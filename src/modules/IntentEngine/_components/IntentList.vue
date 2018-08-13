<template>
  <div class="intent-list">
    <div v-for="(intent, idx) in intentListShown" :key="idx" class="intent-block" :class="{'active': intent.expand}" @mouseover="hoverIntent(intent, true)" @mouseout="hoverIntent(intent, false)">
      <div class="intent-block-header" @click="beforeExpandIntent(intent)">
        <div class="intent-icons">
          <icon icon-type="intent" :size="16"/>
        </div>
        <div class="intent-title">
          <input v-if="intent.isEditMode" type="text" ref="intentName" v-model="editIntentName" v-tooltip="intentNameTooltip" :placeholder="$t('intent_engine.manage.placeholder.intent_title')" />
          <span v-else>{{intent.name}}
            <!-- {{$t('intent_engine.manage.corpus_num', { num: intent.total })}} -->
          </span>
        </div>
        <div v-if="hasIntentAction" class="intent-action">
          <div v-if="intent.isEditMode" class="intent-save-tool">
            <text-button button-type="primary" @click="saveEditIntent(intent)">{{ $t('general.save') }}</text-button>
            <text-button @click.stop="cancelEditIntent(intent)">{{ $t('general.cancel') }}</text-button>
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
          <div class="corpus-tools">
            <label-switch 
              :options="corpusTypeOption"
              v-model="intent.viewCorpusType"
              @change="changeCorpusViewType($event, intent)"/>
            <div v-if="!intent.hasCorpusEditing && intent.hasCorpusSelected" class="corpus-delete-btn">
              <text-button button-type="error" @click="deleteMultiCorpus(intent)">{{ $t('general.delete') }}</text-button>
            </div>
          </div>
          <div class="corpus-block" @mouseout="clearHover(intent)">
            <div v-if="intent.isEditMode" class="corpus-add-row">
              <input type="text" v-model="newCorpus"
                :placeholder="$t('intent_engine.manage.placeholder.add_corpus')"
                @compositionstart="setCompositionState(true)"
                @compositionend="setCompositionState(false)"
                @keydown.enter="detectCompositionState"
                @keyup.enter="addCorpus(intent)"/>
              <text-button class="add-corpus-btn" @click="addCorpusByClick(intent)">{{ $t('intent_engine.manage.addin') }}</text-button>
            </div>
            <div v-for="(corpus, cidx) in getCorpusPage(intent)" :key="`${idx}-${cidx}`"
              class="corpus-row" :class="{'editing': corpus.isEdit}"
              @mouseover="hoverCorpus(intent, corpus)"
              >
              <div v-if="!intent.hasCorpusEditing && (intent.hasCorpusSelected || (intent.isEditMode && corpus.isHover))">
                <input type="checkbox" :checked="corpus.isSelect" @change="selectCorpus(intent, corpus)">
              </div>
              <div class="corpus">
                <input v-if="corpus.isEdit" type="text"   v-model="editCorpusContent"
                  :placeholder="$t('intent_engine.manage.placeholder.edit_corpus')" 
                  @compositionstart="setCompositionState(true)"
                  @compositionend="setCompositionState(false)"
                  @keydown.enter="detectCompositionState"
                  @keyup.enter="confirmEditCorpus(intent, corpus)"/>
                <span v-else>{{corpus.text}}</span>
              </div>
              <div v-if="!intent.hasCorpusEditing && intent.isEditMode && corpus.isHover" class="corpus-action">
                <div class="corpus-action-edit" @click="editCorpus(intent, corpus)">{{ $t('general.edit') }}</div>
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
    <div v-if="isAddIntent" class="intent-block active">
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
            <text-button button-type="primary" @click="saveAddIntent()">{{ $t('general.save') }}</text-button>
            <text-button @click.stop="cancelAddNewIntent()">{{ $t('general.cancel') }}</text-button>
          </div>
        </div>
      </div>
      <div class="intent-block-content">
        <div class="corpus-tools">
          <label-switch 
            :options="corpusTypeOption"
            v-model="newIntent.viewCorpusType"
            @change="changeCorpusViewType($event, newIntent)"/>
          <div v-if="!newIntent.hasCorpusEditing && newIntent.hasCorpusSelected" class="corpus-delete-btn">
            <text-button button-type="error" @click="deleteMultiCorpus(newIntent)">{{ $t('general.delete') }}</text-button>
          </div>
        </div>
        <div class="corpus-block" @mouseout="clearHover(newIntent)">
          <div v-if="newIntent.isEditMode" class="corpus-add-row">
            <input type="text" v-model="newCorpus"
              :placeholder="$t('intent_engine.manage.placeholder.add_corpus')"
              @compositionstart="setCompositionState(true)"
              @compositionend="setCompositionState(false)"
              @keydown.enter="detectCompositionState"
              @keyup.enter="addCorpus(newIntent)"/>
            <text-button class="add-corpus-btn" @click="addCorpusByClick(newIntent)">{{ $t('intent_engine.manage.addin') }}</text-button>
          </div>
          <div v-for="(corpus, cidx) in getCorpusPage(newIntent)" :key="`newIntent-${cidx}`"
            class="corpus-row" :class="{'editing': corpus.isEdit}"
            @mouseover="hoverCorpus(newIntent, corpus)"
          >
            <div v-if="!newIntent.hasCorpusEditing && (newIntent.hasCorpusSelected || corpus.isHover)">
              <input type="checkbox" :checked="corpus.isSelect" @change="selectCorpus(newIntent, corpus)">
            </div>
            <div class="corpus">
              <input v-if="corpus.isEdit" type="text" v-model="editCorpusContent"
                :placeholder="$t('intent_engine.manage.placeholder.edit_corpus')" 
                @compositionstart="setCompositionState(true)"
                @compositionend="setCompositionState(false)"
                @keydown.enter="detectCompositionState"
                @keyup.enter="confirmEditCorpus(newIntent, corpus)"/>
              <span v-else>{{corpus.text}}</span>
            </div>
            <div v-if="!newIntent.hasCorpusEditing && corpus.isHover" class="corpus-action">
                  <div class="corpus-action-edit" @click="editCorpus(newIntent, corpus)">{{ $t('general.edit') }}</div>
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
import event from '@/utils/js/event';

