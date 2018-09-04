<template lang="html">
<div id="edge-edit-tab">
  <div class="instruction block">
    {{$t("task_engine_v2.edge_edit_tab.instruction")}}
  </div>
  <draggable v-model="normalEdges" :options="{ghostClass:'ghost'}" @start="drag=true" @end="drag=false">
    <template v-for="(edge, index) in normalEdges">
      <condition-block
        class="condition-block"
        :key="edge.id"
        :nodeId="nodeId"
        :initialEdge="edge"
        :toNodeOptions="toNodeOptions"
        :mapTableOptions="mapTableOptions"
        :globalVarOptions="globalVarOptions"
        @update="updateNormalEdge(index, $event)"
        @deleteEdge="deleteEdge(index)">
      </condition-block>
    </template>
  </draggable>
  <button
    class="button-add-edge"
    @click="addEdge()">
    {{$t("task_engine_v2.edge_edit_tab.button_add_edge")}}
  </button>
  <div class="exceed_limit block" v-if="nodeType !== 'entry' && nodeType !== 'nlu_pc'">
    <div class="condition-row">
      <div class="label label-bold">
        {{$t("task_engine_v2.edge_edit_tab.label_exceed_limit")}}
      </div>
      <div class="label label-margin-left">
        {{$t("task_engine_v2.edge_edit_tab.instruction_exeed_limit")}}
      </div>
      <input class="input-limit"
        oninput="this.value = this.value.replace(/^0$/g, ''); this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(^[0-9]{1,2}).*/g, '$1');"
        v-model="dialogueLimit">
      </input>
      <div class="label">
        {{$t("task_engine_v2.edge_edit_tab.label_time")}}
      </div>
      <div class="label label-margin-left">
        {{$t("task_engine_v2.edge_edit_tab.label_then_goto")}}
      </div>
      <dropdown-select
        class="select select-goto"
        ref="selectExceedThenGoto"
        :value="[exceedThenGoto]"
        @input="exceedThenGoto = $event[0]"
        :options="exceedThenGotoOptions"
        :showCheckedIcon="false"
        :showSearchBar="true"
        width="200px"
        :inputBarStyle="selectStyle"
      />
    </div>
  </div>
  <div class="default_goto block">
    <div class="condition-row">
      <div class="label label-bold">
        {{$t("task_engine_v2.edge_edit_tab.label_default_goto")}}
      </div>
      <div class="label label-margin-left">
        {{$t("task_engine_v2.edge_edit_tab.instruction_default_goto")}}
      </div>
      <div class="label label-margin-left">
        {{$t("task_engine_v2.edge_edit_tab.label_then_goto")}}
      </div>
      <dropdown-select
        class="select select-goto"
        ref="selectExceedThenGoto"
        :value="[elseInto]"
        @input="elseInto = $event[0]"
        :options="elseIntoOptions"
        :showCheckedIcon="false"
        :showSearchBar="true"
        width="200px"
        :inputBarStyle="selectStyle"
      />
    </div>
  </div>
</div>
</template>

<script>
import draggable from 'vuedraggable';
import DropdownSelect from '@/components/DropdownSelect';
import ConditionBlock from './ConditionBlock';
import scenarioInitializer from '../_utils/scenarioInitializer';

