
<template>
  <div id="card-content" class="card">
    <div id="card-content-header">
      <search-input v-model="wordbankKeyword"></search-input>
      <div id="io-buttons">
        <!-- <text-button>{{ $t('wordbank.batch_import') }}</text-button> -->
        <text-button @click="exportWordbank">{{ $t('wordbank.export_all') }}</text-button>
      </div>
    </div>
    <div id="card-content-content">
      <div id="toolbar">
        <text-button button-type="primary" @click="popAddWordbank">{{ $t('wordbank.add_wordbank') }}</text-button>
        <text-button 
          @click="deleteMultiWordbank"
          :button-type="this.checkedWordbank.length === 0 ? 'disable' : 'error'">
          {{ $t('wordbank.delete') }}
        </text-button>
        <text-button 
          @click="popMoveToCategory"
          :button-type="this.checkedWordbank.length === 0 ? 'disable' : 'default'">
          {{ $t('wordbank.moveto') }}
        </text-button>
      </div>
      <general-table id="content-table" 
        :tableHeader="tableHeader" :tableData="tableData" :action="tableAction"
        @checkedChange="handleCheckedChange" checkbox
        showEmpty></general-table>
    </div>
    <div id="card-content-footer">
      <v-pagination size="small" :total="curTotal" :pageIndex="curPageIdx" :pageSize="pageLimit" :layout="['prev', 'pager', 'next', 'jumper']" @page-change="handlePageChange"></v-pagination>
    </div>

    <div id="content-blocker" v-if="isEditMode"></div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import WordbankEditPop from './WordbankEditPop';
import MoveToPop from './MoveToPop';
import api from '../_api/wordbank';

