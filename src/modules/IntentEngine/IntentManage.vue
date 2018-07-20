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
          <!-- <text-button v-if="canEdit" button-type="primary" @click="addIntent">{{ $t('intent_engine.manage.add_intent') }}</text-button> -->
          <text-button v-if="canImport" @click="importIntentList">{{ $t('general.import') }}</text-button>
          <text-button v-if="canExport" @click="exportIntentList(currentVersion)">{{ $t('general.export') }}</text-button>
        </div>
        <intent-list 
          :intentList="intentList"
          :canDeleteIntent="false"
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
        {
          name: '',
          total: 0,
          // corpus: [
          //   {
          //     id: 0,
          //     text: '',
          //     isHover: false,
          //     isSelect: false,
          //   },
          // ],
          // expand: false,
          // isEditMode: false,
          // hasCorpusSelected: false,
          // hasCorpusEditing: false,
        },
      ],
      currentVersion: '',
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
    addIntent() {
      this.isAddIntent = true;
    },
    finishAddIntent() {
      this.isAddIntent = false;
    },
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
</style>
