<template>
<transition name="slide-in">
  <div class="pop-window" :class="{hidden: !show}" v-on:mousedown="exitPop">
    <div class="pop-content">
      <div class="title" v-if="title">
        <label>{{ title }}</label>
      </div>
      <div v-bind:class="[customContentClasses]" class="content">
        <component v-if="bindValue === true" v-on:validateSuccess="validatePass"  
          v-on:disableOK="disableOK"
          v-on:enableOK="enableOK"
          :is="currentView" v-model="data" :extData="extData" ref="content"></component>
        <component v-else v-on:validateSuccess="validatePass"  
          v-on:disableOK="disableOK"
          v-on:enableOK="enableOK"
          :is="currentView" :origData="data" :extData="extData" ref="content"></component>
      </div>
      <div class="pop-button">
        <template v-for="button in custom_button">
          <text-button :main=button.primary
            v-on:click="customClick(button)" :key="button.msg">{{ button.msg }}</text-button>
        </template>
        <text-button
          v-on:click="click(false)"
          ref="cancelBtn"
          v-if="buttons.indexOf('cancel') != -1">{{ cancel_msg }}</text-button>
        <text-button :disabled=disable_ok
          color="purple"
          v-on:click="click(true)"
          ref="okBtn"
          v-if="buttons.indexOf('ok') != -1">{{ ok_msg }}</text-button>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import TextButton from '../basic/TextButton';

export default {
  name: 'pop-window',
  components: {
    TextButton,
  },
  methods: {
    exitPop(e) {
      const target = e.target;
      if (target.className === 'pop-window' && this.clickOutsideClose) {
        this.click(false);
      }
    },
    customClick(button) {
      if (button.callback) {
        button.callback();
      }

      if (button.closeAfterClick) {
        this.show = false;
        this.currentView = undefined;
      }
    },
    click(ok = true) {
      if (!ok) {
        this.show = false;
        this.currentView = undefined;
        this.$root.$emit('close-window', this);
        if (this.callCancel && typeof this.callCancel === 'function') {
          this.callCancel.call(this, this.data);
        }
      }

      if (ok && !this.disable_ok) {
        if (this.validate) {
          this.$refs.content.$emit('validate');
        } else {
          this.validatePass();
        }
      }
    },
    validatePass(customData) {
      this.show = false;
      this.currentView = undefined;
      this.$root.$emit('close-window', this);
      if (this.callOk && typeof this.callOk === 'function') {
        if (customData) {
          this.callOk.call(this, customData);
        } else {
          this.callOk.call(this, this.data);
        }
      }
    },
    showWindow(option) {
      const that = this;
      that.show = true;
      that.title = option.title;
      that.buttons = option.buttons || ['ok', 'cancel'];
      that.ok_msg = option.ok_msg || that.dft_ok_msg;
      that.cancel_msg = option.cancel_msg || that.dft_cancel_msg;
      that.data = option.data;
      that.extData = option.extData || {};
      that.currentView = option.component;
      that.validate = option.validate;
      that.disable_ok = option.disable_ok || false;
      that.custom_button = option.custom_button || [];
      that.clickOutsideClose = option.clickOutsideClose !== false;
      that.bindValue = option.bindValue !== false;
      if (option.callback) {
        that.callOk = option.callback.ok;
        that.callCancel = option.callback.cancel;
      } else {
        that.callOk = undefined;
        that.callCancel = undefined;
      }
      if (option.customContentClasses !== undefined) {
        that.customContentClasses = option.customContentClasses;
      } else {
        that.customContentClasses = [];
      }
    },
    hideWindow() {
      this.click(false);
    },
    enableOK() {
      this.disable_ok = false;
    },
    disableOK() {
      this.disable_ok = true;
    },
  },
  data() {
    return {
      show: false,
      dft_ok_msg: this.$t('general.ok'),
      dft_cancel_msg: this.$t('general.cancel'),
      buttons: ['ok', 'cancel'],
      title: '',
      currentView: undefined,
      data: {},
      callOk: undefined,
      callCancel: undefined,
      extData: {},
      disable_ok: false,
      ok_msg: 'ok',
      cancel_msg: 'cancel',
      custom_button: [],
      customContentClasses: [],
      clickOutsideClose: true,
      bindValue: true,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "styles/variable";

$pop-title-font-size: 20px;
$pop-title-font-color: #333333;

@keyframes showup {
  from {
    margin-top: -20px;
    opacity: 0;
    min-height: 70%;
  }
  to {
    margin-top: 0;
    opacity: 1;
    height: auto;
  }
}

.pop-window {
  &.hidden {
    visibility: hidden;
  }

  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0%, 0%, 0%, 0.6);
  height: 100%;
  width: 100%;
  z-index: 100;

  display: flex;
  align-items: center;
  justify-content: center;
  &.slide-in-enter-active, &.slide-in-leave-active {
    transition: all 0.25s ease-in;
    .pop-content {
      transition: all 0.25s ease-in;
    }
  }
  &.slide-in-enter, &.slide-in-leave-to {
    .pop-content {
      margin-top: -20px;
      opacity: 0;
    }
  }
  &.slide-in-enter-to, &.slide-in-leave {
    .pop-content {
      margin-top: 0;
      opacity: 1;
    }
  }

  .pop-content {
    // animation-name: showup;
    // animation-duration: 0.5s;

    background: white;
    // min-width: 300px;
    max-width: 90%;
    max-height: 90vh;

    display: flex;
    flex-direction: column;
    
    align-items: center;
    justify-content: left;
    box-shadow: 0 0 18px 0 rgba(0,0,0,0.24);
    border-radius: 4px;
    padding: 5px;

    & > .title {
      line-height: $pop-title-font-size;
      font-size: $pop-title-font-size;
      padding: 25px;

      width: 100%;
      & > label {
        display: inline-block;
        max-width: 600px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    & > .content {
      min-height: 30px;
      max-height: calc(90vh - #{2 * 30px});
      // padding: 20px;
      box-sizing: border-box;
      width: 100%;
      overflow: auto;
    }

    & > .visible-overflow {
      overflow: visible;
    }

    .pop-button {
      text-align: right;
      width: 100%;
      padding: 25px;
      padding-top: 0px;
      box-sizing: border-box;

      .text-button {
        width: auto;
      }
    }
  }

  & div.loading {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
    background: rgba(0%, 0%, 0%, 0.6);
    color: white;
    display: flex;
      align-items: center;
      justify-content: center;
  }
}
</style>
