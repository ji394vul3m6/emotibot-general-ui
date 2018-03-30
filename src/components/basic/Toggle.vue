<template>
  <div class="toggle-base" v-on:click="toggle" :class="{checked: checked, big: big}">
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
  },
  watch: {
    value(val) {
      this.checked = val;
    },
    checked() {
      if (this.checked !== this.value) {
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
.toggle-base {
  cursor: pointer;
  display: inline-block;
  width: 40px;
  position: relative;
  background: $deactive-color;
  height: 20px;
  border-radius: 14px;
  padding: 3px;

  &.checked {
    background: $active-color;
  }
  transition: background-color 500ms;
  input {
    visibility: hidden;
    &:checked + label {
      left: 23px;
    }
  }
  label {
    display: block;
    position: absolute;
    width: 14px;
    height: 14px;
    background: white;
    top: 3px;
    left: 3px;
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
}
</style>
