<template>
  <div>
    <div class="card h-fill w-fill">
      <nav-bar class='nav-bar' :options=pageOption v-model='currentPage' @search="changeKeyword" showSearch></nav-bar>
      <div class="page">
        <command-row class="commands">
          <text-button button-type="primary" @click="popEditUser()">{{ $t('management.add_account') }}</text-button>
        </command-row>
        <div class="table-container">
          <general-table
            :table-header="tableHeader"
            :table-data="showUsers"
            :action="actions"
            autoHeight
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
import NavBar from '@/components/NavigationBar';
import api from './_api/system';
import CommandRow from '../_components/CommandRow';
import UserAddForm from './_components/AdminAddForm';
import PasswordForm from '../UserManage/_components/UserPasswordForm';

const enterpriseListPage = '/manage/enterprise-manage';
export default {
  name: 'system-admin-list',
  path: 'system-admin-list',
  components: {
    NavBar,
    CommandRow,
  },
  api,
  computed: {
    filteredUsers() {
      if (this.keyword === '') {
        return this.users;
      }
      return this.users.filter(user => user.user_name.indexOf(this.keyword) >= 0);
    },
    showUsers() {
      const start = this.pageLimit * (this.curPageIdx - 1);
      const end = start + this.pageLimit;
      return this.filteredUsers.slice(start, end);
    },
  },
  watch: {
    currentPage(val) {
      if (val === 'enterpriseList') {
        this.$router.push(enterpriseListPage);
      }
    },
  },
  data() {
    return {
      pageOption: {
        enterpriseList: this.$t('management.enterprise_list'),
        systemAdminList: this.$t('management.admin_list'),
      },
      currentPage: 'systemAdminList',
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
    changeKeyword(word) {
      this.keyword = word;
    },
    goRoleList() {
      this.$router.push('/manage/enterprise-role-list');
    },
    handlePageChange(page) {
      this.curPageIdx = page;
    },
    loadUsers() {
      const that = this;
      that.$emit('startLoading');
      that.$api.getAdmins()
      .then((users) => {
        that.users = users;
        that.users.forEach((user) => {
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
              password: retData.password,
              verify_password: retData.verify,
            };
            that.$api.updateAdmin(origUser.id, updatedUser)
            .then(() => {
              that.$notify({ text: that.$t('management.update_password_success') });
              that.popEditUser(tempUser);
            })
            .catch((err) => {
              that.popEditPassword(origUser, tempUser);
              if (err.response.status === 403) {
                that.$notifyFail(that.$t('management.err_manager_password'));
              } else {
                that.$notifyFail(that.$t('management.err_update_password_fail'));
              }
            });
          },
          cancel() {
            console.log(tempUser);
            that.popEditUser(tempUser);
          },
        },
      });
    },
    popEditUser(user) {
      const that = this;

      const popOption = {
        title: user ? that.$t('management.edit_account') : that.$t('management.add_account'),
        component: UserAddForm,
        validate: true,
        extData: {
          user,
          editPasswordCallback: this.popEditPassword,
        },
        callback: {
          ok(retData) {
            if (user === undefined) {
              that.$api.addAdmin(retData)
              .then(() => {
                that.$notify({ text: that.$t('error_msg.save_success') });
                that.loadUsers();
              })
              .catch((err) => {
                console.log(err);
              });
            } else {
              that.$api.updateAdmin(user.id, retData)
              .then(() => {
                that.$notify({ text: that.$t('error_msg.save_success') });
                that.loadUsers();
              })
              .catch((err) => {
                console.log(err);
              });
            }
          },
        },
      };
      that.$pop(popOption);
    },
    deleteUser(user) {
      const that = this;
      that.$popCheck({
        data: {
          msg: that.$t('privileges.check_delete_user', { user: user.user_name }),
        },
        callback: {
          ok() {
            that.$api.deleteAdmin(user.id).then(() => {
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
    @include auto-overflow();
    @include customScrollbar();
    .commands {
      flex: 0 0 auto;
    }
    .table-container {
      flex: 1;
      margin-top: 20px;
    }
    .table-paginator {
      flex: 0 0 50px;
      border-top: 1px solid $color-borderline;
      padding-right: 12px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
</style>
