<template>
  <div ref="infoInput" class="info-input icon-input" :class="{'ie-focus-within': isFocus, fill: fill, flex: flex, disabled: disabled, error: error}" v-tooltip="errorTooltip">
    <input v-model="text"
      ref="input"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
      :type="type"
      :autocomplete="autocomplete"
      @keyup="$emit('input', text)"
      @focus="toggleFocus(true)"
      @blur="toggleFocus(false)">
    <div ref="infoIcon" class="input-icon info-icon" 
      v-tooltip="infoTooltip"
      @mouseover="toggleHover(true)"
      @mouseout="toggleHover(false)">
      <icon v-if="isHover" icon-type="info_hover" :size=16 />
      <icon v-else icon-type="info" :size=16 />
    </div> 
  </div>
</template>


<script>
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: false,
      default: 'text',
    },
    fill: {
      type: Boolean,
      required: false,
      default: false,
    },
    flex: {
      type: Boolean,
      required: false,
      default: false,
    },
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    maxlength: {
      type: Number,
      required: false,
    },
    error: {
      type: Boolean,
      required: false,
      default: false,
    },
    errorMsg: {
      type: String,
      required: false,
      default: '',
    },
    msg: {
      type: String,
      required: true,
      default: '',
    },
    autocomplete: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      text: '',
      isFocus: false,
      isHover: false,
      errorTooltip: {
        msg: '',
        eventOnly: true,
        errorType: true,
        alignLeft: true,
      },
    };
  },
  computed: {
    infoTooltip() {
      const msg = this.msg;
      return {
        msg,
        top: 0,
        alignLeft: true,
      };
    },
  },
  watch: {
    value() {
      this.text = this.value;
    },
    errorMsg() {
      const that = this;
      that.errorTooltip.msg = that.errorMsg;
      that.$refs.infoInput.dispatchEvent(new Event('tooltip-reload'));
    },
    error() {
      const that = this;
      if (that.error) {
        that.$refs.infoInput.dispatchEvent(new Event('tooltip-show'));
        // reposition info tooltip
        that.infoTooltip.top = 30 + 30 + 8; // inputHeight + tooltipHeight + padding
        that.$refs.infoIcon.dispatchEvent(new Event('tooltip-reload'));
      } else {
        that.$refs.infoInput.dispatchEvent(new Event('tooltip-hide'));
         // reposition info tooltip
        that.infoTooltip.top = 0;
        that.$refs.infoIcon.dispatchEvent(new Event('tooltip-reload'));
      }
    },
  },
  methods: {
    focus() {
      this.$refs.input.focus();
      this.toggleFocus(true);
    },
    toggleFocus(bool) {
      this.isFocus = bool;
    },
    toggleHover(bool) {
      this.isHover = bool;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "styles/variable";

$input-height: 30px;

.info-input {
  height: $input-height;
  display: inline-flex;
  &.fill {
    width: 100%;
    display: flex;

    input {
      display: block;
      flex: 1;
      width: auto;
    }
    .input-icon {
      flex: 0 0 auto;
    }
  }

  .info-icon {
    &:hover {
      cursor: pointer;
    }
  }
}
input {
  outline: none;
  background: transparent;
}

/* workaround of focus-within of IE*/
.ie-focus-within {
  outline: none;
  box-shadow: 0 0 0 2px rgba(75, 75, 100, 0.2);
  border-color: $color-borderline-hover;
}
</style>
