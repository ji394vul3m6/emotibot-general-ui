<template>
<div id="edge-edit-tab">
  <div class="title">
    {{ this.$t('task_engine_v2.edge_edit_tab2.instruction')}}
    <span class="instruction" v-t="'task_engine_v2.edge_edit_tab2.instruction_hint'"></span>
  </div>
  <draggable v-model="normalEdges" :options="{ghostClass:'ghost'}" @start="drag=true" @end="drag=false; emitUpdate();">
    <template v-for="(edge, index) in normalEdges">
      <condition-block
        class="condition-block"
        ref="conditionBlock"
        :key="edge.id"
        :nodeId="nodeId"
        :initialEdge="edge"
        :toNodeOptions="toNodeOptions"
        :mapTableOptions="mapTableOptions"
        :globalVarOptions="globalVarOptions"
        :validateConditionBlock="validateTab"
        @update:valid="$set(edge, 'valid', $event); if ($event) {isAllConditionBlockValid()}"
        @update="updateNormalEdge(index, $event)"
        @deleteEdge="deleteEdge(index)"
        @addNewDialogueNode="addNewDialogueNode">
      </condition-block>
    </template>
  </draggable>
  <button class="button-add-edge" @click="addEdge">
    {{$t("task_engine_v2.edge_edit_tab2.button_add_edge")}}
  </button>
  <div class="title" v-t="'task_engine_v2.edge_edit_tab2.exception_handle'"></div>
  <div class="section">
    <div class="block" v-if="exceedThenGoto !== null">
      <div class="label">
        {{$t("task_engine_v2.edge_edit_tab2.label_exceed_limit")}}
      </div>
      <div class="condition-row">
        {{$t("task_engine_v2.edge_edit_tab2.instruction_exeed_limit")}}
        <input class="input-limit" ref="input-content" v-tooltip="tooltip" @focus="onInputFocus"
          oninput="this.value = this.value.replace(/^0$/g, ''); this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(^[0-9]{1,2}).*/g, '$1');"
          v-model="dialogueLimit"/>
        {{$t("task_engine_v2.edge_edit_tab2.label_time")}}
        {{$t("task_engine_v2.edge_edit_tab2.label_then_goto")}}
        <dropdown-select
          class="select select-goto"
          ref="selectExceedThenGoto"
          :value="[exceedThenGoto]"
          @input="exceedThenGoto = $event[0]"
          :options="exceedThenGotoOptions"
          :fixedListWidth="false"
          :showCheckedIcon="false"
          :showSearchBar="true"
          width="200px"
          :inputBarStyle="selectStyle"/>
      </div>
    </div>
    <div class="block">
      <div class="label">
        {{$t("task_engine_v2.edge_edit_tab2.label_default_goto")}}
      </div>
      <div class="condition-row">
        {{$t("task_engine_v2.edge_edit_tab2.instruction_default_goto")}}
        {{$t("task_engine_v2.edge_edit_tab2.label_then_goto")}}
        <dropdown-select
          class="select select-goto"
          ref="selectElseThenGoto"
          :value="[elseInto]"
          @input="elseInto = $event[0]"
          :options="elseIntoOptions"
          :fixedListWidth="false"
          :showCheckedIcon="false"
          :showSearchBar="true"
          width="200px"
          :inputBarStyle="selectStyle"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import event from '@/utils/js/event';
import draggable from 'vuedraggable';
import DropdownSelect from '@/components/DropdownSelect';
import general from '@/modules/TaskEngine/_utils/general';
import ConditionBlock from './ConditionBlock';
import scenarioInitializer from '../_utils/scenarioInitializer';

