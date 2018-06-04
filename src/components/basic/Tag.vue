<template>
  <span class="tag">
    <slot></slot>
  </span>
</template>
<script>
export default {
};
</script>

<style lang="scss" scoped>
@import "styles/variable";

$tag-dft-background: #eeeeee;
$tag-dft-color: $color-font-normal;
.tag {
  @include font-14px();
  color: $tag-dft-color;
  background-color: $tag-dft-background;
  margin: 0px;
  padding: 3px 5px;
  border-radius: 2px;
  height: 20px;
}
</style>
