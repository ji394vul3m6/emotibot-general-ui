<template>
  <div id="qa-list-page" class='page'>
    <div style="height: 100%; min-width: 1235px; min-height: 900px;">
      <qa-selectors ref="selector"></qa-selectors>
      <div id="qalist-display">
        <div id="qa-category">
      	  <qa-category 
            v-on:categoryChanged="handleCategoryChanged" 
            v-on:categoryChangedDone="handleCategoryChangedDone"
            ref="category" 
            v-on:itemClicked="handleTreeItemClicked">
          </qa-category>
        </div>
    	  <div id="qa-table">
    	  	<qa-table ref="qaTable" :tableData="rawData"></qa-table>
    	  </div> 
      </div>
    </div>
    <div class="loading" v-if="loading">
      {{ loadingWord }}
    </div>
    <div style="display:none;"> {{ doQuery }} </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import Vue from 'vue';
import qaAPI from './_api/qalist';
import QASelectors from './_components/QASelectors';
import QACategory from './_components/QACategory';
import QATable from './_components/QATable';
import QAUpdatePop from './_components/QAUpdatePop';
import qaListUtil from './_store/QAListUtil';

Vue.component('qa-selectors', QASelectors);
Vue.component('qa-category', QACategory);
Vue.component('qa-table', QATable);

