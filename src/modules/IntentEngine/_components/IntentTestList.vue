<template>
<div id="intent-test-list">
  <div class="type-title">
    {{ $t('intent_engine.test_data.test_corpus_without_intent') }}
    <icon iconType="info" :size="16" enableHover v-tooltip="intentTypeTooltip"></icon>
  </div>
  <div class="intent-block" v-for="corpusGroup in corpusGroupWithoutAnnotation" :key="corpusGroup.id">
    <div class="intent-header">
      <div class="intent-name">
        {{`${$t('intent_engine.test_data.num_test_corpus', {cnum: corpusGroup.sentences_count})}`}}
      </div>
    </div>
  </div>
  <div class="type-title margin-top">
    {{ $t('intent_engine.test_data.intent_and_test_corpus') }}
    <icon iconType="info" :size="16" enableHover v-tooltip="intentTypeTooltip"></icon>
  </div>
  <div class="intent-block" v-for="intent in intentList" :key="intent.id">
    <div class="intent-header">
      <div class="icon">
        <icon icon-type="intent" :size="15"/>
      </div>
      <div class="intent-name after-icon">
        {{`${intent.name} ( ${$t('intent_engine.test_data.num_test_corpus', {cnum: intent.sentences_count})} )`}}
      </div>
    </div>
  </div>
</div>

</template>

<script>

// test_data: {
// intent_num: '共有 {inum} 組測試意圖 / {cnum} 筆測試語料',
// test_corpus_without_intent: '未標註任何意圖的測試語料',
// intent_and_test_corpus: '意圖及測試語料',
// show_button: '檢視',
// show_intent_with_corpus_less_than_3: '顯示少於3筆測試語料',
// show_test_result: '顯示測試結果',
// test_corpus: '測試語料',
// result_correct: '正確',
// result_wrong: '錯誤',
// result_none: '無記錄',
// },
export default {
  name: 'intent-test-list',
  components: {},
  props: {
    allIntents: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      intentList: [],
      corpusGroupWithoutAnnotation: [],
      intentTypeTooltip: {
        msg: this.$t('intent_engine.manage.tooltip.page_info'),
      },
    };
  },
  computed: {},
  watch: {
    allIntents() {
      this.renderIntentList();
    },
  },
  methods: {
    renderIntentList() {
      this.intentList = [];
      this.corpusGroupWithoutAnnotation = [];
      this.allIntents.forEach((intent) => {
        if (intent.type === true) {
          this.intentList.push(intent);
        } else {
          this.corpusGroupWithoutAnnotation.push(intent);
        }
      });
      console.log(this.corpusGroupWithoutAnnotation);
    },
  },
  mounted() {
    this.renderIntentList();
  },
};
</script>

<style lang="scss" scoped>
#intent-test-list{
  display: flex;
  flex-direction: column;
  .type-title{
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
  .intent-block{
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    transition: all .2s ease-in-out;
    &:hover {
      box-shadow: 0 4px 9px 0 rgba(115, 115, 115, 0.2), 0 5px 8px 0 rgba(228, 228, 228, 0.5);
    }
    &.active {
      box-shadow: 0 4px 9px 0 rgba(115, 115, 115, 0.2), 0 5px 8px 0 rgba(228, 228, 228, 0.5);
    }
    .intent-header{
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      height: 48px;
      background-color: $color-disabled;
      padding: 10px 20px;
      border: 1px solid $color-borderline;
      border-radius: 4px;
      cursor: pointer;
      .intent-name{
        @include font-14px-line-height-28px();
        &.after-icon{
          margin-left: 18px;
        }
      }
    }
  }
}

</style>
