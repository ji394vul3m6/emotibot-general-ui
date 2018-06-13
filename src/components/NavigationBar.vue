<template>
  <div class="nav-bar">
    <div class="tag"
      v-for="(text, val) in options" :key=val
      :class="{active: selectedPage === val}"
      @click="clickPage(val)">
      {{text}}
    </div>
  </div>  
</template>

<script>
export default {
  name: 'nav-bar',
  props: {
    options: {
      type: Object,
      default: {},
      required: true,
    },
    value: {
      default: '',
    },
  },
  watch: {
    selectedPage(val) {
      this.$emit('input', val);
    },
  },
  data() {
    return {
      selectedPage: '',
    };
  },
  methods: {
    clickPage(val) {
      if (Object.keys(this.options).length <= 1) {
        return;
      }
      this.selectedPage = val;
    },
  },
  mounted() {
    this.selectedPage = this.value;
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

$navbar-font-size: 16px;
$navbar-line-height: 18px;
$navbar-active-color: #1875f0;

.nav-bar {
  height: 60px;
  display: flex;
  align-items: flex-end;
  box-shadow: inset 0 -1px 0 0 #e9e9e9;
  .tag {
    @include click-button();
    font-size: $navbar-font-size;
    line-height: $navbar-line-height;
    padding-bottom: 14px;
    margin-left: 18px;
    &.active {
      color: $navbar-active-color;
      border-bottom: 3px solid $navbar-active-color;
      padding-bottom: 11px;
    }
  }
}
</style>
