<template>
  <div id="intent-manage">
    <div id="intent-manage-card" class="card w-fill h-fill">
      <div class="header">
        <div class="header-title">
          {{ $t('pages.intent_engine.intent_manage') }}
        </div>
        <div class="header-subtitle">
          {{ $t('intent_engine.manage.intent_num', {inum: intentList.length}) }}
        </div>
        <div class="header-tool">
          <text-button id="train-button" :button-type="canTrain ? 'default' : 'disable'" :icon-type="canTrain ? 'info_warning' : 'info_warning_gray'" width="100px" @click="startTraining" v-tooltip="trainButtonTooltip">{{ $t('intent_engine.train') }}</text-button>
          <search-input v-model="intentKeyword"></search-input>
        </div>
      </div>
      <div class="content">
        <div class="content-tool">
          <div class="content-tool-left">
            <text-button v-if="canAdd" button-type="primary" @click="addIntent">{{ $t('intent_engine.manage.add_intent') }}</text-button>
            <text-button v-if="canImport" @click="importIntentList">{{ $t('general.import') }}</text-button>
            <text-button v-if="canExport" :button-type="allowExport ? 'default' : 'disable'" @click="exportIntentList(currentVersion)">{{ $t('general.export') }}</text-button>
          </div>
          <div v-if="!hasIntents" class="content-tool-right">
            <text-button>{{ $t('intent_engine.import.download_template') }}</text-button>
          </div>
        </div>
        <div v-if="!hasIntents && !isAddIntent" class="init_page">
          {{ $t('intent_engine.manage.no_data.title') }}<br>
          {{ $t('intent_engine.manage.no_data.hint_left') }}<br>
          {{ $t('intent_engine.manage.no_data.hint_right') }}
        </div>
        <intent-list
          :intentList="intentListToShow"
          :canEditIntent="canEdit"
          :canDeleteIntent="canEdit"
          :addIntentMode="isAddIntent"
          @addIntentDone="finishAddIntent()">
        </intent-list>
      </div>
    </div>
  </div>
</template>
<script>
import api from './_api/intent';
import IntentList from './_components/IntentList';
import ImportIntentPop from './_components/ImportIntentPop';

export default {
  path: 'intent-manage',
  privCode: 'intent_manage',
  displayNameKey: 'intent_manage',
  name: 'intent-manage',
  api,
  components: {
    IntentList,
  },
  data() {
    return {
      statusTimer: null,
      trainStatus: undefined,  // 'TRAINED', 'NOT_TRAINED', 'TRAINING'
      trainBtnClicked: false,
      intentKeyword: '',

      isAddIntent: false,

      intentList: [
        // {
        //   name: '',
        //   total: 0,
        //   corpus: [
        //     {
        //       id: 0,
        //       text: '',
        //       isHover: false,
        //       isSelect: false,
        //     },
        //   ],
        //   expand: false,
        //   isEditMode: false,
        //   hasCorpusSelected: false,
        //   hasCorpusEditing: false,
        // },
      ],
      currentVersion: '',
      trainButtonTooltip: {
        msg: this.$t('intent_engine.manage.train_button_tooltip'),
        alignLeft: true,
      },
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
      return this.$hasRight('import');
    },
    canExport() {
      return this.$hasRight('export');
    },
    allowExport() {
      return !this.versionNotAvailable && this.hasIntents;
    },
    canEdit() {
      return this.$hasRight('edit') && !this.versionNotAvailable;
    },
    canAdd() {
      return this.$hasRight('edit');
    },
    canTrain() {
      return !this.versionNotAvailable && (this.hasIntents && this.shouldTrain);
    },
    shouldTrain() {
      return this.trainStatus === 'NOT_TRAINED' || this.trainStatus === 'TRAIN_FAILED';
    },
    intentListToShow() {
      if (this.intentKeyword !== '') {
        return this.intentList.filter(intent => intent.name.includes(this.intentKeyword));
        // NOTE: 'includes' may not support IE
      }
      return this.intentList;
    },
  },
  methods: {
    addIntent() {
      this.isAddIntent = true;
      this.intentKeyword = '';
    },
    finishAddIntent() {
      this.isAddIntent = false;
    },
    exportIntentList(version) {
      if (!this.allowExport) return;
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
    startTraining() {
      const that = this;
      that.$api.startTraining()
      .then(() => {
        that.trainBtnClicked = true;
        that.$emit('startLoading', that.$t('intent_engine.is_training'));
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
        that.intentList = [];
        intents.forEach((intent) => {
          that.intentList.push({
            name: intent,
            total: 0,
            // corpus: [],
            // expand: false,
            // isEditMode: false,
            // hasCorpusSelected: false,
            // hasCorpusEditing: false,
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

#intent-manage-card {
  display: flex;
  flex-direction: column;
  .content {
    flex: 1;
  }
}
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
  .header-subtitle {
    @include font-16px();
    color: $color-font-mark;
    flex: 1;
    margin-left: 20px;
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
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
  @include customScrollbar();

  .content-tool {
    flex: 0 0 auto;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    .text-button {
      margin-right: 10px;
      &:last-child {
        margin-right: 0px;
      }
    }
  }
  .intent-list {
    flex: 1;
  }
  .init_page {
    @include font-14px();
    color: $color-font-disabled;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
}
</style>
