<template lang="html">
<div id="node-block" :style="style">
  <div @click="deleteNode">
    X
  </div>
  <div class="label-node-name">
    {{node.description}}
  </div>
  <div class="button-row">
    <text-button
      class="button-edit-node"
      button-type='primary'
      @click="editNode">
      {{$t("general.edit")}}
    </text-button>
  </div>
</div>
</template>

<script>
import NodeEditPage from './NodeEditPage';

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
    initialNode: {
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
    node() {
      if (this.initialNode) {
        return JSON.parse(JSON.stringify(this.initialNode));
      }
      return {};
    },
  },
  watch: {
  },
  methods: {
    onMouseDown(e) {
      // console.log('onMouseDown');
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
      // console.log('onMouseMove');

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
      // console.log('onMouseUp');
      this.moving = false;
    },
    deleteNode() {
      this.$emit('deleteNode');
    },
    editNode() {
      // console.log(this.initialNode);
      const that = this;
      that.$pop({
        title: '对话节点',
        component: NodeEditPage,
        validate: true,
        // customContentClasses: {
        //   width: '80vh;',
        //   height: '80vh;',
        //   'min-width': '80vh;',
        //   'min-height': '80vh;',
        // },
        extData: {
          node: that.initialNode,
        },
        callback: {
          ok: (ner) => {
            that.$emit('addCustomNer', ner);
            that.$nextTick(() => {
              that.categoryToNerTypeMap =
                JSON.parse(JSON.stringify(that.initialCategoryToNerTypeMap));
            });
            that.entityCollector.ner = ner;
          },
        },
      });
    },
    addListeners() {
      document.documentElement.addEventListener('mousemove', this.onMouseMove, false);
      document.documentElement.addEventListener('mousedown', this.onMouseDown, false);
      document.documentElement.addEventListener('mouseup', this.onMouseUp, false);
    },
    removeListeners() {
      document.documentElement.removeEventListener('mousemove', this.onMouseMove, false);
      document.documentElement.removeEventListener('mousedown', this.onMouseDown, false);
      document.documentElement.removeEventListener('mouseup', this.onMouseUp, false);
    },
  },
  beforeMount() {},
  mounted() {
    this.addListeners();
  },
  beforeDestroy() {
    this.removeListeners();
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

#node-block{
  min-width: 230px;
  min-height: 120px;
  background: white;
  position: absolute;
  border: 1px solid $color-borderline;
  border-radius: 10px;
  cursor: move;
}
</style>
