<template>
  <div>
    <iframe ref="iframe" src="/BF/index.html#index"></iframe>
  </div>
</template>

<script>
export default {
  path: 'ssm',
  privCode: 'ssm',
  displayNameKey: 'ssm',
  name: 'ssm',
  isIFrame: true,
  methods: {
    checkIFrameMsg(e) {
      if (e.data === 'open-chat-test') {
        this.$root.$emit('open-chat-test');
      } else if (e.data === 'close-chat-test') {
        this.$root.$emit('close-chat-test');
      }
    },
  },
  mounted() {
    window.addEventListener('message', this.checkIFrameMsg);
  },
  beforeDestroy() {
    window.removeEventListener('message', this.checkIFrameMsg);
  },
};
</script>

<style lang="scss" scoped>
iframe {
  width: calc(100% + 150px);
  height: calc(100% + 50px);
  top: -50px;
  left: -150px;
  position: relative;
}
</style>
