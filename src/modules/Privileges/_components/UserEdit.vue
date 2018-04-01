<template>
  <div class='user-edit'>
    <div class="row">
      <span class="row-name">{{ $t('privileges.user_name') }}</span>
      <template v-if="addMode">
        <input v-model="name" ref="nameInput"
          :class="{error: isNameError}"
          @blur="checkName"
          :placeholder="$t('privileges.placeholder_user_name')">
      </template>
      <template v-else>
        <span class='row-val'>{{name}}</span>
      </template>
    </div>
    <div v-if="isNameError" class="err-msg">{{ $t('error_msg.input_empty') }}</div>
    <div class="row">
      <span class="row-name">{{ $t('privileges.password') }}</span>
      <input type="password" v-model="password"
        @blur="checkPassword"
        :placeholder="addMode ? $t('privileges.placeholder_password') : $t('privileges.placeholder_modify_password')">
    </div>
    <div v-if="isPasswordError" class="err-msg">{{ $t('error_msg.input_empty') }}</div>
    <div class="row">
      <span class="row-name">{{ $t('privileges.role') }}</span>
      <select v-model="role" v-on:change="checkRole">
        <option v-for="role in origData.roles" :key="role.role_id" :value="role.role_id">{{role.role_name}}</option>
      </select>
    </div>
    <div v-if="isRoleError" class="err-msg">{{ $t('privileges.err_role_empty') }}</div>
  </div>
</template>

<script>
import md5 from 'md5';

export default {
  name: 'user-edit-pop',
  props: {
    origData: {
      type: Object,
      default() {
        return { name: '', roles: [], addMode: true };
      },
    },
  },
  data() {
    return {
      name: '',
      isNameError: false,
      password: '',
      isPasswordError: false,
      role: '',
      isRoleError: false,
      addMode: false,
    };
  },
  computed: {
    isNameValid() {
      return this.name !== '';
    },
    isPasswordValid() {
      const that = this;
      if (that.addMode) {
        return this.password !== '';
      }
      return true;
    },
    isRoleValid() {
      return this.role !== '';
    },
  },
  methods: {
    checkName() {
      this.isNameError = !this.isNameValid;
      if (this.isNameValid) {
        this.$emit('enableOK');
      } else {
        this.$emit('disableOK');
      }
      return this.isNameValid;
    },
    checkPassword() {
      this.isPasswordError = !this.isPasswordValid;
      if (this.isPasswordValid) {
        this.$emit('enableOK');
      } else {
        this.$emit('disableOK');
      }
      return this.isPasswordValid;
    },
    checkRole() {
      this.isRoleError = !this.isRoleValid;
      if (this.isRoleValid) {
        this.$emit('enableOK');
      } else {
        this.$emit('disableOK');
      }
      return this.isRoleValid;
    },
    validate() {
      const that = this;
      if (that.checkName() && that.checkPassword() && that.checkRole()) {
        const retObj = {
          name: that.name,
          role_id: that.role,
        };
        if (that.password !== '') {
          retObj.password = md5(that.password);
        }
        that.$emit('validateSuccess', retObj);
      }
    },
  },
  mounted() {
    const that = this;
    that.name = that.origData.name;
    that.addMode = that.origData.addMode;
    that.roles = that.origData.roles;
    that.role = that.origData.role;
    that.$on('validate', that.validate);
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

.user-edit {
  @include popForm(60px);
}
</style>
