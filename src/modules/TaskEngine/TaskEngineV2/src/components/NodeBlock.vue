<template lang="html">
<div
  id="node-block"
  :style="style">
  <!-- @mousedown.stop="onMouseDown"
  @mousemove.stop="onMouseMove"
  @mouseup.stop="onMouseUp"> -->
  <div @click="deleteNode">
    X
  </div>
</div>
<!-- @mousemove.stop="onMouseMove" -->
</template>

<script>

export default {
  name: 'node-block',
  components: {},
  props: {
    x: {
      type: Number,
      default: 0,
      validator(val) {
        return typeof val === 'number';
      },
    },
    y: {
      type: Number,
      default: 0,
      validator(val) {
        return typeof val === 'number';
      },
    },
    initialNodeBlock: {
      type: Object,
      required: true,
      default: undefined,
    },
  },
  data() {
    return {
      lastMouseX: 0,
      lastMouseY: 0,
      moving: false,
    };
  },
  computed: {
    style() {
      return {
        top: `${this.y}px`,
        left: `${this.x}px`,
      };
    },
    nodeBlock() {
      if (this.initialNodeBlock) {
        return JSON.parse(JSON.stringify(this.initialNodeBlock));
      }
      return {};
    },
  },
  watch: {
  },
  methods: {
    onMouseDown(e) {
      console.log('onMouseDown');
      // console.log(e.target);
      // console.log(e.currentTarget);
      // console.log(this.$el);
      // e.target.addEventListener('mousemove', this.onMouseMove);
      const mouseX = e.pageX;
      const mouseY = e.pageY;

      this.lastMouseX = mouseX;
      this.lastMouseY = mouseY;

      const target = e.target || e.srcElement;
      if (this.$el.contains(target) && e.which === 1) {
        this.moving = true;
        if (e.preventDefault) e.preventDefault();
      }
    },
    onMouseMove(e) {
      if (!this.moving) {
        return;
      }
      console.log('onMouseMove');

      const mouseX = e.pageX;
      const mouseY = e.pageY;

      const diffX = mouseX - this.lastMouseX;
      const diffY = mouseY - this.lastMouseY;

      this.lastMouseX = mouseX;
      this.lastMouseY = mouseY;

      const left = this.x + diffX;
      const top = this.y + diffY;

      this.$emit('updatePosition', { left, top });
    },
    onMouseUp() {
      console.log('onMouseUp');
      this.moving = false;
    },
    deleteNode() {
      this.$emit('deleteNode');
    },
  },
  beforeMount() {},
  mounted() {
    document.documentElement.addEventListener('mousemove', this.onMouseMove, true);
    document.documentElement.addEventListener('mousedown', this.onMouseDown, true);
    document.documentElement.addEventListener('mouseup', this.onMouseUp, true);
  },
  beforeDestroy() {
    document.documentElement.removeEventListener('mousemove', this.onMouseMove, true);
    document.documentElement.removeEventListener('mousedown', this.onMouseDown, true);
    document.documentElement.removeEventListener('mouseup', this.onMouseUp, true);
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

#node-block{
  width: 200px;
  height: 120px;
  background: grey;
  position: absolute;
}
</style>
