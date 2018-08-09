<template lang="html">
  <svg id="edges" width="100%" height="100%">
    <g v-for="p in paths" >
      <path :d="p.data" :style="p.style"></path>
    </g>
    <!-- <g>
      <path d="M 0 500 H 1000 500 V 1000 1000" style="stroke: yellow; strokeWidth: 4; fill: 'none';"></path>
    </g> -->
  </svg>
</template>

<script>

export default {
  name: 'scenario-edit-page',
  components: {},
  props: {
    edges: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
    };
  },
  computed: {
    paths() {
      const pathList = [];
      this.edges.forEach((l) => {
        // const d = this.distance(l.x1, l.y1, l.x2, l.y2);
        // const dx = l.x2 - l.x1;
        // const dy = l.y2 - l.y1;
        pathList.push({
          data: `M ${l.x1} ${l.y1} L ${l.x1} ${l.y2} L ${l.x2} ${l.y2}`,
          style: l.style,
          outlineStyle: l.outlineStyle,
        });
      });
      return pathList;
    },
  },
  watch: {},
  methods: {
    distance(x1, y1, x2, y2) {
      return Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
    },
  },
  beforeMount() {},
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

#edges{
}
</style>
