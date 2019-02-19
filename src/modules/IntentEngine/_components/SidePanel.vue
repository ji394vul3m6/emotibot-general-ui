<template>
<div id="side-panel">
  <template v-if="mode==='trainPage'">
    <div class="title margin-bottom">
      {{$t('intent_engine.side_panel.intent_train')}}
    </div>
    <div class="info margin-bottom">
      {{$t('intent_engine.side_panel.intent_train_info')}}
    </div>
    <text-button class="button margin-bottom"
      :button-type="canTrain ? 'default' : 'disable'"
      :height="'40px'"
      @click="startTraining()">
      {{$t('intent_engine.side_panel.do_train')}}
    </text-button>
    <div class="train-records" v-if="recentModels.length > 0" style="margin-bottom: 20px;">
      <div class="model" v-for="(model, index) in recentModels" :key="model.ie_model_id">
        <span v-if="index===0">
          {{`${$t('intent_engine.side_panel.last_success_train')}: ${model.trainDatetimeStr}`}}
        </span>
        <span v-if="index!==0 && showRecentTrainRecords">
          {{`${$t('intent_engine.side_panel.success_train_record')}: ${model.trainDatetimeStr}`}}
        </span>
      </div>
      <div class="link" v-if="showRecentTrainRecords===false" @click="showRecentTrainRecords=true">
        {{$t('intent_engine.side_panel.show_train_records')}}
      </div>
      <div class="link" v-if="showRecentTrainRecords===true" @click="showRecentTrainRecords=false">
        {{$t('intent_engine.side_panel.hide_train_records')}}
      </div>
    </div>
    <div class="title" style="margin-bottom: 20px;">
      {{$t('intent_engine.side_panel.intent_test')}}
    </div>
    <div class="info margin-bottom">
      {{$t('intent_engine.side_panel.intent_test_info')}}
    </div>
    <div class="hint">
      {{$t('intent_engine.side_panel.edit_intent_test_corpus_hint')}}
    </div>
    <text-button class="button" style="margin-bottom: 30px;" :height="'40px'" @click="toPage('test')">
      {{$t('intent_engine.side_panel.go_to_intent_test')}}
    </text-button>
  </template>
  <template v-if="mode==='trainPage' || mode==='testPage'">
    <div class="info margin-bottom" >
      {{$t('intent_engine.side_panel.do_intent_test_info')}}
    </div>
    <text-button class="button margin-bottom"
      :button-type="canTest ? 'default' : 'disable'"
      :height="'40px'"
      @click="startTesting()">
      {{$t('intent_engine.side_panel.do_test')}}
    </text-button>
    <div class="link" @click="toPage('test/records')">
      {{$t('intent_engine.side_panel.go_to_intent_test_records')}}
    </div>
  </template>
</div>
</template>
<script>
// tooltip: {
//   intent_and_corpus_unchanged: '無新增任何意圖或語料',
//   intent_test_is_empty: '意圖測試集為空請先編輯',
// },

import intentApi from '../_api/intent';
import intentTestApi from '../_api/intentTest';
import eventBus from '../_utils/eventBus';
import general from '../_utils/general';
import DoIntentTestPop from './DoIntentTestPop';


const TRAIN_STATUS = {
  NOT_TRAINED: 'NOT_TRAINED',
  TRAINING: 'TRAINING',
  TRAINED: 'TRAINED',
  NEED_TRAIN: 'NEED_TRAIN',
  TRAIN_FAILED: 'TRAIN_FAILED',
};

const TEST_STATUS = {
  TESTING: 0,
  TESTED: 1,
  TEST_FAILED: 2,
  NEED_TEST: 3,
  PENDING: 4,
};

