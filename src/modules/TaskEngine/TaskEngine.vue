<template>
  <div id="task-engine">
    <iframe ref="iframe" src="/BF/scenario/scenario.html"></iframe>
  </div>
</template>

<script>
export default {
  path: 'task-engine-scenario',
  privCode: 'task-engine',
  displayNameKey: 'task_engine_scenario',
  icon: 'white_task_engine',
  name: 'task-engine-scenario',
  data() {
    return {};
  },
  methods: {
    reload() {
      this.$refs.iframe.setAttribute('src', '/BF/scenario/scenario.html');
    },
  },
  activated() {
    this.$refs.iframe.setAttribute('src', '/BF/scenario/scenario.html');
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
#task-engine {
  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
