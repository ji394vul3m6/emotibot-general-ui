<template>
  <div class="qa-test-float">
    <div class="header">
      <div class="info">
        <div class="robot-icon">
        </div>
        <div class="name">
          {{ robotName }}
        </div>
      </div>
      <div class="control">
        <div class="analysis-switch">
          <span>{{ $t('qatest.sentence_analysis') }}</span>
          <toggle v-model="showAnalysis"></toggle>
        </div>
        <div class="close-button" @click="closeQATest">
          <icon icon-type="info_close" :size=16 />
        </div>
      </div>
    </div>
    <div class="list" ref="qaBox">
      <div v-for="(data, idx) in chatData" :key="idx" :class="data.role" class="chat-box">
        <div class="chat-image" v-if="data.role !== 'user'">
          <div class="robot-icon"></div>
        </div>
        <div class="chat-item">
          <template v-if="data.content.type === 'text' && data.content.subType === 'text'">
            <template v-if="data.html">
              <div class="chat-content" v-html="data.content.value">
              </div>
            </template>
            <template v-else>
              <div class="chat-content">{{data.content.value}}</div>
            </template>
          </template>
          <template v-if="data.content.type === 'text' && (data.content.subType === 'guslist' || data.content.subType === 'relatelist')">
            <div class="chat-content">{{ data.content.value }}
              <div v-for="(sentence, idx) in data.content.data" :key="sentence" @click="sendUserText(sentence, true)" class='click-text'>
                {{ idx + 1 }}. {{ sentence }}
              </div>
            </div>
          </template>
          <template v-if="data.content.type === 'cmd'">
            <div class="chat-content"> 
            [{{ $t('qatest.cmd') }}]：
            {{ $t(`qatest.cmdlist.${data.content.subType}`) !== `qatest.cmdlist.${data.content.subType}`
            ? $t(`qatest.cmdlist.${data.content.subType}`) : data.content.subType }}
            </div>
          </template>
          <div class="chat-time">{{ data.time }}</div>
          <div class="chat-analysis" v-if="data.analysis !== undefined && data.role === 'user'" >
            <div>[{{ $t('qatest.intent') }}]：{{ data.analysis.intent }}</div>
            <div>[{{ $t('qatest.emotion') }}]：{{ data.analysis.emotion }}</div>
            <div>[{{ $t('qatest.module') }}]：{{ data.analysis.module }}</div>
            <div>[{{ $t('qatest.token') }}]：{{ data.analysis.tokens }}</div>
          </div>  
        </div>
      </div>
    </div>
    <div class="input">
      <div class="dimension">
        <text-button @click="selectDimension">{{ $t('qatest.dimension') }}</text-button>
        <div class="selected-dimension">
          {{ selectedTags }}
        </div>
      </div>
      <div class="text-input">
        <textarea v-model="userInput"
          @keydown="checkKey"
          @compositionstart="inComposition = true"
          @compositionend="inComposition = false"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import DimensionSelector from '@/components/DimensionSelector';
import tagAPI from '@/api/tagType';
import api from '../FAQ/_api/qatest';