export default {
  name: 'side-panel',
  intentApi,
  intentTestApi,
  components: {},
  props: {
    mode: {
      type: String,
      required: false,
      default: () => 'trainPage',
    },
    hasIntents: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },
  data() {
    return {
      models: [],
      trainStatus: undefined,
      trainStatusIntervalId: undefined,
      testStatus: undefined,  // type: TEST_STATUS
      testStatusIntervalId: undefined,
      eventBus: eventBus.eventBus,
      showRecentTrainRecords: false,
    };
  },
  watch: {},
  computed: {
    canTrain() {
      return this.hasIntents && this.shouldTrain;
    },
    shouldTrain() {
      return this.trainStatus === TRAIN_STATUS.NOT_TRAINED ||
             this.trainStatus === TRAIN_STATUS.NEED_TRAIN ||
             this.trainStatus === TRAIN_STATUS.TRAIN_FAILED;
    },
    canTest() {
      return this.testStatus === TEST_STATUS.NEED_TEST ||
             this.testStatus === TRAIN_STATUS.TEST_FAILED;
    },
    recentModels() {
      if (this.models.recent_trained) {
        return this.models.recent_trained.map(model => ({
          ...model,
          trainDatetimeStr: general.timestampToDatetimeString(model.train_time),
        }));
      }
      return [];
    },
    uniqueModels() {
      const keyOrder = ['recent_trained', 'recent_tested', 'recent_saved'];
      const uniqueIds = {};
      const uniqueModels = [];
      if (this.models.in_used) {
        uniqueIds[this.models.in_used.ie_model_id] = 1;
        uniqueModels.push(
          {
            ...this.models.in_used,
            trainDatetimeStr: general.timestampToDatetimeString(this.models.in_used.train_time),
          },
        );
      }
      for (let i = 0; i < keyOrder.length; i += 1) {
        const models = this.models[keyOrder[i]];
        models.forEach((model) => {
          if (uniqueIds[model.ie_model_id] === undefined) {
            uniqueIds[model.ie_model_id] = 1;
            uniqueModels.push(
              {
                ...model,
                trainDatetimeStr: general.timestampToDatetimeString(model.train_time),
              },
            );
          }
        });
      }
      return uniqueModels;
    },
  },
  methods: {
    getModels() {
      intentApi.getModels.call(this).then((data) => {
        this.models = data;
      });
    },
    startTraining() {
      if (!this.canTrain) return;
      const that = this;
      that.eventBus.$emit('startLoading', that.$t('intent_engine.is_training'));
      intentApi.startTraining.call(this).then(() => {
        that.trainStatus = TRAIN_STATUS.TRAINING;
      });
    },
    startTesting() {
      if (!this.canTest) return;
      const that = this;
      const popOption = {
        title: that.$t('intent_engine.side_panel.do_intent_test.title'),
        component: DoIntentTestPop,
        validate: true,
        extData: {
          models: this.uniqueModels,
        },
        callback: {
          ok(modelId) {
            that.eventBus.$emit('startTesting');
            that.eventBus.$emit('startLoading', that.$t('intent_engine.is_testing'));
            intentTestApi.testIntentTestCorpus.call(that, modelId).then(() => {
              that.testStatus = TEST_STATUS.TESTING;
            });
          },
        },
      };
      this.$pop(popOption);
    },
    startPollingTrainStatus() {
      this.trainStatusIntervalId = setInterval(() => {
        this.pollTrainStatus();
      }, 5000);
    },
    stopPollingTrainStatus() {
      clearInterval(this.trainStatusIntervalId);
      this.trainStatusIntervalId = undefined;
    },
    pollTrainStatus() {
      const that = this;
      intentApi.getTrainingStatus.call(this).then((data) => {
        that.trainStatusChanged(data.status);
        if (!that.trainStatusIntervalId) {
          that.startPollingTrainStatus();
        }
      }).catch((err) => {
        console.error(err);
        this.eventBus.$emit('endLoading');
      });
    },
    trainStatusChanged(newStatus) {
      const prevStatus = this.trainStatus;
      this.trainStatus = newStatus;
      if (prevStatus === undefined) { // run trainStatusChanged for the first time
        if (newStatus === TRAIN_STATUS.TRAINING) {
          this.eventBus.$emit('startLoading', this.$t('intent_engine.is_training'));
        }
      } else if (prevStatus === TRAIN_STATUS.TRAINING) {
        if (newStatus === TRAIN_STATUS.TRAINED) {
          this.$notify({ text: this.$t('intent_engine.training_success') });
        } else if (status === TRAIN_STATUS.TRAIN_FAILED) {
          this.$notifyFail(this.$('intent_engine.training_fail'));
        }
        if (newStatus !== TRAIN_STATUS.TRAINING) {
          this.eventBus.$emit('endLoading');
        }
      }
      // if (newStatus === TRAIN_STATUS.NOT_TRAINED) {
      //   console.log('TRAIN_STATUS.NOT_TRAINED');
      // } else if (newStatus === TRAIN_STATUS.TRAINING) {
      //   console.log('TRAIN_STATUS.TRAINING');
      // } else if (newStatus === TRAIN_STATUS.TRAINED) {
      //   console.log('TRAIN_STATUS.TRAINED');
      // } else if (newStatus === TRAIN_STATUS.NEED_TRAIN) {
      //   console.log('TRAIN_STATUS.NEED_TRAIN');
      // } else if (newStatus === TRAIN_STATUS.TRAIN_FAILED) {
      //   console.log('TRAIN_STATUS.TRAIN_FAILED');
      // }
    },
    startPollingTestStatus() {
      this.testStatusIntervalId = setInterval(() => {
        this.pollTestStatus();
      }, 10000);
    },
    stopPollingTestStatus() {
      clearInterval(this.testStatusIntervalId);
      this.testStatusIntervalId = undefined;
    },
    pollTestStatus() {
      const that = this;
      intentTestApi.getTestStatus.call(this).then((data) => {
        // console.log(data);
        that.testStatusChanged(data.status);
        if (!that.testStatusIntervalId) {
          that.startPollingTestStatus();
        }
      }).catch((err) => {
        console.error(err);
        this.eventBus.$emit('endLoading');
      });
    },
    testStatusChanged(newStatus) {
      const prevStatus = this.testStatus;
      this.testStatus = newStatus;
      console.log(prevStatus);
      if (prevStatus === undefined) { // run testStatusChanged for the first time
        if (newStatus === TEST_STATUS.TESTING) {
          this.eventBus.$emit('startLoading', this.$t('intent_engine.is_testing'));
        }
      }
      if (newStatus !== TEST_STATUS.TESTING) {
        this.eventBus.$emit('endLoading');
      }
      // if (newStatus === TEST_STATUS.TESTING) {
      //   console.log('TEST_STATUS.TESTING');
      // } else if (newStatus === TEST_STATUS.TESTED) {
      //   console.log('TEST_STATUS.TESTED');
      // } else if (newStatus === TEST_STATUS.TEST_FAILED) {
      //   console.log('TEST_STATUS.TEST_FAILED');
      // } else if (newStatus === TEST_STATUS.NEED_TEST) {
      //   console.log('TEST_STATUS.NEED_TEST');
      // } else if (newStatus === TEST_STATUS.PENDING) {
      //   console.log('TEST_STATUS.PENDING');
      // }
    },
    toPage(path) {
      this.$router.push(`/intent-manage/${path}`);
    },
  },
  mounted() {
    this.getModels();
    this.pollTrainStatus();
    // this.pollTestStatus();
  },
  beforeDestroy() {
    this.stopPollingTrainStatus();
    this.stopPollingTestStatus();
  },
};
</script>

<style lang="scss" scoped>
#side-panel{
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  width: 270px;
  height: 100%;
  border-left: 1px solid $color-borderline-disabled;
  padding: 20px 17px 20px 25px;
  overflow-y: scroll;
  @include customScrollbar();
  .title{
    @include font-16px-line-height-28px();
  }
  .info{
    @include font-14px();
  }
  .button{
    @include font-14px-line-height-28px();
    cursor: pointer;
  }
  .model{
    @include font-12px-line-height-28px();
    color: $color-font-mark;
  }
  .link{
    @include font-12px-line-height-28px();
    cursor: pointer;
    color: $app-active-color;
  }
  .hint{
    @include font-12px-line-height-28px();
    color: $color-warning; 
  }
  .margin-bottom{
    margin-bottom: 10px;
  }
}
</style>
