<template lang="html">
<div id="scenario-edit-page">
  <div class="graph-container">
    <template v-for="(node, index) in nodes">
      <node-block
        :x="node.x"
        :y="node.y"
        :initialNode="node.content"
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

export default {
  name: 'scenario-edit-page',
  components: { 'node-block': NodeBlock },
  data() {
    return {
      nodes: [],
    };
  },
  computed: {
    // filteredScenarioList() {
    //   return this.scenarioList.filter(
    //     scenario => scenario.scenarioName.indexOf(this.filteredKeyWord) !== -1);
    // },
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
        console.log(node);
        return {
          x: moduleDataLayouts[nodeId].position.left,
          y: moduleDataLayouts[nodeId].position.top,
          content: node,
        };
      });
      console.log('this.nodes.length');
      console.log(this.nodes.length);
      // this.currentSkillId = 'mainSkill';
      // // propagate currentSkill
      // this.skills = moduleData.skills;
      // const currentSkill = this.skills[this.currentSkillId];
      // this.$refs.skillEditPage.$emit('propSkill', currentSkill);
      // // propagate ner map (entity map)
      // this.idToNerMap = Array.isArray(moduleData.idToNerMap) ? {} : moduleData.idToNerMap;
    },
    updateNodePosition(index, position) {
      console.log(position);
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