export default {
  api: [api, tagAPI],
  computed: {
    ...mapGetters([
      'robotName',
    ]),
    selectedTags() {
      return this.tagTypes.reduce((arr, type) => {
        const selectedChild = type.values.filter(value => value.checked).map(value => value.text).join(',');
        if (selectedChild !== '') {
          arr.push(selectedChild);
        }
        return arr;
      }, []).join(',');
    },
  },
  data() {
    return {
      showAnalysis: true,
      inComposition: false,
      userInput: '',
      multiAnswerDelay: 2000, // milliseconds
      chatData: [],
      tagTypes: [],
    };
  },
  mounted() {
    const that = this;
    this.$api.getTagTypes().then((data) => {
      that.tagTypes = data;
    }).then(() => {
      that.sendUserText('welcome_tag');
    });
  },
  methods: {
    closeQATest() {
      this.$root.$emit('close-chat-test');
    },
    selectDimension() {
      const that = this;
      const value = JSON.parse(JSON.stringify(this.tagTypes));
      that.$pop({
        title: that.$t('qatest.filter_dimension'),
        component: DimensionSelector,
        data: value,
        extData: {
          type: 'radio',
        },
        custom_button: [{
          msg: that.$t('general.reset'),
          event: 'reset',
        }],
        callback: {
          ok: () => {
            this.tagTypes = value;
          },
        },
      });
    },
    checkKey(e) {
      if (e.keyCode === 13 || e.key === 'Enter') {
        // If user is typping in composition mode,
        // skip Enter which made composition finish fist
        if (this.inComposition) {
          return;
        }
        if (!e.shiftKey) {
          if (this.userInput.trim().length > 0) {
            this.sendText();
          }
          e.preventDefault();
        }
      }
    },
    sendText() {
      const that = this;

      if (that.userInput.trim().length <= 0) {
        that.$popError(that.$t('error_msg.input_empty'));
        return;
      }
      that.sendUserText(that.userInput, true);
      that.userInput = '';
    },
    sendUserText(text, append) {
      const that = this;
      let chatNode;
      if (append) {
        chatNode = that.appendChat(text);
      }

      const filter = {};
      that.tagTypes.forEach((tagType) => {
        const selectedValue = tagType.values.find(tag => tag.checked);
        if (selectedValue) {
          filter[tagType.type] = selectedValue.text;
        }
      });

      that.$api.QATest(text, filter).then((data) => {
        const res = data.data;
        const answerData = res.data;
        const sentenceInfo = res.info;

        if (res.status !== 0) {
          that.$popError(that.$t('error_msg.server_error'), res.message);
          return;
        }
        if (res.result.answers && res.result.answers.length > 0) {
          // old format use 'result' part in return obj
          that.appendChatArrayDelay(res.result.answers, 'robot');
        } else if (answerData !== undefined) {
          // new format use 'data' part as answer
          that.appendChatArrayDelay(answerData, 'robot');
        } else {
          that.$popError(that.$t('error_msg.server_error'), res.message);
          return;
        }

        if (that.showAnalysis && chatNode) {
          if (sentenceInfo === undefined) {
            // old format analysis infomation in 'result' part in return obj, too
            chatNode.analysis = {
              tokens: res.result.tokens ? res.result.tokens.join(', ') : '',
              emotion: res.result.emotion || that.$t('qatest.unknown'),
              intent: res.result.intent || that.$t('qatest.unknown'),
              module: res.result.module || '',
              matchResult: res.result.similar_question || [],
            };
          } else {
            // new format analysis infomation in 'info' part in return obj
            chatNode.analysis = {
              tokens: sentenceInfo.tokens ? sentenceInfo.tokens.join(', ') : '',
              emotion: sentenceInfo.emotion || that.$t('qatest.unknown'),
              intent: sentenceInfo.intent || that.$t('qatest.unknown'),
            };
          }
        }
      }, () => {
        // general.handleAPIError(that, err).catch((value) => {
        //   general.popErrorWindow(that, that.i18n.error_msg.server_error, value.errMsg);
        // });
      });
    },
    appendChatArrayDelay(chats, char) {
      const that = this;
      if (chats.length <= 0) {
        return;
      }
      that.appendChat(chats[0], char);
      if (chats.length > 1) {
        setTimeout(() => {
          that.appendChatArrayDelay(chats.slice(1), char);
        }, that.multiAnswerDelay);
      }
    },
    appendChat(text, role) {
      const that = this;
      let answerObj = {};
      let oldAnswerFormat = false;
      let parseText = text;

      if (text.startsWith('[CMD]:')) {
        oldAnswerFormat = true;
        parseText = parseText.replace(/^\[CMD\]:/, '');
      }

      try {
        answerObj = JSON.parse(parseText.toString());
        if ((typeof answerObj).toLowerCase() !== 'object') {
          throw String('Not object');
        }
        // transform old format in openAPI
        // TODO: check all format alive to parse
        if (oldAnswerFormat) {
          answerObj = {
            type: 'cmd',
            subType: answerObj.type,
            value: answerObj.urls.join(','),
          };
        }
      } catch (err) {
        answerObj = {
          type: 'text',
          subType: 'text',
          value: parseText,
        };
      }
      const chatNode = {
        role: role || 'user',
        content: answerObj,
        time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        html: role === 'robot',
      };
      that.chatData.push(chatNode);
      that.$nextTick(that.scrollToBottom);
      return chatNode;
    },
    scrollToBottom() {
      this.$refs.qaBox.scrollTop = this.$refs.qaBox.scrollHeight;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

$qa-test-font-size: 14px;
$qa-test-bg: #f3f3f3;
$qa-test-header-bg: #ffffff;
$qa-test-input-bg: #f9f9f9;

$robot-icon-bg: #ffca43;
$robot-icon-border: #ffbc4d;
$robot-icon-size: 40px;
$robot-name-font-size: 16px;
$robot-name-color: #666666;

$user-input-color: #666666;

$chat-user-bg: #1875f0;
$chat-user-color: #ffffff;
$chat-robot-bg: #ffffff;
$chat-robot-color: #333333;
$chat-border-radius: 6px;
$chat-time-font-size: 12px;
$chat-info-font-size: 12px;
$chat-info-bg: #eeeeee;

@mixin header-control() {
  .control {
    flex: 0 0 auto;

    display: flex;
    align-items: center;
    .analysis-switch {
      padding: 5px;

      display: flex;
      align-items: center;
      span {
        margin-right: 10px;
      }
    }
    .close-button {
      padding: 20px;
      @include click-button();
    }
  }
}
@mixin header-info() {
  .info {
    flex: 1;

    display: flex;
    align-items: center;

    .robot-icon {
      margin: 20px;
    }
    .name {
      font-size: $robot-name-font-size;
      color: $robot-name-color;
    }
  }
}
@mixin chat-item() {
  .chat-item {
    flex: 1;

    display: flex;
    flex-direction: column;
    .chat-content {
      padding: 10px;
      word-break: break-all;
      line-height: 1.57;
      border-radius: $chat-border-radius;

      .click-text {
        text-decoration: underline;
        color: blue;
        @include click-button();
      }
    }
    .chat-time {
      margin-top: 8px;
      font-size: $chat-time-font-size;
    }
    .chat-analysis {
      margin-top: 8px;
      line-height: 1.33;
      max-width: 230px;
      padding: 10px;
      font-size: $chat-info-font-size;
      border-radius: $chat-border-radius;
      background: $chat-info-bg;
    }
  }
}


.robot-icon {
  height: $robot-icon-size;
  width: $robot-icon-size;
  background: $robot-icon-bg;
  border: 1px solid $robot-icon-border;
}

.qa-test-float {
  font-size: $qa-test-font-size;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: $qa-test-header-bg;

  .header {
    flex: 0 0 80px;
    background: $qa-test-header-bg;

    display: flex;
    @include header-info();
    @include header-control();
  }

  .list {
    flex: 1;
    background: $qa-test-bg;

    display: flex;
    flex-direction: column;
    @include auto-overflow();
    padding: 0 20px;
    .chat-box {
      flex: 0 0 auto;
      margin-top: 20px;

      display: flex;
      align-items: stretch;

      .robot-icon {
        margin-right: 10px;
      }

      @include chat-item();
      &.robot {
        .chat-item {
          align-items: flex-start;
          .chat-content {
            background: $chat-robot-bg;
            color: $chat-robot-color;
          }
        }
      }
      &.user {
        .chat-item {
          align-items: flex-end;
          .chat-content {
            background: $chat-user-bg;
            color: $chat-user-color;
          }
        }
      }
    }
  }

  .input {
    flex: 0 0 148px;
    background: $qa-test-input-bg;

    display: flex;
    flex-direction: column;
    .dimension {
      flex: 0 0 48px;
      background-color: $qa-test-input-bg;
      box-shadow: inset 0 -1px 0 0 #e9e9e9, inset 0 1px 0 0 #e9e9e9;
      padding: 0 20px;

      display: flex;
      align-items: center;
      .selected-dimension {
        margin-left: 10px;
      }
    }
    .text-input {
      flex: 1;
      textarea {
        background: $qa-test-input-bg;
        resize: none;
        height: 100%;
        width: 100%;
        border: none;
        word-break: break-all;
        padding: 10px;
        outline: none;
        font-size: $qa-test-font-size;
        color: $user-input-color;
      }
    }
  }
}
</style>
