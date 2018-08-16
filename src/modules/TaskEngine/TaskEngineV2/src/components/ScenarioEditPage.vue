<template lang="html">
<div id="scenario-edit-page" @wheel="onPageWheel()">
  <div class="browse-window" ref="window">
    <div class="canvas-page"
      ref="page"
      :style="canvasStyle"
      @drop="nodeOptionDrop($event)"
      @dragover="nodeOptionDragOver($event)">
      <edges :edges="filteredEdges"></edges>
      <template v-for="(node, index) in nodes">
        <node-block
          :x="node.x"
          :y="node.y"
          :initialNode="node.data"
          :toNodeOptions="toNodeOptions"
          @updatePosition="updateNodePosition(index, $event)"
          @savePosition="saveNodePosition(index)"
          @deleteNode="deleteNode(index)"
          @saveNode="saveNode(index, $event)">
        </node-block>
      </template>
    </div>
  </div>
  <div class="side-panel">
    <label-switch class="panel-tabs" :options="panelTabOptions" @change=""/>
    <template v-for="(nodeOption, index) in nodeOptions">
      <div class="node-option"
        :class="{ 'odd-option': index % 2 === 0 }"
        draggable="true"
        @dragstart="nodeOptionDragStart(nodeOption.type, $event);">
        <div class="node-name">{{nodeOption.name}}</div>
      </div>
    </template>
  </div>
</div>
</template>

<script>
import taskEngineApi from '@/modules/TaskEngine/_api/taskEngine';
import general from '@/modules/TaskEngine/_utils/general';
import NodeBlock from './NodeBlock';
import Edges from './Edges';

