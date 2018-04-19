<template>
  <div id='role-manage'>
    <div class="actions row">
      <text-button main icon-type="white_add" @click="popAddUser">{{$t('general.add')}}{{$t('privileges.user')}}</text-button>
      <search-input v-model="keyword"></search-input>
    </div>
    <div class="header row">
      <div class="check"></div>
      <div class="name">{{$t('privileges.user_name')}}</div>
      <div class="role">{{$t('privileges.role')}}</div>
      <div class="actions">{{$t('general.actions')}}</div>
    </div>
    <div class="lists">
      <template v-if="users.length > 0">
      <div v-for="user in users" v-if="user.user_name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1" :key="user.user_id" class='user-row row'>
        <div class="check">
        </div>
        <div class="name">{{user.user_name}}</div>
        <div class="role">{{getRoleShowName(user)}}</div>
        <div class="actions">
          <template v-if="user.type !== enterpriseAdminType">
          <div class="icon button" @click="popEditUser(user)">
            <icon icon-type="edit"/>
            <div class="tooltip">{{$t('general.edit')}}</div>
          </div>
          <div class="icon button">
            <icon icon-type="delete" @click="deleteUser(user)"/>
            <div class="tooltip">{{$t('general.delete')}}</div>
          </div>
          </template>
        </div>
      </div>
      </template>
      <template v-else>
        <div class='role-row row empty'>
          {{ $t('privileges.no_users') }}
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import userAPI from './_api/user';
import roleAPI from './_api/role';
import UserEdit from './_components/UserEdit';

export default {
  path: 'user-manage',
  privCode: 'management',
  displayNameKey: 'user_manage',
  icon: 'white_user',
  api: [userAPI, roleAPI],
  data() {
    return {
      keyword: '',
      users: [],
      roleMap: {},
      enterpriseAdminType: 1,
      systemAdminType: 0,
      enterprise: {},
    };
  },
  methods: {
    getRoleShowName(user) {
      const that = this;
      if (user.type === that.enterpriseAdminType) {
        return that.$t('privileges.enterprise_admin');
      }
      if (that.roleMap[user.role] !== undefined) {
        return that.roleMap[user.role];
      }
      return user.role;
    },
    popEditUser(user) {
      const that = this;
      that.$emit('startLoading');
      that.$api.getEnterpriseRoles(that.enterprise.id).then((roles) => {
        if (roles.length <= 0) {
          that.$notifyFail(that.$t('privileges.err_need_create_role'));
          return;
        }
        that.$pop({
          component: UserEdit,
          data: {
            name: user.user_name,
            role: user.role,
            roles,
            addMode: false,
          },
          title: `${that.$t('general.edit')}${that.$t('privileges.user')}`,
          validate: true,
          bindValue: false,
          callback: {
            ok(retData) {
              if (retData.password === undefined && retData.role === user.role) {
                return;
              }
              console.log(retData);
              that.$api.updateEnterpriseUser(that.enterprise.id, user.id, retData).then(() => {
                that.notifySuccess();
                that.loadUsers();
              });
            },
          },
        });
      }, () => {

      }).then(() => {
        that.$emit('endLoading');
      });
    },
    deleteUser(user) {
      const that = this;
      that.$popCheck({
        data: {
          msg: that.$t('privileges.check_delete_user', { user: user.user_name }),
        },
        callback: {
          ok() {
            that.$api.deleteEnterpriseUser(that.enterprise.id, user.id).then(() => {
              that.$notify({ text: that.$t('privileges.delete_success') });
              that.loadUsers();
            });
          },
        },
        bindValue: true,
      });
    },
    popAddUser() {
      const that = this;
      that.$emit('startLoading');
      that.$api.getEnterpriseRoles(that.enterprise.id).then((roles) => {
        if (roles.length <= 0) {
          that.$notifyFail(that.$t('privileges.err_need_create_role'));
          return;
        }
        that.$pop({
          component: UserEdit,
          data: {
            name: '',
            roles,
            addMode: true,
          },
          title: `${that.$t('general.add')}${that.$t('privileges.user')}`,
          validate: true,
          bindValue: false,
          callback: {
            ok(retData) {
              retData.username = retData.name;
              console.log(retData);
              that.$api.addEnterpriseUser(that.enterprise.id, retData).then(() => {
                that.notifySuccess();
                that.loadUsers();
              });
            },
          },
        });
      }, () => {

      }).then(() => {
        that.$emit('endLoading');
      });
    },
    notifySuccess() {
      this.$notify({ text: this.$t('error_msg.success') });
    },
    loadUsers() {
      const that = this;
      that.$emit('startLoading');
      that.$api.getEnterpriseRoles(that.enterprise.id).then((roles) => {
        roles.forEach((role) => {
          that.roleMap[role.id] = role.name;
        });
      })
      .then(() => that.$api.getEnterpriseUsers(that.enterprise.id))
      .then((users) => {
        that.users = users;
      })
      .finally(() => {
        that.$emit('endLoading');
      });
    },
  },
  mounted() {
    this.enterprise = this.$getUserEnterprises();
    this.loadUsers();
  },
};
</script>



<style lang="scss" scoped>
@import "styles/variable";

#role-manage {
  display: flex;
  flex-direction: column;
  height: 100%;
  .actions {
    flex: 0 0 $table-row-height;
  }
  .header {
    background: $table-header-background;
  }
  .lists {
    flex: 1 1 100px;
    background: $table-body-background;

    display: flex;
    flex-direction: column;
    .user-row {
      &.empty {
        justify-content: center;
      }
      &:hover {
        background: $table-body-hover-background;
      }
      border-bottom: 1px solid $table-border-color;
    }
  }
  .row {
    @include flex-row();

    .check {
      flex: 0 0 50px;
    }
    .name {
      flex: 1 1 100px;
    }
    .role {
      flex: 1 1 100px;
    }
    .actions {
      flex: 0 0 90px;
    }
  }
}
</style>
