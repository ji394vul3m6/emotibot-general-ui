<template>
<div id="intent-train-tab">
  <div class="content">
    <div class="content-tool">
      <div class="content-tool-left">
        <text-button v-if="canAdd" :button-type="allowAdd ? 'primary' : 'disable'" @click="addIntent">{{ $t('intent_engine.manage.add_intent') }}</text-button>
        <text-button v-if="canEdit && showBatchDelete" :button-type="allowEdit ? 'error' : 'disable'" @click="deleteIntents">{{ $t('intent_engine.manage.delete_intents') }}</text-button>
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
        :searchIntentMode="searchIntentMode"
        :searchIntentWithKeyword="isSearchKeyword"
        :keyword="searchKeyword"
        @addIntentDone="finishAddIntent($event)"
        @deleteIntentDone="refreshIntentPage()"
        @cancelSearch="inSearchIntentMode(false)"
        @checkedIntent="handleIntentChecked"
        ref="intents">
      </intent-list>
    </div>
  </div>
  <side-panel clase="side-panel"></side-panel>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import util from '@/utils/js/format';
import api from '../_api/intent';
import SidePanel from './SidePanel';
import IntentList from './IntentList';
import ImportIntentPop from './ImportIntentPop';

export default {
  name: 'intent-train-tab',
  api,
  privCode: 'intent_manage',
  components: {
    SidePanel,
    IntentList,
  },
  props: {
    searchKeyword: {
      type: String,
      required: true,
    },
    searchIntentMode: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      statusTimer: null,
      fetchStatusError: false,
      trainStatus: undefined,  // 'TRAINED', 'NOT_TRAINED', 'TRAINING'
      trainBtnClicked: false,
      keywordTimer: null,
      keywordDelay: 500, // ms

      isAddIntent: false,
      isSearchKeyword: false,    // call search api with keyword or not
      intentList: [],
      corpusCounts: 0,
      currentVersion: '',
      trainButtonTooltip: {
        msg: this.$t('intent_engine.manage.train_button_tooltip'),
        alignLeft: true,
      },
      trainingProgress: 50,
      lastTrainedTime: '',
      pageInfoTooltip: {
        msg: this.$t('intent_engine.manage.tooltip.page_info'),
      },
      showBatchDelete: false,
    };
  },
  computed: {
    ...mapGetters([
      'robotID',
    ]),
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
      if (!that.searchIntentMode) {
        that.corpusCounts = that.intentList.reduce((acc, intent) => acc + intent.total
      , 0);
      }
    },
    searchKeyword() {
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
      this.searchKeyword = '';
    },
    deleteIntents() {
      const that = this;
      const deleteIDs = that.$refs.intents.getCheckedIntentIDs();
      that.$emit('startLoading');
      that.$api.deleteIntents(deleteIDs).then(() => {
        that.$notify({ text: that.$t('intent_engine.manage.notify.delete_intent_success') });
      })
      .catch((err) => {
        console.log(err);
        that.$notifyFail(that.$t('intent_engine.manage.notify.delete_intent_fail'));
      })
      .finally(() => {
        that.$emit('endLoading');
        that.refreshIntentPage();
      });
    },
    handleIntentChecked() {
      const deleteIDs = this.$refs.intents.getCheckedIntentIDs();
      if (deleteIDs.length > 0) {
        this.showBatchDelete = true;
      } else {
        this.showBatchDelete = false;
      }
    },
    finishAddIntent(done) {
      this.isAddIntent = false;
      if (done) {
        this.refreshIntentPage();
      }
    },
    inSearchIntentMode(bool) {
      this.searchIntentMode = bool;
    },
    exportIntentList(version) {
      if (!this.allowExport) return;
      const EXPORT_INTENT_URL = 'api/v2/intents/export';
      if (version) {
        window.open(`${EXPORT_INTENT_URL}?version=${version}`);
      } else {
        window.open(`${EXPORT_INTENT_URL}?appid=${this.robotID}`);
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
      that.$emit('startLoading', that.$t('intent_engine.is_training'));
      that.$api.startTraining()
      .then(() => {
        that.trainStatus = 'TRAINING';
        that.trainBtnClicked = true;
      });
    },
    pollTrainingStatus(version) {
      const that = this;
      const prevStatus = that.trainStatus;
      that.$api.getTrainingStatus(version)
      .then((rsp) => {
        const status = rsp.status;
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
        that.lastTrainedTime = util.datetimeToString(new Date(rsp.last_train * 1000));
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
      console.log('refreshIntentPage');
      const that = this;
      if (!this.allowLoadPage) return;
      this.$emit('startLoading');
      // that.$api.getIntents()
      that.$api.getIntentsDetail(that.searchKeyword)
      .then((intents) => {
        that.isSearchKeyword = that.searchKeyword !== '';

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
#intent-train-tab{
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  @include customScrollbar();
  .content{
    flex: 1 0 auto;
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
  }
  .side-pannel{
    flex: 0 0 auto;
  }
}
</style>
