<template lang="html">
<div id="scenario-edit-page" @wheel="onPageWheel()">
  <div class="browse-window" ref="window">
    <div class="canvas-page"
      id="canvas-page"
      ref="page"
      :style="canvasStyle"
      @drop="nodeOptionDrop($event)"
      @dragover="nodeOptionDragOver($event)"
      @mousemove="canvasMouseMove"
      @mouseup="canvasMouseUp"
      @click="canvasClick">
      <template v-for="(nodeBlock, index) in nodeBlocks">
        <node-block class="block"
          :ref="`nodeBlock_${index}`"
          :key="nodeBlock.data.nodeId"
          :x="nodeBlock.x"
          :y="nodeBlock.y"
          :nodeBlockWidth="nodeBlockWidth"
          :nodeBlockHeight="nodeBlockHeight"
          :nodeTypeName="getNodeTypeName(nodeBlock.data.nodeType)"
          :initialNode="nodeBlock.data"
          :toNodeOptions="toNodeOptions"
          :globalVarOptionsMap="globalVarOptionsMap"
          :linking="linking"
          @updatePosition="updateNodePosition(index, $event)"
          @savePosition="saveScenario()"
          @deleteNode="deleteNode(index)"
          @saveNode="saveNode(index, $event)"
          @copyNode="copyNode(index)"
          @linkingStart="linkingStart(index, $event)"
          @linkingStop="linkingStop(index, $event)"
          @mouseEnterDstSlot="mouseEnterDstSlot(index, $event)"
          @mouseLeaveDstSlot="mouseLeaveDstSlot()">
        </node-block>
      </template>
      <edges class="edges"
        ref="edges"
        :edges="filteredEdges"
        :nodeBlockWidth="nodeBlockWidth"
        :nodeBlockHeight="nodeBlockHeight"
      ></edges>
      <edges-on-top class="edgesOnTop"
        ref="edgesOnTop"
        :linkingEdge="linkingEdge"
      ></edges-on-top>
    </div>
    <div class="addNewEdgeDropdown"
      ref="addNewEdgeDropdown"
      v-dropdown="addNewEdgeDropdown"
      :style="addNewEdgeDropdownStyle"
      @dropdownHidden="dropdownHidden()">
    </div>
  </div>
  <div class="side-panel">
    <div class="node-option-nav-bar">
      <div class="node-option-title">{{$t("task_engine_v2.scenario_edit_page.add_node")}}</div>
      <div class="node-option-instruction">{{$t("task_engine_v2.scenario_edit_page.add_node_instruction")}}</div>
      <div class="side-panel-toggle" @click="toggleSidePanel()">{{sidePanelTogleIcon}}</div>
    </div>
    <div class="node-options" v-if="showNodeOptions">
      <template v-for="(nodeOption, index) in nodeOptions">
        <div class="node-option"
          :class="{ 'odd-option': index % 2 === 0 }"
          draggable="true"
          @dragstart="nodeOptionDragStart(nodeOption.type, nodeOption.name, $event);">
          <img class="node-icon" :src="`/static/images/${nodeOption.image}`" alt="...">
          <div class="node-label">
            <div class="node-name">{{nodeOption.name}}</div>
            <div class="node-description">{{nodeOption.description}}</div>
          </div>
        </div>
      </template>
    </div>
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
      @mouseover="showTopPanelButtonLabel.varTemplate=true"
      @mouseleave="showTopPanelButtonLabel.varTemplate=false"
      @click="editVarTemplate()">
      <icon class="icon-panel" icon-type="knowledge_base" :enableHover="false" :size=18 @click=""/>
      <transition name="label">
        <div
          v-if="showTopPanelButtonLabel.varTemplate"
          class="label-button-block">
          {{$t("task_engine_v2.scenario_edit_page.global_var_template")}}
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
import EdgesOnTop from './EdgesOnTop';
import GlobalEdgeEditPop from './GlobalEdgeEditPop';
import VarTemplateEditPop from './VarTemplateEditPop';
import ScenarioSettingsEditPop from './ScenarioSettingsEditPop';
import scenarioConvertor from '../_utils/scenarioConvertor';
import scenarioInitializer from '../_utils/scenarioInitializer';
import optionConfig from '../_utils/optionConfig';

