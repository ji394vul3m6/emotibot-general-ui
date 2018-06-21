<template>
  <div>
    <div class="card h-fill w-fill">
      <nav-bar class='nav-bar' :options="pageOption"></nav-bar>
      <div class="back-button">
        <text-button @click="goUserList">{{ $t('management.go_back') }}</text-button>
      </div>
      <command-row class="commands" :show-search=false>
        <text-button button-type="primary" @click="addRole">{{ $t('management.add_role') }}</text-button>
      </command-row>
      <div class="role-list">
        <div class="role-list-inside">
          <div v-for="role in roles" :key="`${role.uuid}-${role.editMode}`" class="role-card" :class="{'edit-mode': role.editMode}">
            <div class="card-title">
            <template v-if="role.editMode">
              <div class="title-text">
                <input v-model="editName" v-tooltip="nameTooltip" ref='nameInput'>
              </div>
              <div class="title-action">
                <div class="action" @click="closeEditRole(role, false)">{{ $t('general.cancel') }}</div>
                <div class="action" @click="closeEditRole(role, true)"
                  v-if="showSave" >{{ $t('general.save') }}</div>
              </div>
            </template>
            <template v-else>
              <div class="title-text">{{ role.name }}</div>
              <div class="title-action" v-if="!oneInEdit">
                <div class="action" @click="editRole(role)">{{ $t('general.edit') }}</div>
                <div class="action delete" v-tooltip="genRoleDeleteTooltip(role)">{{ $t('general.delete') }}</div>
              </div>
            </template>
            </div>
            <div class="card-content">
              <div v-for="(val, key) in showPrivilegeMap" :key="key" class="priv-col">
                <div class="priv-title">
                  {{ $t(`pages.${key}.module_name`) }}
                </div>
                <div class="priv-list">
                  <template v-if="role.editMode">
                    <template v-for="(cmds, mod) in val">
                      <div v-for="(check, cmd) in cmds" :key="`${mod}-${cmd}`" class="priv-item">
                        <input type="checkbox" :id="`${mod}.${cmd}`" v-model="cmds[cmd]" @change="checkCmdDependency(cmds, cmd === 'view')">
                        <label class="item-text" :for="`${mod}.${cmd}`">
                          {{ $t(`management.privilege.${mod}.${cmd}`) }}
                        </label>
                      </div>
                    </template>
                  </template>
                  <template v-else>
                    <template v-for="(cmds, mod) in val">
                      <div v-for="(check, cmd) in cmds" :key="`${mod}-${cmd}`" class="priv-item"
                        v-if="role.privileges[mod] && role.privileges[mod].indexOf(cmd) >= 0">
                        <icon icon-type="check" :size=8 />
                        <label class="item-text" :for="`${mod}.${cmd}`">
                          {{ $t(`management.privilege.${mod}.${cmd}`) }}
                        </label>
                      </div>
                    </template>
                  </template>
                </div>
              </div>
            </div>
          </div> <!-- end of role-card-->
        </div> <!-- end of role-list-inside-->
      </div> <!-- end of role-list-->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import NavBar from '@/components/NavigationBar';
import modules from '@/modules';
import CommandRow from '../_components/CommandRow';
import roleAPI from '../_api/role';

