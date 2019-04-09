<template>
  <div class="review-input">
    <div class="header">点评内容</div>
    <div>
      <textarea placeholder="内容不少于5个字符" v-model="input">
      </textarea>
    </div>
  </div>
</template>

<script>
import api from '../_api/review';

export default {
  props: ['value', 'extData'],
  api,
  data() {
    return {
      input: this.value,
    };
  },
  watch: {
  },
  methods: {
    validate() {
      if (this.input && this.input.trim().length > 4) {
        this.extData.comment = this.input;
        this.addReview(this.extData);
      } else {
        this.$notifyFail(this.$t('review.pop.tooShort'));
      }
    },
    addReview(data) {
      if (data.status === 0) {
        api.updateReview(data.id, data.comment).then((res) => {
          if (res.data.status === 'success') {
            this.$emit('validateSuccess');
          } else {
            this.$notifyFail(this.$t('review.addFail'));
          }
        });
      } else if (data.status === -1) {
        api.addReview(data).then((res) => {
          if (res.data.status === 'success') {
            this.$emit('validateSuccess');
          } else {
            this.$notifyFail(this.$t('review.addFail'));
          }
        });
      }
    },
  },
  beforeMount() {
    this.$on('validate', this.validate);
  },
};
</script>

<style lang="scss" scoped>
  .review-input {
    height: 110px;
    display: flex;
    justify-content: flex-start;
    font-size: 14px;
    div.header {
      padding-top: 10px;
      padding-right: 20px;
      padding-left: 20px;
    }
    textarea {
      margin-right: 20px;
      width: 368px;
      height: 98px;
      border: 1px solid #DBDBDB;
      font-size: 12px;
    }
  }
</style>
