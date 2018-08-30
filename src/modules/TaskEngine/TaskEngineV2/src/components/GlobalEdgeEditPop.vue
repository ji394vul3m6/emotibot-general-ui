<template lang="html">
<div id="global-edge-edit-pop">
  <div class="instruction block">
    {{$t("task_engine_v2.global_edge_edit_pop.instruction")}}
  </div>
  <draggable v-model="globalEdges" :options="{ghostClass:'ghost'}" @start="drag=true" @end="drag=false">
    <template v-for="(edge, index) in globalEdges">
      <condition-block
        class="condition-block"
        :key="edge.id"
        :nodeId="nodeId"
        :initialEdge="edge"
        :toNodeOptions="toNodeOptions"
        :globalVarOptions="globalVarOptions"
        :mapTableOptions="mapTableOptions"
        @update="updateEdge(index, $event)"
        @deleteEdge="deleteEdge(index)">
      </condition-block>
    </template>
  </draggable>
  <button
    class="button-add-edge"
    @click="addEdge()">
    {{$t("task_engine_v2.global_edge_edit_pop.button_add_edge")}}
  </button>
</div>
</template>

<script>
import mappingtable from '@/modules/TaskEngine/_api/taskEngine_mappingtable';
import draggable from 'vuedraggable';
import ConditionBlock from './ConditionBlock';
import scenarioInitializer from '../_utils/scenarioInitializer';

export default {
  name: 'global-edge-edit-pop',
  components: {
    draggable,
    'condition-block': ConditionBlock,
  },
  props: {
    extData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      nodeId: '',
      globalEdges: [],
      toNodeOptions: [],
      globalVarOptions: [],
      mapTableOptions: [],
    };
  },
  computed: {},
  watch: {},
  methods: {
    renderData() {
      // render globalEdges
      const edges = JSON.parse(JSON.stringify(this.extData.globalEdges));
      this.globalEdges = edges.map((edge) => {
        edge.id = this.$uuid.v1();
        return edge;
      });

      // render toNodeOptions
      const options = JSON.parse(JSON.stringify(this.extData.toNodeOptions));
      this.toNodeOptions = [
        { text: 'do nothing', value: null },
        { text: 'Exit (ID: 0)', value: '0' },
      ].concat(options);

      // render globalVarOptions
      this.globalVarOptions = JSON.parse(JSON.stringify(this.extData.globalVarOptions));
    },
    addEdge() {
      const edge = scenarioInitializer.initialEdge();
      edge.id = this.$uuid.v1();
      this.globalEdges.push(edge);
    },
    deleteEdge(index) {
      this.globalEdges.splice(index, 1);
    },
    updateEdge(index, edge) {
      this.globalEdges[index] = edge;
    },
    loadMappingTableOptions() {
      const mapTables = [];
      mappingtable.getTemplateMappingList().then((templateData) => {
        mapTables.push(...templateData.data);
        mappingtable.getMappingList().then((data) => {
          mapTables.push(...data.data);
          this.mapTableOptions = mapTables.map(table => ({
            text: table,
            value: table,
          }));
        });
      });
    },
    validate() {
      const edges = this.globalEdges.map(edge => ({
        edge_type: edge.edge_type,
        to_node_id: edge.to_node_id,
        condition_rules: edge.condition_rules,
        actions: [],
      }));
      this.$emit(
        'validateSuccess',
        edges,
      );
    },
  },
  beforeMount() {
    this.loadMappingTableOptions();
    this.renderData();
  },
  mounted() {
    this.$on('validate', this.validate);
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

#global-edge-edit-pop{
  width: 725px;
  height: 70vh;
  display: flex;
  flex-direction: column;
  padding: 25px 25px 25px 25px;
  .instruction{
    height: 60px;
    flex: 0 0 60px;
    line-height: 20px;
    color: $color-font-normal;
    font-size: 14px;
  }
  .block{
    background: #F3F7F9;
    padding: 20px 20px 20px 20px;
    border: 1px solid $color-borderline;
    border-radius: 5px;
    margin: 0px 0px 20px 0px;
  }
  .button-add-edge{
    height: 40px;
    flex: 0 0 40px;
    background: #46BE8A;
    border-radius: 5px;
    color: white;
    font-size: 18px;
    font-weight: 600;
    margin: 0px 0px 10px 0px;
    cursor: pointer;
    &:hover{
      transition: background-color 0.5s ease;
      background: lighten(#46BE8A, 10%);
    }
  }
}
</style>
