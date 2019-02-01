<template>
<div id="intent-test-record-page" class="card w-fill h-fill">
  <div class="header">
    <div class="breadcrumb">
      <div class="header-title" @click="toPage('');" style="cursor: pointer;">
        {{ $t('pages.intent_engine.intent_manage') }}
      </div>
      <icon iconType="month_right" :size="18" style="margin: 0px 10px;"></icon>
      <div class="header-title" v-if="record.saved">
        {{ `${record.name} ( ${$t('intent_engine.test_records.test_record')} ${record.updated_time})` }}
      </div>
      <div class="header-title" v-if="!record.saved">
        {{ `${$t('intent_engine.test_records.test_record')} ${record.updated_time}` }}
      </div>
    </div>
    <div class="right-align-header">
      <search-input v-model="searchKeyword" @focus="inSearchIntentMode"></search-input>
      <text-button class="return-button" @click="toPage('')">{{ $t('general.go_back') }}</text-button>
    </div>
  </div>
  <div class="body">
    <div class="statistics-box">
      <div class="text active">
        {{$t('intent_engine.test_record.test_data')}}
      </div>
      <div class="text normal margin-bottom">
        {{`${$t('intent_engine.test_data.num_test_corpus', {cnum: record.sentences_count})}`}}
      </div>

      <div class="text active">
        {{$t('intent_engine.test_record.intent_model_version')}}
      </div>
      <div class="text normal">
        {{record.ie_model_updated_time}}
      </div>
      <div class="text normal margin-bottom">
        {{`${$t('intent_engine.test_record.intent_statistics', {inum: record.intents_count, cnum: record.sentences_count})}`}}
      </div>
      <div class="text normal margin-bottom">
        {{`${$t('intent_engine.test_records.tester')}：aaa`}}
      </div>
      <div class="seperater margin-bottom"></div>

      <div class="text active margin-bottom">
        {{`${$t('intent_engine.test_record.accuracy')} ${accuracy}%`}}
      </div>
      <div class="text active margin-bottom">
        {{`${$t('intent_engine.test_record.recall')} ${recall}%`}}
      </div>
      <div class="text active margin-bottom">
        {{`${$t('intent_engine.test_record.precision')} ${precision}%`}}
      </div>
      <div class="seperater margin-bottom"></div>

      <div class="text normal margin-bottom">
        {{`True Positive：${record.true_positives}`}}
      </div>
      <div class="text normal margin-bottom">
        {{`True Negative：${record.true_negatives}`}}
      </div>
      <div class="text normal margin-bottom">
        {{`False Positive：${record.false_positives}`}}
      </div>
      <div class="text normal margin-bottom">
        {{`False Negative：${record.false_negatives}`}}
      </div>
    </div>
    <div class="content">
      <div class="tool-bar">
        <div class="link">
          {{$t('intent_engine.test_records.unstore_record')}}
        </div>
        <div class="link">
          {{$t('intent_engine.test_records.restore_record')}}
        </div>
        <dropdown-select :options="[]" width="64px" @input="downloadData"/>
      </div>
      <template v-if="hasIntents">
        <intent-test-list
          :allIntents="intentList">
        </intent-test-list>
      </template>
    </div>
  </div>
</div>
</template>
<script>

import IntentTestList from './IntentTestList';
import api from '../_api/intentTest';

export default {
  name: 'intent-test-record-page',
  api,
  components: {
    IntentTestList,
  },
  props: {
  },
  data() {
    return {
      searchKeyword: '',
      searchIntentMode: false,
      record: {},
      intentList: [],
    };
  },
  computed: {
    hasIntents() {
      return this.intentList.length > 0;
    },
    accuracy() {
      const a = ((this.record.tp + this.record.tn) * 100) /
        (this.record.tp + this.record.tn + this.record.fp + this.record.fn);
      return Math.round(a);
    },
    recall() {
      const r = ((this.record.tp) * 100) /
        (this.record.tp + this.record.fn);
      return Math.round(r);
    },
    precision() {
      const p = ((this.record.tp) * 100) /
        (this.record.tp + this.record.fp);
      return Math.round(p);
    },
  },
  watch: {},
  methods: {
    getTestRecord(intentTestID) {
      console.log(intentTestID);
      this.$api.getTestRecord('540000199801149697').then((data) => {
        console.log(data);
        const { intents, ...record } = data;
        record.tp = record.true_positives;
        record.tn = record.true_negatives;
        record.fp = record.false_positives;
        record.fn = record.false_negatives;
        this.record = record;
        this.intentList = intents;
      });
    },
    inSearchIntentMode(bool) {
      this.searchIntentMode = bool;
    },
    toPage(path) {
      this.$router.push(`/intent-manage/${path}`);
    },
    downloadData() {
      console.log('downloadData');
    },
  },
  mounted() {
    this.intentTestID = this.$route.params.id;
    this.getTestRecord(this.intentTestID);
  },
};
</script>

<style lang="scss" scoped>
#intent-test-record-page{
  display: flex;
  flex-direction: column;
  min-width: 600px;
  min-height: 400px;
  .header {
    flex: 0 0 auto;
    height: 60px;
    padding: 0 20px;
    border-bottom: 1px solid $color-borderline-disabled;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .breadcrumb{
      display: flex;
      align-items: center;
      .header-title {
        @include font-16px();
        color: $color-font-active;
        min-width: 64px;
      }
    }
    .right-align-header{
      display: flex;
      align-items: center;
      .return-button{
        margin-left: 10px;
      }
    }
  }
  .body{
    flex: 1 1 auto;
    display: flex;
    height: calc(100% - 60px);
    .statistics-box{
      flex: 0 0 auto;
      display: flex;
      flex-direction: column;
      margin: 20px 20px 10px 20px;
      padding: 10px 20px 10px 20px;
      width: 240px;
      height: calc(100% - 30px);
      border-radius: 4px;
      border: 1px solid $color-borderline;
      .margin-bottom {
        margin-bottom: 10px;
      }
      .text {
        @include font-14px-line-height-28px();
      }
      .active{
        color: $color-font-active;
      }
      .normal{
        color: $color-font-normal;
      }
      .seperater{
        height: 1px;
        background-color: $color-borderline;
      }
    }
    .content{
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      padding-right: 20px;
      overflow-y: scroll;
      @include customScrollbar();
      .tool-bar{
        display: flex;
        justify-content: flex-end;
        margin: 20px 0px 20px 0px;
        .link{
          @include font-14px-line-height-28px();
          cursor: pointer;
          color: $app-active-color;
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
