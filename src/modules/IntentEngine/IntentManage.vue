<template>
  <div id="intent-manage">
    <div class="card w-fill h-fill">
      <div class="header">
        <div class="header-title">
          {{ $t('pages.intent_engine.intent_manage') }}
        </div>
        <div class="header-tool">
          <text-button id="train-button" :button-type="canTrain ? 'default' : 'disable'" :icon-type="canTrain ? 'info_warning' : 'info_warning_gray'" width="100px" @click="startTraining">{{ $t('intent_engine.train') }}</text-button>
          <search-input v-model="intentKeyword"></search-input>
        </div>
      </div>
      <div class="content">
        <div class="content-tool">
          <text-button v-if="canEdit" button-type="primary" @click="beforeAddIntent">{{ $t('intent_engine.manage.add_intent') }}</text-button>
          <text-button v-if="canImport" @click="importIntentList">{{ $t('general.import') }}</text-button>
          <text-button v-if="canExport" @click="exportIntentList(currentVersion)">{{ $t('general.export') }}</text-button>
        </div>
        <div class="intent-list">
          <div v-for="(intent, idx) in intentList" :key="idx" class="intent-block" :class="{'active': intent.expand}" >
            <div class="intent-block-header" @click="beforeExpandIntent(intent)">
              <div class="intent-icons">
                <icon icon-type="intent" :size="16"/>
              </div>
              <div class="intent-title">
                <input v-if="intent.isEditMode" type="text" v-model="editIntentName" :placeholder="$t('intent_engine.manage.placeholder.intent_title')"/>
                <span v-else>{{intent.name}}{{$t('intent_engine.manage.corpus_num', { num: intent.total })}}</span>
              </div>
              <div class="intent-action">
                <div v-if="intent.isEditMode" class="intent-save-tool">
                  <text-button button-type="primary">{{ $t('general.save') }}</text-button>
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
                <input type="text" v-model="newIntent.name" :placeholder="$t('intent_engine.manage.placeholder.intent_title')"/>
              </div>
              <div class="intent-action">
                <div class="intent-save-tool">
                  <text-button button-type="primary">{{ $t('general.save') }}</text-button>
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
      </div>
    </div>
  </div>
</template>
<script>
import api from './_api/intent';
import ImportIntentPop from './_components/ImportIntentPop';