export default {
  path: 'wordbank-list',
  privCode: 'wordbank',
  displayNameKey: 'wordbank_list',
  icon: 'white_folder',
  api,
  data() {
    return {
      wordbanks: [],
      filteredWordbanks: [],
      currentWordbanks: [],

      wordbankKeyword: '',
      tableHeader: [
        {
          key: 'wordbank',
          text: this.$t('wordbank.wordbank'),
          width: '120px',
        },
        {
          key: 'synonym',
          text: this.$t('wordbank.synonym'),
          type: 'tag',
        },
      ],
      tableAction: [
        {
          text: this.$t('wordbank.edit'),
          type: 'primary',
          onclick: this.editWordbank,
        },
        {
          text: this.$t('wordbank.delete'),
          type: 'error',
          onclick: this.deleteWordbank,
        },
      ],
      checkedWordbank: [],

      curPageIdx: 1,
      pageLimit: 20,
    };
  },
  computed: {
    ...mapGetters([
      'wordbank',
      'currentCategory',
      'isEditMode',
    ]),
    tableData() { // This is curPage
      // Handle empty data cause curPageIdx to zero;
      if (this.curPageIdx <= 0) {
        this.toFirstPage();
      }

      const startIdx = (this.curPageIdx - 1) * this.pageLimit;
      const endIdx = startIdx + this.pageLimit;
      return this.currentWordbanks.slice(startIdx, endIdx)
        .map((bank) => {
          const tablerow = {
            wid: bank.wid,
            wordbank: bank.name,
            synonym: bank.similar_words.slice(0, 4),
          };
          return tablerow;
        });
    },
    curTotal() {
      return this.currentWordbanks.length;
    },
    lastPageIdx() {
      return Math.floor((this.curTotal - 1) / this.pageLimit) + 1;
    },
  },
  watch: {
    wordbanks() {
      this.wordbankKeyword = '';
      this.currentWordbanks = this.wordbanks;
      this.filteredWordbanks = [];
    },
    currentCategory() {
      this.loadCurrentWordbanks();
      this.currentWordbanks = this.wordbanks;
    },
    wordbankKeyword() {
      if (this.wordbankKeyword !== '') {
        this.filteredWordbanks = this.wordbanks
          .filter(word => word.name.indexOf(this.wordbankKeyword) !== -1);
        this.currentWordbanks = this.filteredWordbanks;
      } else {
        this.currentWordbanks = this.wordbanks;
        this.filteredWordbanks = [];
      }
      this.toFirstPage();
    },
    lastPageIdx() {
      if (this.curPageIdx > this.lastPageIdx) {
        this.toCurPage(this.lastPageIdx);
      }
    },
  },
  methods: {
    ...mapMutations([
      'setWordbank',
      'setCurrentCategory',
      'setWordbankEditMode',
      'updateWordbankInCategory',
      'addWordbankToCategory',
      'deleteWordbankFromCategory',
    ]),
    toFirstPage() {
      this.curPageIdx = 1;
      // const elem = this.$refs.synonymList;
      // elem.scrollTop = 0;
    },
    toCurPage(page) {
      this.curPageIdx = page;
      // const elem = this.$refs.synonymList;
      // elem.scrollTop = 0;
    },
    handlePageChange(page) {
      if (page <= 0) {
        this.toFirstPage();
      } else {
        this.toCurPage(page);
      }
    },
    exportWordbank() {
      window.open('/api/v3/dictionary/export?zh_tw=true', '_blank');
    },
    editWordbank(data) {
      this.$api.getWordbank(data.wid)
      .then((wordbank) => {
        this.popEditWordbank(wordbank);
      });
    },
    isWordbankSensitive(wid) {  // By recursive through sensitive category
      let isIn = false;
      this.wordbank.children.forEach((child) => {
        if (child.name === this.$t('wordbank.sensitive_wordbank')) {
          isIn = this.isWordbankInSensitiveCategory(child, wid) || isIn;
        }
      });
      return isIn;
    },
    isWordbankInSensitiveCategory(wordbank, wid) {
      let hasWid = false;
      if (wordbank.wordbanks && wordbank.wordbanks.length !== 0) {
        hasWid = wordbank.wordbanks.findIndex(bank => bank.wid === wid) !== -1;
        if (hasWid) return hasWid;
      }
      if (wordbank.children && wordbank.children.length !== 0) {
        wordbank.children.forEach((child) => {
          hasWid = hasWid || this.isWordbankInSensitiveCategory(child, wid);
        });
      }
      return hasWid;
    },
    isCategorySensitive(cid) {  // By recursive through sensitive category
      let isIn = false;
      this.wordbank.children.forEach((child) => {
        if (child.name === this.$t('wordbank.sensitive_wordbank')) {
          isIn = this.isCategoryInSensitiveCategory(child, cid) || isIn;
        }
      });
      return isIn;
    },
    isCategoryInSensitiveCategory(wordbank, cid) {
      let hasCid = false;
      if (wordbank.cid === cid) return true;
      if (wordbank.children && wordbank.children.length !== 0) {
        wordbank.children.forEach((child) => {
          hasCid = hasCid || this.isCategoryInSensitiveCategory(child, cid);
        });
      }
      return hasCid;
    },
    popAddWordbank() {
      const wordbankProp = {
        wid: undefined,
        answer: '',
        editable: true,
        name: '',
        similar_words: [],
      };
      if (this.currentCategory.cid < 0) { // 'all' or 'no_category'
        wordbankProp.isSensitive = false;
      } else {
        wordbankProp.isSensitive = this.isCategorySensitive(this.currentCategory.cid);
      }

      const targetCid = this.currentCategory.cid < 0 ? -1 : this.currentCategory.cid;
      const options = {
        component: WordbankEditPop,
        title: this.$t('wordbank.add_wordbank'),
        data: {
          wordbank: wordbankProp,
        },
        validate: true,
        callback: {
          ok: (addedWordbank) => {
            this.$api.addWordbank(targetCid, addedWordbank)
            .then((bank) => {
              const payload = {
                cid: this.currentCategory.cid,
                newbank: bank,
              };
              this.addWordbankToCategory(payload);
              this.loadCurrentWordbanks();
            })
            .catch((err) => {
              console.log(err);
              this.$notifyFail(this.$t('wordbank.error.add_wordbank_fail'));
            });
          },
        },
      };
      this.$pop(options);
    },
    popEditWordbank(wordbank) {
      // check sensitive by wordbank cause wordbank might be opened through 'all' category
      wordbank.isSensitive = this.isWordbankSensitive(wordbank.wid);
      const options = {
        component: WordbankEditPop,
        title: this.$t('wordbank.edit_wordbank'),
        data: {
          wordbank,
        },
        validate: true,
        callback: {
          ok: (editedWordbank) => {
            this.$api.updateWordbank(editedWordbank)
            .then((bank) => {
              this.updateWordbankInCategory(bank);
              this.loadCurrentWordbanks();
            })
            .catch((err) => {
              console.log(err);
              this.$notifyFail(this.$t('wordbank.error.edit_wordbank_fail'));
            });
          },
        },
      };
      this.$pop(options);
    },
    popMoveToCategory() {
      if (this.checkedWordbank.length === 0) {
        return;
      }
      const wordbanksToMove = this.checkedWordbank;
      const options = {
        component: MoveToPop,
        title: this.$t('wordbank.moveto_wordbank'),
        validate: true,
        callback: {
          ok: (toCid) => {
            const movePromises = [];
            wordbanksToMove.forEach((bank) => {
              movePromises.push(this.$api.moveToCategory(bank.wid, toCid));
            });

            Promise.all(movePromises)
            .then(() => {
              wordbanksToMove.forEach((bank) => {
                const theBank = this.currentCategory.wordbanks
                  .find(wordbank => wordbank.wid === bank.wid);

                const targetWordbank = {
                  answer: theBank.answer,
                  editable: theBank.editable,
                  name: theBank.name,
                  similar_words: theBank.similar_words,
                  wid: theBank.wid,
                };
                this.deleteWordbankFromCategory(targetWordbank.wid);
                const payload = {
                  cid: toCid,
                  newbank: targetWordbank,
                };
                this.addWordbankToCategory(payload);
                this.loadCurrentWordbanks();
              });
              this.$notify({ text: this.$t('wordbank.success.moved') });
            })
            .catch((err) => {
              console.log(err);
              this.$notifyFail(this.$t('wordbank.error.move_wordbank_fail'));
            });
          },
        },
      };
      this.$pop(options);
    },
    deleteWordbank(data) {
      const option = {
        data: {
          msg: this.$t('wordbank.delete_wordbank_msg', { name: data.wordbank }),
        },
        callback: {
          ok: () => {
            this.confirmDeleteWordbank(data.wid);
          },
        },
      };
      this.$popCheck(option);
    },
    confirmDeleteWordbank(wid) {
      this.$api.deleteWordbank(wid)
      .then(() => {
        this.deleteWordbankFromCategory(wid);
        this.loadCurrentWordbanks();
      })
      .catch((err) => {
        console.log(err);
        this.$notifyFail(this.$t('wordbank.error.delete_wordbank_fail'));
      });
    },
    deleteMultiWordbank() {
      const option = {
        data: {
          msg: this.$t('wordbank.delete_multi_wordbank_msg'),
        },
        callback: {
          ok: () => {
            this.checkedWordbank.forEach((bank) => {
              this.confirmDeleteWordbank(bank.wid);
            });
          },
        },
      };
      this.$popCheck(option);
    },
    handleCheckedChange(checked) {
      this.checkedWordbank = checked;
    },
    loadCurrentWordbanks() {
      if (!this.isEditMode) {
        this.wordbanks = this.getWordbanksFromSubCategories(this.currentCategory);
      }
    },
    getWordbanksFromSubCategories(wordbank) {
      let subWordbanks = [];
      if (wordbank.children && wordbank.children.length > 0) {
        wordbank.children.forEach((child) => {
          subWordbanks = subWordbanks.concat(this.getWordbanksFromSubCategories(child));
        });
      }
      return wordbank.wordbanks.concat(subWordbanks);
    },
  },
};
</script>
<style lang="scss" scoped>
@import 'styles/variable';
#card-content {
  position: relative;
  display: flex;
  flex-direction: column;
  #card-content-header {
    flex: 0 0 72px;
    padding: 20px;
    padding-bottom: 24px;
    border-bottom: 1px solid $color-borderline;
    display: flex;
    align-items: center;
    justify-content: space-between;

    #io-buttons {
      display: flex;
      justify-content: space-between;
      .text-button {
        margin: 0 5px;
      }
      :last-child {
        margin-right: 0px;
      }
    }
  }
  #card-content-content {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    #toolbar {
      flex: 0 0 auto;
      margin: 10px 20px;
      display: flex;
      .text-button {
        margin: 0 5px;
      }
      :first-child {
        margin-left: 0px;
      }
    }

    #content-table {
      overflow: hidden;
    }
  }
  #card-content-footer {
    border-top: 1px solid $color-borderline;
    flex: 0 0 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  #content-blocker {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.55);
  }
}
</style>
