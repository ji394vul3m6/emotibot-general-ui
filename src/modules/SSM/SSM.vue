<template>
  <div>
    <iframe ref="iframe" src="/BF/login.html"></iframe>
  </div>
</template>

<script>
export default {
  path: 'ssm',
  privCode: 'ssm',
  displayNameKey: 'ssm',
  name: 'ssm',
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
