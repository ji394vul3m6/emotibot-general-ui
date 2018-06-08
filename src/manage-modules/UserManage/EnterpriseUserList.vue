<template>
  <div>
    <div class="card h-fill w-fill">
      <nav-bar class='nav-bar' :options=pageOption></nav-bar>
      <div class="page">
        <command-row class="commands">
          <text-button button-type="primary" @click="popAddUser">{{ $t('management.add_account') }}</text-button>
          <text-button @click="goRoleList">{{ $t('management.privilege_setting') }}</text-button>
        </command-row>
        <div class="table-container">
          <general-table
            :table-header="tableHeader"
            :table-data="showUsers"
            :action="actions"
            autoHeight
            font-class="font-12"
          />
        </div>
        <div class="table-paginator">
          <v-pagination size="small"
            :total="users.length"
            :pageIndex="curPageIdx"
            :pageSize="pageLimit"
            :layout="['prev', 'pager', 'next', 'jumper']"
            @page-change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import NavBar from '@/components/NavigationBar';
import CommandRow from '../_components/CommandRow';
import userAPI from '../_api/user';
import groupAPI from '../_api/group';
import roleAPI from '../_api/role';
import robotAPI from '../_api/robot';
import ChooseUserTypeForm from './_components/ChooseUserTypeForm';
import UserAddForm from './_components/UserAddForm';
import PasswordForm from './_components/UserPasswordForm';

export default {
  name: 'enterprise-user-list',
  path: 'enterprise-user-list',
  components: {
    NavBar,
    CommandRow,
  },
  api: [userAPI, groupAPI, roleAPI, robotAPI],
  computed: {
    ...mapGetters([
      'enterpriseID',
      'userRoleMap',
    ]),
    showUsers() {
      const start = this.pageLimit * (this.curPageIdx - 1);
      const end = start + this.pageLimit;
      return this.users.slice(start, end);
    },
  },
  data() {
    return {
      pageOption: {
        userList: this.$t('management.enterprise_privilege_manage'),
      },
      keyword: '',
      users: [],
      curPageIdx: 1,
      pageLimit: 20,
      tableHeader: [
        {
          key: 'user_name',
          text: this.$t('management.user_name'),
          width: '10%',
        },
        {
          key: 'type_text',
          text: this.$t('management.user_type'),
          width: '10%',
        },
        {
          key: 'display_name',
          text: this.$t('management.user_display_name'),
          width: '10%',
        },
        {
          key: 'phone',
          text: this.$t('management.phone'),
          width: '20%',
        },
        {
          key: 'email',
          text: this.$t('management.email'),
        },
      ],
      actions: [
        {
          text: '編輯',
          type: 'primary',
          onclick: this.popEditUser,
        },
        {
          text: '刪除',
          type: 'error',
          onclick: this.deleteUser,
        },
      ],
    };
  },
  methods: {
    goRoleList() {
      this.$router.push('/manage/enterprise-role-list');
    },
    handlePageChange(page) {
      this.curPageIdx = page;
    },
    loadUsers() {
      const that = this;
      that.$emit('startLoading');
      that.$api.getEnterpriseUsers(that.enterpriseID)
      .then((users) => {
        that.users = users;
        that.users.forEach((user) => {
          if (user.type === 2) {
            user.type_text = that.$t('management.normal_user');
          } else if (user.type === 1) {
            user.type_text = that.$t('management.enterprise_admin');
          } else if (user.type === 0) {
            user.type_text = that.$t('management.system_admin');
          } else {
            user.type_text = that.$t('management.unknown');
          }

          if (!user.display_name) {
            user.display_name = user.user_name;
          }
        });
      })
      .finally(() => {
        that.$emit('endLoading');
      });
    },
    popEditPassword(origUser, tempUser) {
      const that = this;
      that.$pop({
        title: that.$t('management.edit_account'),
        component: PasswordForm,
        validate: true,
        extData: {
          user: origUser,
        },
        ok_msg: that.$t('general.save'),
        callback: {
          ok(retData) {
            const updatedUser = {
              username: origUser.user_name,
              name: origUser.display_name,
              email: origUser.email,
              phone: origUser.phone,
              password: retData,
            };
            that.$api.updateEnterpriseUser(that.enterpriseID, origUser.id, updatedUser)
            .then(() => {
              that.$notify({ text: that.$t('management.update_password_success') });
              that.popEditUser(tempUser);
            });
          },
          cancel() {
            that.popEditUser(tempUser);
          },
        },
      });
    },
    popEditUser(user) {
      const that = this;
      const promises = [
        that.$api.getEnterpriseRoles(that.enterpriseID),
        that.$api.getRobotGroups(that.enterpriseID),
        that.$api.getRobots(that.enterpriseID),
      ];

      const popOption = {
        title: that.$t('management.edit_account'),
        component: UserAddForm,
        validate: true,
        extData: {
          type: user.type,
          editMode: true,
          user,
          editPasswordCallback: this.popEditPassword,
        },
        cancel_msg: that.$t('management.go_back'),
        callback: {
          ok(retData) {
            that.$api.updateEnterpriseUser(that.enterpriseID, user.id, retData).then(() => {
              that.loadUsers();
            });
          },
        },
      };

      Promise.all(promises)
      .then(([roles, groups, robots]) => {
        console.log(roles);
        console.log(groups);
        console.log(robots);
        popOption.extData.roles = roles;
        popOption.extData.groups = groups;
        popOption.extData.robots = robots;
        that.$pop(popOption);
      });
    },
    popAddUser(dftUserType) {
      const that = this;
      that.$pop({
        title: that.$t('management.add_account'),
        component: ChooseUserTypeForm,
        validate: true,
        ok_msg: that.$t('management.next_step'),
        extData: {
          defaultType: dftUserType,
        },
        callback: {
          ok(retData) {
            that.popAddUserInfo(retData);
          },
        },
      });
    },
    popAddUserInfo(userType) {
      const that = this;

      const promises = [
        that.$api.getEnterpriseRoles(that.enterpriseID),
        that.$api.getRobotGroups(that.enterpriseID),
        that.$api.getRobots(that.enterpriseID),
      ];
      const popOption = {
        title: that.$t('management.add_account'),
        component: UserAddForm,
        validate: true,
        extData: {
          type: userType,
          editMode: false,
        },
        left_button: {
          callback() {
            that.popAddUser(userType);
          },
          closeAfterClick: true,
          msg: that.$t('management.last_step'),
        },
        callback: {
          ok(retData) {
            retData.type = userType;
            that.$api.addEnterpriseUser(that.enterpriseID, retData).then(() => {
              that.loadUsers();
            });
          },
        },
      };

      Promise.all(promises)
      .then(([roles, groups, robots]) => {
        console.log(roles);
        console.log(groups);
        console.log(robots);
        popOption.extData.roles = roles;
        popOption.extData.groups = groups;
        popOption.extData.robots = robots;
        that.$pop(popOption);
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
            that.$api.deleteEnterpriseUser(that.enterpriseID, user.id).then(() => {
              that.$notify({ text: that.$t('privileges.delete_success') });
              that.loadUsers();
            });
          },
        },
        bindValue: true,
      });
    },
  },
  mounted() {
    this.loadUsers();
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

.card {
  overflow: hidden;

  display: flex;
  flex-direction: column;
  .nav-bar {
    flex: 0 0 auto;
  }
  .page {
    flex: 1;

    display: flex;
    flex-direction: column;
    .commands {
      flex: 0 0 auto;
    }
    .table-container {
      flex: 1;
      margin-top: 20px;
    }
    .table-paginator {
      flex: 0 0 50px;

      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
</style>