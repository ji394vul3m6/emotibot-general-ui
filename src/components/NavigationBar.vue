<template>
  <div class="nav-bar">
    <div class="tag-container">
      <div class="tag"
        v-for="(text, val) in options" :key=val
        :class="{active: selectedPage === val, 'no-hover': Object.keys(options).length <= 1}"
        @click="clickPage(val)">
        {{text}}
      </div>
    </div>
    <search-input v-if="showSearch" v-model='keyword' @input="keywordChange"></search-input>
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
    showSearch: {
      type: Boolean,
      default: false,
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
      keyword: '',
      emitTimer: undefined,
    };
  },
  methods: {
    clickPage(val) {
      if (Object.keys(this.options).length <= 1) {
        return;
      }
      this.selectedPage = val;
    },
    keywordChange() {
      const that = this;
      if (that.emitTimer) {
        clearTimeout(that.emitTimer);
      }
      that.emitTimer = setTimeout(() => {
        that.$emit('search', that.keyword);
      }, 200);
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
$navbar-active-color: $color-primary;

.nav-bar {
  height: 60px;
  display: flex;
  box-shadow: inset 0 -1px 0 0 $color-borderline;
  justify-content: space-between;
  align-items: center;
  padding-right: 20px;
  .tag-container {
    display: flex;
    .tag {
      color: $color-font-active;
      box-sizing: border-box;
      height: 60px;
      font-size: $navbar-font-size;
      line-height: $navbar-line-height;
      margin-left: 24px;
      display: flex;
      align-items: center;
      padding-bottom: 3px;
      &:first-child{
        margin-left: 18px;
      }
      &.active {
        color: $navbar-active-color;
        border-bottom: 3px solid $navbar-active-color;
        padding-bottom: 0px;
      }
      &:not(.no-hover) {
        @include click-button();
        &:hover {
          color: $navbar-active-color;
        }
      }
    }
  }
}
</style>
