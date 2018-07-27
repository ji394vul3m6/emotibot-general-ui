<template>
  <div class="intent-list">
    <div v-for="(intent, idx) in intentList" :key="idx" class="intent-block" :class="{'active': intent.expand}" >
      <!--@click="beforeExpandIntent(intent)"-->
      <div class="intent-block-header">
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
            <div class="intent-action-icon" :ref="`${idx}_intentAction`" @click.stop="showDropdown(intent, idx)" v-dropdown="intentActionDropdown">
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
          <div class="corpus-block" @mouseout="clearHover(intent)">
            <div v-if="!intent.hasCorpusEditing && intent.hasCorpusSelected" class="corpus-delete-btn">
              <text-button button-type="error" @click="deleteMultiCorpus(intent)">{{ $t('general.delete') }}</text-button>
            </div>
            <div v-for="(corpus, cidx) in intent.corpus" :key="`${idx}-${cidx}`"
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
            <div v-if="intent.isEditMode" class="corpus-add-row">
              <input type="text" v-model="newCorpus"
                :placeholder="$t('intent_engine.manage.placeholder.add_corpus')"
                @compositionstart="setCompositionState(true)"
                @compositionend="setCompositionState(false)"
                @keydown.enter="detectCompositionState"
                @keyup.enter="addCorpus(intent)"/>
              <text-button class="add-corpus-btn" button-type="primary" @click="addCorpusByClick(intent)">{{ $t('intent_engine.manage.addin') }}</text-button>
            </div>
          </div>
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
        <div class="corpus-block" @mouseout="clearHover(newIntent)">
          <div v-if="!newIntent.hasCorpusEditing && newIntent.hasCorpusSelected" class="corpus-delete-btn">
            <text-button button-type="error" @click="deleteMultiCorpus(intent)">{{ $t('general.delete') }}</text-button>
          </div>
          <div v-for="(corpus, cidx) in newIntent.corpus" :key="`newIntent-${cidx}`"
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
          <div v-if="newIntent.isEditMode" class="corpus-add-row">
            <input type="text" v-model="newCorpus"
              :placeholder="$t('intent_engine.manage.placeholder.add_corpus')"
              @compositionstart="setCompositionState(true)"
              @compositionend="setCompositionState(false)"
              @keydown.enter="detectCompositionState"
              @keyup.enter="addCorpus(newIntent)"/>
            <text-button class="add-corpus-btn" button-type="primary" @click="addCorpusByClick(newIntent)">{{ $t('intent_engine.manage.addin') }}</text-button>
          </div>
        </div>
      </div> 
    </div>
  </div>
