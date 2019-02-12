<template>
  <div id="download-link-column" @click="linkClicked()">
    <icon :size=18 icon-type="more_blue"/>
    <span class="text">{{linkData.text}}</span>
  </div>
</template>
<script>

export default {
  data() {
    return {};
  },
  watch: {},
  methods: {
    linkClicked() {
      this.linkData.onclick();
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
#download-link-column {
  display: flex;
  align-items: center;
  cursor: pointer;
  .text{
    margin-left: 10px;
    @include font-14px();
    color: $color-primary;
  }
}
</style>