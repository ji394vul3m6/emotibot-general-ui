<template>
  <div class="popForm">
    <div class="input-row" :style="{width:width}">
      <div class="row-name">{{ $t('privileges.role_name') }}：</div>
      <template v-if="addMode">
        <input v-model="name" 
          :class="{error: isNameError}"
          @blur="checkName"
          :placeholder="$t('privileges.placeholder_input_role_name')"
          ref="nameInput">
        <span v-if="isNameError" class="err-msg">{{ $t('error_msg.input_empty') }}</span>
      </template>
      <template v-else>
        <span class='row-val'>{{name}}</span>
      </template>
    </div>
    <div class="input-row" :style="{width:width}">
      <div class="row-name">{{ $t('privileges.function_priv') }}：</div>
      <div>
        <text-button main @click="setAll(true)">{{ $t('privileges.all_active') }}</text-button>
        <text-button @click="setAll(false)">{{ $t('privileges.all_deactive') }}</text-button>
      </div>
    </div>
    <div class="block">
      <div class="row header">
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
      addMode: false,
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
        const cmdList = priv.commands;
        const localPriv = {
          id: priv.code,
          name: priv.code,
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
        const cmdList = priv.commands;
        const localPriv = {
          id: priv.code,
          name: priv.code,
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
      // note: set normal commands in default, which can
      // controller order of commands
      const cmds = ['view', 'edit', 'create', 'delete', 'import', 'export'];
      const that = this;
      that.privilegeList.forEach((priv) => {
        const cmdList = priv.commands;
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
        ret[priv.id] = enableCmd;
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
    that.addMode = that.origData.addMode;

    that.cmds = that.getAllCmds();
    if (that.origData.privileges === undefined) {
      that.privileges = that.getDefaultPrivilege();
    } else {
      that.privileges = that.convertPrivilege(that.origData.privileges);
    }
    that.width = `${100 + (that.cmds.length * 64)}px`;

    that.$on('validate', that.validate);
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

$role-edit-font-size: 14px;
$role-edit-err-size: 12px;
$role-edit-err-color: $error-color;
$role-edit-block-border-radius: 4px;

.popForm {
  padding: 0 25px;
  font-size: $role-edit-font-size;

  .input-row {
    display: flex;
    flex-direction: column;
    font-size: $role-edit-font-size;
    margin-bottom: 20px;
    .row-name {
      margin-bottom: 10px;
    }
    input {
      @include general-input();
    }
    select {
      @include general-select();
    }
    .err-msg {
      color: $role-edit-err-color;
      font-size: $role-edit-err-size;
      margin-top: 10px;
    }
  }

  .block {
    width: 100%;
    border: 1px solid #D9D9D9;
    border-radius: $role-edit-block-border-radius;
    display: flex;
    flex-direction: column;
    .row {
      display: flex;
      padding: 10px 0;

      &.header {
        padding: 5px 0;
        flex: 0 0 50px;
        display: flex;
        align-items: center;
      }

      .cell {
        flex: 0 0 64px;
        text-align: center;
      }
      .name {
        flex: 0 0 70px;
        text-align: left;
        margin-left: 10px;
      }
      .ignore { 
        border-top: 1px solid black; 
        width: 5px; 
        display: inline-block; 
      }
    }
  }
}
</style>
