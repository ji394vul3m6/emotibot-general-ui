<template>
  <div class="text-button" :style="style" :class="{main: main, 'icon-button': showIcon}" @click="$emit('click', $event)">
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
    height: {
      type: String,
      default: '',
    },
    iconType: {
      type: String,
      default: '',
    },
    // TODO disabled
  },
  components: {
    icon: Icon,
  },
  computed: {
    style() {
      if (this.height !== '') {
        return `height: ${this.height}; line-height: ${this.height}`;
      }
      return '';
    },
    showIcon() {
      return this.iconType.trim() !== '';
    },
  },
};
</script>

<style lang="scss" scoped>
@import "styles/variable";
.text-button {
  background: white;
  color: black;
  border: 1px solid $input-border-color;
  display: inline-block;
  box-sizing: border-box;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;

  padding: 0 10px;
  width: auto;
  border-radius: $input-border-radius;

  height: $default-line-height;
  line-height: $default-line-height;
  margin-right: $line-element-between-width;
  display: inline-flex;

  &.icon-button {
    padding-left: 0;
  }
  & > .button-content {
    margin-top: 1px;
    text-align: center;
  }

  &.main {
    background: $button-blue-bg;
    color: $button-blue-text;
    border: none;
    &:hover {
      background: $button-blue-hover;
    }
    &:active {
      color: $button-blue-active-text;
    }
  }
}
</style>
