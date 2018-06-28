<template>
  <div class="normal-password-form">
    <div class="row">
      <div class="row-title">{{ $t('management.orig_password') }}</div>
      <input type="password" class="row-input" ref="origPassword" v-model="origPassword"
      :placeholder="$t('management.input_placeholder')" autocomplete="new-password">
    </div>
    <div class="row">
      <div class="row-title">{{ $t('management.new_password') }}</div>
      <input type="password" class="row-input" ref="password" v-model="password"
      :placeholder="$t('management.input_placeholder')" autocomplete="new-password">
    </div>
    <div class="row">
      <div class="row-title">{{ $t('management.check_new_password') }}</div>
      <input type="password" class="row-input" ref="newPassword" v-model="newPassword"
      :placeholder="$t('management.input_placeholder')" autocomplete="new-password">
    </div>
    <div class="row">
      <div class="err-msg" v-if="errMsg !== ''">{{ errMsg }}</div>
    </div>
  </div>
</template>

<script>
import md5 from 'md5';

export default {
  name: 'user-password-form',
  props: {
    extData: {
      type: Object,
      default: {},
    },
  },
  computed: {
    isAdmin() {
      return this.userType <= 1;
    },
  },
  data() {
    return {
      origPassword: '',
      password: '',
      newPassword: '',
      userType: 2,
      errMsg: '',
    };
  },
  methods: {
    validate() {
      const that = this;
      const verify = that.$cookie.get('verify');
      if (that.origPassword === '') {
        that.errMsg = that.$t('management.err_origin_empty_password');
        that.$refs.origPassword.focus();
      } else if (md5(that.origPassword) !== verify) {
        that.errMsg = that.$t('management.err_origin_password');
        that.$refs.origPassword.focus();
      } else if (that.password === '') {
        that.errMsg = that.$t('management.err_empty_password');
        that.$refs.password.focus();
      } else if (that.newPassword !== that.password) {
        that.errMsg = that.$t('management.err_invalid_check_password');
        that.$refs.newPassword.focus();
      } else {
        that.$emit('validateSuccess', {
          password: md5(that.password),
          verify: md5(that.origPassword),
        });
      }
    },
  },
  mounted() {
    if (this.extData.user) {
      this.userType = this.extData.user.type || 2;
    }
    this.$on('validate', this.validate);
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

.normal-password-form {
  color: #666666;
  padding: 0 25px;
  @include font-14px();
  width: 465px;
  display: flex;
  flex-direction: column;
  .row {
    flex: 0 0 40px;

    display: flex;
    align-items: center;
    .row-title {
      flex: 0 0 90px;
    }
    .row-input {
      flex: 0 1 340px;
      padding: 3px 8px;
      @include font-14px();
    }
    .err-msg {
      color: #f76260;
    }
  }
}
</style>