export default {
  name: 'edge-edit-tab',
  components: {
    draggable,
    'dropdown-select': DropdownSelect,
    'condition-block': ConditionBlock,
  },
  props: {
    initialEdgeTab: {
      type: Object,
      required: true,
    },
    initialToNodeOptions: {
      type: Array,
      required: true,
    },
    globalVarOptions: {
      type: Array,
      required: true,
    },
    mapTableOptions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      nodeId: '',
      nodeType: '',
      normalEdges: [],
      dialogueLimit: null,
      toNodeOptions: [],
      exceedThenGoto: null,
      exceedThenGotoOptions: [],
      elseInto: null,
      elseIntoOptions: [],
      selectStyle: {
        height: '36px',
        'border-radius': '5px',
      },
    };
  },
  computed: {},
  watch: {
    dialogueLimit: {
      handler() {
        this.emitUpdate();
      },
    },
    exceedThenGoto: {
      handler() {
        this.emitUpdate();
      },
    },
    elseInto: {
      handler() {
        this.emitUpdate();
      },
    },
  },
  methods: {
    renderTabContent() {
      const edgeTab = JSON.parse(JSON.stringify(this.initialEdgeTab));
      this.nodeId = edgeTab.nodeId;
      this.nodeType = edgeTab.nodeType;
      this.exceedThenGoto = edgeTab.exceedThenGoto;
      this.elseInto = edgeTab.elseInto;
      this.dialogueLimit = edgeTab.dialogueLimit;

      // add tmp id for edges
      this.normalEdges = edgeTab.normalEdges.map((edge) => {
        edge.id = this.$uuid.v1();
        return edge;
      });

      // render toNodeOptions, exceedThenGotoOptions, elseIntoOptions
      let options = JSON.parse(JSON.stringify(this.initialToNodeOptions));
      options = options.filter(option => option.value !== this.nodeId);
      if (this.nodeType === 'entry') {
        this.toNodeOptions = [{ text: 'do nothing', value: null }].concat(options);
        this.exceedThenGotoOptions = [];
        this.elseIntoOptions = options;
      } else if (this.nodeType === 'nlu_pc') {
        this.elseIntoOptions = [{ text: 'Exit (ID: 0)', value: '0' }].concat(options);
        this.toNodeOptions = [{ text: 'do nothing', value: null }].concat(this.elseIntoOptions);
        this.exceedThenGotoOptions = [];
      } else {
        this.exceedThenGotoOptions = [{ text: 'Exit (ID: 0)', value: '0' }].concat(options);
        this.toNodeOptions = [{ text: 'do nothing', value: null }].concat(this.exceedThenGotoOptions);
        this.elseIntoOptions = [
          {
            text: this.$t('task_engine_v2.to_node_option.parse_fail'),
            value: this.nodeId,
          },
        ].concat(this.exceedThenGotoOptions);
      }
    },
    updateNormalEdge(index, $event) {
      this.normalEdges[index] = $event;
      this.emitUpdate();
    },
    addEdge() {
      const edge = scenarioInitializer.initialEdge();
      edge.id = this.$uuid.v1();
      this.normalEdges.push(edge);
      this.emitUpdate();
    },
    deleteEdge(index) {
      this.normalEdges.splice(index, 1);
      this.emitUpdate();
    },
    emitUpdate() {
      const edgeTab = {
        dialogueLimit: parseInt(this.dialogueLimit, 10) || null,
        exceedThenGoto: this.exceedThenGoto || null,
        elseInto: this.elseInto || null,
        normalEdges: this.normalEdges.map((edge) => {
          const e = JSON.parse(JSON.stringify(edge));
          delete e.id;
          return e;
        }),
      };
      // console.log(edgeTab);
      this.$emit('update', edgeTab);
    },
  },
  beforeMount() {
    this.renderTabContent();
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

#edge-edit-tab{
  display: flex;
  flex-direction: column;
  padding: 0px 30px 0px 20px;
  .block{
    background: #F3F7F9;
    padding: 20px 20px 20px 20px;
    border: 1px solid $color-borderline;
    border-radius: 5px;
    margin: 0px 0px 20px 0px;
    .condition-row{
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 36px;
      .label{
        height: 36px;
        line-height: 36px;
        font-size: 16px;
      }
      .label-bold{
        font-weight: 600;
      }
      .label-margin-left{
        margin-left: 20px;
      }
      .input-limit{
        height: 36px;
        margin: 0px 10px 0px 10px;
        width: 40px;
      }
      .select{
        background: white;
        margin-left: 20px;
        border-radius: 5px;
      }
    }
  }
  .instruction{
    height: 60px;
    line-height: 20px;
    color: $color-font-normal;
    font-size: 14px;
  }
  .button-add-edge{
    height: 40px;
    background: #46BE8A;
    border-radius: 5px;
    color: white;
    font-size: 18px;
    font-weight: 600;
    margin: 20px 0px 10px 0px;
    cursor: pointer;
    &:hover{
      transition: background-color 0.5s ease;
      background: lighten(#46BE8A, 10%);
    }
  }
}
</style>
