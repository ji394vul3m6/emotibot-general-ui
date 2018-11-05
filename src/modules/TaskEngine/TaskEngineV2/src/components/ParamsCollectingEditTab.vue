<template lang="html">
<div id="params-collecting-edit-tab">
  <draggable v-model="params" :options="{ghostClass:'ghost'}" @start="drag=true" @end="drag=false; emitUpdate();">
    <template v-for="(param, index) in params">
      <params-collecting-block
        :key="param.id"
        :nodeId="nodeId"
        :initialParam="param"
        :mapTableOptions="mapTableOptions"
        :validateParamsCollectingBlock="validateTab"
        @update:valid="$set(param, 'valid', $event); if ($event) {isAllParamsCollectingBlockValid()}"
        @update="updateParam(index, $event)"
        @deleteParam="deleteParam(index)">
      </params-collecting-block>
    </template>
  </draggable>
  <button
    class="button-add-params"
    @click="addParam()">
    {{$t("task_engine_v2.params_collecting_tab.button_add_params")}}
  </button>
</div>
</template>

<script>
import draggable from 'vuedraggable';
import DropdownSelect from '@/components/DropdownSelect';
import ParamsCollectingBlock from './ParamsCollectingBlock';
import scenarioInitializer from '../_utils/scenarioInitializer';

export default {
  name: 'params-collecting-edit-tab',
  components: {
    draggable,
    'dropdown-select': DropdownSelect,
    'params-collecting-block': ParamsCollectingBlock,
  },
  props: {
    validateTab: {
      type: Boolean,
      default: false,
    },
    paramsCollectingTab: {
      type: Object,
      required: true,
    },
    mapTableOptions: {
      type: Array,
      required: true,
    },
  },
  data() {
    const paramsCollectingTab = this.paramsCollectingTab;
    const nodeId = paramsCollectingTab.nodeId;
    // add tmp id for params
    const params = paramsCollectingTab.params.map((param) => {
      const obj = { ...param };
      obj.id = this.$uuid.v1();
      obj.valid = false;
      return obj;
    });
    return {
      nodeId,
      params,
    };
  },
  watch: {
    validateTab(newV, oldV) {
      if (newV && !oldV && !this.params.length) {
        this.$emit('update:valid', true);
      }
    },
  },
  methods: {
    emitUpdate() {
      const paramsCollectingTab = {
        params: this.params.map((param) => {
          delete param.id;
          delete param.valid;
          return param;
        }),
      };
      // console.log(paramsCollectingTab);
      this.$emit('update', paramsCollectingTab);
    },
    updateParam(index, $event) {
      this.params[index] = { ...this.params[index], ...$event };
      this.emitUpdate();
    },
    addParam() {
      const param = {};
      param.id = this.$uuid.v1();
      param.valid = false;
      param.parsers = [];
      const parser = scenarioInitializer.initialParser();
      parser.id = this.$uuid.v1();
      param.parsers.push(parser);
      this.params.push(param);
      this.emitUpdate();
    },
    deleteParam(index) {
      this.params.splice(index, 1);
      this.emitUpdate();
    },
    isAllParamsCollectingBlockValid() {
      let valid = true;
      this.params.forEach((param) => {
        if (!param.valid) {
          valid = false;
        }
      });
      this.$emit('update:valid', valid);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

#params-collecting-edit-tab{
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
  .button-add-params{
    height: 40px;
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