export default {
  name: 'scenario-edit-page',
  components: {
    'node-block': NodeBlock,
    edges: Edges,
  },
  data() {
    return {
      moduleData: {},
      moduleDataLayout: {},
      nodes: [],
      edges: [],
      panelTabOptions: this.getPanelTabOptions(),
      nodeOptions: this.getNodeOptions(),
      canvasWidth: 2000,
      canvasHeight: 2000,
      rainbowColors: this.getRainbowColors(),
    };
  },
  computed: {
    idToNode() {
      const map = {};
      this.nodes.forEach((node) => {
        map[node.data.node_id] = node;
      });
      return map;
    },
    toNodeOptions() {
      const options = [];
      Object.keys(this.idToNode).forEach((key) => {
        const node = this.idToNode[key];
        const nodeName = node.data.description;
        const nodeType = node.data.node_type || '';
        if (nodeType !== 'entry') {
          options.push({
            text: `${nodeName} (ID: ${key})`,
            value: key,
          });
        }
      });
      return options;
    },
    allEdges() {
      const edgeList = [];
      Object.keys(this.idToNode).forEach((key) => {
        const node = this.idToNode[key];
        node.data.edges.forEach((edge) => {
          if (!edge.to_node_id) return;
          if (!this.idToNode[edge.to_node_id]) return;

          edgeList.push({
            from_id: node.data.node_id,
            to_id: edge.to_node_id,
            edge_type: edge.edge_type,
          });
        });
      });
      return edgeList;
    },
    filteredEdges() {
      return this.allEdges.filter(edge =>
        edge.edge_type !== 'hidden' &&
        edge.from_id !== '0' &&
        edge.to_id !== '0' &&
        edge.from_id !== edge.to_id,
      ).map((edge, index) => ({
        x1: this.idToNode[edge.from_id].x + 115,
        y1: this.idToNode[edge.from_id].y + 60,
        x2: this.idToNode[edge.to_id].x + 115,
        y2: this.idToNode[edge.to_id].y + 60,
        style: {
          stroke: this.rainbowColors[index % this.rainbowColors.length],
          strokeWidth: 4,
          fill: 'none',
        },
      }));
    },
    canvasStyle() {
      return {
        width: `${this.canvasWidth}px`,
        height: `${this.canvasHeight}px`,
      };
    },
  },
  watch: {},
  methods: {
    loadScenario(scenarioId) {
      return taskEngineApi.loadScenario(scenarioId).then((data) => {
        this.moduleData = JSON.parse(data.result.editingContent);
        this.moduleDataLayouts = JSON.parse(data.result.editingLayout);
        window.moduleData = this.moduleData;
        window.moduleDataLayouts = this.moduleDataLayouts;
        this.scenarioName = this.moduleData.metadata.scenario_name;
        this.renderData(this.moduleData, this.moduleDataLayouts);
      }, (err) => {
        general.popErrorWindow(this, 'loadScenario error', err.message);
      });
    },
    renderData(moduleData, moduleDataLayouts) {
      // console.log(moduleData);
      // console.log(moduleDataLayouts);
      this.nodes = moduleData.nodes.filter(node => node.node_id !== '0').map((node) => {
        const nodeId = node.node_id;
        return {
          x: moduleDataLayouts[nodeId].position.left,
          y: moduleDataLayouts[nodeId].position.top,
          data: node,
        };
      });
    },
    saveNode(index, node) {
      // this.nodes[index].data = node;
      this.moduleData = {
        version: '1.0',
        metadata: this.moduleData.metadata,
        global_edges: this.moduleData.global_edges || [],
        setting: this.moduleData.setting,
        msg_confirm: this.moduleData.msg_confirm,
        nodes: this.moduleData.nodes,
        // nodes: this.nodes,
        // TODO add back Exit node to nodes
      };
      console.log('saveNode');
      console.log(this.moduleData);
      // this.saveScenario(this.moduleData, this.moduleDataLayouts);
    },
    updateNodePosition(index, position) {
      this.nodes[index].x = position.left;
      this.nodes[index].y = position.top;
    },
    saveNodePosition(index) {
      const nodeId = this.nodes[index].data.node_id;
      this.moduleDataLayouts[nodeId].position.left = this.nodes[index].x;
      this.moduleDataLayouts[nodeId].position.top = this.nodes[index].y;
      console.log('saveNodePosition');
      // console.log(this.moduleDataLayouts);
      // this.saveScenario(this.moduleData, this.moduleDataLayouts);
    },
    saveScenario(data, layout) {
      return taskEngineApi.saveScenario(
        this.appId,
        this.scenarioId,
        JSON.stringify(data),
        JSON.stringify(layout),
      ).then(() => {
        window.moduleData = data;
        window.moduleDataLayouts = layout;
        this.$notify({ text: this.$t('error_msg.save_success') });
      }, (err) => {
        general.popErrorWindow(this, 'saveScenario error', err.message);
      });
    },
    deleteNode(index) {
      this.nodes.splice(index, 1);
    },
    nodeOptionDragStart(nodeType, e) {
      e.dataTransfer.setData('text', nodeType);
    },
    nodeOptionDragOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    },
    nodeOptionDrop(e) {
      const nodeType = e.dataTransfer.getData('text');
      this.nodes.push({
        x: e.offsetX,
        y: e.offsetY,
        data: {
          description: nodeType,
          node_id: 'tmp_id',
          edges: [],
        },
      });
    },
    onPageWheel() {
      // expand canvas width and height
      const scrollLeft = this.$refs.window.scrollLeft;
      const windowWidth = this.$refs.window.clientWidth;
      const pageWidth = this.$refs.page.clientWidth;

      const scrollTop = this.$refs.window.scrollTop;
      const windowHeight = this.$refs.window.clientHeight;
      const pageHeight = this.$refs.page.clientHeight;

      const scrollPercentX = (scrollLeft / (pageWidth - windowWidth)) * 100;
      const scrollPercentY = (scrollTop / (pageHeight - windowHeight)) * 100;

      if (scrollPercentX >= 95) {
        this.canvasWidth *= 1.1;
      }
      if (scrollPercentY >= 95) {
        this.canvasHeight *= 1.1;
      }
    },
    getPanelTabOptions() {
      const tabs = [
        this.$t('task_engine_v2.scenario_edit_page.tabs.node'),
      ];
      return tabs.map(tab => ({
        text: tab,
        val: tab,
      }));
    },
    getNodeOptions() {
      const nodeOptions = [
        {
          type: 'dialogue',
          name: this.$t('task_engine_v2.node_type.dialogue'),
        },
        {
          type: 'restful',
          name: this.$t('task_engine_v2.node_type.restful'),
        },
        {
          type: 'nlu_pc_node',
          name: this.$t('task_engine_v2.node_type.nlu_pc_node'),
        },
        {
          type: 'parameter_collecting',
          name: this.$t('task_engine_v2.node_type.parameter_collecting'),
        },
        {
          type: 'router',
          name: this.$t('task_engine_v2.node_type.router'),
        },
      ];
      return nodeOptions;
    },
    getRainbowColors() {
      return [
        '#db6b6c', '#5a9bd3', '#42a198', '#f8c954', '#7e47ae',
        '#dc7598', '#5a99d2', '#db6b6c', '#eaa355', '#8a7168',
      ];
    },
  },
  beforeMount() {
    this.appId = this.$cookie.get('appid');
    this.scenarioId = this.$route.params.id;
    this.loadScenario(this.scenarioId);
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

#scenario-edit-page{
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .browse-window{
    position: relative;
    width: 100%;
    height: 100%;
    @include auto-overflow();
    @include customScrollbar();  
    .canvas-page{
      background: #F1F4F5;
      background-size: 20px 20px;
      background-image: linear-gradient(to right, #DDDDDD 1px, transparent 1px), linear-gradient(to bottom, #DDDDDD 1px, transparent 1px);
    }
  }
  .side-panel {
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 0;
    top: 0;
    width: 500px;
    height: calc(100% - 8px);
    background: white;
    border: 1px solid $color-borderline;
    border-radius: 5px;
    padding: 24px;
    margin-right: 8px;
    @include auto-overflow();
    @include customScrollbar();
    .node-option{
      display: flex;
      align-items: center;
      justify-content: center;
      height: 150px;
      cursor: move;
      &.odd-option{
        background: darken(#F7FBFC, 2%)
      }
      &:hover{
        background: darken(#F7FBFC, 5%);
      }
      .node-name{
        font-size: 20px;
      }
    }
  }
}
</style>
