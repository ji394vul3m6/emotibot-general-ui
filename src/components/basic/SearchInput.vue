<template>
  <div class="search-input">
    <input v-model="keyword"
      ref="input"
      :placeholder="$t('general.search_placeholder')"
      @keypress.enter="$emit('search', keyword)"
      @keyup="$emit('input', keyword)">
    <icon icon-type="search" :size=12 />
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

$input-dft-height: 28px;
$input-dft-width: 160px;
$input-radius: 4px;
$input-dft-border: #D9D9D9;

.search-input {
  height: $input-dft-height;
  width: $input-dft-width;
  border-radius: $input-radius;
  padding: 0 8px;

  border: 1px solid $input-dft-border;
  background: white;

  display: flex;
  align-items: center;

  input {
    box-sizing: border-box;
    display: inline-block;
    width: 160px;
    border: none;
    &:focus {
      outline: none;
    }
  }
  ::placeholder {
    color: #CCCCCC;
  }
}
</style>
