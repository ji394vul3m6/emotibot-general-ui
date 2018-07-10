<template>
  <div id="error-alert">
    <div class="main">{{ value.msg }}</div>
    <div class="info">{{ value.info }}</div>
  </div>  
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style lang="scss" scoped>
#error-alert{
  padding: 20px;
}
</style>