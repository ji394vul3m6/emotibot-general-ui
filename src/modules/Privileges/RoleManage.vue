<template>
  <div id='role-manage'>
    <div class="actions row">
      <text-button main icon-type="white_add" @click="popAddRole">{{$t('general.add')}}{{$t('privileges.role')}}</text-button>
      <search-input v-model="keyword"></search-input>
    </div>
    <div class="header row">
      <div class="check"></div>
      <div class="name">{{$t('privileges.role_name')}}</div>
      <!-- <div class="privileges">{{$t('privileges.privileges')}}</div> -->
      <div class="actions">{{$t('general.actions')}}</div>
    </div>
    <div class="lists">
      <template v-if="roles.length > 0">
      <div v-for="role in roles" v-if="role.role_name.indexOf(keyword) !== -1" :key="role.role_id" class='role-row row'>
        <div class="check">
          <!-- <input type="checkbox"> -->
        </div>
        <div class="name">{{role.role_name}}</div>
        <!-- <div class="privileges">
          <div v-for="(actions, privilege) in role.privileges" :key="privilege">
            {{privilegeList[privilege].name}}:
            <span v-for="action in actions" :key="action">{{$t(`privileges.actions.${action}`)}}</span>
          </div>
        </div> -->
        <div class="actions">
          <div class="icon button" @click="popEditRole(role)">
            <icon icon-type="edit"/>
            <div class="tooltip">{{$t('general.edit')}}</div>
          </div>
          <div class="icon button">
            <icon icon-type="delete" @click="deleteRole(role)"/>
            <div class="tooltip">{{$t('general.delete')}}</div>
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
          name: role.role_name,
          privileges: role.privileges,
        },
        validate: true,
        bindValue: false,
        callback: {
          ok(retData) {
            that.$api.updateRole(role.role_id, retData).then(() => {
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
            that.$api.deleteRole(role.role_id).then(() => {
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
        },
        validate: true,
        bindValue: false,
        callback: {
          ok(retData) {
            that.$api.addRole(retData.name, retData.privileges).then(() => {
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
      that.$api.getRoles().then((roles) => {
        that.roles = roles;
      });
    },
  },
  mounted() {
    this.loadRoles();
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
  .row {
    flex: 0 0 auto;
    min-height: $table-row-height;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 10px;

    .check {
      flex: 0 0 50px;
    }
    .name {
      flex: 1 1 100px;
    }
    .privileges {
      flex: 3 1 300px;

      & > div {
        display: inline-block;
        float: left;
        padding: 5px;
        background: $table-header-background;
        margin: 5px;
        margin-left: 0;
        border-radius: 4px;
        span {
          &:not(:last-child):after {
            content: ", ";
          }
        }
      }
    }
    .actions {
      flex: 0 0 90px;
    }
  }
}
</style>
