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

export default {
  name: 'text-button',
  props: {
    main: {
      type: Boolean,
      default: false,
    },
    fill: {
      type: Boolean,
      default: false,
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
    disabled: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '',
    },
    // TODO disabled
  },
  components: {
    icon: Icon,
  },
  method: {
  },
  computed: {
    classObj() {
      const ret = {
        main: this.main,
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
$btn-dft-color: #666666;

.text-button {
  width: $btn-dft-width;
  height: $btn-dft-height;
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: $btn-radius;
  padding: 5px 10px;
  color: $btn-dft-color;

  @include click-button();

  background: white;
  color: black;
  border: 1px solid $input-border-color;
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
    opacity: 0.2;
    cursor: no-drop;
    pointer-events: none;
  }

  &.main {
    background: $app-active-color;
    color: $button-blue-text;
    border: none;
    &:hover {
      background: $button-blue-hover;
    }
    &:active {
      color: $button-blue-active-text;
    }
  }
  &.fill {
    width: 100%;
    margin: 0;
    .button-content {
      width: 100%;
      text-align: center;
    }
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