const POSITIVE_CORPUS = 'pos';
const NEGATIVE_CORPUS = 'neg';

export default {
  props: {
    intentList: {
      type: Array,
      required: true,
      default: () => [],
    },
    addIntentMode: {
      type: Boolean,
      default: false,
    },
    canEditIntent: {
      type: Boolean,
      default: true,
    },
    canDeleteIntent: {
      type: Boolean,
      default: true,
    },
    canRemoveIntent: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      intentListShown: [],
      editIntentName: '',
      editCorpusContent: '',

      isAddIntent: false,
      newIntentName: '',
      newCorpus: '',
      corpusBackup: [],
      LIST_PAGE_SIZE: 10,
      newIntent: {
        name: '',
        corpus: {
          pos: [],
          neg: [],
        },
        curPage: 1,
        expand: true,
        isHover: false,
        isEditMode: true,
        viewCorpusType: POSITIVE_CORPUS,
        hasCorpusSelected: false,
        hasCorpusEditing: false,
      },

      intentActionDropdown: {
        options: [{
          text: '編輯',
          onclick: this.beforeEditIntent,
        }],
        alignLeft: true,
      },

      intentNameTooltip: {
        msg: '',
        eventOnly: true,
        errorType: true,
        alignLeft: true,
      },

      corpusTypeOption: [{
        text: this.$t('intent_engine.manage.positive'),
        val: POSITIVE_CORPUS,
      }, {
        text: this.$t('intent_engine.manage.negative'),
        val: NEGATIVE_CORPUS,
      }],
      compositionState: false,
      wasCompositioning: false,

      // Keep edit actions at local and send these till user click save btn
      deletedCorpusIds: [],
      updatedCorpus: [],
      addedCorpus: [],
    };
  },
  computed: {
    hasIntentAction() {
      return (this.canEditIntent || this.canDeleteIntent || this.canRemoveIntent);
    },
  },
  watch: {
    intentList() {
      this.intentListShown = this.intentList.map(intent => ({
        name: intent.name,
        total: intent.total,
        curPage: 1,
        corpus: [],
        expand: false,
        isHover: false,
        isEditMode: false,
        viewCorpusType: POSITIVE_CORPUS,
        hasCorpusSelected: false,
        hasCorpusEditing: false,
      }));
    },
    addIntentMode() {
      if (this.addIntentMode) {
        this.beforeAddIntent();
      }
    },
    editIntentName() {
      if (this.$refs.intentName !== undefined && this.$refs.intentName[0] !== undefined) {
        this.$refs.intentName[0].dispatchEvent(event.createEvent('tooltip-hide'));
      }
    },
    newIntentName() {
      if (this.$refs.intentAddName !== undefined) {
        this.$refs.intentAddName.dispatchEvent(event.createEvent('tooltip-hide'));
      }
    },
  },
  methods: {
    getCorpusPage(intent) {
      // TODO: call api to get corpus depends on page and type?

      const currentCorpus = intent.corpus[intent.viewCorpusType];
      const start = this.LIST_PAGE_SIZE * (intent.curPage - 1);
      const end = this.LIST_PAGE_SIZE * intent.curPage;
      return currentCorpus.slice(start, end);
    },
    getCurTotal(intent) {
      const currentCorpus = intent.corpus[intent.viewCorpusType];
      return currentCorpus.length;
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
      if (that.canEditIntent) {
        that.intentActionDropdown.options = [{
          text: that.$t('general.edit'),
          onclick: that.beforeEditIntent.bind(that, intent, idx),
        }];
      }
      if (that.canDeleteIntent) {
        that.intentActionDropdown.options.push({
          text: that.$t('general.delete'),
          onclick: () => {
            console.log('click delete');
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
      that.$refs[refName][0].dispatchEvent(event.createEvent('dropdown-reload'));
    },
    closeExpandIntent(intent) {
      intent.expand = false;
    },
    closeAllIntent() {
      const that = this;
      that.intentListShown.forEach((intentItem) => {
        intentItem.expand = false;
      });
    },
    intentInEditMode() {
      const that = this;
      return that.intentListShown.find(intent => intent.isEditMode === true);
    },
    beforeExpandIntent(intent) {
      const that = this;
      if (intent.expand) return;
      if (that.isAddIntent) {
        that.cancelAddNewIntent(that.editIntent.bind(that, intent));
        return;
      }
      const intentInEditMode = that.intentInEditMode();
      if (intentInEditMode !== undefined) {
        that.cancelEditIntent(intentInEditMode, that.expandIntent.bind(that, intent));
      } else {
        that.expandIntent(intent);
      }
    },
    expandIntent(intent) {
      const that = this;
      that.closeAllIntent();
      // TODO: call api to get coupus from the target intent;
      // Here is MOCK
      intent.corpus = {
        pos: [
          {
            id: 1,
            text: 'theres glitter on the floor after the party',
            isEdit: false,
            isHover: false,
            isSelect: false,
          },
          {
            id: 2,
            text: 'girls carrying their shoes down in the lobby',
            isEdit: false,
            isHover: false,
            isSelect: false,
          },
          {
            id: 3,
            text: 'candle wax and polaroid on the hardwood floor',
            isEdit: false,
            isHover: false,
            isSelect: false,
          },
          {
            id: 4,
            text: 'you and me from the night before but',
            isEdit: false,
            isHover: false,
            isSelect: false,
          },
          {
            id: 5,
            text: 'dont read the last page',
            isEdit: false,
            isHover: false,
            isSelect: false,
          },
          {
            id: 6,
            text: 'and I stay when youre lost and Im scared and youre turning away',
            isEdit: false,
            isHover: false,
            isSelect: false,
          },
          {
            id: 7,
            text: 'I want your midnight',
            isEdit: false,
            isHover: false,
            isSelect: false,
          },
          {
            id: 8,
            text: 'But Ill be cleaning up bottles with you on new years day',
            isEdit: false,
            isHover: false,
            isSelect: false,
          },
          {
            id: 9,
            text: 'Hold on to the memories they will hold on to you',
            isEdit: false,
            isHover: false,
            isSelect: false,
          },
          {
            id: 10,
            text: 'And I will hold on to you',
            isEdit: false,
            isHover: false,
            isSelect: false,
          },
          {
            id: 11,
            text: 'Please dont ever become a stranger whose laugh I could recognize anywhere',
            isEdit: false,
            isHover: false,
            isSelect: false,
          },
        ],
        neg: [
          {
            id: 12,
            text: 'I dont know why all the tree change in the fall',
            isEdit: false,
            isHover: false,
            isSelect: false,
          },
          {
            id: 13,
            text: 'I know youre not scared of anything at all',
            isEdit: false,
            isHover: false,
            isSelect: false,
          },
          {
            id: 14,
            text: 'Dont know if snow whites house is near or far away',
            isEdit: false,
            isHover: false,
            isSelect: false,
          },
          {
            id: 15,
            text: 'But I know I had the best day with you today',
            isEdit: false,
            isHover: false,
            isSelect: false,
          },
        ],
      };

      intent.expand = true;
    },

    /** Handle Edit Intent */
    beforeEditIntent(intent) {
      const that = this;
      if (that.isAddIntent) {
        that.cancelAddNewIntent(that.editIntent.bind(that, intent));
        return;
      }
      const intentInEditMode = that.intentInEditMode();
      if (intentInEditMode !== undefined) {
        that.cancelEditIntent(intentInEditMode, that.editIntent.bind(that, intent));
      } else {
        that.editIntent(intent);
      }
    },
    editIntent(intent) {
      const that = this;
      that.expandIntent(intent);
      intent.isEditMode = true;
      that.editIntentName = intent.name;
      that.corpusBackup = [].concat(intent.corpus);
    },
    cancelEditIntent(intent, nextAction) {
      const that = this;
      const option = {
        data: {
          msg: that.$t('intent_engine.manage.cancel_edit_msg'),
        },
        callback: {
          ok: () => {
            that.$refs.intentName[0].dispatchEvent(event.createEvent('tooltip-hide'));
            intent.isEditMode = false;
            intent.hasCorpusSelected = false;
            intent.hasCorpusEditing = false;
            intent.corpus = that.corpusBackup;
            intent.viewCorpusType = POSITIVE_CORPUS;
            if (nextAction !== undefined) {
              nextAction();
            }
          },
        },
      };
      that.$popCheck(option);
    },
    initEditStorage() {
      const that = this;
      that.deletedCorpusIds = [];
      that.updatedCorpus = [];
      that.addedCorpus = [];
    },
    saveEditIntent(intent) {
      const that = this;
      console.log('intent:', intent);
      const intentNameValid = that.validateIntentName(that.editIntentName, intent.name);
      // TODO: validate, call api to save, reload everything
      if (intentNameValid) {
        // TODO: compare edited and deleted id, if edited appears in deleted, should filter it out.
        that.updatedCorpus = that.updatedCorpus
          .filter(cp => that.deletedCorpusIds
            .findIndex(dId => cp.id === dId) === -1);
        // form request param
        // call api to save, call api to reload itself
        // api success
        that.initEditStorage();
      } else {
        that.$refs.intentName[0].focus();
        that.$refs.intentName[0].dispatchEvent(event.createEvent('tooltip-reload'));
        that.$refs.intentName[0].dispatchEvent(event.createEvent('tooltip-show'));
      }
    },
    validateIntentName(name, oldname) {
      const that = this;
      if (name.length === 0) {
        that.intentNameTooltip.msg = that.$t('intent_engine.manage.tooltip.name_empty');
        return false;
      }
      const isNotOldName = (oldname === undefined) ? true : (oldname !== name);
      const hasDuplicateName = that.intentListShown
        .find(intent => intent.name === name) !== undefined;
      if (isNotOldName && hasDuplicateName) {
        that.intentNameTooltip.msg = that.$t('intent_engine.manage.tooltip.name_duplicate');
        return false;
      }
      return true;
    },

    /** Handle Add Intent */
    beforeAddIntent() {
      const that = this;
      const intentInEditMode = that.intentInEditMode();
      if (intentInEditMode !== undefined) {
        that.cancelEditIntent(intentInEditMode, that.addIntent);
      } else {
        that.addIntent();
      }
    },
    addIntent() {
      const that = this;
      that.closeAllIntent();
      that.newIntent = {
        name: '',
        corpus: {
          pos: [],
          neg: [],
        },
        curPage: 1,
        expand: true,
        isEditMode: true,
        viewCorpusType: POSITIVE_CORPUS,
        hasCorpusSelected: false,
        hasCorpusEditing: false,
      };
      that.isAddIntent = true;
      that.$nextTick(() => {
        that.$refs.intentAddName.focus();
      });
    },
    saveAddIntent() {
      const that = this;
      const intentNameValid = that.validateIntentName(that.newIntentName);
      // TODO: validate, call api to save, reload everything
      if (intentNameValid) {
        // form request param
        // call api to add, call api to reload all
        that.$emit('addIntentDone');
        that.initEditStorage();
      } else {
        that.$refs.intentAddName.focus();
        that.$refs.intentAddName.dispatchEvent(event.createEvent('tooltip-reload'));
        that.$refs.intentAddName.dispatchEvent(event.createEvent('tooltip-show'));
      }
    },
    cancelAddNewIntent(nextAction) {
      const that = this;
      const option = {
        data: {
          msg: that.$t('intent_engine.manage.cancel_edit_msg'),
        },
        callback: {
          ok: () => {
            that.newIntent = {};
            that.isAddIntent = false;
            that.$emit('addIntentDone');
            if (nextAction !== undefined) {
              nextAction();
            }
          },
        },
      };
      that.$popCheck(option);
    },

    /** Handle Corpus */
    changeCorpusViewType(type, intent) {
      // cancel all actions of previous type
      intent.hasCorpusEditing = false;
      intent.hasCorpusSelected = false;
      intent.curPage = 1;
      if (type === POSITIVE_CORPUS) {
        intent.corpus[NEGATIVE_CORPUS].forEach((cp) => {
          cp.isSelect = false;
          cp.isEdit = false;
        });
      } else if (type === NEGATIVE_CORPUS) {
        intent.corpus[POSITIVE_CORPUS].forEach((cp) => {
          cp.isSelect = false;
          cp.isEdit = false;
        });
      }
    },
    hoverCorpus(intent, corpus) {
      intent.corpus[intent.viewCorpusType].forEach((cp) => {
        cp.isHover = false;
      });
      corpus.isHover = true;
    },
    clearHover(intent) {
      if (intent.corpus) {
        intent.corpus[intent.viewCorpusType].forEach((cp) => {
          cp.isHover = false;
        });
      }
    },
    selectCorpus(intent, corpus) {
      corpus.isSelect = !corpus.isSelect;
      intent.hasCorpusSelected = intent.corpus[intent.viewCorpusType]
        .filter(cp => cp.isSelect === true).length !== 0;
    },
    leaveEditCorpus(corpus, intent) {
      corpus.isEdit = false;
      intent.hasCorpusEditing = false;
    },
    editCorpus(intent, corpus) {
      const that = this;
      corpus.isEdit = true;
      intent.hasCorpusEditing = true;
      that.editCorpusContent = corpus.text;
    },
    confirmEditCorpus(intent, corpus) {
      const that = this;
      if (that.wasCompositioning) {
        return;
      }
      that.editCorpusContent = that.editCorpusContent.trim();
      if (that.editCorpusContent === '') {
        that.deleteCorpus(intent, corpus);
      } else {
        corpus.text = that.editCorpusContent;
        that.refreshUpdatedCorpus(corpus, that.editCorpusContent);
      }
      that.leaveEditCorpus(corpus, intent);
    },
    refreshUpdatedCorpus(corpus, newText) {
      const that = this;
      const idxInUpdatedCorpus = that.updatedCorpus.findIndex(cp => cp.id === corpus.id);
      const idxInAddedCorpus = that.addedCorpus.findIndex(cp => cp.id === corpus.id);

      if (idxInAddedCorpus !== -1) {
        that.addedCorpus[idxInAddedCorpus].text = newText;
      } else if (idxInUpdatedCorpus !== -1) {
        that.updatedCorpus[idxInUpdatedCorpus].text = newText;
      } else {
        that.updatedCorpus.push({
          id: corpus.id,
          text: newText,
        });
      }
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
      const corpusIdx = intent.corpus[intent.viewCorpusType].findIndex(cp => cp.id === corpus.id);
      intent.corpus[intent.viewCorpusType].splice(corpusIdx, 1);
      that.refreshDeletedCorpus(corpus);
      intent.hasCorpusSelected = intent.corpus[intent.viewCorpusType]
        .filter(cp => cp.isSelect === true).length !== 0;
    },
    deleteMultiCorpus(intent) {
      const that = this;
      const selectedCorpus = intent.corpus[intent.viewCorpusType]
        .filter(cp => cp.isSelect === true);
      selectedCorpus.forEach((corpus) => {
        that.deleteCorpus(intent, corpus);
      });
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
      if (intent.hasCorpusEditing) {
        const editingCorpus = intent.corpus[intent.viewCorpusType].find(cp => cp.isEdit === true);
        that.leaveEditCorpus(editingCorpus, intent);
      }
      if (that.newCorpus !== '') {
        const tempId = -parseInt(Math.random() * 1000, 10);
        intent.corpus[intent.viewCorpusType].splice(0, 0, {
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
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.intent-list {
  @include font-14px();
  > :not(:last-child) {
    margin-bottom: 12px;
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
      }
      .intent-action {
        .intent-action-tool{
          display: flex;
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
      color: $color-font-normal;
      .corpus-tools{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
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
      padding-right: 12px;
    }  
  }
}
</style>
