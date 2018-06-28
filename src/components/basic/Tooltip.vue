<template>
  <div class="tooltip" :style="style" :class="{'error': error}" ref="tooltip">
    <div class="tooltip-text" v-if="buttons === undefined || buttons.length <= 0">
      {{ msg }}
    </div>
    <div class="tooltip-form" v-else>
      <div class="tooltip-info">
        <div class="tooltip-icon" v-if="iconType && iconType !== ''">
          <icon :icon-type="iconType" :size=12 />
        </div>
        <div class="tooltip-text">
          {{ msg }}
        </div>
      </div>
      <div class="tooltip-buttons">
        <text-button v-for="button in buttons" :key="button.msg"
          @click="clickButton(button)"
          :button-type="button.buttonType ? button.buttonType : 'default'">
          {{ button.msg }}
        </text-button>
      </div>
    </div>
    <div class="tooltip-triangle" :style="triangleStyle"></div>
  </div>
</template>

<script>
const tooltipTypes = ['default', 'error'];

export default {
  name: 'tooltip',
  props: {
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
    msg: {
      type: String,
      default: '',
    },
    leftOffset: {
      type: Number,
      default: 0,
    },
    topOffset: {
      type: Number,
      default: 0,
    },
    buttons: {
      type: Array,
      default: [],
    },
    tooltipType: {
      type: String,
      default: 'default',
      validator: value => tooltipTypes.indexOf(value) > -1,
    },
    iconType: {
      type: String,
      default: '',
    },
    data: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      show: false,
      showX: 0,
      showY: 0,
      elemWidth: 0,
    };
  },
  computed: {
    style() {
      return {
        top: `${this.showY}px`,
        left: `${this.showX}px`,
        visibility: this.show ? 'visible' : 'hidden',
      };
    },
    triangleStyle() {
      const left = this.leftOffset > 0 ? 0 : (0 - this.leftOffset - 8) + (this.elemWidth / 2);
      return {
        left: `${left}px`,
      };
    },
    error() {
      return this.tooltipType === 'error';
    },
  },
  methods: {
    clickButton(button) {
      const that = this;
      if (button.closeAfterClick) {
        that.show = false;
      }
      if (button.callback) {
        button.callback(that.data);
      }
    },
  },
  mounted() {
    const that = this;

    that.$on('show', (pos) => {
      if (pos) {
        that.x = pos.x;
        that.y = pos.y;
      }
      that.elemWidth = that.$el.clientWidth;
      that.showX = (that.x - that.$el.clientWidth) + that.leftOffset;
      that.showY = (that.y - that.$el.clientHeight - 8) + that.topOffset;
      that.show = true;
    });
    that.$on('hide', () => {
      that.show = false;
    });
  },
};
</script>

<style lang='scss' scoped>
.tooltip {
  position: fixed;
  z-index: 2;
  visibility: hidden;
  word-break: break-all;

  & > .tooltip-text {
    max-width: 172px;
  }
  font-size: 12px;
  line-height: 18px;
  border-radius: 2px;
  color: #FFFFFF;
  background-color: rgba(0, 0, 0, 0.85);
  // box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  padding: 5px 8px;
  cursor: default;

  .tooltip-form {
    background-color: #FFFFFF;
    color: #000000;
    .tooltip-info {
      display: flex;
      .tooltip-icon {
        flex: 0 0 auto;
      } 
      .tooltip-text {
        padding: 10px 0;
        flex: 0 1 180px;
        &:not(:first-child) {
          margin-left: 8px;
        }
      }
    }
    .tooltip-buttons {
      display: flex;

      & > div {
        &:not(:first-child) {
          margin-left: 10px;
        }
      }
    }
  }

  &.error {
    z-index: 1;
    background-color: #FEF3F0;
    border-radius: 4px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    & > .tooltip-text {
      color: #F76260;
    }
    .tooltip-triangle {
      position: absolute;
      left: 25px;
      top: 100%;
      width: 16px;
      height: 16px;
      overflow: hidden;
      &::after{
        content: "";
        background: #FEF3F0;
        position: absolute;
        transform: rotate(45deg);
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
        width: 8px;
        height: 8px;
        top: -4px;
        left: 4px;
      }
    }
  }
}
</style>