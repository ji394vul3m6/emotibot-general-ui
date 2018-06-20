<template>
  <div class="commands">
    <div class="buttons">
      <slot></slot>
    </div>
    <search-input v-if="showSearch" v-model='keyword' @input="keywordChange"></search-input>
  </div>  
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
      emitTimer: undefined,
    };
  },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
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
};
</script>

<style lang="scss" scoped>
.commands {
  flex: 0 0 auto;
  padding: 0 20px;
  padding-top: 20px;

  display: flex;
  justify-content: space-between;
  .buttons {
    & > div {
      margin-right: 10px;
    }
  }
}
</style>
