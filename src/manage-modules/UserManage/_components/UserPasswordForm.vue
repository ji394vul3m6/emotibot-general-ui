<template>
  <div class="password-form" :class="[isAdmin ? 'admin' : 'normal']">
    <div class="row">
      <div class="row-title">{{ $t('management.manager_password') }}</div>
      <input type="password" class="row-input" ref="managerPassword" v-model="managerPassword" :placeholder="$t('management.input_placeholder')">
    </div>
    <div class="row">
      <div class="row-title">{{ $t('management.new_password') }}</div>
      <input type="password" class="row-input" ref="password" v-model="password" :placeholder="$t('management.input_placeholder')">
    </div>
    <div class="row">
      <div class="row-title">{{ $t('management.check_new_password') }}</div>
      <input type="password" class="row-input" ref="newPassword" v-model="newPassword" :placeholder="$t('management.input_placeholder')">
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
      managerPassword: '',
      password: '',
      newPassword: '',
      userType: 2,
      errMsg: '',
    };
  },
  methods: {
    validate() {
      const that = this;
      if (that.managerPassword === '') {
        that.errMsg = that.$t('management.err_manager_empty_password');
        that.$refs.managerPassword.focus();
      } else if (that.password === '') {
        that.errMsg = that.$t('management.err_empty_password');
        that.$refs.password.focus();
      } else if (that.newPassword !== that.password) {
        that.errMsg = that.$t('management.err_invalid_check_password');
        that.$refs.newPassword.focus();
      } else {
        that.$emit('validateSuccess', md5(that.password));
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

.password-form {
  color: #666666;
  padding: 0 25px;
  height: 240px;
  @include font-14px();
  &.admin {
    width: 510px;
  }
  &.normal {
    width: 560px;
  }
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
