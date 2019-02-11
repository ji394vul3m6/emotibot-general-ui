<template>
<div id="intent-test-page" class="card w-fill h-fill">
  <div class="header">
    <div class="breadcrumb">
      <div class="header-title" @click="toPage('');" style="cursor: pointer;">
        {{ $t('pages.intent_engine.intent_manage') }}
      </div>
      <icon iconType="month_right" :size="18" style="margin: 0px 10px;"></icon>
      <div class="header-title">
        {{ $t('intent_engine.test_records.intent_test_data') }}
      </div>
    </div>
    <div class="right-align-header">
      <search-input v-model="searchKeyword" @focus="inSearchIntentMode"></search-input>
      <text-button class="return-button" @click="toPage('')">{{ $t('general.go_back') }}</text-button>
    </div>
  </div>
  <div class="body">
    <div class="content">
      <div class="content-tool">
        <div class="content-tool-left">
          <text-button v-if="canImport" :button-type="allowImport ? 'default' : 'disable'">{{ $t('general.import') }}</text-button>
          <text-button v-if="canExport" :button-type="allowExport ? 'default' : 'disable'">{{ $t('general.export') }}</text-button>
          <div class="intent-count-label">
            {{ $t('intent_engine.test_data.intent_num', {inum: allIntents.length, cnum: corpusCounts}) }}
          </div>
        </div>
        <div class="content-tool-right">
          <dropdown-select
            class="option-select"
            :multi="true"
            :value="undefined"
            @input="onSelectOption()"
            :options="[]"
            :showCheckedIcon="true"
            width="64px"
            :inputBarStyle="optionSelectStyle"
          />
        </div>
      </div>
      <template v-if="corpusGroupWithoutAnnotation.length > 0">
        <div class="intent-list-title">
          {{ $t('intent_engine.test_data.test_corpus_without_intent') }}
          <icon iconType="info" :size="16" enableHover v-tooltip="intentTypeTooltip"></icon>
        </div>
        <intent-test-list class="intent-list"
          :initialIntentList="corpusGroupWithoutAnnotation"
          :intentListType="'corpusGroupWithoutAnnotation'">
        </intent-test-list>
      </template>
      <template v-if="intentList.length > 0">
        <div class="intent-list-title margin-top">
          {{ $t('intent_engine.test_data.intent_and_test_corpus') }}
          <icon iconType="info" :size="16" enableHover v-tooltip="intentTypeTooltip"></icon>
        </div>
        <intent-test-list class="intent-list"
          :initialIntentList="intentList"
          :intentListType="'normal'">
        </intent-test-list>
      </template>
    </div>
    <side-panel clase="side-panel"></side-panel>
  </div>
</div>
</template>
<script>

import IntentTestList from './IntentTestList';
import SidePanel from './SidePanel';
import api from '../_api/intentTest';

export default {
  name: 'intent-test-page',
  privCode: 'intent_manage',
  api,
  components: {
    IntentTestList,
    SidePanel,
  },
  props: {
  },
  data() {
    return {
      searchKeyword: '',
      searchIntentMode: false,
      allIntents: [],
      intentList: [],
      corpusGroupWithoutAnnotation: [],
      corpusCounts: 0,
      optionSelectStyle: {
        height: '28px',
        'border-radius': '2px',
      },
      intentTypeTooltip: {
        msg: this.$t('intent_engine.manage.tooltip.page_info'),
      },
    };
  },
  computed: {
    canImport() {
      return this.$hasRight('import');
    },
    canExport() {
      return this.$hasRight('export');
    },
    allowImport() {
      return false;
    },
    allowExport() {
      return false;
    },
  },
  watch: {
    allIntents() {
      if (!this.searchIntentMode) {
        this.corpusCounts = this.allIntents.reduce(
          (acc, intent) => acc + intent.sentences_count, 0,
        );
      }
      this.intentList = [];
      this.corpusGroupWithoutAnnotation = [];
      this.allIntents.forEach((intent) => {
        if (intent.type === true) {
          this.intentList.push(intent);
        } else {
          this.corpusGroupWithoutAnnotation.push(intent);
        }
      });
    },
  },
  methods: {
    getTestIntents() {
      this.$api.getTestIntents().then((data) => {
        this.allIntents = data.intents;
      });
    },
    inSearchIntentMode(bool) {
      this.searchIntentMode = bool;
    },
    toPage(path) {
      this.$router.push(`/intent-manage/${path}`);
    },
  },
  mounted() {
    this.getTestIntents();
  },
};
</script>

<style lang="scss" scoped>
#intent-test-page{
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
    flex-direction: row;
    height: calc(100% - 60px);
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
        flex-direction: row;
        justify-content: space-between;
        .content-tool-left{
          display: flex;
          flex-direction: row;
          .text-button {
            margin-left: 10px;
            &:first-child {
              margin-left: 0px;
            }
          }
          .intent-count-label {
            flex: 1 1 auto;
            color: $color-font-mark;
            @include font-14px-line-height-28px();
            margin-left: 20px;
          }
        }
      }
      .intent-list-title{
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        color: $color-font-active;
        @include font-14px-line-height-28px();
        &.margin-top{
          margin-top: 20px;
        }
        .icon {
          margin-left: 6px;
        }
      }
      .intent-list{
        flex: 0 0 auto;
      }
    }
  }
  
}
</style>
