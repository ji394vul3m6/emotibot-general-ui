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
      class="button button-edit-node"
      button-type='primary'
      @click="editNode()">
      {{$t("general.edit")}}
    </text-button>
    <text-button
      v-if="node.nodeType !== 'entry'"
      class="button button-copy-node"
      button-type='primary'
      @click="copyNode()">
      {{$t("general.copy")}}
    </text-button>
    <div class="warning-icon"
      ref="exitIcon"
      v-if="hasExitConnection"
      v-tooltip="{ msg: $t('task_engine_v2.warnings.has_exit_connection')}">
      <img class="exit-icon"
        src="/static/images/exit_icon.png"
        width="32px">
      </img>
    </div>
    <div class="warning-icon"
      ref="warningIcon"
      v-if="warningTooltipValue.msgs && warningTooltipValue.msgs.length > 0"
      v-tooltip="warningTooltipValue">
      <icon icon-type="info_warning" :size=22></icon>
    </div>
  </div>
  <div class="edge-slot edge-slot-from"
    id="edgeSlotFrom"
    ref="edgeSlotFrom"
    v-if="linking === false || isSrcNode === true"
    :class="{'is-src-node': isSrcNode}"
    @mousedown.prevent="srcSlotMouseDown($event)">
  </div>
  <div class="edge-slot edge-slot-to"
    id="edgeSlotTo"
    v-if="linking === true && isSrcNode === false"
    @mousedown="">
  </div>
</div>
</template>

<script>
import NodeEditPage from './NodeEditPage';
import optionConfig from '../_utils/optionConfig';

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
    globalVarOptionsMap: {
      type: Object,
      required: true,
      default: undefined,
    },
    linking: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      node: {},
      lastMouseX: 0,
      lastMouseY: 0,
      canMove: false,
      hasMoved: false,
      hasExitConnection: false,
      warningTooltipValue: {},
      warningMsgMap: {},
      isSrcNode: false,
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
      const target = e.target || e.srcElement;
      if (target.id === 'edgeSlotFrom' || target.id === 'edgeSlotTo') {
        return;
      }
      const mouseX = e.pageX;
      const mouseY = e.pageY;
      this.lastMouseX = mouseX;
      this.lastMouseY = mouseY;

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
      this.isSrcNode = false;
    },
    srcSlotMouseDown(e) {
      this.isSrcNode = true;
      const edgeSlotFrom = this.$refs.edgeSlotFrom;
      const x = edgeSlotFrom.offsetLeft + edgeSlotFrom.offsetParent.offsetLeft + 8;
      const y = edgeSlotFrom.offsetTop + edgeSlotFrom.offsetParent.offsetTop + 8;
      const slot = { x, y };
      this.$emit('linkingStart', slot);
      if (e.preventDefault) e.preventDefault();
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
        cancelValidate: true,
        extData: {
          node: that.node,
          toNodeOptions: that.toNodeOptions,
          globalVarOptionsMap: that.globalVarOptionsMap,
        },
        callback: {
          ok: (nodeResult) => {
            this.node = nodeResult;
            this.$emit('saveNode', nodeResult);
          },
        },
      });
    },
    copyNode() {
      this.$emit('copyNode');
    },
    renderData() {
      this.node = JSON.parse(JSON.stringify(this.initialNode));
      this.renderWarnings();
    },
    propNode(newNode) {
      this.node = JSON.parse(JSON.stringify(newNode));
      this.renderWarnings();
    },
    renderWarnings() {
      if (!this.node.warnings || !(this.node.warnings instanceof Array)) return;
      const warningMsgs = [];
      this.hasExitConnection = false;
      this.node.warnings.forEach((w) => {
        if (w.type === 'has_exit_connection') {
          this.hasExitConnection = true;
        } else {
          const msg = this.warningMsgMap[w.type];
          warningMsgs.push(msg);
        }
      });
      this.warningTooltipValue.msgs = warningMsgs;

      // reload
      if (this.$refs.warningIcon) {
        this.$refs.warningIcon.dispatchEvent(new Event('tooltip-reload'));
      }
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
  beforeMount() {
    this.warningMsgMap = optionConfig.getWarningMsgMap(this);
    this.renderData();
  },
  mounted() {
    this.$on('propNode', this.propNode);
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
  width: 230px;
  height: 120px;
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
    .button{
      height: 32px;
    }
    .button-copy-node{
      margin: 0px 0px 0px 3px;
    }
    .exit-icon{
      margin: 0px 0px 0px 3px;
    }
  }
  .edge-slot{
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  .edge-slot-from{
    position: absolute;
    bottom: -8px;
    left: 107px;
    &:hover{
      border: 2px solid grey;
      border-radius: 100%;
    }
  }
  .is-src-node {
    background: grey;
    border: 2px solid grey;
    border-radius: 100%;
  }
  .edge-slot-to{
    position: absolute;
    top: -8px;
    left: 107px;
    border: 2px solid grey;
    border-radius: 100%;
    &:hover{
      background: grey;  
    }
  }
}
</style>
