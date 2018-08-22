<template>
  <div id="pop-qa-mark">
    <div id="mark-header">
      <div class="toolbar-row">
        <div class="toolbar-left">
          <div class="row-title">
            {{ $t('statistics.user_question') }}：
          </div>
          <div class="row-content">
            {{ qa[0].user_question }}
            <span v-if="qa.length > 1">, ...</span>
          </div>
        </div>
      </div>
      <div class="toolbar-row">
        <div class="toolbar-left">
          <div class="row-title">
            {{ $t('statistics.mark.as') }}：
          </div>
          <div class="row-content">
            <template v-if="hasMultiOriginMarks">
              <div class="marked-q">
                {{ $t('statistics.mark.multi') }}
                <icon icon-type="close" :size="8" id="delete-tag" @click="toggleHasMultiOriginMarks" button></icon>
              </div>
            </template>
            <template v-else-if="markedQuestion !== ''">
              <div class="marked-q">
                {{ markedQuestion }}
                <icon icon-type="close" :size="8" id="delete-tag" @click="cancelMarkedQuestion" button></icon>
              </div>
            </template>
            <template v-else>
              {{ $t('general.empty') }}
            </template>
          </div>
        </div>
        <div class="toolbar-right">
          <search-input v-model="keyword"></search-input>
        </div>
      </div>
    </div>
    <general-table
      id="mark-content"
      :tableHeader="tableHeader"
      :tableData="tableData"
      :showEmptyMsg="emptyMsg"
      :onclickRow="setChosenQuestion"
      showEmpty
    >
    </general-table>
  </div>
</template>

<script>
import api from '../_api/selflearn';

export default {
  api,
  props: {
    value: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      appId: this.$cookie.get('appid'),
      qa: undefined,  // prop value.qa
      keyword: '',
      markedQuestion: '',
      hasMultiOriginMarks: false,
      keywordTimer: undefined,
      checkIcon: {
        iconType: 'check_green',
        iconSize: 20,
      },
      tableHeader: [
        {
          key: 'icon',
          text: '',
          type: 'icon',
        },
        {
          key: 'question',
          text: this.$t('statistics.recommend_question'),
        },
      ],
      tableData: [
        {
          question: '標註的句子',
        },
        {
          question: '兩句標準問',
        },
        {
          question: '三句標準問',
        },
        {
          question: '四句標準問',
        },
        {
          question: '五句標準問',
        },
        {
          question: '六句標準問',
        },
      ],
      // tableData: [],
      recommendQuestion: [
        {
          question: '標註的句子',
        },
        {
          question: '兩句標準問',
        },
        {
          question: '三句標準問',
        },
        {
          question: '四句標準問',
        },
        {
          question: '五句標準問',
        },
        {
          question: '六句標準問',
        },
      ],
      emptyMsg: [
        this.$t('statistics.recommend_empty_msg_1'),
        this.$t('statistics.recommend_empty_msg_2'),
      ],
    };
  },
  watch: {
    keyword() {
      const that = this;
      if (that.keywordTimer !== undefined) {
        clearTimeout(that.keywordTimer);
        that.keywordTimer = undefined;
      }
      if (that.keyword === '') {
        // TODO: tableData 恢復成原本的推薦
        that.tableData = that.recommendQuestion;
        that.updateMarkedIcon(that.markedQuestion);
      } else {
        that.keywordTimer = setTimeout(that.searchKeyword, 300);
      }
    },
  },
  methods: {
    toggleHasMultiOriginMarks() {
      this.hasMultiOriginMarks = false;
    },
    cancelMarkedQuestion() {
      const emptyMarkedQuestion = '';
      this.updateMarkedIcon(emptyMarkedQuestion);
    },
    setChosenQuestion(datarow) {
      const that = this;
      const chosenQuestion = datarow.question;
      that.updateMarkedIcon(chosenQuestion);
    },
    updateMarkedIcon(chosenQ) {
      const that = this;
      const oldMarkedQIdx = that.tableData.findIndex(data => data.question === that.markedQuestion);
      if (oldMarkedQIdx !== -1) {
        that.tableData.splice(oldMarkedQIdx, 1, {
          question: that.markedQuestion,
        });
      }

      that.markedQuestion = chosenQ;
      const newMarkedQIdx = that.tableData.findIndex(data => data.question === that.markedQuestion);
      if (newMarkedQIdx !== -1) {
        that.tableData.splice(newMarkedQIdx, 1, {
          question: that.markedQuestion,
          icon: that.checkIcon,
        });
      }
    },
    searchKeyword() {
      const that = this;
      that.$api.searchStdQuestion(that.appId, that.keyword)
      .then((stdQuestion) => {
        console.log(stdQuestion);
        // set the questions to tableData;
        that.updateMarkedIcon(that.markedQuestion);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        that.keywordTimer = undefined;
      });
    },
    getOriginMark() {
      const that = this;
      const markedCount = that.qa.filter(q => q.marked).length;
      if (that.qa.length > 1) {
        if (markedCount > 0) {
          that.hasMultiOriginMarks = true;
        }
      } else if (markedCount > 0) {  // only one qa
        that.$api.getMarkedQuestion(that.qa.record_id)
        .then((question) => {
          console.log(question);
          that.markedQuestion = question;
          that.updateMarkedIcon(that.markedQuestion);
        }).catch(() => {
          that.markedQuestion = '';
        });
      }
    },
  },
  mounted() {
    // TODO: get Recommend
    const that = this;
    that.qa = that.value.qa;

    const sentences = that.qa.map(q => q.user_question);
    that.$api.getRecommend(that.appId, sentences)
    .then((recommend) => {
      console.log(recommend);
      // TODO: set recommend question
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      that.getOriginMark();
    });
  },
};
</script>

<style lang="scss" scoped>
#pop-qa-mark {
  width: 768px;
  height: 378px;
  display: flex;
  flex-direction: column;
}

#mark-header {
  padding: 0 24px;
  @include font-14px();
  .toolbar-row {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .toolbar-left {
      flex: 1;
      display: flex;
      align-items: center;
      .row-title {
        width: 80px;
      }
      .row-content {
        .marked-q {
          background-color: #eeeeee; 
          padding: 3px 6px;
          border-radius: 2px;
          #delete-tag {
            margin-left: 5px;
          }
        }
      }
    }
  }
  
}
#mark-content {
  margin-top: 10px;
  flex: 1;
  border-bottom: 1px solid $color-borderline;
}
</style>
