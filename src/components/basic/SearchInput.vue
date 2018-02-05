<template>
  <div class="search-input">
    <div class="icon" @click="$refs.input.focus()">
      <div class="searchIcon"></div>
    </div>
    <input v-model="keyword"
      ref="input"
      @keypress.enter="$emit('search', keyword)"
      @keyup="$emit('input', keyword)">
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      keyword: '',
    };
  },
};
</script>

<style lang="scss" scoped>
@import "styles/variable";

.search-input {
  height: $default-line-height;
  line-height: $default-line-height;
  margin-right: $line-element-between-width;
  border: 1px solid $input-border-color;
  border-radius: $input-border-radius;
  background: white;
  vertical-align: middle;

  display: flex;

  input {
    box-sizing: border-box;
    display: inline-block;
    border: none;
    &:focus {
      outline: none;
    }
  }
}
</style>
