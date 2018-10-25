<i18n>
{
  "zh-cn": {
    "instruction": "为每个节点增加通用的连线",
    "button_add_edge": "＋增加连线",
    "confirm_to_save_changes": "通用连线设置已被更动，请问是否需要保存？"
  }
}
</i18n>

<template lang="html">
<div id="global-edge-edit-pop">
  <div class="instruction block" v-t="'instruction'"></div>
  <div class="block-list-container">
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
          @deleteEdge="deleteEdge(index)"
          @addNewDialogueNode="addNewDialogueNode">
        </condition-block>
      </template>
    </draggable>
  </div>
  <button
    class="button-add-edge"
    @click="addEdge()">
    {{$t("button_add_edge")}}
  </button>
</div>
</template>

<script>
import mappingtable from '@/modules/TaskEngine/_api/taskEngine_mappingtable';
import general from '@/modules/TaskEngine/_utils/general';
import draggable from 'vuedraggable';
import ConditionBlock from './ConditionBlock';
import scenarioInitializer from '../_utils/scenarioInitializer';

export default {
  name: 'global-edge-edit-pop',
  components: {
    draggable,
    ConditionBlock,
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
      originalGlobalEdgesStr: '',
      globalEdges: [],
      toNodeOptions: [],
      globalVarOptions: [],
      mapTableOptions: [],
      newNodeOptions: undefined,
    };
  },
  computed: {
    doNothingEdge() {
      return { text: 'do nothing', value: null };
    },
    exitEdge() {
      return { text: 'Exit (ID: 0)', value: '0' };
    },
    addNewDialogueNodeEdge() {
      return {
        text: this.$t('task_engine_v2.to_node_option.add_new_dialogue_node'),
        value: 'add_new_dialogue_node',
        isButton: true,
      };
    },
  },
  watch: {},
  methods: {
    addNewDialogueNode(newNodeID) {
      if (this.newNodeOptions === undefined) {
        this.newNodeOptions = [];
      }
      const nodeNames = [
        ...window.moduleData.ui_data.nodes.map(node => node.nodeName),
        ...this.newNodeOptions.map(option => option.nodeName),
      ];
      const newNodeName = general.suffixIndexToNodeName(
                            this.$t('task_engine_v2.node_type.dialogue'),
                            nodeNames,
                          );
      this.newNodeOptions.push({
        nodeName: newNodeName,
        nodeId: newNodeID,
        nodeType: 'dialogue',
      });
      this.updateOptions();
    },
    updateOptions() {
      this.composeOptions([
        ...this.extData.toNodeOptions,
        ...this.newNodeOptions.map(option => ({
          text: `${option.nodeName} (ID: ${option.nodeId})`,
          value: option.nodeId,
        })),
      ]);
    },
    composeOptions(options) {
      this.toNodeOptions = [
        this.addNewDialogueNodeEdge,
        this.doNothingEdge,
        this.exitEdge,
      ].concat(options);
    },
    renderData() {
      // render globalEdges
      const edges = JSON.parse(JSON.stringify(this.extData.globalEdges));
      this.globalEdges = edges.map((edge) => {
        edge.id = this.$uuid.v1();
        return edge;
      });
      this.originalGlobalEdgesStr =
        JSON.stringify(this.globalEdges, general.JSONStringifyReplacer);

      // render toNodeOptions
      this.composeOptions(this.extData.toNodeOptions);

      // render globalVarOptions
      const globalVarOptionsMap = JSON.parse(JSON.stringify(this.extData.globalVarOptionsMap));
      this.globalVarOptions = [];
      Object.values(globalVarOptionsMap).forEach((globalVarOption) => {
        this.globalVarOptions.push(...globalVarOption);
      });
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
        { edges, newNodeOptions: this.newNodeOptions },
      );
    },
    cancelValidate() {
      const newGlobalEdgesStr = JSON.stringify(this.globalEdges, general.JSONStringifyReplacer);
      // console.log(`New Str: ${newGlobalEdgesStr}`);
      // console.log(`Old Str: ${this.originalGlobalEdgesStr}`);
      if (newGlobalEdgesStr === this.originalGlobalEdgesStr) {
        this.$emit('cancelValidateSuccess');
      } else {
        const that = this;
        that.$popCheck({
          bindValue: true,
          data: {
            msg: that.$t('confirm_to_save_changes'),
          },
          callback: {
            ok() {
              const edges = that.globalEdges.map(edge => ({
                edge_type: edge.edge_type,
                to_node_id: edge.to_node_id,
                condition_rules: edge.condition_rules,
                actions: [],
              }));
              that.$emit(
                'validateSuccess',
                edges,
              );
            },
            cancel() {
              that.$emit('cancelValidateSuccess');
            },
          },
        });
      }
    },
  },
  beforeMount() {
    this.loadMappingTableOptions();
    this.renderData();
  },
  mounted() {
    this.$on('validate', this.validate);
    this.$on('cancelValidate', this.cancelValidate);
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
  padding: 25px 25px 0px 25px;
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
  .block-list-container{
    display: flex;
    flex-direction: column;
    margin: 0px 0px 20px 0px;
    @include auto-overflow();
    @include customScrollbar();
  }
}
</style>
