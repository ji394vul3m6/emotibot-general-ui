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
    <div slot="footer" class="tool-bar" v-if="currentWordBank !== wordbank">
      <text-button icon-type="folder_add" v-if="paths.length < 4">
        {{ $t('wordbank.add_folder') }}
      </text-button>
      <text-button icon-type="dictionary_add">
        {{ $t('wordbank.add_dictionary') }}
      </text-button>
    </div>
  </basic-page>
</template>

<script>
import BasicPage from '@/components/layout/BasicPage';
import Icon from '@/components/basic/Icon';
import api from './_api/wordbank';
import EditPop from './_components/WordBankEdit';

export default {
  path: 'wordbank-list',
  privCode: 'wordbank_list',
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
  methods: {
    ...api,
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
        // if type is dictionary, open pop to edit it.
        that.$pop({
          title: that.$t('wordbank.edit_dictionary'),
          component: EditPop,
          buttons: ['ok'],
          data: wordbank,
          validate: true,
          clickOutsideClose: true,
          bindValue: false,
        });
      }
    },
    loadWordbanks() {
      const that = this;
      that.$emit('startLoading');
      that.getWordbanks().then((data) => {
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