</template>
<script>
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
      editIntentName: '',
      editCorpusContent: '',

      isAddIntent: false,
      newIntentName: '',
      newCorpus: '',
      newIntent: {
        name: '',
        corpus: [],
        expand: true,
        isEditMode: true,
        hasCorpusSelected: false,
        hasCorpusEditing: false,
      },

      intentActionDropdown: {
        options: [{
          text: '編輯',
          onclick: this.beforeEditIntent,
          // onclick: this.beforeEditIntent(intent, idx),
        }],
        alignLeft: true,
      },

      intentNameTooltip: {
        msg: '',
        eventOnly: true,
        errorType: true,
        alignLeft: true,
      },

      compositionState: false,
      wasCompositioning: false,
    };
  },
  computed: {
    hasIntentAction() {
      return (this.canDeleteIntent || this.canRemoveIntent);
    },
  },
  watch: {
    intentList() {
      this.intentList.forEach((intent) => {
        intent.corpus = [];
        intent.expand = false;
        intent.isEditMode = false;
        intent.hasCorpusSelected = false;
        intent.hasCorpusEditing = false;
      });
    },
    addIntentMode() {
      if (this.addIntentMode) {
        this.beforeAddIntent();
      }
    },
    editIntentName() {
      if (this.$refs.intentName !== undefined) {
        this.$refs.intentName[0].dispatchEvent(new Event('tooltip-hide'));
      }
    },
    newIntentName() {
      if (this.$refs.intentAddName !== undefined) {
        this.$refs.intentAddName.dispatchEvent(new Event('tooltip-hide'));
      }
    },
  },
  methods: {
    setCompositionState(bool) {
      this.compositionState = bool;
    },
    detectCompositionState() {
      this.wasCompositioning = this.compositionState;
    },
    showDropdown(intent, idx) {
      const that = this;
      // that.intentActionDropdown.options = [{
      //   text: that.$t('general.edit'),
      //   onclick: that.beforeEditIntent.bind(that, intent, idx),
      // }];
      that.intentActionDropdown.options = [];

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
      that.$refs[refName][0].dispatchEvent(new Event('dropdown-reload'));
    },
    closeExpandIntent(intent) {
      intent.expand = false;
    },
    closeAllIntent() {
      const that = this;
      that.intentList.forEach((intentItem) => {
        intentItem.expand = false;
      });
    },
    intentInEditMode() {
      const that = this;
      return that.intentList.find(intent => intent.isEditMode === true);
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
      that.$forceUpdate();
    },
    cancelEditIntent(intent, nextAction) {
      const that = this;
      const option = {
        data: {
          msg: that.$t('intent_engine.manage.cancel_edit_msg'),
        },
        callback: {
          ok: () => {
            that.$refs.intentName[0].dispatchEvent(new Event('tooltip-hide'));
            intent.isEditMode = false;
            intent.hasCorpusSelected = false;
            intent.hasCorpusEditing = false;
            intent.corpus.forEach((cp) => {
              cp.isSelect = false;
              cp.isEdit = false;
            });
            if (nextAction !== undefined) {
              nextAction();
            }
          },
        },
      };
      that.$popCheck(option);
    },
    saveEditIntent(intent) {
      const that = this;
      console.log('intent:', intent);
      const intentNameValid = that.validateIntentName(that.editIntentName, intent.name);
      // TODO: validate, call api to save, reload everything
      if (intentNameValid) {
        // form request param
        // call api to save, call api to reload itself
      } else {
        // Show tooltip
        console.log(that.$refs);
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
      const hasDuplicateName = that.intentList.find(intent => intent.name === name) !== undefined;
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
        corpus: [],
        expand: true,
        isEditMode: true,
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
    hoverCorpus(intent, corpus) {
      intent.corpus.forEach((cp) => {
        cp.isHover = false;
      });
      corpus.isHover = true;
    },
    clearHover(intent) {
      intent.corpus.forEach((cp) => {
        cp.isHover = false;
      });
    },
    selectCorpus(intent, corpus) {
      corpus.isSelect = !corpus.isSelect;
      intent.hasCorpusSelected = intent.corpus.filter(cp => cp.isSelect === true).length !== 0;
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
      corpus.text = that.editCorpusContent;
      corpus.isEdit = false;
      intent.hasCorpusEditing = false;
    },
    deleteCorpus(intent, corpus) {
      const corpusIdx = intent.corpus.findIndex(cp => cp.id === corpus.id);
      intent.corpus.splice(corpusIdx, 1);
      intent.hasCorpusSelected = intent.corpus.filter(cp => cp.isSelect === true).length !== 0;
    },
    deleteMultiCorpus(intent) {
      const that = this;
      const selectedCorpus = intent.corpus.filter(cp => cp.isSelect === true);
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
      if (that.newCorpus !== '') {
        intent.corpus.push({
          id: parseInt(Math.random() * 1000, 10),
          text: that.newCorpus,
          isHover: false,
          isSelect: false,
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
    transition: all .3s ease-in-out;
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
      .corpus-block {
        border-left: 2px solid rgba(74, 144, 226, 0.24);
        .corpus-delete-btn {
          margin-left: 15px;
          padding-left: 5px;
        }
        .corpus-row {
          height: 28px;
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
  }
}
</style>