export default {
  path: 'intent-manage',
  privCode: 'intent_manage',
  displayNameKey: 'intent_manage',
  name: 'intent-manage',
  api,
  data() {
    return {
      statusTimer: null,
      trainStatus: undefined,  // 'TRAINED', 'NOT_TRAINED', 'TRAINING'
      trainBtnClicked: false,
      intentKeyword: '',

      isAddIntent: false,

      intentList: [
        {
          name: 'Blank Space',
          total: 8,
          corpus: [
            {
              id: 1,
              text: 'Nice to meet you',
              isHover: false,
              isSelect: false,
            },
            {
              id: 2,
              text: 'Where youve been',
              isHover: false,
              isSelect: false,
            },
            {
              id: 3,
              text: 'I could show you incredible things',
              isHover: false,
              isSelect: false,
            },
          ],
          expand: false,
          isEditMode: false,
          hasCorpusSelected: false,
          hasCorpusEditing: false,
        },
        {
          name: 'Wildest Dream',
          total: 7,
          corpus: [
            {
              id: 4,
              text: 'Say youll remember me',
              isHover: false,
              isSelect: false,
            },
            {
              id: 5,
              text: 'Standing in a nice dress',
              isHover: false,
              isSelect: false,
            },
            {
              id: 6,
              text: 'Staring at the sunset',
              isHover: false,
              isSelect: false,
            },
          ],
          expand: false,
          isEditMode: false,
          hasCorpusSelected: false,
          hasCorpusEditing: false,
        },
      ],
      currentVersion: '',

      editIntentName: '',
      editCorpusContent: '',

      // newIntentName: '',
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
      compositionState: false,
      wasCompositioning: false,
    };
  },
  computed: {
    hasIntents() {
      return this.intentList.length > 0;
    },
    versionNotAvailable() {
      return !this.hasIntents && this.currentVersion === '';
    },
    canImport() {
      return this.$hasRight('import') && !this.versionNotAvailable;
    },
    canExport() {
      return this.$hasRight('export') && !this.versionNotAvailable;
    },
    canEdit() {
      return this.$hasRight('edit') && !this.versionNotAvailable;
    },
    canTrain() {
      return !this.versionNotAvailable && (this.hasIntents && this.shouldTrain);
    },
    shouldTrain() {
      return this.trainStatus === 'NOT_TRAINED' || this.trainStatus === 'TRAIN_FAILED';
    },
  },
  methods: {
    exportIntentList(version) {
      const EXPORT_INTENT_URL = 'api/v1/intents/download';
      if (version) {
        window.open(`${EXPORT_INTENT_URL}?version=${version}`, '_blank');
      } else {
        window.open(EXPORT_INTENT_URL, '_blank');
      }
    },
    importIntentList() {
      const that = this;
      const popOption = {
        title: that.$t('intent_engine.import.title'),
        component: ImportIntentPop,
        disable_ok: true,
        validate: true,
        callback: {
          ok(file) {
            that.$emit('startLoading');
            that.$api.importIntents(file)
            .then((res) => {
              that.currentVersion = res.version;
              clearInterval(that.statusTimer);
              that.statusTimer = undefined;
              that.pollTrainingStatus(that.currentVersion);
              that.refreshIntentPage();
              that.$notify({ text: that.$t('intent_engine.import.success') });
            })
            .catch((err) => {
              console.log(err);
              that.$notifyFail(that.$t('intent_engine.import.fail'));
            })
            .finally(() => {
              that.$emit('endLoading');
            });
          },
        },
      };
      that.$pop(popOption);
    },
    setCompositionState(bool) {
      this.compositionState = bool;
    },
    detectCompositionState() {
      this.wasCompositioning = this.compositionState;
    },
    showDropdown(intent, idx) {
      const that = this;
      that.intentActionDropdown.options = [{
        text: that.$t('general.edit'),
        onclick: that.beforeEditIntent.bind(that, intent, idx),
      }, {
        text: that.$t('general.delete'),
        onclick: () => {
          console.log('click delete');
        },
      }];
      const refName = `${idx}_intentAction`;
      that.$refs[refName][0].dispatchEvent(new Event('dropdown-reload'));
    },
    intentInEditMode() {
      const that = this;
      return that.intentList.find(intent => intent.isEditMode === true);
    },
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
      that.isAddIntent = true;
      that.newIntent = {
        name: '',
        corpus: [],
        expand: true,
        isEditMode: true,
        hasCorpusSelected: false,
        hasCorpusEditing: false,
      };
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
    closeAllIntent() {
      const that = this;
      that.intentList.forEach((intentItem) => {
        intentItem.expand = false;
      });
    },
    expandIntent(intent) {
      const that = this;
      that.closeAllIntent();
      intent.expand = true;
    },
    closeExpandIntent(intent) {
      intent.expand = false;
    },
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
            console.log('nextAction', nextAction);
            if (nextAction !== undefined) {
              nextAction();
            }
          },
        },
      };
      that.$popCheck(option);
    },
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
    startTraining() {
      const that = this;
      that.$api.startTraining()
      .then(() => {
        that.trainBtnClicked = true;
        that.showLoading(that.$t('intent_engine.is_training'));
      });
    },
    pollTrainingStatus(version) {
      const that = this;
      const prevStatus = that.trainStatus;
      that.$api.getTrainingStatus(version)
      .then((status) => {
        if (status === 'TRAINING') {
          that.$emit('startLoading', that.$t('intent_engine.is_training'));
          that.trainStatus = status;
        } else if (prevStatus === 'TRAINING') {
          that.refreshIntentPage(); // also hideloading
          if (status === 'TRAINED') {
            if (that.trainBtnClicked) {
              that.$notify({ text: that.$t('intent_engine.training_success') });
              that.trainBtnClicked = false;
            }
          } else if (status === 'TRAIN_FAILED') {
            if (that.trainBtnClicked) {
              that.$notifyFail(that.$('intent_engine.training_fail'));
              that.trainBtnClicked = false;
            }
          }
        } else if (prevStatus === 'TRAIN_FAILED') {
          if (status === 'TRAIN_FAILED') {
            if (that.trainBtnClicked) {
              that.$notifyFail(that.$t('intent_engine.training_fail'));
              that.trainBtnClicked = false;
              that.$emit('endLoading');
            }
          }
        } else if (prevStatus === undefined) {
          that.refreshIntentPage();
        }
        that.trainStatus = status;
        if (!this.statusTimer) {
          that.startPollingTrainingStatus(version);
        }
      })
      .catch((err) => {
        that.trainBtnClicked = false;
        console.log(err);
        if (err.response.status === 400) {
          that.$notifyFail(that.$t('http_status.400'));
        } else if (err.response.status === 401) { // unauthorized
          that.$notifyFail(that.$t('http_status.401'));
        } else if (err.response.status === 404) {  // version not exist
          that.$notifyFail(that.$t('intent_engine.version_not_exist'));
          this.currentVersion = '';
          clearInterval(this.statusTimer);
          this.statusTimer = undefined;
        } else if (err.response.status !== 500) {
          that.$notifyFail(that.$t('intent_engine.training_fail'));
        }
        that.$emit('endLoading');
      });
    },
    startPollingTrainingStatus(version) {
      this.statusTimer = setInterval(() => {
        this.pollTrainingStatus(version);
      }, 5000);
    },
    refreshIntentPage() {
      const that = this;
      this.$emit('startLoading');
      that.$api.getIntents()
      .then((intents) => {
        console.log(intents);
        that.intentList = [];
        intents.forEach((intent) => {
          that.intentList.push({
            name: intent,
            total: 0,
            corpus: [],
            expand: false,
            isEditMode: false,
            hasCorpusSelected: false,
            hasCorpusEditing: false,
          });
        });
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status < 500) {
          if (err.response.status === 404) {
            that.$notifyFail(that.$t('intent_engine.version_not_exist'));
          } else {
            that.$notifyFail(that.$t('http_status.400'));
          }
        }
      })
      .finally(() => {
        this.$emit('endLoading');
      });
    },
  },
  mounted() {
    this.$emit('startLoading');
    this.pollTrainingStatus();
  },
  beforeDestroy() {
    clearInterval(this.statusTimer);
    this.statusTimer = undefined;
  },

};
</script>
<style lang="scss" scoped>
.header {
  height: 60px;
  padding: 0 20px;
  border-bottom: 1px solid $color-borderline;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .header-title {
    @include font-16px();
    color: $color-font-active;
  }
  .header-tool {
    display: flex;
    align-items: center;
    > :not(:last-child) {
      margin-right: 10px;
    }
    .text-button {
      border-color: $color-warning;
      &.disabled {
        border-color: $color-borderline;
      }
    }
  }
}
.content {
  padding: 20px;
  .content-tool {
    margin-bottom: 20px;
    display: flex;
    .text-button {
      margin-right: 10px;
    }
  }
}
.intent-list {
  @include font-14px();
  > :not(:last-child) {
    margin-bottom: 12px;
  }

  .intent-block {
    border: 1px solid #DBDBDB;
    border-radius: 4px;
    transition: all .5s ease-in-out;
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
