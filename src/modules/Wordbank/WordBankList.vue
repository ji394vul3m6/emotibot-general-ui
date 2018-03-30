<template>
  <basic-page>
    <div slot="header" class="tool-bar">
      <icon icon-type="home" button @click="goRoot"></icon>
      <template v-for="(path, idx) in paths">
        <span :key="idx">/</span>
        <span :key="path.name" class='path-unit' @click="goWordbankInPath(idx)">{{path.name}}</span>
      </template>
    </div>
    <div class="wordbank-list">
      <div v-for="entry in currentWordBank" :key="entry.name" class="wordbank-entry" @click="goWordbankChildren(entry)">
        <template v-if="entry.type === 0">
          <icon icon-type="folder"></icon>
        </template>
        <template v-else>
          <icon icon-type="dictionary"></icon>
        </template>
        <span>{{ entry.name }}</span>
      </div>
    </div>
    <div slot="footer" class="tool-bar">
      <text-button icon-type="folder_add" v-if="paths.length < 4 && currentWordBank !== wordbank" @click="popAddFolder">
        {{ $t('wordbank.add_folder') }}
      </text-button>
      <text-button icon-type="dictionary_add" v-if="currentWordBank !== wordbank" @click="popAddWordbank">
        {{ $t('wordbank.add_dictionary') }}
      </text-button>
      <!-- <text-button icon-type="download">
        {{ $t('wordbank.download_current_dictionary') }}
      </text-button> -->
    </div>
  </basic-page>
</template>

<script>
import BasicPage from '@/components/layout/BasicPage';
import Icon from '@/components/basic/Icon';
import InputPop from '@/components/pop/InputPop';
import api from './_api/wordbank';
import EditPop from './_components/WordBankEdit';

export default {
  path: 'wordbank-list',
  privCode: 'wordbank',
  displayNameKey: 'wordbank_list',
  icon: 'white_folder',
  components: {
    BasicPage,
    icon: Icon,
  },
  data() {
    return {
      paths: [],
      wordbank: [],
      currentWordBank: [],
    };
  },
  api,
  methods: {
    popAddFolder() {
      const that = this;
      const data = {
        maxlength: 20,
        inputName: that.$t('general.folder'),
        value: '',
      };
      const options = {
        title: that.$t('wordbank.add_folder'),
        component: InputPop,
        buttons: ['ok'],
        data,
        validate: true,
        clickOutsideClose: true,
        callback: {
          ok() {
            that.addFolder(data.value);
          },
        },
      };
      that.$pop(options);
    },
    popAddWordbank() {
      const that = this;
      const options = {
        title: that.$t('wordbank.add_dictionary'),
        component: EditPop,
        buttons: ['ok'],
        validate: true,
        extData: {
          nameEditable: true,
        },
        clickOutsideClose: true,
        bindValue: false,
        callback: {
          ok(retData) {
            const wordbank = {};
            wordbank.name = retData.name;
            wordbank.text = retData.text;
            wordbank.similar_words = retData.similar_words;
            wordbank.answer = retData.answer;
            that.addWordbank(wordbank);
          },
        },
      };

        // if type is dictionary, open pop to edit it.
      if (that.paths[0].name === that.$t('wordbank.sensitive_wordbank')) {
          // only sensitive wordbank can setup custom answer
        options.extData.setupAnswer = true;
      }
      that.$pop(options);
    },
    goRoot() {
      this.currentWordBank = this.wordbank;
      this.paths = [];
    },
    goWordbankInPath(idx) {
      const that = this;

      if (idx >= that.paths.length) {
        return;
      }
      that.currentWordBank = that.paths[idx].wordbank.children;
      that.paths = that.paths.slice(0, idx + 1);
    },
    goWordbankChildren(wordbank) {
      const that = this;
      if (wordbank.type === 0) {
        // if wordbank type is directory, go into directory
        that.paths.push({
          name: wordbank.name,
          wordbank,
        });
        that.currentWordBank = wordbank.children || [];
      } else if (wordbank.type === 1) {
        that.$emit('startLoading');
        const options = {
          title: that.$t('wordbank.edit_dictionary'),
          component: EditPop,
          buttons: ['ok'],
          validate: true,
          extData: {},
          clickOutsideClose: true,
          bindValue: false,
          callback: {
            ok(retData) {
              that.updateWordbank(retData).then(() => {
                wordbank.name = retData.name;
                wordbank.text = retData.text;
                wordbank.similar_words = retData.similar_words;
                wordbank.answer = retData.answer;
              });
            },
          },
        };

        // if type is dictionary, open pop to edit it.
        if (that.paths[0].name === that.$t('wordbank.sensitive_wordbank')) {
          // only sensitive wordbank can setup custom answer
          options.extData.setupAnswer = true;
        }
        that.$api.getWordbank(wordbank.id).then((latest) => {
          options.data = latest;
          that.$pop(options);
        }, (err) => {
          if (err.response.status === 404) {
            that.$notifyFail(that.$t('wordbank.err_wordbank_not_found'));
            const removeIdx = that.currentWordBank.indexOf(wordbank);
            that.currentWordBank.splice(removeIdx, 1);
          }
        }).then(() => {
          that.$emit('endLoading');
        });
      }
    },
    updateWordbank(data) {
      const that = this;
      return that.$api.updateWordbank(data).then(() => {
        that.$notify({ text: that.$t('error_msg.success') });
      });
    },
    addFolder(folderName) {
      const that = this;
      that.$emit('startLoading');
      that.$api.addFolder(that.paths, folderName).then(() => {
        that.currentWordBank.push({
          name: folderName,
          children: [],
          type: 0,
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        that.$emit('endLoading');
      });
    },
    addWordbank(wordbank) {
      const that = this;
      that.$emit('startLoading');
      that.$api.addWordbank(that.paths, wordbank).then((newWordbank) => {
        that.currentWordBank.push(newWordbank);
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        that.$emit('endLoading');
      });
    },
    loadWordbanks() {
      const that = this;
      that.$emit('startLoading');
      that.$api.getWordbanks().then((data) => {
        that.wordbank = data;
        that.currentWordBank = data;
        that.$emit('endLoading');
      }).catch(() => {
        that.$emit('endLoading');
      });
    },
  },
  mounted() {
    const that = this;
    that.loadWordbanks();
  },
};
</script>

<style lang="scss" scoped>
@import "styles/variable";
.tool-bar {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 10px;
  span {
    margin-right: 0.5em;
  }
  .icon {
    margin-top: -5px;
  }
  .path-unit {
    cursor: pointer;
  }
}
.wordbank-list {
  line-height: $default-line-height;
  display: flex;
  flex-direction: column;
  .wordbank-entry {
    display: flex;
    flex-direction: row;
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid $table-border-color;

    &:hover {
      background: $table-body-hover-background;
    }
  }
}
</style>
