<template>
  <div class="robot-words-edit">
    <div class="info">{{ origData.words.comment }}</div>
    <div class="input">
      <input id="content" v-model="content">
    </div>
    <div class="err">
      {{ errMsg }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'robot-words-edit',
  props: {
    origData: {
      type: Object,
      default: {
        words: {},
        content: '',
      },
      required: true,
    },
  },
  data() {
    return {
      errMsg: '',
      content: '',
    };
  },
  methods: {
    validate() {
      const that = this;
      that.content = that.content.trim();
      if (that.content === '') {
        that.errMsg = this.$t('error_msg.input_empty');
      } else if (that.origData.words.contents.findIndex(c => c.content === that.content) >= 0) {
        that.errMsg = this.$t('chat_skill.errorDuplicate');
      } else {
        that.$emit('validateSuccess', that.content);
      }
    },
  },
  mounted() {
    this.$on('validate', this.validate);
    this.content = this.origData.content;
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

$info-font-size: 12px;
$info-line-height: 18px;
$info-font-color: #999999;

$error-color: #f76260;

.robot-words-edit {
  padding: 0 20px;
  width: 520px;
}
.info {
  font-size: $info-font-size;
  line-height: $info-line-height;
  color: $info-font-color;
  margin-bottom: 20px;
}
.input {
  input {
    display: block;
    width: 100%;
    outline: solid 1px rgba(255, 255, 255, 0.2);
  }
}
.err {
  height: 40px;
  display: flex;
  align-items: center;
  color: $error-color;
}
</style>
