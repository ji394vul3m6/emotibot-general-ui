<template lang="html">
<div id="scenario-edit-page" @wheel="onPageWheel()">
  <div class="browse-window" ref="window">
    <div class="canvas-page"
      ref="page"
      :style="canvasStyle"
      @drop="nodeOptionDrop($event)"
      @dragover="nodeOptionDragOver($event)">
      <edges
        ref="edges"
        :edges="filteredEdges"
      ></edges>
      <template v-for="(nodeBlock, index) in nodeBlocks">
        <node-block
          :key="nodeBlock.data.nodeId"
          :x="nodeBlock.x"
          :y="nodeBlock.y"
          :nodeTypeName="getNodeTypeName(nodeBlock.data.nodeType)"
          :initialNode="nodeBlock.data"
          :toNodeOptions="toNodeOptions"
          @updatePosition="updateNodePosition(index, $event)"
          @savePosition="saveScenario()"
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
        @dragstart="nodeOptionDragStart(nodeOption.type, nodeOption.name, $event);">
        <div class="node-name">{{nodeOption.name}}</div>
      </div>
    </template>
  </div>
  <div class="top-panel">
    <div class="button-block"
      @mouseover="showTopPanelButtonLabel.setting=true"
      @mouseleave="showTopPanelButtonLabel.setting=false"
      @click="editScenarioSettings()">
      <icon class="icon-panel" icon-type="setting" :enableHover="false" :size=18 @click=""/>
      <transition name="label">
        <div
          v-if="showTopPanelButtonLabel.setting"
          class="label-button-block">
          {{$t("task_engine_v2.scenario_edit_page.setting")}}
        </div>
      </transition>
    </div>
    <div class="button-block"
      @mouseover="showTopPanelButtonLabel.globalEdge=true"
      @mouseleave="showTopPanelButtonLabel.globalEdge=false"
      @click="editGlobalEdge()">
      <icon class="icon-panel" icon-type="canlendar" :enableHover="false" :size=18 @click=""/>
      <transition name="label">
        <div
          v-if="showTopPanelButtonLabel.globalEdge"
          class="label-button-block">
          {{$t("task_engine_v2.scenario_edit_page.global_edge")}}
        </div>
      </transition>
    </div>
    <div class="button-block"
      @mouseover="showTopPanelButtonLabel.export=true"
      @mouseleave="showTopPanelButtonLabel.export=false"
      @click="exportScenario()">
      <icon class="icon-panel" icon-type="save" :enableHover="false" :size=18 @click=""/>
      <transition name="label">
        <div
          v-if="showTopPanelButtonLabel.export"
          class="label-button-block">
          {{$t("task_engine_v2.scenario_edit_page.export")}}
        </div>
      </transition>
    </div>
    <div class="button-block"
      @mouseover="showTopPanelButtonLabel.publish=true"
      @mouseleave="showTopPanelButtonLabel.publish=false"
      @click="publishScenario()">
      <icon class="icon-panel" icon-type="upload" :enableHover="false" :size=18 @click=""/>
      <transition name="label">
        <div
          v-if="showTopPanelButtonLabel.publish"
          class="label-button-block">
          {{$t("task_engine_v2.scenario_edit_page.publish")}}
        </div>
      </transition>
    </div>
  </div>
</div>
</template>

