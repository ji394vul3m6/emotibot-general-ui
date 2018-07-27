<template>
  <div class="toggle-base" v-on:click="toggle" :class="{checked: checked, big: big, disabled: disabled}">
    <input type="checkbox" :id="id" v-model="checked">
    <label :for="id"></label>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    big: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    value() {
      this.checked = this.value;
    },
    checked(val) {
      if (val !== this.value) {
        this.$emit('input', this.checked);
        this.$emit('change', this.checked);
      }
    },
  },
  methods: {
    toggle() {
      this.checked = !this.checked;
    },
  },
  data() {
    const random = parseInt(Math.random() * 1000, 10);
    return {
      id: `toggle_${random}`,
      checked: false,
    };
  },
  mounted() {
    this.checked = this.value;
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

$toggle-active-color: #3d80ff;
$disabled-active-color: #A7C5FF;
$disabled-deactive-color: #EBEBEB;
.toggle-base {
  cursor: pointer;
  display: inline-block;
  width: 28px;
  position: relative;
  background: $deactive-color;
  height: 14px;
  border-radius: 14px;
  padding: 3px;

  &.checked {
    background: $toggle-active-color;
  }
  transition: background-color 500ms;
  input {
    visibility: hidden;
    &:checked + label {
      left: 15px;
    }
  }
  label {
    display: block;
    position: absolute;
    width: 12px;
    height: 12px;
    background: white;
    top: 1px;
    left: 1px;
    border-radius: 20px;
    user-select: none;
    cursor: pointer;
    transition: all 0.4s ease;
  }
  
  &.big {
    width: 60px;
    height: 26px;
    border-radius: 20px;
    padding: 3px;
    label {
      width: 20px;
      height: 20px;
    }
    input {
      visibility: hidden;
      &:checked + label {
        left: 36px;
      }
    }
  }

  &.disabled{
    cursor: default;
    pointer-events: none;
    background: $disabled-deactive-color;
    &.checked {
      background: $disabled-active-color;
    }
  }
}
</style>
