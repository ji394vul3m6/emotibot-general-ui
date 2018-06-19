<template>
  <router-view @startLoading="$emit('startLoading', $event)" @endLoading="$emit('endLoading', $event)"></router-view>
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>

</style>
