<template>
  <div class="text-button"
    tabindex="0"
    :style="style"
    :class="classObj"
    @click="$emit('click', $event)"
    @keyup.enter="$emit('click', $event)">
    <icon :icon-type="iconType" v-if="showIcon"></icon>
    <div class="button-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Icon from './Icon';

const buttonTypes = ['default', 'fill', 'primary', 'disable', 'error'];

export default {
  name: 'text-button',
  props: {
    buttonType: {
      type: String,
      default: 'default',
      validator: value => buttonTypes.indexOf(value) > -1,
    },
    width: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '',
    },
    iconType: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
  },
  mounted() {
  },
  components: {
    icon: Icon,
  },
  method: {
  },
  computed: {
    primary() {
      return this.buttonType === 'primary';
    },
    fill() {
      return this.buttonType === 'fill';
    },
    default() {
      return this.buttonType === 'default';
    },
    disabled() {
      return this.buttonType === 'disable';
    },
    error() {
      return this.buttonType === 'error';
    },
    classObj() {
      const ret = {
        primary: this.primary,
        'icon-button': this.showIcon,
        fill: this.fill,
        disabled: this.disabled,
        error: this.error,
        'custom-width': this.width !== '',
        'font-lg': parseInt(this.height.replace('px', ''), 10) >= 40,
      };
      if (this.color !== '') {
        ret[this.color] = true;
      }
      return ret;
    },
    style() {
      let style = '';
      if (this.height !== '') {
        style += `height: ${this.height}; line-height: ${this.height};`;
      }
      if (this.width !== '') {
        style += `width: ${this.width}`;
      }
      return style;
    },
    showIcon() {
      return this.iconType.trim() !== '';
    },
  },
};
</script>

<style lang="scss" scoped>
@import "styles/variable";

$btn-dft-height: 28px;
$btn-dft-width: 68px;
$btn-radius: 2px;

$btn-dft-bg-color: $color-white;
$btn-dft-color: $color-font-normal;
$btn-dft-border-color: $color-borderline;

$btn-fill-bg-color: $color-button;
$btn-fill-color: $color-white;

$btn-disable-bg-color: $color-disabled;
$btn-disable-color: $color-font-disabled;

$btn-primary-bg-color: $color-primary;
$btn-primary-color: $color-white;

$btn-error-bg-color: $color-error;
$btn-error-color: $color-white;

.text-button {
  @include font-12px();
  width: $btn-dft-width;
  height: $btn-dft-height;
  box-sizing: border-box;
  padding: 5px 10px;

  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  
  background: $btn-dft-bg-color;
  color: $btn-dft-color;
  border: 1px solid $btn-dft-border-color;
  border-radius: $btn-radius;
  white-space: nowrap;

  @include click-button();
  @include button-active-background($color-white);
  &:focus {
    outline: none;
  }
  &:hover {
    background: $btn-disable-bg-color;
  }
  
  &.font-lg {
    @include font-14px();
  }

  &.icon-button {
    padding-left: 0;
  }
  & > .button-content {
    text-align: center;
  }

  &.disabled {
    background: $btn-disable-bg-color;
    color: $btn-disable-color;
    user-select: none;
    cursor: not-allowed;
    &:hover {
      opacity: 1;
    }
  }
  &.primary {
    @include button-hover-opacity();
    @include button-active-background($btn-primary-bg-color);
    background: $btn-primary-bg-color;
    color: $btn-primary-color;
    border: none;
  }
  &.fill {
    @include button-hover-opacity();
    @include button-active-background($btn-fill-bg-color);
    background: $btn-fill-bg-color;
    color: $btn-fill-color;
    border: none;
  }
  &.error {
    @include button-hover-opacity();
    @include button-active-background($btn-error-bg-color);
    background: $btn-error-bg-color;
    color: $btn-error-color;
    border: none;
  }
  &.custom-width {
    margin: 0;
    .button-content {
      width: 100%;
      text-align: center;
    }
  }
}
</style>