export default {
  name: 'scenario-edit-page',
  components: {
    'node-block': NodeBlock,
    edges: Edges,
    'edges-on-top': EdgesOnTop,
  },
  data() {
    return {
      moduleData: {},
      moduleDataLayout: {},
      setting: {},
      globalEdges: [],
      varTemplates: [],
      nodeBlocks: [],
      edges: [],
      panelTabOptions: [],
      nodeOptions: [],
      canvasWidth: 2000,
      canvasHeight: 2000,
      nodeBlockWidth: 230,
      nodeBlockHeight: 120,
      rainbowColors: [],
      showTopPanelButtonLabel: {
        setting: false,
        varTemplate: false,
        globalEdge: false,
        export: false,
        publish: false,
      },
      nodeTypes: [],
      sidePanelTogleIcon: '-',
      showNodeOptions: true,
      linking: false,
      addNewEdgeDropdown: {
        options: [],
        width: '220px',
      },
      addNewEdgeDropdownStyle: {},
      linkingEdge: {
        show: false,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        srcNodeIndex: undefined,
        dstNodeIndex: undefined,
      },
      stopCanvasClickPropagationOnce: false,
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
            if (edge.edge_type && edge.edge_type === 'qq') {
              edge.candidate_edges.forEach((e) => {
                if (!this.idToNodeBlock[e.to_node_id]) return;
                edgeList.push({
                  from_id: nodeBlock.data.nodeId,
                  to_id: e.to_node_id,
                  edge_type: edge.edge_type,
                });
              });
            } else {
              if (!edge.to_node_id) return;
              if (!this.idToNodeBlock[edge.to_node_id]) return;
              edgeList.push({
                from_id: nodeBlock.data.nodeId,
                to_id: edge.to_node_id,
                edge_type: edge.edge_type,
              });
            }
          });
        }
        if (nodeBlock.data.edgeTab &&
            nodeBlock.data.edgeTab.exceedThenGoto &&
            this.idToNodeBlock[nodeBlock.data.edgeTab.exceedThenGoto]) {
          edgeList.push({
            from_id: nodeBlock.data.nodeId,
            to_id: nodeBlock.data.edgeTab.exceedThenGoto,
            edge_type: 'exceedThenGoTo',
          });
        }
        if (nodeBlock.data.edgeTab &&
            nodeBlock.data.edgeTab.elseInto &&
            this.idToNodeBlock[nodeBlock.data.edgeTab.elseInto]) {
          edgeList.push({
            from_id: nodeBlock.data.nodeId,
            to_id: nodeBlock.data.edgeTab.elseInto,
            edge_type: 'else_into',
          });
        }

        // push pc_node edges
        if (nodeBlock.data.paramsCollectingEdgeTab) {
          nodeBlock.data.paramsCollectingEdgeTab.normalEdges.forEach((edge) => {
            if (edge.edge_type && edge.edge_type === 'qq') {
              edge.candidate_edges.forEach((e) => {
                if (!this.idToNodeBlock[e.to_node_id]) return;
                edgeList.push({
                  from_id: nodeBlock.data.nodeId,
                  to_id: e.to_node_id,
                  edge_type: edge.edge_type,
                });
              });
            } else {
              if (!edge.to_node_id) return;
              if (!this.idToNodeBlock[edge.to_node_id]) return;
              edgeList.push({
                from_id: nodeBlock.data.nodeId,
                to_id: edge.to_node_id,
                edge_type: edge.edge_type,
              });
            }
          });
        }

        // push restful node edges
        if (nodeBlock.data.restfulEdgeTab) {
          if (this.idToNodeBlock[nodeBlock.data.restfulEdgeTab.restfulSucceedThenGoto]) {
            edgeList.push({
              from_id: nodeBlock.data.nodeId,
              to_id: nodeBlock.data.restfulEdgeTab.restfulSucceedThenGoto,
              edge_type: 'normal',
            });
          }
          if (this.idToNodeBlock[nodeBlock.data.restfulEdgeTab.restfulFailedThenGoto]) {
            edgeList.push({
              from_id: nodeBlock.data.nodeId,
              to_id: nodeBlock.data.restfulEdgeTab.restfulFailedThenGoto,
              edge_type: 'normal',
            });
          }
        }

        // globalEdges
        this.globalEdges.forEach((edge) => {
          if (!edge.to_node_id) return;
          if (!this.idToNodeBlock[edge.to_node_id]) return;
          edgeList.push({
            from_id: nodeBlock.data.nodeId,
            to_id: edge.to_node_id,
            edge_type: edge.edge_type,
          });
        });
      });

      return edgeList;
    },
    filteredEdges() {
      const edgeMap = {};
      const filteredEdges = [];
      let idx = 0;
      this.allEdges.filter(edge =>
        edge.edge_type !== 'hidden' &&
        edge.from_id !== '0' &&
        edge.to_id !== '0' &&
        edge.to_id !== null &&
        edge.to_id !== undefined &&
        edge.from_id !== edge.to_id,
      ).forEach((edge) => {
        const key = `${edge.from_id}_${edge.to_id}`;
        if (key in edgeMap) return;
        edgeMap[key] = 1;
        const nodeBlockMap = this.idToNodeBlock;
        filteredEdges.push({
          x1: nodeBlockMap[edge.from_id].x + this.halfBlockWidth,
          y1: nodeBlockMap[edge.from_id].y + this.halfBlockHeight,
          x2: nodeBlockMap[edge.to_id].x + this.halfBlockWidth,
          y2: nodeBlockMap[edge.to_id].y + this.halfBlockHeight,
          style: {
            stroke: this.rainbowColors[idx % this.rainbowColors.length],
            strokeWidth: 5,
            fill: 'none',
          },
        });
        idx += 1;
      });
      return filteredEdges;
    },
    canvasStyle() {
      return {
        width: `${this.canvasWidth}px`,
        height: `${this.canvasHeight}px`,
      };
    },
    halfBlockWidth() {
      return this.nodeBlockWidth / 2;
    },
    halfBlockHeight() {
      return this.nodeBlockHeight / 2;
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
        this.$popError('loadScenario error', err.message);
      });
    },
    updateWindowModuleData() {
      window.moduleData = JSON.parse(JSON.stringify(this.moduleData));
      window.moduleDataLayouts = JSON.parse(JSON.stringify(this.moduleDataLayouts));
    },
    renderData() {
      this.scenarioName = this.moduleData.metadata.scenario_name;
      this.globalEdges = this.moduleData.global_edges;
      this.varTemplates = this.moduleData.msg_confirm;
      this.setting = {
        scenarioName: this.moduleData.metadata.scenario_name,
        scenarioDialogueCntLimit: this.moduleData.setting.sys_scenario_dialogue_cnt_limit,
        nodeDialogueCntLimit: this.moduleData.setting.sys_node_dialogue_cnt_limit,
      };
      this.nodeBlocks = this.moduleData.ui_data.nodes.map((node, index) => {
        // prop node
        const nodeBlockRef = `nodeBlock_${index}`;
        if (this.$refs[nodeBlockRef] && this.$refs[nodeBlockRef].length > 0) {
          this.$refs[nodeBlockRef][0].$emit('propNode', node);
        }
        // update nodeBlocks
        const nodeId = node.nodeId;
        return {
          x: this.moduleDataLayouts[nodeId].position.left,
          y: this.moduleDataLayouts[nodeId].position.top,
          data: node,
        };
      });
      this.renderGlobalVarOptionsMap();
    },
    renderGlobalVarOptionsMap() {
      this.globalVarOptionsMap = {};
      this.moduleData.nodes.forEach(((node) => {
        if (node.global_vars) {
          const vars = node.global_vars.map(v => ({
            text: node.description,
            value: v,
          }));
          this.globalVarOptionsMap[node.node_id] = vars;
        }
      }));
    },
    saveScenario() {
      const uiNodes = this.nodeBlocks.map(nodeBlock => nodeBlock.data);
      const nodes = scenarioConvertor.convertUiNodesToNodes(uiNodes, this.setting);
      this.globalEdges = scenarioConvertor.appendActionToGlobalEdges(this.globalEdges);
      const nodeInfo = scenarioConvertor.traverseEdges(nodes, this.globalEdges);
      scenarioConvertor.generateWarnings(uiNodes, nodeInfo);
      // scenarioConvertor.addBackContentTextArray(this, nodes, this.globalEdges);
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
        msg_confirm: this.varTemplates,
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
      // console.log(JSON.stringify(data, general.JSONStringifyReplacer));
      return taskEngineApi.saveScenario(
        this.appId,
        this.scenarioId,
        JSON.stringify(data),
        JSON.stringify(layout),
      ).then(() => {
        this.moduleData = data;
        this.moduleDataLayouts = layout;
        this.renderData();
        this.updateWindowModuleData();
        // this.$notify({ text: this.$t('error_msg.save_success') });
      }, (err) => {
        this.$notifyFail(`saveScenario failed, error:${err.message}`);
      });
    },
    saveNode(index, node) {
      this.nodeBlocks[index].data = node;
      this.$nextTick(() => {
        this.saveScenario();
      });
    },

    copyNode(index) {
      const srcNodeId = this.nodeBlocks[index].data.nodeId;
      const newNodeId = scenarioInitializer.guid_sort();
      const srcNodeName = this.nodeBlocks[index].data.nodeName;
      const newNodeName = `${srcNodeName}_copy`;
      const srcNodeBlockString = JSON.stringify(this.nodeBlocks[index]);
      let newNodeStr = srcNodeBlockString.replace(new RegExp(srcNodeId, 'g'), newNodeId);
      console.log(newNodeStr);
      newNodeStr = newNodeStr.replace(new RegExp(`"nodeName":"${srcNodeName}"`, 'g'), `"nodeName":"${newNodeName}"`);
      console.log(newNodeStr);
      const newNodeBlock = JSON.parse(newNodeStr);
      newNodeBlock.x += 100;
      newNodeBlock.y += 100;
      this.nodeBlocks.push(newNodeBlock);
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
      this.addNewNode(nodeType, nodeName, e.offsetX, e.offsetY);
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
    editVarTemplate() {
      const that = this;
      that.$pop({
        title: '',
        component: VarTemplateEditPop,
        validate: true,
        extData: {
          varTemplates: this.varTemplates,
          globalVarOptionsMap: this.globalVarOptionsMap,
        },
        callback: {
          ok: (varTemplates) => {
            this.varTemplates = varTemplates;
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
          globalVarOptionsMap: this.globalVarOptionsMap,
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
    toggleSidePanel() {
      this.showNodeOptions = !this.showNodeOptions;
      if (this.showNodeOptions) {
        this.sidePanelTogleIcon = '-';
      } else {
        this.sidePanelTogleIcon = '+';
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
      return this.nodeTypes.filter(nodeType => nodeType.type !== 'entry');
    },
    getNodeTypeName(type) {
      const nodeType = this.nodeTypes.find(t => t.type === type);
      return nodeType.name;
    },
    linkingStart(index, slot) {
      this.linking = true;
      this.linkingEdge.show = true;
      this.linkingEdge.x1 = slot.x;
      this.linkingEdge.y1 = slot.y;
      this.linkingEdge.x2 = slot.x;
      this.linkingEdge.y2 = slot.y;
      this.linkingEdge.srcNodeIndex = index;
    },
    linkingStop(index, e) {
      if (this.nodeBlocks[index] && this.nodeBlocks[index].data) {
        const toNodeId = this.nodeBlocks[index].data.nodeId;
        this.showAddNewEdgeDropdown(e.clientX, e.clientY, toNodeId);
      } else {
        this.showAddNewEdgeDropdown(e.clientX, e.clientY, undefined);
      }
    },
    mouseEnterDstSlot(index, slot) {
      if (!this.linking) return;
      this.linkingEdge.x2 = slot.x;
      this.linkingEdge.y2 = slot.y;
      this.linkingEdge.dstNodeIndex = index;
    },
    mouseLeaveDstSlot() {
      if (!this.linking) return;
      this.linkingEdge.dstNodeIndex = undefined;
    },
    canvasMouseMove(e) {
      if (!this.linking) return;
      if (this.linkingEdge.dstNodeIndex) return;
      const pageRect = this.$refs.page.getBoundingClientRect();
      this.linkingEdge.x2 = e.clientX - pageRect.x;
      this.linkingEdge.y2 = e.clientY - pageRect.y;
    },
    canvasMouseUp(e) {
      this.showAddNewEdgeDropdown(e.clientX, e.clientY, undefined);
    },
    canvasClick(e) {
      if (this.stopCanvasClickPropagationOnce) {
        if (e.stopPropagation) e.stopPropagation();
        this.stopCanvasClickPropagationOnce = false;
      }
    },
    showAddNewEdgeDropdown(clientX, clientY, toNodeId) {
      if (!this.linking) return;
      this.linking = false;
      this.stopCanvasClickPropagationOnce = true;
      const pageRect = this.$refs.page.getBoundingClientRect();
      let left = clientX - pageRect.x - 50;
      let top = clientY - pageRect.y - 50;
      if (left < 0) left = 0;
      if (top < 0) top = 0;
      this.addNewEdgeDropdownStyle = {
        left: `${left}px`,
        top: `${top}px`,
      };
      this.renderAddNewEdgeDropdown(toNodeId);
      this.$refs.addNewEdgeDropdown.click();
    },
    dropdownHidden() {
      this.linkingEdge.show = false;
      this.linkingEdge.dstNodeIndex = undefined;
    },
    renderAddNewEdgeDropdown(toNodeId) {
      const sourceIndex = this.linkingEdge.srcNodeIndex;
      if (!this.nodeBlocks[sourceIndex] || !this.nodeBlocks[sourceIndex].data) {
        this.addNewEdgeDropdown.options = [];
        return;
      }
      // source node
      const sourceNode = this.nodeBlocks[sourceIndex].data;
      const sourceNodeType = sourceNode.nodeType;
      let dstNodeId = toNodeId;
      const exceedThenGotoOption = {
        text: this.$t('task_engine_v2.scenario_edit_page.new_edge_exceed_then_goto'),
        onclick: () => {
          if (dstNodeId === undefined) {
            const newNode = this.addNewLinkingNode(this.linkingEdge);
            dstNodeId = newNode.nodeId;
          }
          sourceNode.edgeTab.exceedThenGoto = dstNodeId;
          this.saveScenario();
          this.dropdownHidden();
        },
      };
      const elseIntoOption = {
        text: this.$t('task_engine_v2.scenario_edit_page.new_edge_else_into'),
        onclick: () => {
          if (dstNodeId === undefined) {
            const newNode = this.addNewLinkingNode(this.linkingEdge);
            dstNodeId = newNode.nodeId;
          }
          sourceNode.edgeTab.elseInto = dstNodeId;
          this.saveScenario();
          this.dropdownHidden();
        },
      };
      const newNormalEdgeOption = {
        text: this.$t('task_engine_v2.scenario_edit_page.new_edge_normal'),
        onclick: () => {
          if (dstNodeId === undefined) {
            const newNode = this.addNewLinkingNode(this.linkingEdge);
            dstNodeId = newNode.nodeId;
          }
          const newEdge = scenarioInitializer.initialEdge();
          newEdge.id = this.$uuid.v1();
          newEdge.to_node_id = dstNodeId;
          sourceNode.edgeTab.normalEdges.push(newEdge);
          this.saveScenario();
          this.dropdownHidden();
        },
      };
      let options = [];
      if (sourceNodeType === 'restful') {
        options = [
          {
            text: this.$t('task_engine_v2.scenario_edit_page.new_edge_restful_success'),
            onclick: () => {
              if (dstNodeId === undefined) {
                const newNode = this.addNewLinkingNode(this.linkingEdge);
                dstNodeId = newNode.nodeId;
              }
              sourceNode.restfulEdgeTab.restfulSucceedThenGoto = dstNodeId;
              this.saveScenario();
              this.dropdownHidden();
            },
          },
          {
            text: this.$t('task_engine_v2.scenario_edit_page.new_edge_restful_fail'),
            onclick: () => {
              if (dstNodeId === undefined) {
                const newNode = this.addNewLinkingNode(this.linkingEdge);
                dstNodeId = newNode.nodeId;
              }
              sourceNode.restfulEdgeTab.restfulFailedThenGoto = dstNodeId;
              this.saveScenario();
              this.dropdownHidden();
            },
          },
        ];
      } else if (sourceNodeType === 'parameter_collecting') {
        options = [
          {
            text: this.$t('task_engine_v2.scenario_edit_page.new_edge_pc_success'),
            onclick: () => {
              if (dstNodeId === undefined) {
                const newNode = this.addNewLinkingNode(this.linkingEdge);
                dstNodeId = newNode.nodeId;
              }
              const edges = sourceNode.paramsCollectingEdgeTab.normalEdges;
              const succeedEdge = edges.find(edge => edge.edge_type === 'pc_succeed');
              if (succeedEdge) {
                succeedEdge.to_node_id = dstNodeId;
                this.saveScenario();
              }
              this.dropdownHidden();
            },
          },
          {
            text: this.$t('task_engine_v2.scenario_edit_page.new_edge_pc_fail'),
            onclick: () => {
              if (dstNodeId === undefined) {
                const newNode = this.addNewLinkingNode(this.linkingEdge);
                dstNodeId = newNode.nodeId;
              }
              const edges = sourceNode.paramsCollectingEdgeTab.normalEdges;
              const failedEdge = edges.find(edge => edge.edge_type === 'pc_failed');
              if (failedEdge) {
                failedEdge.to_node_id = dstNodeId;
                this.saveScenario();
              }
              this.dropdownHidden();
            },
          },
          {
            text: this.$t('task_engine_v2.scenario_edit_page.new_edge_normal'),
            onclick: () => {
              if (dstNodeId === undefined) {
                const newNode = this.addNewLinkingNode(this.linkingEdge);
                dstNodeId = newNode.nodeId;
              }
              const newEdge = scenarioInitializer.initialEdge();
              newEdge.id = this.$uuid.v1();
              newEdge.to_node_id = dstNodeId;
              sourceNode.paramsCollectingEdgeTab.normalEdges.push(newEdge);
              this.saveScenario();
              this.dropdownHidden();
            },
          },
        ];
      } else if (sourceNodeType === 'entry' || sourceNodeType === 'nlu_pc') {
        options = [elseIntoOption, newNormalEdgeOption];
      } else {
        options = [
          exceedThenGotoOption,
          elseIntoOption,
          newNormalEdgeOption,
        ];
      }
      this.addNewEdgeDropdown.options = options;
      this.$refs.addNewEdgeDropdown.dispatchEvent(new Event('dropdown-reload'));
    },
    addNewLinkingNode(linkingEdge) {
      const nodeType = 'dialogue';
      const nodeName = this.getNodeTypeName(nodeType);
      const x = linkingEdge.x2 - this.halfBlockWidth;
      const y = linkingEdge.y2 - this.halfBlockHeight;
      return this.addNewNode(nodeType, nodeName, x, y);
    },
    addNewNode(nodeType, nodeName, x, y) {
      const nodeDialogueCntLimit = this.setting.nodeDialogueCntLimit;
      const newNodeName = general.suffixIndexToNodeName(nodeName, undefined);
      const node = scenarioInitializer.initialNode(nodeType, newNodeName, nodeDialogueCntLimit);
      this.nodeBlocks.push({
        x,
        y,
        data: node,
      });
      this.saveScenario();
      return node;
    },
  },
  beforeMount() {
    this.appId = this.$cookie.get('appid');
    this.scenarioId = this.$route.params.id;
    this.panelTabOptions = this.getPanelTabOptions();
    this.nodeTypes = optionConfig.getNodeTypes(this);
    this.nodeOptions = this.getNodeOptions();
    this.rainbowColors = optionConfig.getRainbowColors();
    this.loadScenario(this.scenarioId);
  },
  mounted() {},
  beforeDestroy() {},
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
      position: relative;
      background: #F1F4F5;
      background-size: 20px 20px;
      background-image: linear-gradient(to right, #DDDDDD 1px, transparent 1px), linear-gradient(to bottom, #DDDDDD 1px, transparent 1px);
    }
    .addNewEdgeDropdown{
      position: absolute;
    }
  }
  .side-panel {
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 0px;
    top: 20px;
    // z-index: 100;
    width: 420px;
    // height: calc(100% - 8px);
    max-height: calc(100% - 8px);
    background: white;
    border: 1px solid $color-borderline;
    border-radius: 5px;
    padding: 24px;
    margin-right: 8px;
    @include auto-overflow();
    @include customScrollbar();
    .node-option-nav-bar{
      position: relative;
      display: flex;
      flex-direction: column;
      height: 70px;
      border-bottom: 2px solid $color-borderline;
      .node-option-title{
        font-size: 20px;
        font-weight: 600;
        line-height: 24px;
      }
      .node-option-instruction{
        font-size: 16px;
        line-height: 16px;
        margin: 10px 0px 0px 0px;
      }
      .side-panel-toggle{
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 36px;
        font-weight: 600;
        cursor: pointer;
      }
    }
    .node-options{
      display: flex;
      flex-direction: column;
      margin: 20px 0px 0px 0px;
      .node-option{
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 150px;
        padding: 20px 40px 20px 40px;
        cursor: move;
        &.odd-option{
          background: darken(#F7FBFC, 2%)
        }
        &:hover{
          background: darken(#F7FBFC, 5%);
        }
        img{
          width: 80px;
          height: 80px;
        }
        .node-label{
          display: flex;
          flex-direction: column;
          margin: 0px 0px 0px 20px;
          .node-name{
            font-size: 16px;
            font-weight: 600;
            color: #333333;
          }
          .node-description{
            font-size: 12px;
            margin: 10px 0px 0px 0px;
          }
        }
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
    width: 450px;
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
