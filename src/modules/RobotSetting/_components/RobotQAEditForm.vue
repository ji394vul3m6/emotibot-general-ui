<template>
  <div class="robot-qa-edit">
    <div class="robot-qa-edit-row">
      <div class="robot-qa-edit-title">{{ $t('general.question') }}</div>
      <div class="robot-qa-edit-data">{{ value.main_question }}</div>
    </div>
    <div class="robot-qa-edit-row" v-for="idx in 5" :key="idx">
      <div class="robot-qa-edit-title">
        <template v-if="idx === 1">{{ $t('general.answer') }}</template>
        <template v-else>{{ $t('general.ext_answer') }}</template>
      </div>
      <div class="robot-qa-edit-data">
        <input :value="value.answers[idx - 1]" ref="answer">
		    <button v-if="idx != 1" type="reset" v-on:click="resetAnswer(idx - 1)"></button>
      </div>
    </div>
    <div class="robot-qa-edit-error" :class="{show: showEmptyError}">
      {{ $t('error_msg.empty_answer') }}
    </div>
  </div>  
</template>

<script>
export default {
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
      showEmptyError: false,
    };
  },
  methods: {
    resetAnswer(idx) {
      this.$refs.answer[idx].value = '';
    },
    validate() {
      const answers = this.$refs.answer.map(input => input.value);
      const allBlank = answers.reduce((val, ans) => val && !(ans.trim()), true);
      if (allBlank) {
        this.showEmptyError = true;
      } else {
        this.showEmptyError = false;
        const ret = this.$refs.answer.map(input => input.value);
        this.$emit('validateSuccess', ret);
      }
    },
  },
  mounted() {
    this.$on('validate', this.validate);
  },
};
</script>