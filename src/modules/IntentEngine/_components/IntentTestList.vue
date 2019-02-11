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
    <transition name="intent-content">
    <div v-if="intent.expand">
      <div class="intent-content">
        <div class="label">
          {{ $t('intent_engine.test_data.test_corpus') }}
        </div>
        <div class="corpus-block">
          <div class="add-corpus-row">
            <input type="text" v-model="newCorpus"
              :placeholder="$t('intent_engine.test_data.add_new_test_corpus')"
              @compositionstart="setCompositionState(true)"
              @compositionend="setCompositionState(false)"
              @keydown.enter="detectCompositionState"
              @keyup.enter="addCorpus(intent)"/>
            <text-button class="add-corpus-btn" @click="addCorpus(intent)">{{ $t('intent_engine.manage.addin') }}</text-button>
          </div>
          <div class="corpus-row" v-for="corpus in getCorpusPage(intent)"
            :key="corpus.id"
            @mouseover="corpus.mouseover = true" 
            @mouseleave="corpus.mouseover = false">
            <div class="corpus">
              <input v-if="corpus.isEditing" type="text" v-model="editingCorpusContent"
                  ref="editCorpusInput"
                  v-tooltip="editCorpusTooltip"
                  @compositionstart="setCompositionState(true)"
                  @compositionend="setCompositionState(false)"
                  @keydown.enter="detectCompositionState"
                  @keyup.enter="updateCorpus(intent, corpus)"
                  @blur="finishEditingCorpus(intent, corpus)"/>
              <span v-else>{{corpus.sentence}}</span>
            </div>
            <div class="corpus-action" v-if="corpus.mouseover && !intent.hasCorpusEditing">
              <div class="action corpus-action-edit" @click="startEditingCorpus(intent, corpus)">{{ $t('general.edit') }}</div>
              <div class="action corpus-action-delete" @click="deleteCorpus(intent, corpus)">{{ $t('general.delete')}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="intent-footer" v-if="intent.testCorpus.length > LIST_PAGE_SIZE">
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
    </transition>
  </div>
</div>

</template>

<script>
import event from '@/utils/js/event';
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
      compositionState: false,
      wasCompositioning: false,
      intentTypeTooltip: {
        msg: this.$t('intent_engine.manage.tooltip.page_info'),
      },
      editCorpusTooltip: {
        msg: this.$t('intent_engine.manage.tooltip.hit_enter_to_save'),
        eventOnly: true,
        errorType: true,
        alignLeft: true,
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
        hasCorpusEditing: intent.hasCorpusEditing ? intent.hasCorpusEditing : false,
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
      if (intent.expand) {
        this.shrinkIntentBlock(intent);
      } else {
        this.expandIntentBlock(intent);
      }
    },
    expandIntentBlock(intent) {
      this.intentList.forEach((i) => {
        i.expand = false;
      });
      this.fetchCorpus(intent).then(() => {
        intent.expand = true;
      });
    },
    fetchCorpus(intent) {
      return this.$api.getIntentTestCorpus(intent.id).then((data) => {
        intent.testCorpus = data.map(corpus => ({
          ...corpus,
          mouseover: false,
          isEditing: false,
        }));
      });
    },
    shrinkIntentBlock(intent) {
      intent.expand = false;
    },
    setCompositionState(bool) {
      this.compositionState = bool;
    },
    detectCompositionState() {
      this.wasCompositioning = this.compositionState;
    },
    addCorpus(intent) {
      const update = [{
        id: 0,
        content: this.newCorpus,
      }];
      this.patchCorpus(intent, update, []);
    },
    handlePageChange(pageIdx, intent) {
      intent.curPage = pageIdx;
    },
    getCorpusPage(intent) {
      const start = this.LIST_PAGE_SIZE * (intent.curPage - 1);
      const end = this.LIST_PAGE_SIZE * intent.curPage;
      return intent.testCorpus.slice(start, end);
    },
    startEditingCorpus(intent, corpus) {
      corpus.isEditing = true;
      intent.hasCorpusEditing = true;
      this.editingCorpusContent = corpus.sentence;
      this.$nextTick(() => {
        this.$refs.editCorpusInput[0].focus();
        this.$nextTick(() => {
          this.$refs.editCorpusInput[0].dispatchEvent(event.createEvent('tooltip-show'));
        });
      });
    },
    finishEditingCorpus(intent, corpus) {
      corpus.isEditing = false;
      intent.hasCorpusEditing = false;
      this.$refs.editCorpusInput[0].dispatchEvent(event.createEvent('tooltip-hide'));
    },
    updateCorpus(intent, corpus) {
      if (this.wasCompositioning) {
        return;
      }
      this.editingCorpusContent = this.editingCorpusContent.trim();
      if (this.editingCorpusContent === '') {
        this.deleteCorpus(intent, corpus);
      } else {
        corpus.sentence = this.editingCorpusContent;
        const update = [{
          id: corpus.id,
          content: corpus.sentence,
        }];
        this.patchCorpus(intent, update, []);
      }
      this.finishEditingCorpus(intent, corpus);
    },
    patchCorpus(intent, update, del) {
      console.log('patchCorpus');
      this.$api.patchIntentTestCorpus(intent.id, update, del).then(() => {
        // this.fetchCorpus(intent);
      });
    },
    deleteCorpus(intent, corpus) {
      const corpusIdx = intent.testCorpus.findIndex(cp => cp.id === corpus.id);
      intent.testCorpus.splice(corpusIdx, 1);
      const del = [corpus.id];
      this.patchCorpus(intent, [], del);
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
    .intent-content-enter-active, .intent-content-leave-active {
      transition: max-height .4s ease-in-out;
      overflow: hidden;
    }
    .intent-content-enter, .intent-content-leave-to {
      max-height: 0px;
    }
    .intent-content-enter-to, .intent-content-leave {
      max-height: 1000px;
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
          &:hover {
            background-color: $color-disabled;
          }
          .corpus{
            flex: 1 1 auto;
            display: flex;
            span{
              @include font-14px-line-height-28px();
            }
            input[type=text] {
              flex: 1;
            }
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
    .intent-footer {
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