export default {
  components: {
    draggable,
    'dropdown-select': DropdownSelect,
    'condition-block': ConditionBlock,
  },
  props: {
    validateTab: {
      type: Boolean,
      default: false,
    },
    edgeTab: {
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
    const edgeTab = this.edgeTab;
    const nodeId = edgeTab.nodeId;
    const nodeType = edgeTab.nodeType;
    const exceedThenGoto = edgeTab.exceedThenGoto || null;
    const elseInto = edgeTab.elseInto;
    const dialogueLimit = edgeTab.dialogueLimit || null;

    // add tmp id for edges
    const normalEdges = edgeTab.normalEdges.map((edge) => {
      const obj = { ...edge };
      obj.id = this.$uuid.v1();
      obj.valid = false;
      return obj;
    });

    this.doNothingEdge = { text: this.$t('task_engine_v2.to_node_option.do_nothing'), value: null };
    this.exitEdge = { text: `${this.$t('task_engine_v2.to_node_option.exit')} (ID: 0)`, value: '0' };
    this.parseFailedEdge = {
      text: this.$t('task_engine_v2.to_node_option.parse_fail'),
      value: nodeId,
    };
    this.addNewDialogueNodeEdge = {
      text: this.$t('task_engine_v2.to_node_option.add_new_dialogue_node'),
      value: 'add_new_dialogue_node',
      isButton: true,
    };

    // render toNodeOptions, exceedThenGotoOptions, elseIntoOptions
    const options = this.initialToNodeOptions.filter(option => option.value !== this.nodeId);
    const {
      toNodeOptions,
      exceedThenGotoOptions,
      elseIntoOptions,
    } = this.composeOptions(options, nodeType);
    return {
      nodeId,
      nodeType,
      normalEdges,
      dialogueLimit,
      newNodeOptions: undefined,
      toNodeOptions,
      exceedThenGoto,
      exceedThenGotoOptions,
      elseInto,
      elseIntoOptions,
      selectStyle: {
        height: '36px',
        'border-radius': '5px',
      },
      tooltip: {
        msg: this.$t('task_engine_v2.err_empty'),
        eventOnly: true,
        errorType: true,
        alignLeft: true,
        absolute: true,
      },
    };
  },
  watch: {
    validateTab(newV, oldV) {
      if (newV && !oldV) {
        let valid = true;
        if (this.$refs['input-content'] && !this.$refs['input-content'].value) {
          valid = false;
          this.$refs['input-content'].dispatchEvent(event.createEvent('tooltip-show'));
        }
        if (!this.normalEdges.length) {
          this.$emit('update:valid', valid);
        }
      }
    },
    dialogueLimit: {
      handler() {
        this.emitUpdate();
      },
    },
    exceedThenGoto: {
      handler() {
        if (this.exceedThenGoto === 'add_new_dialogue_node') {
          const newNodeID = scenarioInitializer.guid_sort();
          this.addNewDialogueNode(newNodeID);
          this.exceedThenGoto = newNodeID;
        }
        this.emitUpdate();
      },
    },
    elseInto: {
      handler() {
        if (this.elseInto === 'add_new_dialogue_node') {
          const newNodeID = scenarioInitializer.guid_sort();
          this.addNewDialogueNode(newNodeID);
          this.elseInto = newNodeID;
        }
        this.emitUpdate();
      },
    },
  },
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
      this.$emit('updateNewNodeOptions', this.newNodeOptions);
      this.updateOptions();
    },
    updateOptions() {
      const { toNodeOptions, exceedThenGotoOptions, elseIntoOptions } = this.composeOptions(
        [
          ...this.initialToNodeOptions,
          ...this.newNodeOptions.map(option => ({
            text: `${option.nodeName} (ID: ${option.nodeId})`,
            value: option.nodeId,
          })),
        ],
        this.nodeType,
      );
      this.toNodeOptions = toNodeOptions;
      this.exceedThenGotoOptions = exceedThenGotoOptions;
      this.elseIntoOptions = elseIntoOptions;
    },
    composeOptions(fullOptions, nodeType) {
      let toNodeOptions;
      let exceedThenGotoOptions;
      let elseIntoOptions;
      const options = fullOptions.filter(option => option.value !== this.nodeId);
      if (nodeType === 'entry') {
        toNodeOptions = [
          this.addNewDialogueNodeEdge,
          this.doNothingEdge,
        ].concat(options);
        exceedThenGotoOptions = [];
        elseIntoOptions = [
          this.addNewDialogueNodeEdge,
        ].concat(options);
      } else if (nodeType === 'dialogue' || nodeType === 'dialogue_2.0') {
        toNodeOptions = [
          this.addNewDialogueNodeEdge,
          this.doNothingEdge,
          this.exitEdge,
        ].concat(options);
        exceedThenGotoOptions = [
          this.addNewDialogueNodeEdge,
          this.exitEdge,
        ].concat(options);
        elseIntoOptions = [
          this.addNewDialogueNodeEdge,
          this.parseFailedEdge,
          this.exitEdge,
        ].concat(options);
      } else { // nodeType = nlu_pc or action
        toNodeOptions = [
          this.addNewDialogueNodeEdge,
          this.doNothingEdge,
          this.exitEdge,
        ].concat(options);
        exceedThenGotoOptions = [];
        elseIntoOptions = [
          this.addNewDialogueNodeEdge,
          this.exitEdge,
        ].concat(options);
      }
      return { toNodeOptions, exceedThenGotoOptions, elseIntoOptions };
    },
    updateNormalEdge(index, $event) {
      this.normalEdges[index] = $event;
      this.emitUpdate();
    },
    addEdge() {
      const edge = scenarioInitializer.initialEdge();
      edge.id = this.$uuid.v1();
      edge.valid = false;
      this.normalEdges.push(edge);
      this.emitUpdate();
    },
    deleteEdge(index) {
      this.normalEdges.splice(index, 1);
      this.emitUpdate();
    },
    emitUpdate() {
      const edgeTab = {
        elseInto: this.elseInto || null,
        normalEdges: this.normalEdges.map((edge) => {
          const { id, valid, ...rest } = edge;
          return rest;
        }),
      };
      if (this.dialogueLimit !== null) {
        edgeTab.dialogueLimit = parseInt(this.dialogueLimit, 10) || null;
      }
      if (this.exceedThenGoto !== null) {
        edgeTab.exceedThenGoto = this.exceedThenGoto;
      }
      // console.log(edgeTab);
      this.$emit('update', edgeTab);
    },
    isAllConditionBlockValid() {
      let valid = true;
      this.normalEdges.forEach((rule) => {
        if (!rule.valid) {
          valid = false;
        }
      });
      if (this.$refs['input-content'] && !this.$refs['input-content'].value) {
        valid = false;
      }
      this.$emit('update:valid', valid);
    },
    onInputFocus(evt) {
      evt.target.dispatchEvent(event.createEvent('tooltip-hide'));
    },
  },
};
</script>

<style lang="scss" scoped>

#edge-edit-tab {
  padding: 20px;
  @include font-14px();
  color: $color-font-active;
  .instruction {
    color: $color-font-mark;
  }
  .title {
    margin-bottom: 10px;
  }
  .section {
    background-color: $color-disabled;
    padding: 20px;
    .block {
      &:not(:last-child) {
        margin-bottom: 20px;
      }
      .label {
        margin-bottom: 10px;
      }
      .condition-row {
        display: flex;
        align-items: center;
        color: $color-font-normal;
        .input-limit {
          height: 32px;
          margin: 0px 10px;
          width: 50px;
        }
        .select {
          background: white;
          margin-left: 10px;
          border-radius: 2px;
        }
      }
    }
  }
  .button-add-edge {
    width: 100%;
    height: 32px;
    background: $color-primary;
    color: white;
    margin-bottom: 20px;
    cursor: pointer;
    border-radius: 3px;
  }
}
</style>
