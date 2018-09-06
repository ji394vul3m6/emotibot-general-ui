<template>
  <div class="intent-test-list">
    <div class="intent-test-header">
      <div>
        {{ $t('intent_engine.test.test_answer') }}
        <icon iconType="info" v-tooltip="testTitleTooltip" :size="16" enableHover></icon>
      </div>
      <div>
        {{ $t('intent_engine.test.precision') }}
        <icon iconType="info" v-tooltip="precisionTooltip" :size="16" enableHover></icon>
      </div>
    </div>
    <div v-for="(intent, idx) in intentTestListShown" :key="idx" class="intent-block" :class="{'active': intent.expand}" @mouseover="hoverIntent(intent, true)" @mouseout="hoverIntent(intent, false)">
      <div class="intent-block-header" @click="beforeExpandIntent(intent)">
        <div class="intent-icons">
          <icon icon-type="intent" :size="16"/>
        </div>
        <div class="intent-title">
          <input v-if="intent.isEditMode" type="text" ref="intentName" v-model="editTestName" v-tooltip="intentNameTooltip" :placeholder="$t('intent_engine.manage.placeholder.intent_title')" />
          <div v-else class="intent-title-display">
            <div>{{intent.name}}</div>
            <div>
              {{ intent.precision }}%
            </div>
          </div>
        </div>
        <div v-if="hasIntentAction" class="intent-action">
          <div v-if="intent.isEditMode" class="intent-save-tool">
            <text-button button-type="primary" @click="saveEditTest(intent)">{{ $t('general.save') }}</text-button>
            <text-button @click.stop="cancelEditTestPop(intent)">{{ $t('general.cancel') }}</text-button>
          </div>
          <div v-else class="intent-action-tool">
            <div v-if="intent.isHover || intent.expand" class="intent-action-icon" :ref="`${idx}_intentAction`" @click.stop="showDropdown(intent, idx)" v-dropdown="intentActionDropdown">
              <icon icon-type="more" :size="24"></icon> 
            </div>
            <div v-if="intent.expand" class="intent-action-icon close" @click.stop="closeExpandIntent(intent, idx)">
              <icon icon-type="close_expand" :size="18"></icon> 
            </div>
          </div>
        </div>
      </div>
      <template v-if="intent.expand">
        <div class="intent-block-content">
          <div v-if="intent.isEditMode" class="corpus-tools">
            <div v-if="intent.hasCorpusSelected" class="corpus-delete-btn">
              <text-button button-type="error" @click="deleteMultiCorpus(intent)">{{ $t('general.delete') }}</text-button>
            </div>
          </div>
          <div v-if="!intent.isEditMode" class="corpus-header">
            <div class="corpus-header-title">{{ $t('intent_engine.test.test_corpus') }}</div>
            <div class="corpus-header-title">
              {{ $t('intent_engine.test.robot_predict') }}
              <icon iconType="info" v-tooltip="robotPredictTooltip" :size="16" enableHover></icon>
            </div>
            <div class="corpus-header-title">
              {{ $t('intent_engine.test.scoring') }}
              <icon iconType="info" v-tooltip="scoringTooltip" :size="16" enableHover></icon>
            </div>
            <div class="corpus-header-title">
              {{ $t('intent_engine.test.result') }}
              <icon iconType="info" :size="16" v-tooltip="resultTooltip" enableHover></icon>
            </div>
          </div>
          <div class="corpus-block" @mouseout="clearHover(intent)">
            <div v-if="intent.isEditMode" class="corpus-add-row">
              <input type="text" v-model="newCorpus" v-tooltip="corpusTooltip"
                ref="newCorpus"
                :placeholder="$t('intent_engine.manage.placeholder.add_corpus')"
                @compositionstart="setCompositionState(true)"
                @compositionend="setCompositionState(false)"
                @keydown.enter="detectCompositionState"
                @keyup.enter="addCorpus(intent)"/>
              <text-button class="add-corpus-btn" @click="addCorpusByClick(intent)">{{ $t('intent_engine.manage.addin') }}</text-button>
            </div>
            <div v-if="intent.corpus.length === 0" class="corpus-row">
              {{ $t('general.no_data') }}
            </div>
            <div v-else v-for="(corpus, cidx) in getCorpusPage(intent)" :key="`${idx}-${cidx}`"
              class="corpus-row"
              @mouseover="hoverCorpus(intent, corpus)"
              >
              <div v-if="(intent.hasCorpusSelected || (intent.isEditMode && corpus.isHover))">
                <input type="checkbox" :checked="corpus.isSelect" @change="selectCorpus(intent, corpus)">
              </div>
              <div class="corpus">
                <div>{{corpus.text}}</div>
                <div v-if="!intent.isEditMode">{{corpus.predict}}</div>
                <div v-if="!intent.isEditMode">{{corpus.score}}</div>
                <div v-if="!intent.isEditMode">{{corpus.result}}</div>
              </div>
              <div v-if="intent.isEditMode && corpus.isHover" class="corpus-action">
                <div class="corpus-action-delete" @click="deleteCorpus(intent, corpus)">{{ $t('general.delete')}}</div>
              </div>
            </div>
          </div> 
        </div> 
        <div v-if="getCurTotal(intent) > LIST_PAGE_SIZE" class="intent-block-footer">
          <v-pagination size="small" :total="getCurTotal(intent)" :pageIndex="intent.curPage" :pageSize="LIST_PAGE_SIZE" :layout="['prev', 'pager', 'next', 'jumper']" @page-change="handlePageChange($event, intent)"></v-pagination>
        </div>
      </template>
    </div>

    <!--ADD INTENT BLOCK-->
    <div v-if="isAddTest" class="intent-block active">
      <!-- // TODO: add intent block here, only need the style in edit mode
      // on save, call api, if save success, reload whole intent list
      // v-if to control show this block or not -->
      <div class="intent-block-header">
        <div class="intent-icons">
          <icon icon-type="intent" :size="16"/>
        </div>
        <div class="intent-title">
          <input type="text" ref="intentAddName" v-model="newIntentName" v-tooltip="intentNameTooltip" :placeholder="$t('intent_engine.manage.placeholder.intent_title')"/>
        </div>
        <div class="intent-action">
          <div class="intent-save-tool">
            <text-button button-type="primary" @click="saveAddTest()">{{ $t('general.save') }}</text-button>
            <text-button @click.stop="cancelAddNewIntent()">{{ $t('general.cancel') }}</text-button>
          </div>
        </div>
      </div>
      <div class="intent-block-content">
        <div class="corpus-tools">
          <div v-if="newIntent.hasCorpusSelected" class="corpus-delete-btn">
            <text-button button-type="error" @click="deleteMultiCorpus(newIntent)">{{ $t('general.delete') }}</text-button>
          </div>
        </div>
        <div class="corpus-block" @mouseout="clearHover(newIntent)">
          <div v-if="newIntent.isEditMode" class="corpus-add-row">
            <input type="text" v-model="newCorpus" v-tooltip="corpusTooltip"
            ref="newCorpus"
              :placeholder="$t('intent_engine.manage.placeholder.add_corpus')"
              @compositionstart="setCompositionState(true)"
              @compositionend="setCompositionState(false)"
              @keydown.enter="detectCompositionState"
              @keyup.enter="addCorpus(newIntent)"/>
            <text-button class="add-corpus-btn" @click="addCorpusByClick(newIntent)">{{ $t('intent_engine.manage.addin') }}</text-button>
          </div>
          <div v-if="newIntent.corpus.length === 0" class="corpus-row">
            {{ $t('general.no_data') }}
          </div>
          <div v-else v-for="(corpus, cidx) in getCorpusPage(newIntent)" :key="`newIntent-${cidx}`"
            class="corpus-row"
            @mouseover="hoverCorpus(newIntent, corpus)"
          >
            <div v-if="(newIntent.hasCorpusSelected || corpus.isHover)">
              <input type="checkbox" :checked="corpus.isSelect" @change="selectCorpus(newIntent, corpus)">
            </div>
            <div class="corpus">
              <span>{{corpus.text}}</span>
            </div>
            <div v-if="corpus.isHover" class="corpus-action">
              <div class="corpus-action-delete" @click="deleteCorpus(newIntent, corpus)">{{ $t('general.delete')}}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="getCurTotal(newIntent) > LIST_PAGE_SIZE" class="intent-block-footer">
        <v-pagination size="small" :total="getCurTotal(newIntent)" :pageIndex="newIntent.curPage" :pageSize="LIST_PAGE_SIZE" :layout="['prev', 'pager', 'next', 'jumper']" @page-change="handlePageChange($event, newIntent)"></v-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../_api/intent';

