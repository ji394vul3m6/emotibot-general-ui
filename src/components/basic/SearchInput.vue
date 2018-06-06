<template>
  <div class="search-input icon-input" :class="{'ie-focus-within': isFocus}">
    <input v-model="keyword"
      ref="input"
      :placeholder="$t('general.search_placeholder')"
      @keypress.enter="$emit('search', keyword)"
      @keyup="$emit('input', keyword)"
      @focus="toggleFocus"
      @blur="toggleFocus">
    <div class="input-icon"> 
      <icon icon-type="search" :size=12 />
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
  },
  data() {
    return {
      keyword: '',
      isFocus: false,
    };
  },
  methods: {
    toggleFocus() {
      this.isFocus = !this.isFocus;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "styles/variable";

$input-height: 28px;

.search-input {
  height: $input-height;
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
