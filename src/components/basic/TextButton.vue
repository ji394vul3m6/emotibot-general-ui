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

const buttonTypes = ['default', 'fill', 'primary', 'disable'];

export default {
  name: 'text-button',
  props: {
    buttonType: {
      type: String,
      default: 'default',
      validator: (value) => {
        console.log(value);
        return buttonTypes.indexOf(value) > -1;
      },
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
  watch: {
    buttonType(val) {
      console.log(val);
    },
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
    classObj() {
      const ret = {
        primary: this.primary,
        'icon-button': this.showIcon,
        fill: this.fill,
        disabled: this.disabled,
        'custom-width': this.width !== '',
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
$btn-dft-width: 90px;
$btn-radius: 4px;

$btn-dft-bg-color: white;
$btn-dft-color: #666666;
$btn-dft-border-color: #e9e9e9;

$btn-fill-bg-color: #4b4b64;
$btn-fill-color: #ffffff;

$btn-disable-bg-color: #f7f7f7;
$btn-disable-color: #cccccc;

$btn-primary-bg-color: #1875f0;
$btn-primary-color: #ffffff;

.text-button {
  width: $btn-dft-width;
  height: $btn-dft-height;
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: $btn-radius;
  padding: 5px 10px;
  color: $btn-dft-bg-color;

  @include click-button();

  background: $btn-dft-bg-color;
  color: $btn-dft-color;
  border: 1px solid $btn-dft-border-color;
  box-sizing: border-box;
  white-space: nowrap;

  margin-right: $line-element-between-width;

  &:focus {
    outline: none;
  }
  &:active {
    background: darken(white, 15%); 
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
  }
  &.primary {
    background: $btn-primary-bg-color;
    color: $btn-primary-color;
    border: none;
    &:hover {
      background: $button-blue-hover;
    }
    &:active {
      color: $button-blue-active-text;
    }
  }
  &.fill {
    background: $btn-fill-bg-color;
    color: $btn-fill-color;
  }
  &.custom-width {
    margin: 0;
    .button-content {
      width: 100%;
      text-align: center;
    }
  }

  &.purple {
    background: #4B4B64;
    color: white;
  }
}
</style>
