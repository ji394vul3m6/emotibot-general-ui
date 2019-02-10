<template>
<div id="intent-test-list">
  <div class="type-title">
    {{ $t('intent_engine.test_data.test_corpus_without_intent') }}
    <icon iconType="info" :size="16" enableHover v-tooltip="intentTypeTooltip"></icon>
  </div>
  <div class="intent-block"
    v-for="corpusGroup in corpusGroupWithoutAnnotation"
    :key="corpusGroup.id">
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
  <div class="intent-block"
    v-for="intent in intentList"
    :key="intent.id"
    :class="{'active': intent.expand}">
    <div class="intent-header" @click="handleIntentClicked(intent)">
      <div class="icon">
        <icon icon-type="intent" :size="15"/>
      </div>
      <div class="intent-name after-icon">
        {{`${intent.name} ( ${$t('intent_engine.test_data.num_test_corpus', {cnum: intent.sentences_count})} )`}}
      </div>
      <div v-if="intent.expand" class="close-expand-icon">
        <icon icon-type="close_expand" :size="18"></icon>
      </div>
    </div>
    <div class="intent-content" v-if="intent.expand === true">
      <div class="label">
        {{ $t('intent_engine.test_data.test_corpus') }}
      </div>
      <div class="corpus-block">
        <div class="add-corpus-row">
          <input type="text" v-model="newCorpus"
            :placeholder="$t('intent_engine.test_data.add_new_test_corpus')"
            @compositionstart="setCompositionState(true)"
            @compositionend="setCompositionState(false)"
            @keyup.enter="addCorpus(intent)"/>
          <text-button class="add-corpus-btn" @click="addCorpus(intent)">{{ $t('intent_engine.manage.addin') }}</text-button>
        </div>
        <div class="corpus-row" v-for="corpus in getCorpusPage(intent)"
          :key="corpus.id"
          @mouseover="corpus.mouseover = true" 
          @mouseleave="corpus.mouseover = false">
          <div class="corpus">
            {{corpus.sentence}}
          </div>
          <div class="corpus-action" v-if="corpus.mouseover">
            <div class="action corpus-action-edit" @click="editCorpus(intent, corpus)">{{ $t('general.edit') }}</div>
            <div class="action corpus-action-delete" @click="deleteCorpus(intent, corpus)">{{ $t('general.delete')}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="intent-block-footer" v-if="intent.expand && intent.testCorpus.length > LIST_PAGE_SIZE">
      <v-pagination
        size="small"
        :total="intent.testCorpus.length"
        :pageIndex="intent.curPage"
        :pageSize="LIST_PAGE_SIZE"
        :layout="['prev', 'pager', 'next', 'jumper']"
        @page-change="handlePageChange($event, intent)">
      </v-pagination>
    </div>
  </div>
</div>

</template>

<script>
import api from '../_api/intentTest';

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
// num_test_corpus: '{cnum}笔测试语料',
// },
export default {
  name: 'intent-test-list',
  api,
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
      LIST_PAGE_SIZE: 10,
      newCorpus: '',
      duringComposition: false,
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
      const initialIntents = this.allIntents.map(intent => ({
        ...intent,
        expand: intent.expand ? intent.expand : false,
        testCorpus: intent.testCorpus ? intent.testCorpus : [],
        curPage: 1,
      }));
      initialIntents.forEach((intent) => {
        if (intent.type === true) {
          this.intentList.push(intent);
        } else {
          this.corpusGroupWithoutAnnotation.push(intent);
        }
      });
    },
    handleIntentClicked(intent) {
      console.log(intent);
      if (intent.expand) {
        this.shrinkIntentBlock(intent);
      } else {
        this.expandIntentBlock(intent);
      }
    },
    expandIntentBlock(intent) {
      intent.testCorpus = [];
      this.$api.getIntentTestCorpus(intent.id).then((data) => {
        intent.testCorpus = data.map(corpus => ({
          ...corpus,
          mouseover: false,
        }));
        intent.expand = true;
      });
    },
    shrinkIntentBlock(intent) {
      console.log('shrinkIntentBlock');
      intent.expand = false;
    },
    setCompositionState(bool) {
      this.duringComposition = bool;
    },
    addCorpus(intent) {
      console.log(this.newCorpus);
      console.log(intent);
    },
    handlePageChange(pageIdx, intent) {
      intent.curPage = pageIdx;
// if (intent.hasCorpusEditing) {
//   const editingCorpus = intent.corpus[intent.viewCorpusType].find(cp => cp.isEdit === true);
//   this.leaveEditCorpus(editingCorpus, intent);
// }
    },
    getCorpusPage(intent) {
      const start = this.LIST_PAGE_SIZE * (intent.curPage - 1);
      const end = this.LIST_PAGE_SIZE * intent.curPage;
      return intent.testCorpus.slice(start, end);
    },
    editCorpus(intent, corpus) {
      console.log(intent);
      console.log(corpus);
    },
    deleteCorpus(intent, corpus) {
      console.log(intent);
      console.log(corpus);
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
    border: 1px solid $color-borderline;
    border-radius: 4px;
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
      padding: 10px 20px;
      background-color: $table-body-hover-background;
      cursor: pointer;
      .intent-name{
        flex: 1 1 auto;
        @include font-14px-line-height-28px();
        &.after-icon{
          margin-left: 18px;
        }
      }
      .close-expand-icon{
        flex: 0 0 auto;
      }
    }
    .intent-content{
      display: flex;
      flex-direction: column;
      padding: 10px 20px 10px 20px;
      border-top: 1px solid $color-borderline;
      background-color: $table-body-hover-background;
      .label{
        @include font-14px-line-height-28px();
      }
      .corpus-block{
        display: flex;
        flex-direction: column;
        margin-top: 22px;
        border-left: 3px solid rgba(74, 144, 226, 0.24);
        .corpus-row{
          display: flex;
          margin: 4px 0px 0px 20px;
          .corpus{
            flex: 1 1 auto;
            @include font-14px-line-height-28px();
          }
          .corpus-action{
            flex: 0 0 auto;
            display: flex;
            .action{
              cursor: pointer;
              margin-right: 14px;
              @include font-12px-line-height-28px();
            }
            .corpus-action-edit{
              color: $color-primary;
            }
            .corpus-action-delete{
              color: $color-error;
            }
          }
        }
        .add-corpus-row{
          display: flex;
          height: 28px;
          margin: 0px 0px 0px 20px;
          input[type=text] {
            flex: 1;
          }
          .add-corpus-btn {
            margin-left: 10px;
          }
        }
      }
    }
    .intent-block-footer {
      border-top: 1px solid $color-borderline;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 12px;
    }
  }
}

</style>
