<template lang="html">
  <div id="edges" class="edges">
    <svg class="svg">
      <g class="paths" v-for="p in paths" >
        <path :d="p.data" :style="p.style"></path>
      </g>
      <g class="linking-path" v-if="linkingPath.show === true">
        <path :d="linkingPath.data" :style="linkingPathStyle"></path>
      </g>
    </svg>
  </div>
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
    linkingEdge: {
      type: Object,
      default: [],
    },
  },
  data() {
    return {
      radius: 60,
      halfWidth: 115,
      halfHeight: 60,
      linkingPath: {},
      linkingPathStyle: {
        stroke: 'grey',
        strokeWidth: 5,
        fill: 'none',
      },
    };
  },
  computed: {
    paths() {
      const pathList = [];
      this.edges.forEach((edge) => {
        const data = this.computeData(edge);
        pathList.push({
          data,
          style: edge.style,
        });
      });
      return pathList;
    },
  },
  watch: {
    linkingEdge: {
      handler() {
        this.linkingPath = {
          show: this.linkingEdge.show,
          data: this.computeLinkingPathData(this.linkingEdge),
          style: this.linkingEdge.style,
        };
      },
      deep: true,
    },
  },
  methods: {
    // p
    // |
    // q
    // |
    // c -- r -- s
    computeData(edge) {
      let px = edge.x1;
      let py = edge.y1;
      let sx = edge.x2;
      let sy = edge.y2;

      if (Math.abs(sx - px) <= this.halfWidth) {
        const meanX = (px + sx) / 2;
        px = meanX;
        sx = meanX;
      }
      if (Math.abs(sy - py) <= this.halfHeight) {
        const meanY = (py + sy) / 2;
        py = meanY;
        sy = meanY;
      }

      const qx = px;
      const cx = px;
      let rx = px;

      let qy = sy;
      const cy = sy;
      const ry = sy;

      if (sx > px) {
        rx += this.radius;
      } else if (sx < px) {
        rx -= this.radius;
      }
      if (sy > py) {
        qy -= this.radius;
      } else if (sy < py) {
        qy += this.radius;
      }
      const data = `M ${px} ${py} L ${qx} ${qy} Q ${cx} ${cy}, ${rx} ${ry} L ${sx} ${sy}`;
      return data;
    },
    computeLinkingPathData(edge) {
      const px = edge.x1;
      const py = edge.y1;
      const qx = edge.x2;
      const qy = edge.y2;
      const data = `M ${px} ${py} L ${qx} ${qy}`;
      return data;
    },
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
  position: relative;
  pointer-events: none;
  width: 100%;
  height: 100%;
  .svg{
    width: 100%;
    height: 100%;
  }
}
</style>
