<template>
  <div class="search-input icon-input" :class="{'ie-focus-within': isFocus, fill: fill, flex: flex}">
    <input v-model="keyword"
      ref="input"
      :placeholder="$t('general.search_placeholder')"
      @keypress.enter="$emit('search', keyword)"
      @keyup="$emit('input', keyword)"
      @focus="toggleFocus"
      @blur="toggleFocus">
    <div class="input-icon"> 
      <icon icon-type="search" :size=16 />
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
    fill: {
      type: Boolean,
      required: false,
      default: false,
    },
    flex: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      keyword: '',
      isFocus: false,
    };
  },
  watch: {
    value() {
      this.keyword = this.value;
    },
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

$input-height: 30px;

.search-input {
  display: inline-flex;
  height: $input-height;
  &.fill {
    width: 100%;
    display: flex;

    input {
      display: block;
      flex: 1;
      width: auto;
    }
    .input-icon {
      flex: 0 0 auto;
    }
  }
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
