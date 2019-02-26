<template>
  <div id="intent-manage">
    <div v-if="isTesting" id="testing-cover" class="card w-fill h-fill">
      <loading-line></loading-line>
      <div>{{ $t('intent_engine.test.test_status_msg.is_testing') }}</div>
    </div>
    <div v-else id="intent-manage-card" class="card w-fill h-fill">
      <div class="header">
        <div class="header-title">
          {{ $t('pages.intent_engine.intent_test') }}
        </div>
        <div class="header-subtitle">
          {{ $t('intent_engine.manage.intent_num', {inum: intentList.length, cnum: corpusCounts}) }}
        </div>
        <div class="header-tool">
          <div v-if="isTraining" class="train-hint training">
            <loading-line :magnify="0.5"></loading-line>
            {{ $t('intent_engine.manage.train_status_msg.is_training', {percentage: trainingProgress}) }}
          </div>
          <div v-else class="train-hint">
            {{ $t('intent_engine.manage.train_status_msg.last_train', {timestr: lastTrainedTime}) }}
          </div>
          <text-button id="train-button" :button-type="canTrain ? 'default' : 'disable'" :icon-type="canTrain ? 'info_warning' : 'info_warning_gray'" width="100px" @click="startTraining" v-tooltip="trainButtonTooltip">{{ $t('intent_engine.train') }}</text-button>
          <search-input v-model="testKeyword" @focus="setSearchTest"></search-input>
        </div>
      </div>
      <div class="content">
        <div class="testing-block">
          <div class="testing-row">
            <text-button :button-type="canTest ? 'primary' : 'disable'" @click="startTesting">{{$t('intent_engine.test.run_test')}}</text-button>
          </div>
          <div class="testing-row">
            <div id="testing-report">
              {{ $t('intent_engine.test.last_test')}}
              <div id="testing-report-button" v-dropdown="reportDropdown">
                <text-button iconType="header_dropdown_gray" :iconSize="8" iconAlign="right">{{ $t('intent_engine.test.download_prev_report') }} </text-button>
              </div>
            </div>
            <div id="testing-howto">
              {{ $t('intent_engine.test.how_to_improve') }}
            </div>
          </div>
        </div>
        <div class="content-tool">
          <div class="content-tool-left">
            <text-button v-if="canAdd" button-type="primary" @click="addTest">{{ $t('general.add') }}</text-button>
            <text-button v-if="canImport" @click="importIntentList">{{ $t('general.import') }}</text-button>
            <text-button v-if="canExport" :button-type="allowExport ? 'default' : 'disable'" @click="exportIntentTestList(currentTestVersion)">{{ $t('general.export') }}</text-button>
          </div>
          <div v-if="!hasTests" class="content-tool-right">
            <text-button @click="downloadTemplate">{{ $t('intent_engine.import.download_test_template') }}</text-button>
          </div>
        </div>
        <div v-if="!hasTests && !isAddTest" class="init_page">
          {{ $t('intent_engine.test.no_data.title') }}<br>
          {{ $t('intent_engine.test.no_data.hint_left') }}<br>
          {{ $t('intent_engine.test.no_data.hint_right') }}
        </div>
        <div v-if="hasTests || isAddTest">
          <intent-test-list
            :intentTestList="intentTestList"
            :canEditTest="canEdit"
            :canDeleteTest="canEdit"
            :addTestMode="isAddTest"
            :searchTestMode="isSearchTest"
            :keyword="testKeyword"
            @addTestDone="finishAddTest($event)"
            @deleteTestDone="refreshTestingPage()"
            @cancelSearch="setSearchTest(false)">
          </intent-test-list>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from './_api/intent';
import IntentTestList from './_components/IntentTestList';
import ImportIntentTestPop from './_components/ImportIntentTestPop';

