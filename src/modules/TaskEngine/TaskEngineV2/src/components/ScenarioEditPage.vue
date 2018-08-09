<template lang="html">
<div id="scenario-edit-page">
  <div class="graph-container">
    <edges :edges="filteredEdges"></edges>
    <template v-for="(node, index) in nodes">
      <node-block
        :x="node.x"
        :y="node.y"
        :initialNode="node.data"
        @updatePosition="updateNodePosition(index, $event)"
        @deleteNode="deleteNode(index)">
      </node-block>
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
      nodes: [],
      edges: [],
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
      ).map(edge => ({
        x1: this.idToNode[edge.from_id].x + 115,
        y1: this.idToNode[edge.from_id].y + 60,
        x2: this.idToNode[edge.to_id].x + 115,
        y2: this.idToNode[edge.to_id].y + 60,
        style: {
          stroke: 'red',
          strokeWidth: 4,
          fill: 'none',
        },
      }));
    },
  },
  watch: {},
  methods: {
    loadScenario(scenarioId) {
      return taskEngineApi.loadScenario(scenarioId).then((data) => {
        window.moduleData = JSON.parse(data.result.editingContent);
        window.moduleDataLayouts = JSON.parse(data.result.editingLayout);
        this.scenarioName = window.moduleData.metadata.scenario_name;
        this.renderData(window.moduleData, window.moduleDataLayouts);
      }, (err) => {
        general.popErrorWindow(this, 'loadScenario error', err.message);
      });
    },
    renderData(moduleData, moduleDataLayouts) {
      console.log(moduleData);
      console.log(moduleDataLayouts);

      this.nodes = moduleData.nodes.filter(node => node.node_id !== '0').map((node) => {
        const nodeId = node.node_id;
        return {
          x: moduleDataLayouts[nodeId].position.left,
          y: moduleDataLayouts[nodeId].position.top,
          data: node,
        };
      });
      // this.currentSkillId = 'mainSkill';
      // // propagate currentSkill
      // this.skills = moduleData.skills;
      // const currentSkill = this.skills[this.currentSkillId];
      // this.$refs.skillEditPage.$emit('propSkill', currentSkill);
      // // propagate ner map (entity map)
      // this.idToNerMap = Array.isArray(moduleData.idToNerMap) ? {} : moduleData.idToNerMap;
    },
    updateNodePosition(index, position) {
      this.nodes[index].x = position.left;
      this.nodes[index].y = position.top;
    },
    deleteNode(index) {
      this.nodes.splice(index, 1);
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
  .graph-container{
    overflow: auto;
    width: 100%;
    height: 100%;
    background: #F1F4F5;
  }
}
</style>
