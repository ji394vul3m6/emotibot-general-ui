<template>
  <div class="form">
    <div class="row">
      <div class="row-title">
        <div class="required">＊</div>
        {{ $t('management.input_personal_pass') }}
      </div>
      <input class="row-input" v-model="password" type="password" autocomplete="new-password"
        :class="{'error': isPasswordTooltipShown}"
        :placeholder="$t('management.manager_password')"
        v-tooltip="passwordTooltip"
        ref="password">
    </div>
    <div class="row">
      <div class="row-title">
        <div class="required">＊</div>
        {{ $t('management.reason_description') }}
      </div>
      <input class="row-input" v-model="reason" ref="reason"
        :class="{'error': isReasonTooltipShown}"
        :placeholder="$t('management.length_50_placeholder')"
        maxlength="50" v-tooltip="reasonTooltip">
    </div>
  </div>  
</template>

<script>
export default {
  name: 'robot-add-form',
  props: {
    extData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      password: '',
      reason: '',
      passwordTooltip: {
        msg: this.$t('management.err_password_length'),
        eventOnly: true,
        errorType: true,
        alignLeft: true,
      },
      reasonTooltip: {
        msg: this.$t('management.err_reason_empty'),
        eventOnly: true,
        errorType: true,
        alignLeft: true,
      },
      isPasswordTooltipShown: false,
      isReasonTooltipShown: false,
      passwordMinlength: 6,
      passwordMaxlength: 16,
    };
  },
  watch: {
    password() {
      this.isPasswordTooltipShown = false;
      this.$refs.password.dispatchEvent(new Event('tooltip-hide'));
    },
    reason() {
      this.isReasonTooltipShown = false;
      this.$refs.reason.dispatchEvent(new Event('tooltip-hide'));
    },
  },
  methods: {
    validate() {
      const that = this;
      let isValid = true;
      // if (that.$cookie.get('verify') !== md5(that.password)) {
      if (that.password.length < that.passwordMinlength ||
       that.password.length > that.passwordMaxlength) {
        isValid = false;
        that.isPasswordTooltipShown = true;
        that.$refs.password.dispatchEvent(new Event('tooltip-show'));
      }
      that.reason = that.reason.trim();
      if (that.reason === '') {
        isValid = false;
        that.isReasonTooltipShown = true;
        that.$refs.reason.dispatchEvent(new Event('tooltip-show'));
      }

      if (isValid) {
        that.$emit('validateSuccess', that.reason);
      }
    },
  },
  mounted() {
    const that = this;
    that.$on('validate', that.validate);
  },
};
</script>

<style lang="scss" scoped>
.form {
  width: 400px;
  padding: 0 24px;

  display: flex;
  flex-direction: column;
  .row {
    margin-bottom: 10px;

    display: flex;
    align-items: center;
    .row-title {
      @include font-14px();
      flex: 0 0 120px;
      .required {
        display: inline-block;
        width: 14px;
        color: $color-primary;
      }
    }
    .row-input {
      flex: 1;
      display: flex;
      padding: 5px 8px;
    }
  }
}
</style>
