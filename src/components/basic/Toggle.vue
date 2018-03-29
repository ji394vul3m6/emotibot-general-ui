<template>
  <div class="toggle-base" v-on:click="toggle">
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
    const now = new Date();
    return {
      id: `toggle_${now.getTime()}`,
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
  background: $active-color;
  width: 60px;
  height: 26px;
  border-radius: 20px;
  position: relative;
  padding: 3px;
  input {
    visibility: hidden;
    &:checked + label {
      left: 36px;
    }
    &::before {
      content: 'ON';
      color: white;
    }
    &::after {
      content: 'OFF';
      color: white;
    }
  }
  label {
    display: block;
    position: absolute;
    width: 20px;
    height: 20px;
    background: white;
    top: 3px;
    left: 3px;
    border-radius: 20px;
    user-select: none;
    cursor: pointer;
    transition: all 0.4s ease;
  }
}
</style>