export default {
  api,
  props: {
    intentTestList: {
      type: Array,
      required: true,
      default: () => [],
    },
    addTestMode: {
      type: Boolean,
      default: false,
    },
    searchTestMode: {
      type: Boolean,
      default: false,
    },
    canEditTest: {
      type: Boolean,
      default: true,
    },
    canDeleteTest: {  // Delete from database
      type: Boolean,
      default: true,
    },
    keyword: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      intentTestListShown: [],
      editTestName: '',
      editCorpusContent: '',

      isAddTest: false,
      newIntentName: '',
      newCorpus: '',
      corpusBackup: {},
      LIST_PAGE_SIZE: 10,
      newIntent: {
        name: '',
        corpus: [],
        curPage: 1,
        expand: true,
        isHover: false,
        isEditMode: true,
        hasCorpusSelected: false,
      },

      intentActionDropdown: {
        options: [{
          text: '編輯',
          onclick: this.beforeEditTest,
        }],
        alignLeft: true,
      },

      intentNameTooltip: {
        msg: '',
        eventOnly: true,
        errorType: true,
        alignLeft: true,
      },
      corpusTooltip: {
        msg: this.$t('intent_engine.test.tooltip.corpus_duplicate'),
        eventOnly: true,
        errorType: true,
        alignLeft: true,
      },
      testTitleTooltip: {
        msg: this.$t('intent_engine.test.tooltip.test_title'),
      },
      precisionTooltip: {
        msg: this.$t('intent_engine.test.tooltip.precision'),
      },
      robotPredictTooltip: {
        msg: this.$t('intent_engine.test.tooltip.robot_predict'),
      },
      scoringTooltip: {
        msg: this.$t('intent_engine.test.tooltip.scoring'),
      },
      resultTooltip: {
        msg: this.$t('intent_engine.test.tooltip.result'),
      },
      compositionState: false,
      wasCompositioning: false,

      // Keep edit actions at local and send these till user click save btn
      deletedCorpusIds: [],
      addedCorpus: [],
    };
  },
  computed: {
    hasIntentAction() {
      return (this.canEditTest || this.canDeleteTest || this.canRemoveIntent);
    },
    isSearchMode() {
      return this.keyword !== '';
    },
    alreadyEdit() {
      return this.deletedCorpusIds.length !== 0 || this.addedCorpus.length !== 0;
    },
  },
  watch: {
    intentTestList() {
      this.intentTestListShown = this.intentTestList.map(intent => ({
        id: intent.id,
        name: intent.name,
        precision: 80,  // TODO: get precision from api or calculate?
        curPage: 1,
        corpus: {},
        expand: false,
        isHover: false,
        isEditMode: false,
        hasCorpusSelected: false,
      }));
    },
    addTestMode() {
      if (this.addTestMode) {
        this.beforeAddTest();
      } else {
        this.isAddTest = false;
      }
    },
    searchTestMode() {
      if (this.searchTestMode) {
        this.beforeSearchTest();
      }
    },
    editTestName() {
      if (this.$refs.intentName !== undefined && this.$refs.intentName[0] !== undefined) {
        this.$refs.intentName[0].dispatchEvent(new Event('tooltip-hide'));
      }
    },
    newIntentName() {
      if (this.$refs.intentAddName !== undefined) {
        this.$refs.intentAddName.dispatchEvent(new Event('tooltip-hide'));
      }
    },
    newCorpus() {
      if (this.isAddTest && this.$refs.newCorpus !== undefined) {
        this.$refs.newCorpus.dispatchEvent(new Event('tooltip-hide'));
      } else if (!this.isAddTest &&
        this.$refs.newCorpus !== undefined && this.$refs.newCorpus[0] !== undefined) {
        this.$refs.newCorpus[0].dispatchEvent(new Event('tooltip-hide'));
      }
    },
  },
  methods: {
    getCorpusPage(intent) {
      const currentCorpus = intent.corpus;
      const start = this.LIST_PAGE_SIZE * (intent.curPage - 1);
      const end = this.LIST_PAGE_SIZE * intent.curPage;
      return currentCorpus.slice(start, end);
    },
    getCurTotal(intent) {
      const currentCorpus = intent.corpus;
      return currentCorpus.length;
    },
    toFirstPage(intent) {
      intent.curPage = 1;
    },
    handlePageChange(pageIdx, intent) {
      intent.curPage = pageIdx;
    },
    setCompositionState(bool) {
      this.compositionState = bool;
    },
    detectCompositionState() {
      this.wasCompositioning = this.compositionState;
    },
    hoverIntent(intent, bool) {
      intent.isHover = bool;
    },
    showDropdown(intent, idx) {
      const that = this;
      that.intentActionDropdown.options = [];
      if (that.canEditTest) {
        that.intentActionDropdown.options = [{
          text: that.$t('general.edit'),
          onclick: that.beforeEditTest.bind(that, intent, idx),
        }];
      }
      if (that.canDeleteTest) {
        that.intentActionDropdown.options.push({
          text: that.$t('general.delete'),
          onclick: () => {
            that.$api.deleteTest(intent.id)
            .then(() => {
              that.$emit('deleteTestDone');
            })
            .catch((err) => {
              console.log(err);
              that.$notifyFail(that.$t('intent_engine.manage.notify.delete_intent_fail'));
            });
          },
        });
      }
      if (that.canRemoveIntent) {
        that.intentActionDropdown.options.push({
          text: that.$t('general.remove'),
          onclick: () => {
            that.$emit('removeIntent', idx);
          },
        });
      }
      const refName = `${idx}_intentAction`;
      that.$refs[refName][0].dispatchEvent(new Event('dropdown-reload'));
    },
    deleteTestPop(intent) {
      const that = this;
      const option = {
        data: {
          msg: that.$t('intent_engine.manage.delete_test_msg', { name: intent.name }),
        },
        callback: {
          ok: () => {
            that.deleteTest(intent);
          },
        },
      };
      that.$popWarn(option);
    },
    deleteTest(intent) {
      const that = this;
      that.$api.deleteTest(intent.id)
      .then(() => {
        that.$emit('deleteTestDone');
      })
      .catch((err) => {
        console.log(err);
        that.$notifyFail(that.$t('intent_engine.manage.notify.delete_test_fail'));
      });
    },
    closeExpandIntent(intent) {
      intent.expand = false;
    },
    closeAllIntent() {
      const that = this;
      that.intentTestListShown.forEach((intentItem) => {
        intentItem.expand = false;
      });
    },
    intentInEditMode() {
      const that = this;
      return that.intentTestListShown.find(intent => intent.isEditMode === true);
    },
    beforeExpandIntent(intent) {
      const that = this;
      if (intent.expand) return;
      if (that.isAddTest) {
        that.cancelAddNewIntent(that.expandIntent.bind(that, intent));
        return;
      }
      const intentInEditMode = that.intentInEditMode();
      if (intentInEditMode !== undefined) {
        that.cancelEditTestPop(intentInEditMode, that.expandIntent.bind(that, intent));
      } else {
        that.expandIntent(intent);
      }
    },
    expandIntent(intent) {
      const that = this;
      that.closeAllIntent();
      that.callGetCorpus(intent);
    },
    callGetCorpus(intent) {
      const that = this;
      // TODO: call get Test Corpus
      const mockData = [
        {
          id: 1,
          content: 'first line',
          predict: '測試題1',
          score: 80,
          result: '正確',
        },
        {
          id: 2,
          content: 'second line',
          predict: '測試題1',
          score: 90,
          result: '正確',
        },
        {
          id: 3,
          content: 'third line',
          predict: '測試題1',
          score: 95,
          result: '正確',
        },
        {
          id: 4,
          content: 'fourth line',
          predict: '測試題2',
          score: 70,
          result: '錯誤',
        },
        {
          id: 5,
          content: 'fifth line',
          predict: '測試題2',
          score: 60,
          result: '錯誤',
        },
      ];
      intent.corpus = mockData.map((cp) => {
        cp.text = cp.content;
        cp.isHover = false;
        cp.isSelect = false;
        return cp;
      });
      that.corpusBackup = [].concat(intent.corpus);
      intent.expand = true;
      that.toFirstPage(intent);
      // that.$api.getCorpus(intent.id, that.keyword)
      // .then((res) => {
      //   const corpus = {
      //     pos: [],
      //     neg: [],
      //   };
      //   corpus.pos = res.positive.map((cp) => {
      //     cp.text = cp.content;
      //     cp.isHover = false;
      //     cp.isSelect = false;
      //     return cp;
      //   });
      //   corpus.neg = res.negative.map((cp) => {
      //     cp.text = cp.content;
      //     cp.isHover = false;
      //     cp.isSelect = false;
      //     return cp;
      //   });
      //   intent.corpus = corpus;
      //   that.corpusBackup = {
      //     pos: [].concat(intent.corpus.pos),
      //     neg: [].concat(intent.corpus.neg),
      //   };
      //   intent.expand = true;
      //   that.toFirstPage(intent);
      // })
      // .catch((err) => {
      //   console.log(err);
      //   that.$notifyFail(that.$t('intent_engine.manage.notify.get_corpus_fail'));
      // });
    },
    /** Handle Edit Intent */
    beforeEditTest(intent) {
      const that = this;
      if (that.isAddTest) {
        that.cancelAddNewIntent(that.editTest.bind(that, intent));
        return;
      }
      const intentInEditMode = that.intentInEditMode();
      if (intentInEditMode !== undefined) {
        that.cancelEditTestPop(intentInEditMode, that.editTest.bind(that, intent));
      } else {
        that.editTest(intent);
      }
    },
    editTest(intent) {
      const that = this;
      that.expandIntent(intent);
      intent.isEditMode = true;
      that.editTestName = intent.name;
      that.$nextTick(() => {
        that.$refs.intentName[0].focus();
      });
    },
    confirmCancelEditTest(intent, nextAction) {
      const that = this;
      that.initEditStorage();
      that.$refs.intentName[0].dispatchEvent(new Event('tooltip-hide'));
      intent.isEditMode = false;
      intent.hasCorpusSelected = false;
      intent.corpus = that.corpusBackup;
      if (nextAction) {
        nextAction();
      }
    },
    cancelEditTestPop(intent, nextActionOnOk, nextActionOnCancel) {
      const that = this;
      if (!that.alreadyEdit) {
        that.confirmCancelEditTest(intent, nextActionOnOk);
        return;
      }
      const option = {
        data: {
          msg: that.$t('intent_engine.manage.cancel_edit_msg'),
        },
        callback: {
          ok: () => {
            that.confirmCancelEditTest(intent, nextActionOnOk);
          },
          cancel: () => {
            if (nextActionOnCancel) {
              nextActionOnCancel();
            }
          },
        },
      };
      that.$popCheck(option);
    },
    initEditStorage() {
      const that = this;
      that.newCorpus = '';
      that.deletedCorpusIds = [];
      that.addedCorpus = [];
    },
    saveEditTest(intent) {
      const that = this;
      const intentNameValid = that.validateIntentName(that.editTestName, intent.name);
      if (intentNameValid) {
        // TODO: call api update Test
        // that.$api.updateIntent(intent, that.addedCorpus, that.deletedCorpusIds)
        // .then(() => {
        //   that.callGetCorpus(intent);
        //   that.initEditStorage();
        //   intent.isEditMode = false;
        //   that.$notify({ text: that.$t('intent_engine.manage.notify.update_intent_success') });
        // })
        // .catch((err) => {
        //   console.log(err);
        //   that.$notifyFail(that.$t('intent_engine.manage.notify.update_intent_fail'));
        //   that.callGetCorpus(intent);
        //   that.initEditStorage();
        // });
      } else {
        that.$refs.intentName[0].focus();
        that.$refs.intentName[0].dispatchEvent(new Event('tooltip-reload'));
        that.$refs.intentName[0].dispatchEvent(new Event('tooltip-show'));
      }
    },
    validateIntentName(name, oldname) {
      const that = this;
      if (name.length === 0) {
        that.intentNameTooltip.msg = that.$t('intent_engine.manage.tooltip.name_empty');
        return false;
      }
      const isNotOldName = (oldname === undefined) ? true : (oldname !== name);
      const hasDuplicateName = that.intentTestListShown
        .find(intent => intent.name === name) !== undefined;
      if (isNotOldName && hasDuplicateName) {
        that.intentNameTooltip.msg = that.$t('intent_engine.manage.tooltip.name_duplicate');
        return false;
      }
      return true;
    },
    beforeSearchTest() {
      const that = this;
      const intentInEditMode = that.intentInEditMode();
      if (intentInEditMode !== undefined) {
        that.cancelEditTestPop(intentInEditMode, null, that.cancelSearch);
      }
    },
    cancelSearch() {
      this.$emit('cancelSearch');
    },
    /** Handle Add Intent */
    beforeAddTest() {
      const that = this;
      const intentInEditMode = that.intentInEditMode();
      if (intentInEditMode !== undefined) {
        that.cancelEditTestPop(intentInEditMode, that.addTest);
      } else {
        that.addTest();
      }
    },
    addTest() {
      const that = this;
      that.closeAllIntent();
      that.newIntent = {
        name: '',
        corpus: [],
        curPage: 1,
        expand: true,
        isEditMode: true,
        hasCorpusSelected: false,
      };
      that.isAddTest = true;
      that.$nextTick(() => {
        that.$refs.intentAddName.focus();
      });
    },
    saveAddTest() {
      const that = this;
      const intentNameValid = that.validateIntentName(that.newIntentName);
      if (intentNameValid) {
        const param = {
          name: that.newIntentName,
          pos: that.newIntent.corpus.pos.map(cp => cp.text),
          neg: that.newIntent.corpus.neg.map(cp => cp.text),
        };
        that.$api.addTest(param)
        .then(() => {
          that.$emit('addTestDone', true);  // reload all
          that.initEditStorage();
          that.newIntentName = '';
          that.$notify({ text: that.$t('intent_engine.manage.notify.add_intent_success') });
        })
        .catch((err) => {
          console.log(err);
          that.$notifyFail(that.$t('intent_engine.manage.notify.add_intent_fail'));
        });
      } else {
        that.$refs.intentAddName.focus();
        that.$refs.intentAddName.dispatchEvent(new Event('tooltip-reload'));
        that.$refs.intentAddName.dispatchEvent(new Event('tooltip-show'));
      }
    },
    cancelAddNewIntent(nextAction) {
      const that = this;
      const option = {
        data: {
          msg: that.$t('intent_engine.manage.cancel_add_msg'),
        },
        callback: {
          ok: () => {
            that.newIntent = {};
            that.isAddTest = false;
            that.newIntentName = '';
            that.initEditStorage();
            that.$emit('addTestDone', false);
            if (nextAction !== undefined) {
              nextAction();
            }
          },
        },
      };
      that.$popCheck(option);
    },

    /** Handle Corpus */
    hoverCorpus(intent, corpus) {
      intent.corpus.forEach((cp) => {
        cp.isHover = false;
      });
      corpus.isHover = true;
    },
    clearHover(intent) {
      if (intent.corpus) {
        intent.corpus.forEach((cp) => {
          cp.isHover = false;
        });
      }
    },
    selectCorpus(intent, corpus) {
      corpus.isSelect = !corpus.isSelect;
      intent.hasCorpusSelected = intent.corpus
        .filter(cp => cp.isSelect === true).length !== 0;
    },
    refreshDeletedCorpus(corpus) {
      const that = this;
      if (corpus.id >= 0) {  // positive ids are corpus already in db
        that.deletedCorpusIds.push(corpus.id);
      } else { // negative ids are newly add corpus
        const idxInAddedCorpus = that.addedCorpus.findIndex(cp => cp.id === corpus.id);
        that.addedCorpus.splice(idxInAddedCorpus, 1);
      }
    },
    deleteCorpus(intent, corpus) {
      const that = this;
      const viewedCorpus = intent.corpus;
      const corpusIdx = viewedCorpus.findIndex(cp => cp.id === corpus.id);
      viewedCorpus.splice(corpusIdx, 1);
      const page = Math.floor((viewedCorpus.length - 1) / 10) + 1;
      if (page < intent.curPage) {
        intent.curPage = page;
      }
      that.refreshDeletedCorpus(corpus);
      intent.hasCorpusSelected = viewedCorpus
        .filter(cp => cp.isSelect === true).length !== 0;
    },
    deleteMultiCorpus(intent) {
      const that = this;
      const selectedCorpus = intent.corpus
        .filter(cp => cp.isSelect === true);
      selectedCorpus.forEach((corpus) => {
        that.deleteCorpus(intent, corpus);
      });
    },
    isDuplicateCorpus(newCorpus, intent) {
      return intent.corpus.find(cp => cp.text === newCorpus) !== undefined;
    },
    addCorpusByClick(intent) {
      const that = this;
      that.detectCompositionState();
      that.addCorpus(intent);
    },
    addCorpus(intent) {
      const that = this;
      if (that.wasCompositioning) {
        return;
      }
      if (that.newCorpus !== '') {
        const isDuplicate = that.isDuplicateCorpus(that.newCorpus, intent);
        if (isDuplicate) {
          if (that.isAddTest) {
            that.$refs.newCorpus.dispatchEvent(new Event('tooltip-show'));
          } else {
            that.$refs.newCorpus[0].dispatchEvent(new Event('tooltip-show'));
          }
          return;
        }
        const tempId = -parseInt(Math.random() * 1000, 10);
        intent.corpus.splice(0, 0, {
          id: tempId,
          text: that.newCorpus,
          isHover: false,
          isSelect: false,
        });
        that.addedCorpus.push({
          id: tempId,
          text: that.newCorpus,
        });
        that.newCorpus = '';
        that.toFirstPage(intent);
      }
    },
  },
  mounted() {
    if (this.addTestMode) {
      this.isAddTest = true;
    }
  },
};
</script>
<style lang="scss" scoped>
.intent-test-list {
  @include font-14px();
  > :not(:last-child) {
    margin-bottom: 12px;
  }
  .intent-test-header {
    display: flex;
    padding: 0 21px;
    align-items: center;
    @include font-14px();
    color: $color-font-active;
    > :nth-child(1) {
      margin-left: 36px;
      flex: 1;
      display: flex;
      align-items: center;
      .icon {
        margin-left: 5px;
      }
    }
    > :nth-child(2) {
      flex: 0 0 180px;
      display: flex;
      align-items: center;
      .icon {
        margin-left: 5px;
      }
    }
  }
  .intent-block {
    border: 1px solid #DBDBDB;
    border-radius: 4px;
    transition: all .2s ease-in-out;
    &:hover {
      box-shadow: 0 4px 9px 0 rgba(115, 115, 115, 0.2), 0 5px 8px 0 rgba(228, 228, 228, 0.5);
    }
    &.active {
      box-shadow: 0 4px 9px 0 rgba(115, 115, 115, 0.2), 0 5px 8px 0 rgba(228, 228, 228, 0.5);
    }
    .intent-block-header {
      height: 50px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      cursor: pointer;

      .intent-icons {
        height: 16px;
        margin-right: 20px;
        display: flex;
        align-items: center;
      }
      .intent-title {
        color: $color-font-normal;
        flex: 1;
        display: flex;
        input[type=text] {
          flex: 1;
        }
        .intent-title-display {
          display: flex;
          flex: 1;
          > :nth-child(1) {
            flex: 1;
          }
          > :nth-child(2) {
            flex: 0 0 120px;
          }
        }
      }
      .intent-action {
        .intent-action-tool{
          display: flex;
          width: 60px;
          justify-content: flex-end;
          .intent-action-icon{
            position: relative;
            height: 24px;
            width: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            &:hover {
              background-color: $color-disabled;
              border-radius: 100%;
            }
            &:not(:last-child) {
              margin-right: 10px;
            }
            &.close{
              &:hover {
                background-color: white;
              }
            }
          }
        }
        .intent-save-tool {
          margin-left: 10px;
        }
      }
    }

    .intent-block-content {
      padding: 10px 20px;
      border-top: 1px solid $color-borderline;
      .corpus-tools{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-bottom: 20px;
      }
      .corpus-header {
        display: flex;
        color: $color-font-active;
        align-items: center;
        margin-bottom: 20px;
        padding-right: 15px;
        .corpus-header-title {
          display: flex;
          align-items: center;
          .icon {
            margin-left: 5px;
          }
        }
        > :nth-child(1) {
          flex: 1;
        }
        > :nth-child(2) {
          flex: 0 0 120px;
        }
        > :nth-child(3) {
          flex: 0 0 80px;
        }
        > :nth-child(4) {
          flex: 0 0 280px;
        }
      }
      .corpus-block {
        border-left: 3px solid rgba(74, 144, 226, 0.24);
        .corpus-delete-btn {
          margin-left: 15px;
          padding-left: 5px;
        }
        .corpus-row {
          min-height: 28px;
          margin: 4px 0;
          margin-left: 15px;
          padding: 0 15px 0 5px;
          border-radius: 2px;
          display: flex;
          align-items: center;
          &:hover {
            background-color: $color-disabled;
          }
          &.editing {
            margin-left: 10px;
            padding: 0px;
          }
          input[type=checkbox] {
            height: 14px;
            width: 14px;
            margin-left: 0px;
            margin-right: 10px;
            cursor: pointer;
          }
          .corpus {
            flex: 1;
            display: flex;
            word-break: break-all;
            input[type=text] {
              flex: 1;
            }
            > :nth-child(1) {
              flex: 1;
            }
            > :nth-child(2) {
              flex: 0 0 120px;
            }
            > :nth-child(3) {
              flex: 0 0 80px;
            }
            > :nth-child(4) {
              flex: 0 0 280px;
            }
          }
          .corpus-action {
            display: flex;
            cursor: pointer;
            > :not(:last-child) {
              margin-right: 10px;
            }
            .corpus-action-edit {
              color: $color-primary;
            }
            .corpus-action-delete {
              color: $color-error;
            }
          }
        }
        .corpus-add-row {
          height: 28px;
          margin: 4px 0;
          margin-left: 10px;
          padding: 0 15px 0 5px;
          padding: 0px;
          display: flex;
          input[type=text] {
            flex: 1;
          }
          .add-corpus-btn {
            margin-left: 10px;
          }
        }
      }
    }
    .intent-block-footer {
      border-top: 1px solid $color-borderline;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 20px;
    }  
  }
}
</style>
