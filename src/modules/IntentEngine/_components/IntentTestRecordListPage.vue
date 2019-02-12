<template>
<div id="intent-test-record-list-page" class="card w-fill h-fill">
  <div class="header">
    <div class="breadcrumb">
      <div class="header-title" @click="toPage('');" style="cursor: pointer;">
        {{ $t('pages.intent_engine.intent_manage') }}
      </div>
      <icon iconType="month_right" :size="18" style="margin: 0px 10px;"></icon>
      <div class="header-title">
        {{ $t('intent_engine.test_records.intent_test_record') }}
      </div>
    </div>
    <div class="right-align-header">
      <search-input v-model="searchKeyword" @focus="inSearchIntentMode"></search-input>
      <text-button class="return-button" @click="toPage('')">{{ $t('general.go_back') }}</text-button>
    </div>
  </div>
  <div class="body">
    <div class="latest-record-block block">
      <div class="block-title">
        {{ $t('intent_engine.test_records.latest_records') }}
      </div>
      <general-scroll-table
        :tableData="latestRecordData"
        :tableHeader="recordTableHeader"
        :action="recordTableAction"
        showEmpty
        allowCustomHeader>
      </general-scroll-table>
    </div>
    <div class="saved-record-block block">
      <div class="block-title">
        {{ $t('intent_engine.test_records.saved_records') }}
      </div>
      <general-scroll-table
        :tableData="savedRecordData"
        :tableHeader="savedRecordTableHeader"
        :action="recordTableAction"
        showEmpty
        allowCustomHeader>
      </general-scroll-table>
    </div>
  </div>
</div>
</template>
<script>

import GeneralScrollTable from '@/components/GeneralScrollTable/GeneralScrollTable';
import api from '../_api/intentTest';
import TestRecordListTableAction from './_tableColumn/TestRecordListTableAction';

export default {
  name: 'intent-test-record-list-page',
  api,
  components: {
    GeneralScrollTable,
  },
  props: {
  },
  data() {
    const recordTableHeader = [
      {
        key: 'tester',
        text: this.$t('intent_engine.test_records.tester'),
        width: '170px',
        default: true,
      },
      {
        key: 'test_record',
        text: this.$t('intent_engine.test_records.test_record'),
        width: '260px',
        default: true,
      },
      {
        key: 'intent_model',
        text: this.$t('intent_engine.test_records.intent_model'),
        width: '190px',
        default: true,
      },
      {
        key: 'accuracy',
        text: this.$t('intent_engine.test_record.accuracy'),
        width: '135px',
        default: true,
      },
      {
        key: 'recall',
        text: this.$t('intent_engine.test_record.recall'),
        width: '135px',
        default: true,
      },
      {
        key: 'precision',
        text: this.$t('intent_engine.test_record.precision'),
        width: '135px',
        default: true,
      },
      {
        key: 'action',
        text: this.$t('general.operation'),
        width: '70px',
        type: 'custom',
        lockedRight: true,
      },
    ];
    const savedRecordTableHeader = [
      {
        key: 'test_record_name',
        text: this.$t('intent_engine.test_records.test_record_name'),
        width: '170px',
        lockedLeft: true,
      },
      ...recordTableHeader,
    ];
    return {
      searchKeyword: '',
      searchIntentMode: false,
      latestRecords: [],
      savedRecords: [],
      recordTableHeader,
      savedRecordTableHeader,
      recordTableAction: [],
    };
  },
  computed: {
    latestRecordData() {
      return this.renderRecordData(this.latestRecords, 'latest');
    },
    savedRecordData() {
      return this.renderRecordData(this.savedRecords, 'saved');
    },
  },
  watch: {},
  methods: {
    getTestRecords() {
      this.$api.getTestRecords().then((data) => {
        // console.log(data);
        this.latestRecords = data.latest;
        this.savedRecords = data.saved;
      });
    },
    renderRecordData(records, type) {
      return records.map((record) => {
        const testRecord = this.composeRecordName(
          record.intent_test.updated_time,
          record.intent_test.sentences_count,
        );
        const rtn = {
          intent_test_id: record.intent_test.id,
          ie_model_id: record.ie_model.id,
          test_record: testRecord,
          intent_model: record.ie_model.updated_time,
          accuracy: record.intent_test.true_positives,
          recall: 0,
          precision: 0,
          tester: record.intent_test.tester,
          action: this.composeRecordAction(record, type),
        };
        if (type === 'saved') {
          rtn.test_record_name = record.intent_test.name;
        }
        return rtn;
      });
    },
    composeRecordName(updatedTime, corpusCount) {
      const modelStats = this.$t('intent_engine.test_records.intent_statistics', { cnum: corpusCount });
      return `${updatedTime} (${modelStats})`;
    },
    composeRecordAction(record, type) {
      const that = this;
      const options = [
        {
          // detail
          text: this.$t('intent_engine.test_records.see_record_detail'),
          onclick: () => {
            that.seeRecordDetail(record);
          },
        },
        {
          // restore
          text: this.$t('intent_engine.test_records.restore_record'),
          onclick: () => {
            that.restoreRecord(record);
          },
        },
      ];
      if (type === 'saved') {
        const option = {
          // unsave
          text: this.$t('intent_engine.test_records.unstore_record'),
          onclick: () => {
            console.log(record.intent_test.tester);
          },
        };
        options.splice(1, 0, option);
      } else {
        const option = {
          // save
          text: this.$t('intent_engine.test_records.store_record'),
          onclick: () => {
            console.log(record.intent_test.tester);
          },
        };
        options.splice(1, 0, option);
      }
      // replace data in TestRecordListTableAction
      const action = { ...TestRecordListTableAction };
      action.data = () => ({
        options,
      });
      return action;
    },
    inSearchIntentMode(bool) {
      this.searchIntentMode = bool;
    },
    seeRecordDetail(record) {
      this.toPage(`test/record/${record.intent_test.id}`);
    },
    restoreRecord(data) {
      console.log(data);
    },
    toPage(path) {
      this.$router.push(`/intent-manage/${path}`);
    },
  },
  mounted() {
    this.getTestRecords();
  },
};
</script>

<style lang="scss" scoped>
#intent-test-record-list-page{
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
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    @include customScrollbar();
    .block{
      flex: 0 0 auto;
      display: flex;
      flex-direction: column;
      .block-title{
        flex: 0 0 auto;
        padding: 20px;
        color: $color-font-active;
        @include font-16px-line-height-28px();
      }
    }
  }
}
</style>