export default {
  path: 'intent-test',
  privCode: 'intent_test',
  displayNameKey: 'intent_test',
  name: 'intent-test',
  api,
  components: {
    IntentTestList,
  },
  data() {
    return {
      statusTimer: null,
      trainStatus: undefined,  // 'TRAINED', 'NOT_TRAINED', 'TRAINING'
      trainBtnClicked: false,
      testKeyword: '',
      keywordTimer: null,
      keywordDelay: 500, // ms

      isTesting: false,
      isAddTest: false,
      isSearchTest: false,

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
      intentTestList: [],
      corpusCounts: 0,
      currentTestVersion: '',
      currentIntentVersion: '',
      trainButtonTooltip: {
        msg: this.$t('intent_engine.manage.train_button_tooltip'),
        alignLeft: true,
      },
      trainingProgress: 50,
      lastTrainedTime: '2018-07-09 16:53',

      reportDropdown: {
        options: [{
          text: '2018-07-10 15:46',
        }],
        width: '180px',
      },
    };
  },
  computed: {
    hasIntents() {
      return this.intentList.length > 0;
    },
    hasTests() {
      return this.intentTestList.length > 0;
    },
    intentVersionNotAvailable() {
      return !this.hasIntents && this.currentIntentVersion === '';
    },
    testVersionNotAvailable() {
      return !this.hasTests && this.currentTestVersion === '';
    },
    canImport() {
      return this.$hasRight('import');
    },
    canExport() {
      return this.$hasRight('export');
    },
    // allowImport() {
    //   return !this.isTraining;
    // },
    allowExport() {
      return this.testVersionNotAvailable && this.hasTests;
    },
    canEdit() {
      return this.$hasRight('edit') && !this.testVersionNotAvailable;
    },
    canAdd() {
      return this.$hasRight('edit');
    },
    // allowEdit() {
    //   return !this.isTraining;
    // },
    // allowAdd() {
    //   return !this.isTraining;
    // },
    canTrain() {
      return !this.intentVersionNotAvailable && (this.hasIntents && this.shouldTrain);
    },
    canTest() {
      return !this.intentVersionNotAvailable && !this.testVersionNotAvailable &&
         this.hasIntents && this.hasTests;
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
      that.corpusCounts = that.intentList.reduce((acc, intent) => acc + intent.total
      , 0);
    },
    testKeyword() {
      const that = this;
      if (that.keywordTimer) {
        clearTimeout(that.keywordTimer);
      }
      that.keywordTimer = setTimeout(() => {
        that.refreshTestingPage();
      }, that.keywordDelay);
    },
  },
  methods: {
    downloadTemplate() {
      // window.open(, '_blank');
    },
    addTest() {
      // if (!this.allowAdd) return;
      this.isAddTest = true;
      this.testKeyword = '';
    },
    finishAddTest(done) {
      this.isAddTest = false;
      if (done) {
        this.refreshTestingPage();
      }
    },
    setSearchTest(bool) {
      this.isSearchTest = bool;
    },
    exportIntentTestList(version) {
      if (!this.allowExport) return;
      const EXPORT_INTENT_TEST_URL = '';
      if (version) {
        window.open(`${EXPORT_INTENT_TEST_URL}?version=${version}`, '_blank');
      } else {
        window.open(EXPORT_INTENT_TEST_URL, '_blank');
      }
    },
    importIntentList() {
      const that = this;
      // if (!that.allowImport) return;

      const popOption = {
        title: that.$t('intent_engine.import.title_test'),
        component: ImportIntentTestPop,
        disable_ok: true,
        validate: true,
        callback: {
          ok(file) {
            that.$emit('startLoading');
            // TODO: call api to import intent test
            that.$api.importIntents(file)
            .then((res) => {
              that.currentIntentVersion = res.version;  // version should be tests version
              clearInterval(that.statusTimer);
              that.statusTimer = undefined;
              that.pollTrainingStatus(that.currentIntentVersion);
              that.refreshTestingPage();
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
    startTesting() {
      const that = this;
      if (!that.canTest) return;
      // TODO: call start Training api
      // that.$api.startTesting().then(() => {
      //   that.isTesting = true;
      // });
      that.isTesting = true;
      // MOCK
      setTimeout(() => {
        that.isTesting = false;
      }, 10000);
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
      .then((rsp) => {
        const status = rsp.status;
        if (status === 'TRAINING') {
          // that.$emit('startLoading', that.$t('intent_engine.is_training'));
          that.trainStatus = status;
        } else if (prevStatus === 'TRAINING') {
          that.refreshTestingPage(); // also hideloading
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
          that.refreshTestingPage();
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
          this.currentIntentVersion = '';
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
    refreshTestingPage() {
      const that = this;
      this.$emit('startLoading');
      // that.$api.getIntents()
      // TODO: call api to load dropdown
      // TODO: also call api get Test sets
      that.$api.getIntentsDetail()  // always fetch all intent
      .then((intents) => {
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

        that.intentTestList = [];
        // that.intentTestList = [
        //   {
        //     id: 1,
        //     name: '測試題1',
        //   },
        //   {
        //     id: 2,
        //     name: '測試題2',
        //   },
        // ];
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
    // TODO: also poll testing status;
  },
  beforeDestroy() {
    clearInterval(this.statusTimer);
    this.statusTimer = undefined;
  },

};
</script>
<style lang="scss" scoped>
#testing-cover {
  background: $color-white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @include font-14px();
  color: $color-font-normal;
  :nth-child(2) {
    margin-top: 20px;
  }
}

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
  .testing-block {
    background-color: $color-disabled;
    border-radius: 4px;
    padding: 10px 20px;
    margin-bottom: 20px;
    .testing-row {
      @include font-14px();
      color: $color-font-active;
      &:nth-child(2) {
        margin-top: 10px;
      }
      display: flex;
      align-items: center;
      justify-content: space-between;
      #testing-report {
        display: flex;
        align-items: center;
        #testing-report-button {
          position: relative;
        }
      }
      #testing-howto {
        color: $color-primary;
        cursor: pointer;
      }
    }
  }
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