export default {
  path: 'qalist',
  privCode: 'qalist',
  displayNameKey: 'qalist',
  icon: 'white_qalist',
  data() {
    return {
      requestLock: false,
      rawData: [],
      loading: true,
      loadingWord: '',
      checkingTimer: null,
    };
  },
  computed: {
    ...mapGetters([
      'doQueryState',
      'searchCategoryID',
    ]),
    doQuery() {
      if (this.doQueryState) {
        this.refreshQAList();
      }
      this.$store.commit('doQuery', false);
      return '';
    },
  },
  mounted() {
    // register event listener
    this.bindEvent();
    this.resetSearchOptions();
    const queryOptions = {
      num: 1,
      action: 'full_import',
      status: 'running',
    };
    qaAPI.queryOperations(queryOptions).then((data) => {
      if (data.records && data.records.length > 0) {
        // someone is importing
        this.showFileImporting();
        this.pollingServerImportStatus(data.records[0].stateId);
      } else {
        this.loading = false;
        this.queryQA();
      }
    }).catch(this.handleError.bind(this));
  },
  updated() {
    this.$refs.qaTable.setPageIndex(this.$store.state.qaQueryOptions.cur_page);
  },
  beforeDestroy() {
    if (this.checkingTimer) {
      clearTimeout(this.checkingTimer);
    }
    this.unBindEvent();
  },
  methods: {
    ...mapMutations({
      setDoQuery: 'doQuery',
    }),
    resetSearchOptions() {
      const defaultOption = qaListUtil.genDefaultQueryOptions();
      this.$store.commit('setQAQueryOptions', defaultOption);
    },
    bindEvent() {
      // bind event
      this.$root.$on('QATable::pageChanged', this.hanldePageChanged);
      this.$root.$on('QATable::rowDeleted', this.handleRowDeleted);
      this.$root.$on('QATable::SQUpdated', this.queryQA);
      this.$root.$on('QASelector::deleteQuestions', this.deleteQuestions);
      this.$root.$on('QASelector::addQuestion', this.addQuestion);
      this.$root.$on('QASelector::doQuery', this.queryQA);
      this.$root.$on('QASelector::fileimported', this.handleFileImported);
      this.$root.$on('QASelector::fileimportStart', this.showFileUploading);
      this.$root.$on('QASelector::fileimportUploaded', this.showFileImporting);
      this.$root.$on('QASelector::fileimportFailed', this.hideLoading);

      this.$root.$on('QAList::loading', this.showLoading);
      this.$root.$on('QAList::loaded', this.hideLoading);
    },
    unBindEvent() {
      // unbind event
      this.$root.$off('QATable::pageChanged', this.hanldePageChanged);
      this.$root.$off('QATable::rowDeleted', this.handleRowDeleted);
      this.$root.$off('QATable::SQUpdated', this.queryQA);
      this.$root.$off('QASelector::deleteQuestions', this.deleteQuestions);
      this.$root.$off('QASelector::addQuestion', this.addQuestion);
      this.$root.$off('QASelector::doQuery', this.queryQA);
      this.$root.$off('QASelector::fileimported', this.handleFileImported);
      this.$root.$off('QASelector::fileimportStart', this.showFileUploading);
      this.$root.$off('QASelector::fileimportUploaded', this.showFileImporting);
      this.$root.$off('QASelector::fileimportFailed', this.hideLoading);

      this.$root.$off('QAList::loading', this.showLoading);
      this.$root.$off('QAList::loaded', this.hideLoading);
    },
    showLoading() {
      this.loadingWord = this.$t('general.loading');
      this.loading = true;
    },
    hideLoading() {
      this.loading = false;
    },
    handleFileImported() {
      // reset search options
      this.resetSearchOptions();

      this.loading = false;
      this.refreshQAList();
    },
    showFileUploading() {
      this.loadingWord = this.$t('qalist.in_uploading');
      this.loading = true;
    },
    showFileImporting() {
      // in FQA import status
      this.loadingWord = this.$t('qalist.import_success');
      this.loading = true;
    },
    showImportError(msg, id) {
      const that = this;
      const option = {
        data: {
          msg,
          id,
        },
        ok_msg: this.$t('qalist.export_file'),
        cancel_msg: that.$t('general.close'),
        callback: {
          ok: () => { qaAPI.downloadFile(id); },
        },
      };
      that.$popCheck(option);
    },
    pollingServerImportStatus(id) {
      qaAPI.queryOperationProgress(id).then((data) => {
        if (data.status === 'running') {
          this.checkingTimer = setTimeout(() => {
            this.pollingServerImportStatus.bind(this)(id);
          }, 2000);
        } else if (data.status === 'success') {
          this.refreshQAList();
          this.checkingTimer = null;
        } else { // fail
          const defaultMsg = this.$t('qalist.import_fail_msg');
          const errMsg = (data.extraInfo.indexOf('问答库模板') > -1) ? data.extraInfo : defaultMsg;

          this.showImportError(errMsg, id);
          this.hideLoading();
          this.refreshQAList();
        }
      }).catch(this.handleError.bind(this));
    },
    handleCategoryChanged() {
      this.loading = true;
    },
    handleCategoryChangedDone() {
      this.loading = false;
      this.refreshQAList();
    },
    deleteQuestions() {
      const that = this;
      if (!that.$refs.qaTable) {
        return;
      }
      const selectedQuestions = that.$refs.qaTable.getSelectedQuestions();
      if (selectedQuestions.length > 0) {
        that.$refs.qaTable.deleteSelectedQuestions();
      } else {
        const options = {
          data: {
            msg: that.$t('qalist.not_select_any_question'),
          },
          buttons: ['ok'],
        };
        that.$popCheck(options);
        // that.$root.$emit('showWindow', options);
      }
    },
    handleRowDeleted() {
      this.$refs.qaTable.unSetAllSelect();
      this.queryQA();
    },
    handleTreeItemClicked(categoryID) {
      const updateOptions = qaListUtil.genDefaultQueryOptions();
      updateOptions.category_id = categoryID;
      this.$store.commit('setQAQueryOptions', updateOptions);
      this.$refs.selector.reset();
      this.queryQA();
    },
    hanldePageChanged(pageIndex) {
      this.$store.commit('setQAQueryOptions', { cur_page: pageIndex - 1 });
      this.queryQA();
    },
    requestAddQuestion(q) {
      q.answer_json = JSON.stringify(q.answer_json);
      return qaAPI.createQuestion(q).then(() => {
        this.queryQA();
        return qaAPI.activeQA();
      });
    },
    addQuestion() {
      debugger;
      const that = this;
      this.$pop({
      // this.$root.$emit('showWindow', {
        component: QAUpdatePop,
        ok_msg: that.$t('general.save'),
        cancel_msg: that.$t('general.cancel'),
        data: {
          categoryid: this.searchCategoryID,
        },
        callback: {
          ok: (question) => {
            this.requestAddQuestion(question);
          },
        },
        validate: true,
      });
    },
    handleError() {
      // const that = this;
      // general.handleAPIError(that, error).catch(() => {
      //   that.showLoadingFailPop();
      //   console.log(error);
      // });
    },
    showLoadingFailPop() {
      // show loading failed message
      const that = this;
      that.loading = false;
      const warningOptions = {
        buttons: ['ok'],
        data: {
          msg: that.$t('qalist.qa_loading_failed_msg'),
        },
      };
      that.$popCheck(warningOptions);
      // that.$root.$emit('showWindow', warningOptions);
    },
    queryQA() {
      const that = this;
      if (!that.loading) {
        that.loadingWord = that.$t('general.loading');
        that.loading = true;
        const options = JSON.parse(JSON.stringify(that.$store.state.qaQueryOptions));
        options.dimension = JSON.stringify(that.$store.state.qaQueryOptions.dimension);

        return qaAPI.filterQuestions(that.$store.state.qaQueryOptions).then((data) => {
          that.rawData = data;
          that.loading = false;
        }).catch(that.handleError.bind(that));
      }
      return Promise.resolve(null);
    },
    refreshQAList() {
      this.loading = false;
      this.queryQA().then(() => {
        this.loading = true;
        return this.$refs.category.updateCategory();
      }).then(() => {
        this.loading = false;
      }).catch(this.handleError.bind(this));
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
div {
  display: inline-block;
}
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  display: inline-block;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

$fill-parent: 100%;

#qalist-display {
  width: $fill-parent;
  height: 80%;
}

#qa-table {
  vertical-align: top;
}

#qa-category {
  width: 200px;
  height: $fill-parent;
  margin-right: 30px;
}
  
#qa-table {
  width: calc(100% - 260px);
  height: $fill-parent;
  display: inline-block;
}

</style>
