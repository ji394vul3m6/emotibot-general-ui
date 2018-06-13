<template>
  <div class="commands">
    <div class="buttons">
      <slot></slot>
    </div>
    <search-input v-if="showSearch" v-model='keyword'></search-input>
  </div>  
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
    };
  },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    keyword(word) {
      this.$emit('search', word);
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
