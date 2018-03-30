<template>
  <div>
    <div class="row" :style="{width:width}">
      <span>{{ $t('privileges.role_name') }}</span>
      <input v-model="name" :class="{error: isNameError}" @blur="checkName" ref="nameInput">
      <span v-if="isNameError" class="err-msg">{{ $t('error_msg.input_empty') }}</span>
    </div>
    <div class="spliter"></div>
    <div class="block">
      <div class="row">
        <text-button main @click="setAll(true)">{{ $t('privileges.all_active') }}</text-button>
        <text-button @click="setAll(false)">{{ $t('privileges.all_deactive') }}</text-button>
      </div>
    </div>
    <div class="block">
      <div class="row">
        <div class="cell name"></div>
        <div class="cell" v-for="cmd in cmds" :key="cmd">
          {{ $t(`privileges.actions.${cmd}`) }}
        </div>
      </div>
      <div class="row" v-for="priv in privileges" :key=priv.privilege_id>
        <div class="cell name">{{$t(`privileges.modules.${priv.name}`)}}</div>
        <div class="cell" v-for="cmd in cmds" :key="cmd">
          <template v-if="priv.cmds[cmd] !== undefined">
            <toggle v-model="priv.cmds[cmd]" @input="checkCmdChange(priv, cmd, $event)"></toggle>
          </template>
          <template v-else>
            <div class="ignore"></div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'role-edit-pop',
  props: {
    origData: {
      type: Object,
      default() {
        return { name: '', privileges: undefined };
      },
    },
  },
  data() {
    return {
      name: '',
      privileges: [],
      cmds: [],
      width: 'auto',
      isNameError: false,
    };
  },
  computed: {
    ...mapGetters([
      'privilegeList',
      'privilegeMap',
    ]),
  },
  methods: {
    checkName() {
      this.isNameError = this.name === '';
      if (this.isNameError) {
        this.$emit('disableOK');
        return false;
      }
      this.$emit('enableOK');
      return true;
    },
    checkCmdChange(priv, cmd, e) {
      if (cmd !== 'view' && e === true) {
        if (priv.cmds.view !== undefined) {
          priv.cmds.view = true;
        }
      }
      if (cmd === 'view' && e === false) {
        Object.keys(priv.cmds).forEach((c) => {
          priv.cmds[c] = false;
        });
      }
    },
    setAll(val) {
      this.privileges.forEach((priv) => {
        Object.keys(priv.cmds).forEach((cmd) => {
          priv.cmds[cmd] = val;
        });
      });
    },
    getDefaultPrivilege() {
      const that = this;
      const ret = [];
      that.privilegeList.forEach((priv) => {
        const cmdList = priv.cmd_list.split(',');
        const localPriv = {
          id: priv.privilege_id,
          name: priv.privilege_name,
          cmds: {},
        };
        cmdList.forEach((cmd) => {
          localPriv.cmds[cmd] = false;
        });
        ret.push(localPriv);
      });
      return ret;
    },
    convertPrivilege(apiPrivileges) {
      const that = this;
      const ret = [];
      that.privilegeList.forEach((priv) => {
        const cmdList = priv.cmd_list.split(',');
        const localPriv = {
          id: priv.privilege_id,
          name: priv.privilege_name,
          cmds: {},
        };
        const apiPriv = apiPrivileges[localPriv.id];
        if (apiPriv === undefined) {
          cmdList.forEach((cmd) => {
            localPriv.cmds[cmd] = false;
          });
        } else {
          cmdList.forEach((cmd) => {
            localPriv.cmds[cmd] = apiPriv.indexOf(cmd) >= 0;
          });
        }
        ret.push(localPriv);
      });
      return ret;
    },
    getAllCmds() {
      const cmds = [];
      const that = this;
      that.privilegeList.forEach((priv) => {
        const cmdList = priv.cmd_list.split(',');
        cmdList.forEach((cmd) => {
          if (cmds.indexOf(cmd) < 0) {
            cmds.push(cmd);
          }
        });
      });
      return cmds;
    },
    getCurrentRoleSet() {
      const ret = {
        name: this.name,
        privileges: this.getCurrentPrivilegeSet(),
      };
      return ret;
    },
    getCurrentPrivilegeSet() {
      const ret = {};

      this.privileges.forEach((priv) => {
        const enableCmd = Object.keys(priv.cmds).filter(cmd => priv.cmds[cmd]);
        ret[priv.id] = enableCmd.join(',');
      });

      return ret;
    },
    validate() {
      const that = this;
      if (that.checkName()) {
        that.$emit('validateSuccess', that.getCurrentRoleSet());
      }
    },
  },
  mounted() {
    const that = this;
    that.name = that.origData.name;

    that.cmds = that.getAllCmds();
    if (that.origData.privileges === undefined) {
      that.privileges = that.getDefaultPrivilege();
    } else {
      that.privileges = that.convertPrivilege(that.origData.privileges);
    }
    that.width = `${100 + (that.cmds.length * 80)}px`;

    that.$on('validate', that.validate);
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';
.block {
  margin-top: 20px;
}
.spliter {
  margin-top: 20px;
  border-bottom: 1px solid $area-border-color;
}
.row {
  display: flex;
  align-items: center;
  margin-top: 10px;
  .cell {
    flex: 0 0 80px;

    display: flex;
    align-items: center;
    justify-content: center;
    &.name {
      flex: 0 0 100px;
      // text-overflow: ellipsis;
      // overflow: hidden;
    }
    .ignore {
      border-top: 1px solid black;
      width: 20px;
      display: inline-block;
    }
  }
  input {
    @include general-input();
  }
  .err-msg {
    color: $error-color;
    font-weight: bold;
    margin-left: 10px;
  }
}
</style>
