<template>
  <div id='role-manage'>
    <div class="actions row">
      <text-button main @click="popAddRole">{{$t('general.add')}}{{$t('privileges.role')}}</text-button>
      <search-input v-model="keyword"></search-input>
    </div>
    <div class="header row">
      <!-- <div class="check"></div> -->
      <div class="name">{{$t('privileges.role_name')}}</div>
        <div class="count">{{$t('privileges.user_count')}}</div>
      <!-- <div class="privileges">{{$t('privileges.privileges')}}</div> -->
      <div class="actions">{{$t('general.actions')}}</div>
    </div>
    <div class="lists">
      <template v-if="roles.length > 0">
      <div v-for="role in roles" v-if="role.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1" :key="role.id" class='role-row row'>
        <!-- <div class="check">
          <input type="checkbox">
        </div> -->
        <div class="name">{{role.name}}</div>
        <div class="count">{{role.user_count}}</div>
        <div class="actions">
          <div class="button" @click="popEditRole(role)">
            <div>{{$t('general.edit')}}</div>
          </div>
          /
          <div class="button" @click="deleteRole(role)"
            :class="{disable: role.user_count > 0}">
            <div>{{$t('general.delete')}}</div>
          </div>
        </div>
      </div>
      </template>
      <template v-else>
        <div class='role-row row empty'>
          {{ $t('privileges.no_roles') }}
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import RoleEdit from './_components/RoleEdit';
import api from './_api/role';

export default {
  path: 'role-manage',
  privCode: 'management',
  displayNameKey: 'role_manage',
  icon: 'white_role',
  api,
  data() {
    return {
      keyword: '',
      roles: [],
      enterprise: {},
    };
  },
  computed: {
    ...mapGetters([
      'privilegeList',
      'privilegeMap',
    ]),
  },
  methods: {
    popEditRole(role) {
      const that = this;
      that.$pop({
        component: RoleEdit,
        data: {
          name: role.name,
          privileges: role.privileges,
        },
        validate: true,
        bindValue: false,
        callback: {
          ok(retData) {
            that.$api.updateEnterpriseRole(that.enterprise.id, role.id, retData).then(() => {
              that.notifySuccess();
              that.loadRoles();
            });
          },
        },
      });
    },
    deleteRole(role) {
      const that = this;
      that.$popCheck({
        data: {
          msg: that.$t('privileges.check_delete', { role: role.role_name }),
        },
        callback: {
          ok() {
            that.$api.deleteEnterpriseRole(that.enterprise.id, role.id).then(() => {
              that.$notify({ text: that.$t('privileges.delete_success') });
              that.loadRoles();
            });
          },
        },
        bindValue: true,
      });
    },
    popAddRole() {
      const that = this;
      that.$pop({
        component: RoleEdit,
        data: {
          name: '',
          addMode: true,
        },
        title: `${that.$t('general.add')}${that.$t('privileges.role')}`,
        validate: true,
        bindValue: false,
        callback: {
          ok(retData) {
            that.$api.addEnterpriseRole(that.enterprise.id, retData).then(() => {
              that.notifySuccess();
              that.loadRoles();
            });
          },
        },
      });
    },
    notifySuccess() {
      this.$notify({ text: this.$t('error_msg.success') });
    },
    loadRoles() {
      const that = this;
      that.$emit('startLoading');
      that.$api.getEnterpriseRoles(that.enterprise.id)
      .then((roles) => {
        that.roles = roles;
      })
      .finally(() => {
        that.$emit('endLoading');
      });
    },
  },
  mounted() {
    this.enterprise = this.$getUserEnterprises();
    this.loadRoles();
  },
};
</script>

<style lang="scss" scoped>
@import "styles/variable";

$role-header-background: #F7F7F7;
$role-body-background: white;
$role-list-height: 50px;

#role-manage {
  display: flex;
  flex-direction: column;
  height: 100%;
  .row {
    flex: 0 0 $role-list-height;
    @include flex-row();
    & > div {
      padding: 0 15px;
    }

    .check {
      flex: 0 0 0;
    }
    .name {
      flex: 1 1 100px;
    }
    .count {
      flex: 0 0 170px;
    }
    .actions {
      flex: 0 0 130px;
      display: flex;
      justify-content: flex-start;
      .button {
        @include click-button();
        &.disable {
          opacity: 0.2;
          cursor: unset;
          pointer-events: none;
        }
      }
    }
  }
  .row.actions {
    flex: 0 0 auto;
    display: flex;
    justify-content: space-between;
    padding: 20px;
  }
  .header {
    background: $role-header-background;
    box-shadow: inset 0 1px 0 0 #E9E9E9, inset 0 -1px 0 0 #E9E9E9;
  }
  .lists {
    flex: 1 1 100px;
    background: $role-body-background;
    @include auto-overflow();

    display: flex;
    flex-direction: column;
    .role-row {
      &.empty {
        justify-content: center;
      }
      &:hover {
        background: $table-body-hover-background;
      }
      border-bottom: 1px solid $table-border-color;
    }
  }
}
</style>
