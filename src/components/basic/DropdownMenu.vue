<template>
  <div class="context-menu-container" :style="style">
    <div class="context-menu">
      <div v-for="(option, idx) in options" :key="idx" class="menu-option" @click="option.onclick">
        {{ option.text }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'dropdown',
  props: {
    options: {
      type: Array,
      required: true,
      default: () => [],
    },
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
    width: {
      type: String,
      default: '160px',
    },
    alignLeft: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      show: false,
      showX: 0,
      showY: 0,
      clickOutsideListener: undefined,
    };
  },
  computed: {
    style() {
      return {
        top: `${this.showY}px`,
        left: `${this.showX}px`,
        visibility: this.show ? 'visible' : 'hidden',
        width: this.width,
      };
    },
  },
  mounted() {
    const that = this;
    that.$on('show', (pos) => {
      if (pos) {
        that.x = pos.x;
        that.y = pos.y;
      }
      if (that.alignLeft) {
        that.showX = (that.x + 10) - that.$el.clientWidth;
        that.showY = that.y;
      } else {
        that.showX = -10;
        // we keep 10px padding to show box-shadow, shift left for 10px to pretty align elems
        that.showY = that.y;
      }
      that.show = true;

      that.clickOutsideListener = (e) => {
        if (!that.$el.contains(e.target)) {
          that.show = false;
        }
      };
    });
    that.$on('hide', () => {
      that.show = false;
    });
  },
};
</script>
<style lang="scss" scoped>
.context-menu-container {
  position: absolute;
  padding: 10px;
  z-index: 5;
}
.context-menu {
  background-color: $color-white;
  color: $color-font-normal;
  border-radius: 2px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
  .menu-option {
    @include font-14px;
    height: 32px;
    padding: 7px 15px;
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
      background-color: $color-select-hover;
      color: $color-white;
    }
    &:first-child {
      border-top-left-radius: 2px;
      border-top-right-radius: 2px;
    }
    &:last-child {
      border-bottom-left-radius: 2px;
      border-bottom-right-radius: 2px;
    }
  }
}
</style>
