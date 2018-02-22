<template>
<transition name="slide-in">
  <div class="pop-window" :class="{hidden: !show}" v-on:mousedown="exitPop">
    <div class="pop-content">
      <div class="title" v-if="title">
        <label>{{ title }}</label>
      </div>
      <div v-bind:class="[customContentClasses]" class="content">
        <component v-on:validateSuccess="validatePass"  
          v-on:disableOK="disableOK"
          v-on:enableOK="enableOK"
          :is="currentView" v-model="data" :extData="extData" ref="content"></component>
      </div>
      <div class="pop-button">
        <template v-for="button in custom_button">
          <text-button :main=button.primary
            v-on:click="customClick(button)" :key="button.msg">{{ button.msg }}</text-button>
        </template>
        <text-button main :disable=disable_ok
          v-on:click="click(true)"
          v-if="buttons.indexOf('ok') != -1">{{ ok_msg }}</text-button>
        <text-button main :disable=disable_ok
          v-on:click="click(false)"
          v-if="buttons.indexOf('cancel') != -1">{{ cancel_msg }}</text-button>
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
      if (target.id === 'pop-window' && this.clickOutsideClose) {
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
      this.show = true;
      this.title = option.title;
      this.buttons = option.buttons || ['ok', 'cancel'];
      this.ok_msg = option.ok_msg || this.dft_ok_msg;
      this.cancel_msg = option.cancel_msg || this.dft_cancel_msg;
      this.data = option.data;
      this.extData = option.extData || {};
      this.currentView = option.component;
      this.validate = option.validate;
      this.disable_ok = option.disable_ok || false;
      this.custom_button = option.custom_button || [];
      this.clickOutsideClose = option.clickOutsideClose !== false;
      if (option.callback) {
        this.callOk = option.callback.ok;
        this.callCancel = option.callback.cancel;
      } else {
        this.callOk = undefined;
        this.callCancel = undefined;
      }
      if (option.customContentClasses !== undefined) {
        this.customContentClasses = option.customContentClasses;
      } else {
        this.customContentClasses = [];
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
    };
  },
};
</script>

<style lang="scss" scoped>
@import "styles/variable";

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
      min-height: 70%;
    }
  }
  &.slide-in-enter-to, &.slide-in-leave {
    .pop-content {
      margin-top: 0;
      opacity: 1;
      height: auto;
    }
  }

  .pop-content {
    // animation-name: showup;
    // animation-duration: 0.5s;

    background: white;
    min-width: 300px;
    max-width: 90%;
    max-height: 90vh;

    display: flex;
    flex-direction: column;
    
    align-items: center;
    justify-content: left;

    border: 1px solid black;

    & > .title {
      width: 100%;
      & > label {
        display: inline-block;
        max-width: 600px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      height: 40px;
      background: $page-header-color;
      color: white;
      box-sizing: border-box;
      padding: 10px;
    }

    & > .content {
      min-height: 30px;
      max-height: calc(90vh - #{2 * 30px});
      padding: 20px;
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
      padding: 20px;
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
