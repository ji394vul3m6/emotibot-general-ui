<template>
  <div class="user-info-form" :class="[isAdmin ? 'admin' : 'normal']">
    <div class="row">
      <div class="row-title">{{ $t('management.user_name') }}</div>
      <div v-if="editMode">{{ userName }}</div>
      <input v-else class="row-input" ref="userName" v-model="userName" :placeholder="$t('management.input_placeholder')">
    </div>
    <div class="row">
      <div class="row-title">{{ $t('management.user_type') }}</div>
      <div>{{ isAdmin ? $t('management.enterprise_admin') : $t('management.normal_user')}}</div>
    </div>
    <div class="row">
      <div class="row-title">{{ $t('management.set_password') }}</div>
      <div class="row-input-col" v-if="editMode && !passwordEdit">
        <div>********</div>
        <text-button class="modify" @click="startEditPassword">{{ $t('management.modify_password') }}</text-button>
      </div>
      <input v-else class="row-input" ref="password" v-model="password" type="password" :placeholder="$t('management.set_passowrd_placeholder')">
    </div>
    <div class="row" v-if="!editMode || passwordEdit">
      <div class="row-title">{{ $t('management.check_password') }}</div>
      <input class="row-input" ref="checkPassword" v-model="checkPassword" type="password" :placeholder="$t('management.check_password_placeholder')">
    </div>
    <div class="row">
      <div class="row-title">{{ $t('management.user_display_name') }}</div>
      <input class="row-input" ref="displayName" v-model="displayName" :placeholder="$t('management.input_placeholder')">
    </div>
    <div class="row">
      <div class="row-title">{{ $t('management.phone') }}</div>
      <input class="row-input" ref="phone" v-model="phone" :placeholder="$t('management.input_placeholder')">
    </div>
    <div class="row">
      <div class="row-title">{{ $t('management.email') }}</div>
      <input class="row-input" ref="email" v-model="email" :placeholder="$t('management.input_placeholder')">
    </div>
    <template v-if="!isAdmin">
    <div class="row" v-for="(privilege, idx) in privilegeSet" :key="idx">
      <div class="row-title">
        <template v-if="idx === 0">{{ $t('management.assign_robot') }}</template>
      </div>
      <dropdown-selector class="selector" :options="machineOptions" v-model="privilege.machine"/>
      <div class="row-text">{{ $t('management.privilege_is') }}</div>
      <dropdown-selector class="selector" :options="privilegeOptions" v-model="privilege.role"/>
      <div class="row-button">
        <text-button button-type="error" v-if="privilegeSet.length > 1" @click="removePrivilege(idx)">
          {{ $t('general.delete') }}
        </text-button>
      </div>
    </div>
    <div class="row">
      <div class="row-title"></div>
      <text-button button-type="primary" @click="addPrivilege">{{ $t('general.add') }}</text-button>
    </div>
    </template>
    <div class='err-tooltip' ref="tooltip">
      {{ errMsg }}
    </div>
  </div>
</template>

<script>
import md5 from 'md5';
import DropdownSelector from '@/components/DropdownSelect';

