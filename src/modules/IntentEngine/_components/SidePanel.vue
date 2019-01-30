<template>
<div id="side-panel">
  <text-button :height="'40px'" @click="toPage('')">train</text-button>
  <text-button :height="'40px'" @click="toPage('test')">to test page</text-button>
  <text-button :height="'40px'" @click="toPage('')">test</text-button>
  <text-button :height="'40px'" @click="toPage('test/records')">to test records</text-button>
</div>
</template>
<script>

export default {
  name: 'side-panel',
  components: {},
  props: {
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    toPage(path) {
      this.$router.push(`/intent-manage/${path}`);
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
#side-panel{
  display: flex;
  flex-direction: column;
  min-width: 270px;
  border-radius: 4px;
  border-left: 1px solid $color-borderline-disabled;
}
</style>
