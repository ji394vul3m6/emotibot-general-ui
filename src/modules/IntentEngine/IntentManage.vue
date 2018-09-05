<template>
  <div id="intent-manage">
    <div id="intent-manage-card" class="card w-fill h-fill">
      <div class="header">
        <div class="header-title">
          {{ $t('pages.intent_engine.intent_manage') }}
          <icon iconType="info" :size="16" enableHover v-tooltip="pageInfoTooltip"></icon>
        </div>
        <div class="header-subtitle">
          {{ $t('intent_engine.manage.intent_num', {inum: intentList.length, cnum: corpusCounts}) }}
        </div>
        <div class="header-tool">
          <div v-if="isTraining" class="train-hint training">
            <loading-line></loading-line>
            {{ $t('intent_engine.manage.train_status_msg.is_training', {percentage: trainingProgress}) }}
          </div>
          <div v-else class="train-hint">
            {{ $t('intent_engine.manage.train_status_msg.last_train', {timestr: lastTrainedTime}) }}
          </div>
          <text-button id="train-button"
            :button-type="canTrain ? 'default' : 'disable'"
            :icon-type="canTrain ? 'info_warning' : 'info_warning_gray'" width="100px"
            @click="startTraining" v-tooltip="trainButtonTooltip">{{ $t('intent_engine.train') }}</text-button>
          <search-input v-model="intentKeyword" @focus="setSearchIntent"></search-input>
        </div>
      </div>
      <div class="content">
        <div class="content-tool">
          <div class="content-tool-left">
            <text-button v-if="canAdd" :button-type="allowAdd ? 'primary' : 'disable'" @click="addIntent">{{ $t('intent_engine.manage.add_intent') }}</text-button>
            <text-button v-if="canImport" :button-type="allowImport ? 'default' : 'disable'" @click="importIntentList">{{ $t('general.import') }}</text-button>
            <text-button v-if="canExport" :button-type="allowExport ? 'default' : 'disable'" @click="exportIntentList(currentVersion)">{{ $t('general.export') }}</text-button>
          </div>
          <div v-if="!hasIntents" class="content-tool-right">
            <text-button @click="downloadTemplate">{{ $t('intent_engine.import.download_template') }}</text-button>
          </div>
        </div>
        <div v-if="!hasIntents && !isAddIntent" class="init_page">
          {{ $t('intent_engine.manage.no_data.title') }}<br>
          {{ $t('intent_engine.manage.no_data.hint_left') }}<br>
          {{ $t('intent_engine.manage.no_data.hint_right') }}
        </div>
        <div v-else-if="hasIntents || isAddIntent">
        <intent-list 
          :intentList="intentList"
          :canEditIntent="canEdit && allowEdit"
          :canDeleteIntent="canEdit && allowEdit"
          :addIntentMode="isAddIntent"
          :searchIntentMode="isSearchIntent"
          :searchIntentWithKeyword="isSearchKeyword"
          :keyword="intentKeyword"
          @addIntentDone="finishAddIntent($event)"
          @deleteIntentDone="refreshIntentPage()"
          @cancelSearch="setSearchIntent(false)">
        </intent-list>
        </div>
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
      fetchStatusError: false,
      trainStatus: undefined,  // 'TRAINED', 'NOT_TRAINED', 'TRAINING'
      trainBtnClicked: false,
      intentKeyword: '',
      keywordTimer: null,
      keywordDelay: 500, // ms

      isAddIntent: false,
      isSearchIntent: false,  // on focus search input
      isSearchKeyword: false,    // call search api with keyword or not

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
      corpusCounts: 0,
      currentVersion: '',
      trainButtonTooltip: {
        msg: this.$t('intent_engine.manage.train_button_tooltip'),
        alignLeft: true,
      },
      trainingProgress: 50,
      lastTrainedTime: '2018-07-09 16:53',
      pageInfoTooltip: {
        msg: this.$t('intent_engine.manage.tooltip.page_info'),
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
    allowImport() {
      return !this.isTraining && !this.fetchStatusError;
    },
    allowExport() {
      return !this.versionNotAvailable && this.hasIntents &&
        !this.isTraining && !this.fetchStatusError;
    },
    canEdit() {
      return this.$hasRight('edit') && !this.versionNotAvailable;
    },
    canAdd() {
      return this.$hasRight('edit');
    },
    allowEdit() {
      return !this.isTraining;
    },
    allowAdd() {
      return !this.isTraining && !this.fetchStatusError;
    },
    allowLoadPage() {
      return !this.fetchStatusError;
    },
    canTrain() {
      return !this.versionNotAvailable && (this.hasIntents && this.shouldTrain);
    },
    shouldTrain() {
      return this.trainStatus === 'NOT_TRAINED' || this.trainStatus === 'TRAIN_FAILED';
    },
    isTraining() {
      return this.trainStatus === 'TRAINING';
    },
  },
  watch: {
    intentList() {
      const that = this;
      if (!that.isSearchIntent) {
        that.corpusCounts = that.intentList.reduce((acc, intent) => acc + intent.total
      , 0);
      }
    },
    intentKeyword() {
      const that = this;
      if (that.keywordTimer) {
        clearTimeout(that.keywordTimer);
      }
      that.keywordTimer = setTimeout(() => {
        that.refreshIntentPage();
      }, that.keywordDelay);
    },
  },
  methods: {
    downloadTemplate() {
      window.open('/Files/intent_template.xlsx', '_blank');
    },
    addIntent() {
      if (!this.allowAdd) return;
      this.isAddIntent = true;
      this.intentKeyword = '';
    },
    finishAddIntent(done) {
      this.isAddIntent = false;
      if (done) {
        this.refreshIntentPage();
      }
    },
    setSearchIntent(bool) {
      this.isSearchIntent = bool;
    },
    exportIntentList(version) {
      if (!this.allowExport) return;
      const EXPORT_INTENT_URL = 'api/v2/intents/export';
      if (version) {
        window.open(`${EXPORT_INTENT_URL}?version=${version}`);
      } else {
        window.open(EXPORT_INTENT_URL);
      }
    },
    importIntentList() {
      const that = this;
      if (!that.allowImport) return;

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
      if (!that.canTrain) return;
      that.$api.startTraining()
      .then(() => {
        that.trainStatus = 'TRAINING';
        that.trainBtnClicked = true;
        that.$emit('startLoading', that.$t('intent_engine.is_training'));
      });
    },
    pollTrainingStatus(version) {
      const that = this;
      const prevStatus = that.trainStatus;
      that.$api.getTrainingStatus(version)
      .then((status) => {
        that.fetchStatusError = false;
        if (status === 'TRAINING') {
          // that.$emit('startLoading', that.$t('intent_engine.is_training'));
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
        that.fetchStatusError = true;
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
      if (!this.allowLoadPage) return;
      this.$emit('startLoading');
      // that.$api.getIntents()
      that.$api.getIntentsDetail(that.intentKeyword)
      .then((intents) => {
        that.isSearchKeyword = that.intentKeyword !== '';

        that.intentList = [];
        intents.forEach((intent) => {
          that.intentList.push({
            id: intent.id,
            name: intent.name,
            total: intent.count,
            positiveCount: intent.positive_count,
            negativeCount: intent.negative_count,
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
    display: flex;
    align-items: center;
    .icon {
      margin-left: 6px;
    }
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
    .train-hint {
      @include font-14px();
      color: $color-font-mark;
      &.training {
        color: $color-primary;
      }
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