export default {
  name: 'user-add-form',
  props: {
    extData: {
      type: Object,
      default: () => ({
        type: 2,
      }),
    },
  },
  components: {
    DropdownSelector,
  },
  computed: {
    isAdmin() {
      return this.userType === 1;
    },
  },
  data() {
    return {
      userType: 2,
      userName: '',
      password: '',
      checkPassword: '',
      displayName: '',
      phone: '',
      email: '',
      editMode: false,
      passwordEdit: false,

      privilegeSet: [{
        machine: [],
        role: [],
      }],

      errColumn: '',
      errMsg: '',
      showErr: false,
      toolTipTimer: undefined,

      machineOptions: [],
      privilegeOptions: [],
      editPasswordCallback: undefined,
      existedUsers: [],
    };
  },
  methods: {
    startEditPassword() {
      const that = this;
      that.$emit('cancel');
      that.$nextTick(() => {
        const copyUser = Object.assign({}, that.extData.user);
        copyUser.display_name = that.displayName.trim();
        copyUser.email = that.email.trim();
        copyUser.phone = that.phone.trim();

        that.editPasswordCallback(that.extData.user, copyUser);
      });
    },
    addPrivilege() {
      this.privilegeSet.push({
        machine: [],
        role: [],
      });
    },
    removePrivilege(idx) {
      this.privilegeSet.splice(idx, 1);
    },
    showError() {
      const that = this;

      const input = that.$refs[that.errColumn];
      if (input === undefined) {
        return;
      }
      input.focus();
      const boundedBox = input.getBoundingClientRect();

      const tooltip = that.$refs.tooltip;
      if (tooltip) {
        tooltip.style.position = 'fixed';
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = 1;
        tooltip.style.top = `${boundedBox.top - tooltip.clientHeight}px`;
        tooltip.style.left = `${boundedBox.left + 200}px`;
        tooltip.className = tooltip.className.replace('fade-out', '');
      } else {
        return;
      }

      if (that.toolTipTimer) {
        clearTimeout(that.toolTipTimer);
      }
      that.$nextTick(() => {
        if (tooltip.classList) {
          tooltip.classList.add('fade-out');
        } else {
          tooltip.className += ' fade-out';
        }
        tooltip.style.opacity = 0.01;
      });
      that.toolTipTimer = setTimeout(() => {
        tooltip.style.visibility = 'hidden';
        that.toolTipTimer = undefined;
      }, 2000);
    },
    validate() {
      const that = this;
      if (that.userName.trim() === '') {
        that.errColumn = 'userName';
        that.errMsg = that.$t('management.err_empty_username');
      } else if (that.email.trim() === '') {
        that.errColumn = 'email';
        that.errMsg = that.$t('management.err_empty_email');
      } else if (!that.editMode && that.password === '') {
        that.errColumn = 'password';
        that.errMsg = that.$t('management.err_empty_password');
      } else if (that.checkPassword !== that.password) {
        that.errColumn = 'checkPassword';
        that.errMsg = that.$t('management.err_invalid_check_password');
      } else {
        that.errColumn = '';
        that.errMsg = '';
      }

      if (!that.editMode) {
        if (that.existedUsers.indexOf(that.userName) >= 0) {
          that.errColumn = 'userName';
          that.errMsg = that.$t('management.err_existed_username');
        }
      }

      if (that.errColumn) {
        that.showError();
        return;
      }

      const ret = {
        username: that.userName.trim(),
        name: that.displayName.trim(),
        email: that.email.trim(),
        phone: that.phone,
      };

      if (that.password !== '') {
        ret.password = md5(that.password);
      }

      const retApps = {
        apps: {},
        groups: {},
      };
      that.privilegeSet.forEach((privilege) => {
        const machine = privilege.machine.length > 0 ? privilege.machine[0] : '';
        const role = privilege.role.length > 0 ? privilege.role[0] : '';
        if (machine !== '' && role !== '') {
          if (that.extData.groups.findIndex(o => o.id === machine) >= 0) {
            retApps.groups[machine] = role;
          } else {
            retApps.apps[machine] = role;
          }
        }
      });
      ret.apps = JSON.stringify(retApps);
      that.$emit('validateSuccess', ret);
    },
  },
  beforeMount() {
    const that = this;
    that.userType = that.extData.type || 2;

    if (that.extData.editMode) {
      that.editMode = that.extData.editMode;
      const user = that.extData.user;
      that.userName = user.user_name;
      that.email = user.email;
      that.displayName = user.display_name;
      that.phone = user.phone || '';
      that.editPasswordCallback = that.extData.editPasswordCallback;

      if (that.extData.user.roles) {
        that.privilegeSet = [];
        that.extData.user.roles.groups.forEach((group) => {
          that.privilegeSet.push({
            machine: [group.id],
            role: [group.role],
          });
        });
        that.extData.user.roles.apps.forEach((app) => {
          that.privilegeSet.push({
            machine: [app.id],
            role: [app.role],
          });
        });
      }
      if (that.privilegeSet.length <= 0) {
        that.privilegeSet = [{
          machine: [],
          role: [],
        }];
      }
    }
    if (that.userType > 1) {
      that.extData.roles.forEach((role) => {
        that.privilegeOptions.push({
          text: role.name,
          value: role.uuid,
        });
      });
      if (that.extData.groups && that.extData.groups.length) {
        that.machineOptions.push({
          text: that.$t('management.robot_group'),
          isGroup: true,
        });
        that.extData.groups.forEach((group) => {
          that.machineOptions.push({
            text: group.name,
            value: group.id,
            inGroup: true,
          });
        });
      }
      if (that.extData.robots && that.extData.robots.length) {
        that.machineOptions.push({
          text: that.$t('management.robots'),
          isGroup: true,
        });
        that.extData.robots.forEach((robot) => {
          that.machineOptions.push({
            text: robot.name,
            value: robot.id,
            inGroup: true,
          });
        });
      }
    }
    if (that.extData.users) {
      that.extData.users.forEach((user) => {
        that.existedUsers.push(user.user_name);
      });
    }

    that.$on('validate', that.validate);
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

.user-info-form {
  color: #666666;
  padding: 0 25px;
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
    max-height: 40px;

    display: flex;
    align-items: center;
    .row-title {
      flex: 0 0 90px;
      max-width: 90px;
    }
    .row-input {
      flex: 0 1 340px;
      padding: 3px 8px;
      @include font-14px();
    }
    .row-input-col {
      flex: 0 1 340px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .row-text {
      margin: 0 9px 0 10px;
    }
    .row-button {
      margin-left: 10px;
    }
    .selector {
      flex: 0 0 140px;
      max-width: 140px;
    }
  }
}
.err-tooltip {
  position: fixed;
  visibility: hidden;
  max-width: 172px;
  min-height: 36px;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  padding: 8px 16px;
  &.fade-out {
    transition: opacity 1s 1s;
  }
}
</style>