<script>
import taskEngineApi from '@/modules/TaskEngine/_api/taskEngine';
import general from '@/modules/TaskEngine/_utils/general';
import NodeBlock from './NodeBlock';
import Edges from './Edges';
import GlobalEdgeEditPop from './GlobalEdgeEditPop';
import ScenarioSettingsEditPop from './ScenarioSettingsEditPop';
import scenarioConvertor from '../_utils/scenarioConvertor';
import scenarioInitializer from '../_utils/scenarioInitializer';

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
      setting: {},
      globalEdges: [],
      nodeBlocks: [],
      edges: [],
      panelTabOptions: [],
      nodeOptions: [],
      canvasWidth: 2000,
      canvasHeight: 2000,
      rainbowColors: [],
      showTopPanelButtonLabel: {
        setting: false,
        globalEdge: false,
        export: false,
        publish: false,
      },
      nodeTypes: [],
    };
  },
  computed: {
    idToNodeBlock() {
      const map = {};
      this.nodeBlocks.forEach((nodeBlock) => {
        map[nodeBlock.data.nodeId] = nodeBlock;
      });
      return map;
    },
    toNodeOptions() {
      const options = [];
      Object.keys(this.idToNodeBlock).forEach((key) => {
        const nodeBlock = this.idToNodeBlock[key];
        const nodeName = nodeBlock.data.nodeName;
        const nodeType = nodeBlock.data.nodeType || '';
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
      // allEdges include normal, qq, else_into and exceedThenGoTo edges, not include hidden edges.
      const edgeList = [];
      Object.keys(this.idToNodeBlock).forEach((key) => {
        const nodeBlock = this.idToNodeBlock[key];
        if (nodeBlock.data.edgeTab && nodeBlock.data.edgeTab.normalEdges) {
          nodeBlock.data.edgeTab.normalEdges.forEach((edge) => {
            // TODO: handle qq edge
            if (!edge.to_node_id) return;
            if (!this.idToNodeBlock[edge.to_node_id]) return;

            edgeList.push({
              from_id: nodeBlock.data.nodeId,
              to_id: edge.to_node_id,
              edge_type: edge.edge_type,
            });
          });
        }
        if (nodeBlock.data.edgeTab && nodeBlock.data.edgeTab.exceedThenGoto) {
          edgeList.push({
            from_id: nodeBlock.data.nodeId,
            to_id: nodeBlock.data.edgeTab.exceedThenGoto,
            edge_type: 'exceedThenGoTo',
          });
        }
        if (nodeBlock.data.edgeTab && nodeBlock.data.edgeTab.elseInto) {
          edgeList.push({
            from_id: nodeBlock.data.nodeId,
            to_id: nodeBlock.data.edgeTab.elseInto,
            edge_type: 'else_into',
          });
        }
      });
      return edgeList;
    },
    filteredEdges() {
      return this.allEdges.filter(edge =>
        edge.edge_type !== 'hidden' &&
        edge.from_id !== '0' &&
        edge.to_id !== '0' &&
        edge.to_id !== null &&
        edge.to_id !== undefined &&
        edge.from_id !== edge.to_id,
      ).map((edge, index) => {
        const nodeBlockMap = this.idToNodeBlock;
        return {
          x1: nodeBlockMap[edge.from_id].x + 115,
          y1: nodeBlockMap[edge.from_id].y + 60,
          x2: nodeBlockMap[edge.to_id].x + 115,
          y2: nodeBlockMap[edge.to_id].y + 60,
          style: {
            stroke: this.rainbowColors[index % this.rainbowColors.length],
            strokeWidth: 4,
            fill: 'none',
          },
        };
      });
    },
    canvasStyle() {
      return {
        width: `${this.canvasWidth}px`,
        height: `${this.canvasHeight}px`,
      };
    },
  },
  watch: {
  },
  methods: {
    loadScenario(scenarioId) {
      return taskEngineApi.loadScenario(scenarioId).then((data) => {
        const jsonData = {
          moduleData: JSON.parse(data.result.editingContent),
          moduleDataLayouts: JSON.parse(data.result.editingLayout),
        };
        const newJsonData = scenarioConvertor.convertJsonToVersion('1.1', jsonData);
        this.moduleData = newJsonData.moduleData;
        this.moduleDataLayouts = newJsonData.moduleDataLayouts;
        this.updateWindowModuleData();
        this.renderData();
      }, (err) => {
        general.popErrorWindow(this, 'loadScenario error', err.message);
      });
    },
    updateWindowModuleData() {
      window.moduleData = JSON.parse(JSON.stringify(this.moduleData));
      window.moduleDataLayouts = JSON.parse(JSON.stringify(this.moduleDataLayouts));
    },
    renderData() {
      this.scenarioName = this.moduleData.metadata.scenario_name;
      this.globalEdges = this.moduleData.global_edges;
      this.setting = {
        scenarioName: this.moduleData.metadata.scenario_name,
        scenarioDialogueCntLimit: this.moduleData.setting.sys_scenario_dialogue_cnt_limit,
        nodeDialogueCntLimit: this.moduleData.setting.sys_node_dialogue_cnt_limit,
      };
      this.nodeBlocks = this.moduleData.ui_data.nodes.map((node) => {
        const nodeId = node.nodeId;
        return {
          x: this.moduleDataLayouts[nodeId].position.left,
          y: this.moduleDataLayouts[nodeId].position.top,
          data: node,
        };
      });
    },
    saveScenario() {
      const uiNodes = this.nodeBlocks.map(nodeBlock => nodeBlock.data);
      const nodes = scenarioConvertor.convertUiNodesToNodes(uiNodes);
      // update data
      const data = {
        version: '1.1',
        metadata: {
          scenario_name: this.setting.scenarioName,
          update_time: this.moduleData.metadata.update_time,
          update_user: this.moduleData.metadata.update_user,
          scenario_id: this.moduleData.metadata.scenario_id,
        },
        setting: {
          sys_scenario_dialogue_cnt_limit: this.setting.scenarioDialogueCntLimit,
          sys_node_dialogue_cnt_limit: this.setting.nodeDialogueCntLimit,
        },
        global_edges: this.globalEdges,
        msg_confirm: this.moduleData.msg_confirm,
        nodes,
        ui_data: {
          nodes: uiNodes,
        },
      };
      // update layout
      const layout = {};
      this.nodeBlocks.forEach((nodeBlock) => {
        const nodeId = nodeBlock.data.nodeId;
        layout[nodeId] = {
          position: {
            left: nodeBlock.x,
            top: nodeBlock.y,
          },
        };
      });
      const replacer = function x(key, value) {
        return ((value instanceof Object) && !(value instanceof Array)) ?
          Object.keys(value).sort().reduce((sorted, k) => {
            sorted[k] = value[k];
            return sorted;
          }, {}) : value;
      };
      console.log(JSON.stringify(data, replacer));
      console.log('saveScenario===');
      console.log(data);
      console.log(layout);
      // return taskEngineApi.saveScenario(
      //   this.appId,
      //   this.scenarioId,
      //   JSON.stringify(data),
      //   JSON.stringify(layout),
      // ).then(() => {
      //   this.moduleData = data;
      //   this.moduleDataLayouts = layout;
      //   this.updateWindowModuleData();
      //   this.$notify({ text: this.$t('error_msg.save_success') });
      // }, (err) => {
      //   this.$notifyFail(`saveScenario failed, error:${err.message}`);
      // });
    },
    saveNode(index, node) {
      this.nodeBlocks[index].data = node;
      this.saveScenario();
    },
    updateNodePosition(index, position) {
      this.nodeBlocks[index].x = position.left;
      this.nodeBlocks[index].y = position.top;
    },
    deleteNode(index) {
      const nodeName = this.nodeBlocks[index].data.nodeName;
      const that = this;
      that.$popCheck({
        data: {
          msg: that.$t(
            'task_engine_v2.scenario_edit_page.ask_delete_node_confirm',
            { node: nodeName },
          ),
        },
        callback: {
          ok() {
            that.nodeBlocks.splice(index, 1);
            that.saveScenario();
          },
        },
      });
    },
    nodeOptionDragStart(nodeType, name, e) {
      e.dataTransfer.setData('type', nodeType);
      e.dataTransfer.setData('name', name);
    },
    nodeOptionDragOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    },
    nodeOptionDrop(e) {
      const nodeType = e.dataTransfer.getData('type');
      const nodeName = e.dataTransfer.getData('name');
      const nodeDialogueCntLimit = this.setting.nodeDialogueCntLimit;
      const node = scenarioInitializer.initialNode(nodeType, nodeName, nodeDialogueCntLimit);
      this.nodeBlocks.push({
        x: e.offsetX,
        y: e.offsetY,
        data: node,
      });
      this.saveScenario();
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
    editScenarioSettings() {
      const that = this;
      that.$pop({
        title: '',
        component: ScenarioSettingsEditPop,
        validate: true,
        extData: {
          setting: this.setting,
        },
        callback: {
          ok: (setting) => {
            this.setting = setting;
            this.saveScenario();
          },
        },
      });
    },
    editGlobalEdge() {
      const that = this;
      that.$pop({
        title: '',
        component: GlobalEdgeEditPop,
        validate: true,
        extData: {
          globalEdges: this.globalEdges,
          toNodeOptions: this.toNodeOptions,
        },
        callback: {
          ok: (edges) => {
            this.globalEdges = edges;
            this.saveScenario();
          },
        },
      });
    },
    exportScenario() {
      taskEngineApi.exportScenario(this.scenarioId);
    },
    publishScenario() {
      // register TDE tasks
      scenarioConvertor.registerNluTdeScenario(this.scenarioId, this.moduleData.ui_data.nodes);

      // publish scenario
      const that = this;
      taskEngineApi.publishScenario(this.appId, this.scenarioId).then(() => {
        that.$notify({ text: that.$t('task_engine_v2.scenario_list_page.publish_succeed') });
        // enable scenario after published
        taskEngineApi.switchScenario(this.appId, this.scenarioId, true).then(() => {
        }, (err) => {
          this.$notifyFail(`enable scenario error:${err.message}`);
        });
      }, (err) => {
        that.$notifyFail(`${that.$t('task_engine_v2.scenario_list_page.publish_failed')}:${err.message}`);
      });
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
      return this.nodeTypes.filter(nodeType => nodeType.type !== 'entry');
    },
    getNodeTypeName(type) {
      const nodeType = this.nodeTypes.find(t => t.type === type);
      return nodeType.name;
    },
    getNodeTypes() {
      const nodeTypes = [
        {
          type: 'entry',
          name: this.$t('task_engine_v2.node_type.entry'),
        },
        {
          type: 'dialogue',
          name: this.$t('task_engine_v2.node_type.dialogue'),
        },
        {
          type: 'restful',
          name: this.$t('task_engine_v2.node_type.restful'),
        },
        {
          type: 'nlu_pc',
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
      return nodeTypes;
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
    this.panelTabOptions = this.getPanelTabOptions();
    this.nodeTypes = this.getNodeTypes();
    this.nodeOptions = this.getNodeOptions();
    this.rainbowColors = this.getRainbowColors();
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
  .top-panel{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    position: absolute;
    left: 20px;
    top: 20px;
    width: 400px;
    height: 66px;
    background: white;
    padding: 0px 16px 0px 32px;
    .button-block{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      height: 36px;
      border: 1px solid $color-borderline;
      padding: 0px 16px 0px 16px;
      cursor: pointer;
      &:first-child{
        border-radius: 6px 0px 0px 6px;
      }
      &:last-child{
        border-radius: 0px 6px 6px 0px;
      }
      .icon-panel{
        margin: 0px 4px 0px 0px;
      }
      .label-button-block{
        font-size: 16px;
      }
      .label-enter-active, .label-leave-active{
        transition: font-size 0.2s;
      }
      .label-enter, .label-leave-to {
        font-size: 0px;
      }
      .label-enter-to, .label-leave {
        font-size: 16px;
      }
    }
  }
}
</style>