export default {
  name: 'enterprise-role-list',
  path: 'enterprise-role-list',
  components: {
    NavBar,
    CommandRow,
  },
  api: roleAPI,
  computed: {
    ...mapGetters([
      'enterpriseID',
      'privilegeList',
    ]),
    duplicateIdx() {
      const that = this;
      const ret = that.editName === '' ? -1 : that.roles.map(r => r.name).indexOf(that.editName);
      return ret;
    },
    showSave() {
      const idx = this.roles.findIndex(role => role.editMode);
      const role = this.roles[idx];
      const existedRole = role.uuid !== undefined && role.uuid !== '';
      return this.editName !== '' &&
        ((existedRole && this.duplicateIdx === idx) || this.duplicateIdx < 0);
    },
  },
  watch: {
    duplicateIdx(val) {
      if (this.$refs.nameInput) {
        const idx = this.roles.findIndex(role => role.editMode);
        if (val !== -1 && val !== idx) {
          const event = new Event('tooltip-show');
          this.$refs.nameInput[0].dispatchEvent(event);
        } else {
          const event = new Event('tooltip-hide');
          this.$refs.nameInput[0].dispatchEvent(event);
        }
      }
    },
  },
  data() {
    return {
      pageOption: {
        userList: this.$t('management.privilege_setting'),
      },
      keyword: '',
      roles: [],
      showPrivilegeMap: {},
      privilegeMap: {},
      oneInEdit: false,
      editName: '',
      nameTooltip: {
        msg: this.$t('management.err_role_duplicate'),
        eventOnly: true,
      },
    };
  },
  methods: {
    checkCmdDependency(cmdStatus, isViewChange) {
      const cmds = Object.keys(cmdStatus);
      if (isViewChange) {
        if (!cmdStatus.view) {
          cmds.forEach((cmd) => { cmdStatus[cmd] = false; });
        }
        return;
      }

      if (Object.keys(cmdStatus).indexOf('view') >= 0) {
        const shouldView = cmds.reduce((ret, cmd) => ret || cmdStatus[cmd], false);
        cmdStatus.view = shouldView;
      }
    },
    genRoleDeleteTooltip(role) {
      const that = this;
      return {
        // icon: 'alert',
        msg: that.$t('privileges.check_delete', { role: role.name }),
        data: role,
        left: -150,
        top: 0,
        clickShow: true,
        buttons: [
          {
            msg: that.$t('general.cancel'),
            closeAfterClick: true,
          },
          {
            msg: that.$t('general.ok'),
            callback: that.deleteRole,
            closeAfterClick: true,
            buttonType: 'fill',
          },
        ],
      };
    },
    goUserList() {
      this.$router.push('/manage/enterprise-user-list');
    },
    deleteRole(role) {
      const that = this;
      that.$api.deleteEnterpriseRole(that.enterpriseID, role.uuid).then(() => {
        that.loadRoles();
      });
    },
    addRole() {
      const that = this;

      // always reset edit role
      that.editName = '';
      Object.keys(that.showPrivilegeMap).forEach((key) => {
        Object.keys(that.showPrivilegeMap[key]).forEach((privCode) => {
          const modulePriv = that.showPrivilegeMap[key][privCode];
          Object.keys(modulePriv).forEach((cmd) => {
            modulePriv[cmd] = false;
          });
        });
      });

      if (that.roles.length > 0 && that.roles[0].uuid === '') {
        return;
      }

      that.roles.unshift({
        uuid: '',
        name: '',
        privileges: {},
        editMode: true,
      });
      that.oneInEdit = true;
    },
    editRole(role) {
      const that = this;
      role.editMode = true;
      that.oneInEdit = true;
      that.editName = role.name;

      // set checked property depend on the role privileges
      Object.keys(that.showPrivilegeMap).forEach((key) => {
        Object.keys(that.showPrivilegeMap[key]).forEach((privCode) => {
          const modulePriv = that.showPrivilegeMap[key][privCode];
          Object.keys(modulePriv).forEach((cmd) => {
            modulePriv[cmd] = (role.privileges[privCode] &&
              role.privileges[privCode].indexOf(cmd) >= 0);
          });
        });
      });

      that.$forceUpdate();
    },
    closeEditRole(role, save) {
      const that = this;
      if (save) {
        const privilegeData = {};
        Object.keys(that.showPrivilegeMap).forEach((key) => {
          Object.keys(that.showPrivilegeMap[key]).forEach((privCode) => {
            const modulePriv = that.showPrivilegeMap[key][privCode];
            const commands = [];
            Object.keys(modulePriv).forEach((cmd) => {
              if (modulePriv[cmd]) {
                commands.push(cmd);
              }
            });
            if (commands.length > 0) {
              privilegeData[privCode] = commands;
            }
          });
        });

        that.$emit('startLoading');
        let promise;
        const options = {
          name: that.editName,
          privileges: privilegeData,
        };
        if (role.uuid && role.uuid !== '') {
          promise = that.$api.updateEnterpriseRole(that.enterpriseID, role.uuid, options);
        } else {
          if (that.roles.map(r => r.name).indexOf(that.editName) >= 0) {
            const event = new Event('tooltip-show');
            that.$refs.nameInput[0].dispatchEvent(event);
            that.$emit('endLoading');
            return;
          }
          promise = that.$api.addEnterpriseRole(that.enterpriseID, options);
        }

        promise.then(() => that.loadRoles())
        .finally(() => {
          that.$emit('endLoading');
        });
      } else if (role.uuid === '') {
        that.roles.shift();
      }
      that.oneInEdit = false;
      role.editMode = false;
      that.$forceUpdate();
    },
    loadRoles() {
      const that = this;
      that.$emit('startLoading');
      that.$api.getEnterpriseRoles(that.enterpriseID)
      .then((roles) => {
        that.roles = roles;
        that.roles.forEach((role) => {
          role.editMode = false;
        });
      })
      .finally(() => {
        that.$emit('endLoading');
      });
    },
    setUpModuleList() {
      const that = this;
      that.privilegeList.forEach((privilege) => {
        that.privilegeMap[privilege.code] = privilege.commands;
      });

      const showModules = {};
      Object.keys(modules).forEach((moduleName) => {
        const pageModule = modules[moduleName];
        const privCodes = {};
        Object.keys(pageModule.pages).forEach((pageName) => {
          const page = pageModule.pages[pageName];
          if (page.privCode === 'management') {
            return;
          }
          if (page.privCode && privCodes[page.privCode] === undefined) {
            privCodes[page.privCode] = {};
            that.privilegeMap[page.privCode].forEach((cmd) => {
              privCodes[page.privCode][cmd] = false;
            });
          }
        });
        showModules[pageModule.displayNameKey] = privCodes;
      });
      that.showPrivilegeMap = showModules;
    },
  },
  mounted() {
    this.setUpModuleList();
    this.loadRoles();
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';
.card {
  overflow: hidden;
  position: relative;

  .back-button {
    position: absolute;
    right: 20px;
    top: 20px;
  }

  .nav-bar {
  }
  .commands {
  }
  .role-list {
    height: calc(100% - 128px);
    @include auto-overflow();
    @include customScrollbar();

    display: flex;
    flex-direction: column;
    padding: 0 20px;
    margin-top: 20px;
  }
}

.role-card {
  background-color: #ffffff;
  border: solid 1px #e9e9e9;
  &.edit-mode {
    box-shadow: 0 0 14px 0 rgba(0, 0, 0, 0.2);
  }
  margin-bottom: 20px;

  display: flex;
  flex-direction: column;
  .card-title {
    flex: 0 0 auto;
    padding: 8px 10px;
    background-color: #f8f8f8;
    border: solid 1px #e9e9e9;

    display: flex;
    justify-content: space-between;
    align-items: center;
    .title-text {
      @include font-16px();
    }
    .title-action {
      display: flex;
      .action {
        @include click-button();
        color: #1875f0;
        &.delete {
          color: #f76260;
        }
        &:not(:first-child) {
          margin-left: 12px;
        }
      }
    }
  }
  .card-content {
    flex: 1;
    display: flex;
    @include auto-overflow-X();
    @include customXScrollbar();
    @include font-14px();
    color: #666666;
    .priv-col {
      flex: 1 0 120px;
      display: flex;
      flex-direction: column;
      .priv-title {
        flex: 0 0 auto;
        margin: 0 10px;
        padding: 10px 0;
        border-bottom: solid 1px #e9e9e9;
        color: #666666;
        @include font-14px();
      }
      .priv-list {
        padding: 10px;
        .priv-item {
          display: flex;
          align-items: center;
          white-space: nowrap;
          .item-text {
            margin-left: 5px;
            @include click-button();
          }
        }
      }
    }
  }
}
</style>
