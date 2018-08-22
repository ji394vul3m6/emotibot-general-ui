<template lang="html">
<div id="node-block" :style="style">
  <div v-if="node.nodeType !== 'entry'" class="button-delete-node">
    <icon icon-type="delete" :enableHover="true" :size=24 @click="deleteNode()"/>
  </div>
  <div class="node-type-row">
    <div class="label-node-type">
      {{nodeTypeName}}
    </div>
  </div>
  <div class="label-node-name">
    {{node.nodeName}}
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
    nodeTypeName: {
      type: String,
      required: true,
    },
    initialNode: {
      type: Object,
      required: true,
      default: undefined,
    },
    toNodeOptions: {
      type: Array,
      required: true,
      default: undefined,
    },
  },
  data() {
    return {
      node: JSON.parse(JSON.stringify(this.initialNode)),
      lastMouseX: 0,
      lastMouseY: 0,
      canMove: false,
      hasMoved: false,
    };
  },
  computed: {
    style() {
      return {
        top: `${this.y}px`,
        left: `${this.x}px`,
      };
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
        this.canMove = true;
        if (e.preventDefault) e.preventDefault();
      }
    },
    onMouseMove(e) {
      if (!this.canMove) {
        return;
      }
      const mouseX = e.pageX;
      const mouseY = e.pageY;

      const diffX = mouseX - this.lastMouseX;
      const diffY = mouseY - this.lastMouseY;

      this.lastMouseX = mouseX;
      this.lastMouseY = mouseY;

      const left = this.x + diffX;
      const top = this.y + diffY;
      this.hasMoved = true;
      this.$emit('updatePosition', { left, top });
    },
    onMouseUp() {
      if (this.canMove && this.hasMoved) {
        this.$emit('savePosition');
      }
      this.canMove = false;
      this.hasMoved = false;
    },
    deleteNode() {
      this.$emit('deleteNode');
    },
    editNode() {
      const that = this;
      that.$pop({
        title: `${that.node.nodeName}（${that.node.nodeId}）`,
        component: NodeEditPage,
        validate: true,
        extData: {
          node: that.node,
          toNodeOptions: that.toNodeOptions,
        },
        callback: {
          ok: (nodeResult) => {
            console.log(nodeResult);
            this.node = nodeResult;
            this.$emit('saveNode', nodeResult);
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
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 230px;
  min-height: 120px;
  background: white;
  position: absolute;
  border: 1px solid $color-borderline;
  border-radius: 10px;
  cursor: move;
  .button-delete-node{
    position: absolute;
    top: 5px;
    right: 5px;
  }
  .node-type-row{
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 12px 0px 0px 0px;
    .label-node-type{
      height: 24px;
      border: 1px solid $color-borderline;
      border-radius: 2px;
      color: #888888;
      background: #F3F7F9;
      font-size: 14px;
      line-height: 24px;
      padding: 0px 4px 0px 4px;
    }
  }
  .label-node-name{
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: 36px;
    line-height: 36px;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
  }
  .button-row{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 36px;
    .button-edit-node{
      height: 32px;
    }
  }
}
</style>
