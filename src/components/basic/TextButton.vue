<template>
  <div class="text-button" :style="style" :class="{main: main}" @click="$emit('click')">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    main: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: '',
    },
  },
  computed: {
    style() {
      if (this.height !== '') {
        return `height: ${this.height}; line-height: ${this.height}`;
      }
      return '';
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

  padding: 0 16px;
  width: auto;
  border-radius: $input-border-radius;

  height: $default-line-height;
  line-height: $default-line-height;
  margin-right: $line-element-between-width;

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
