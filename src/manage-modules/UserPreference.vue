<template>
  <div class="user-preference">
    <div class="card h-fill w-fill">
      <nav-bar class='nav-bar' :options=pageOption></nav-bar>
      <div class="button-container">
        <div class="back-button">
          <text-button @click="hideUserPreference">{{ $t('management.go_back') }}</text-button>
        </div>
        <div class="edit-button">
          <text-button button-type="primary" width="80px" @click="popEditUser">{{ $t('management.edit_data') }}</text-button>
        </div>
      </div>
      <div class="content">
        <div class="row" v-for="col in columnOption" :key="col.key">
          <div class="row-title">{{ col.text }}：</div>
          <div class="row-content">{{ user[col.key] }}</div>
          <text-button v-if="col.key==='password'"
          @click="popEditPassword">{{ $t('management.modify_password') }}</text-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import NavBar from '@/components/NavigationBar';
import api from './_api/user';
import UserForm from './_components/NormalUserEditForm';
import PasswordForm from './_components/NormalUserPasswordForm';

export default {
  name: 'user-preference',
  components: {
    NavBar,
  },
  api,
  data() {
    return {
      user: {},
      pageOption: {
        robotList: this.$t('management.user_preference'),
      },
      columnOption: [
        {
          key: 'user_name',
          text: 'ID',
        },
        {
          key: 'password',
          text: this.$t('management.password'),
        },
        {
          key: 'display_name',
          text: this.$t('management.user_display_name'),
        },
        {
          key: 'phone',
          text: this.$t('management.phone'),
        },
        {
          key: 'email',
          text: this.$t('management.email'),
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'enterpriseID',
    ]),
  },
  methods: {
    ...mapMutations([
      'hideUserPreference',
    ]),
    loadUser() {
      const that = this;
      that.$emit('startLoading');
      return that.$api.getEnterpriseUser(that.enterpriseID, that.userInfo.id)
      .then((data) => {
        data.password = '********';
        that.user = data;
      })
      .finally(() => {
        that.$emit('endLoading');
      });
    },
    popEditUser() {
      const that = this;
      that.$pop({
        title: that.$t('management.edit_user_preference'),
        component: UserForm,
        validate: true,
        extData: that.user,
        bindValue: false,
        ok_msg: that.$t('general.save'),
        callback: {
          ok(retData) {
            const updatedUser = {
              ...retData,
              apps: that.getUserPrivilegeStr(),
            };

            if (retData.name === that.user.display_name &&
              retData.email === that.user.email &&
              retData.phone === that.user.phone) {
              that.$notify({ text: that.$t('error_msg.save_success') });
              return;
            }

            that.$emit('startLoading');
            that.$api.updateEnterpriseUser(that.enterpriseID, that.userInfo.id, updatedUser)
            .then(() => {
              that.$notify({ text: that.$t('error_msg.save_success') });
              return that.loadUser();
            })
            .finally(() => {
              that.$emit('endLoading');
            });
          },
        },
      });
    },
    popEditPassword() {
      const that = this;
      that.$pop({
        title: that.$t('management.modify_password'),
        component: PasswordForm,
        validate: true,
        extData: that.user,
        ok_msg: that.$t('general.save'),
        callback: {
          ok(retData) {
            const updatedUser = {
              username: that.user.user_name,
              name: that.user.display_name,
              email: that.user.email,
              phone: that.user.phone,
              password: retData.password,
              verify_password: retData.verify,
              apps: that.getUserPrivilegeStr(),
            };

            that.$emit('startLoading');
            that.$api.updateEnterpriseUser(that.enterpriseID, that.userInfo.id, updatedUser)
            .then(() => {
              that.$notify({ text: that.$t('management.update_password_success') });
            })
            .finally(() => {
              that.$emit('endLoading');
            });
          },
        },
      });
    },
    getUserPrivilegeStr() {
      const that = this;
      const privileges = {
        apps: {},
        groups: {},
      };
      that.user.roles.apps.forEach((app) => {
        if (!privileges.apps[app.id]) {
          privileges.apps[app.id] = [];
        }
        privileges.apps[app.id].push(app.role);
      });
      that.user.roles.groups.forEach((group) => {
        if (!privileges.groups[group.id]) {
          privileges.groups[group.id] = [];
        }
        privileges.groups[group.id].push(group.role);
      });
      return JSON.stringify(privileges);
    },
  },
  mounted() {
    this.loadUser();
  },
};
</script>

<style lang="scss" scoped>
@import './styles/variable.scss';

.user-preference {
  position: absolute;
  left: 0;
  top: $page-header-height;
  width: 100vw;
  height: calc(100vh - #{$page-header-height});
  background: $page-base;
  box-sizing: border-box;
  overflow: hidden;
  padding: 0 20px;
  .card {
    position: relative;
    @include card();
  }

  .button-container {
    display: flex;
    align-items: flex-end;
    position: absolute;
    right: 20px;
    top: 20px;
    .edit-button {
      margin-left: 10px;
    }
  }

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 30px 20px;
    @include font-14px();

    .row {
      margin-bottom: 20px;

      display: flex;
      align-items: center;
      .row-title {
        flex: 0 0 88px;
        overflow: hidden;
      }
      .row-content {
        margin-right: 10px;
      }
    }
  }
}
</style>
