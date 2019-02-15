<template>
<div id="side-panel">
  <div class="title margin-bottom">
    {{$t('intent_engine.side_panel.intent_train')}}
  </div>
  <div class="info margin-bottom">
    {{$t('intent_engine.side_panel.intent_train_info')}}
  </div>
  <text-button class="button margin-bottom" :height="'40px'" @click="startTraining()">
    {{$t('intent_engine.side_panel.do_train')}}
  </text-button>
  <div class="records" style="margin-bottom: 20px;">
    <div class="record">
      {{$t('intent_engine.side_panel.last_success_train')}}
    </div>
    <div class="record">
      {{$t('intent_engine.side_panel.success_train_record')}}
    </div>
    <div class="link">
      {{$t('intent_engine.side_panel.show_train_records')}}
    </div>
    <div class="link">
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
  <div class="info margin-bottom" >
    {{$t('intent_engine.side_panel.do_intent_test_info')}}
  </div>
  <text-button class="button margin-bottom" :height="'40px'" @click="startTesting()">
    {{$t('intent_engine.side_panel.do_test')}}
  </text-button>
  <div class="link" @click="toPage('test/records')">
    {{$t('intent_engine.side_panel.go_to_intent_test_records')}}
  </div>
</div>
</template>
<script>
// tooltip: {
//   intent_and_corpus_unchanged: '無新增任何意圖或語料',
//   intent_test_is_empty: '意圖測試集為空請先編輯',
// },

import testApi from '../_api/intentTest';
import eventBus from './eventBus';
import DoIntentTestPop from './DoIntentTestPop';

const TEST_STATUS = {
  TESTING: 0,
  TESTED: 1,
  TEST_FAILED: 2,
  NEED_TEST: 3,
  PENDING: 4,
};

export default {
  name: 'side-panel',
  testApi,
  components: {},
  props: {},
  data() {
    return {
      testStatus: undefined,  // type: TEST_STATUS
      testStatusIntervalId: undefined,
      eventBus: eventBus.eventBus,
    };
  },
  watch: {},
  computed: {
    canTest() {
      return true;
    },
  },
  methods: {
    startTraining() {
      this.$emit('startTraining');
    },
    startTesting() {
      if (!this.canTest) return;
      const that = this;
      const popOption = {
        title: that.$t('intent_engine.side_panel.do_intent_test.title'),
        component: DoIntentTestPop,
        validate: true,
        extData: {
          models: ['123'],
        },
        callback: {
          ok(model) {
            console.log(`startTesting: ${model}`);
            that.eventBus.$emit('startLoading', that.$t('intent_engine.is_testing'));
            // testApi.testIntentTestCorpus.call(that, model).then(() => {
            //   that.testStatus = TEST_STATUS.TESTING;
            // //   that.trainBtnClicked = true;
            // });
          },
        },
      };
      this.$pop(popOption);
    },
    startPollingTestStatus() {
      this.testStatusIntervalId = setInterval(() => {
        this.pollTestStatus();
      }, 5000);
    },
    pollTestStatus() {
      const that = this;
      testApi.getTestStatus.call(this).then((data) => {
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
      console.log(prevStatus);
      this.testStatus = newStatus;
      if (newStatus === TEST_STATUS.TESTED) {
        this.eventBus.$emit('endLoading');
      } else if (newStatus === TEST_STATUS.TESTED) {
        this.eventBus.$emit('endLoading');
      }
    },
    toPage(path) {
      this.$router.push(`/intent-manage/${path}`);
    },
  },
  mounted() {
    // this.pollTestStatus();
  },
  beforeDestroy() {
    clearInterval(this.testStatusIntervalId);
    this.testStatusIntervalId = undefined;
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
  .record{
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
