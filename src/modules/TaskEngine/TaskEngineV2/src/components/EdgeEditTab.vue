<template lang="html">
<!-- instruction: '使用连线连接此节点与其他节点',
button_add: '＋增加',
button_add_edge: '＋增加连线',
label_content: '内容',
label_then_goto: '则前往',
label_pattern: '模式',
label_nth_match: '第几符合词',
label_mapping_table: '转换数据',
label_source_key: '来源键',
label_target_key: '目的键',
label_link: '连结',
label_similarity_threshold: '相日度门槛',
label_sentence: '句子',
label_compare_operator: '比较方式',
label_key: '键',
lable_value: '值',
label_exceed_limit: '超过轮次',
instruction_exeed_limit: '当此节点出话超过',
label_time: '次',
label_default_goto: '预设前往',
instruction_default_goto: '当所有规则都无法符合时', -->
<div id="edge-edit-tab">
  <div class="instruction block">
    {{$t("task_engine_v2.edge_edit_tab.instruction")}}
  </div>
  <condition-block>
  </condition-block>
  <!-- <draggable v-model="actionGroupList" :options="{ghostClass:'ghost'}" @start="drag=true" @end="drag=false">
    <div class="action-group-container" v-for="(actionGroup, index) in actionGroupList">
      <action-group :key="actionGroup.actionGroupId"
        :initialActionGroup="actionGroup"
        :initialEntityCollectorList="initialEntityCollectorList"
        :initialSkillNameList="initialSkillNameList"
        @update="updateActionGroup(index, $event)"
        @deleteActionGroupButtonClick="deleteActionGroup(index)"
      ></action-group>
    </div>
  </draggable> -->
  <button
    class="button-add-edge"
    @click="">
    {{$t("task_engine_v2.edge_edit_tab.button_add_edge")}}
  </button>
  <div class="exceed_limit block">
    <div class="condition-row">
      <div class="label label-bold">
        {{$t("task_engine_v2.edge_edit_tab.label_exceed_limit")}}
      </div>
      <div class="label label-margin-left">
        {{$t("task_engine_v2.edge_edit_tab.instruction_exeed_limit")}}
      </div>
      <input class="input-limit"></input>
      <div class="label">
        {{$t("task_engine_v2.edge_edit_tab.label_time")}}
      </div>
      <div class="label label-margin-left">
        {{$t("task_engine_v2.edge_edit_tab.label_then_goto")}}
      </div>
      <dropdown-select
        class="select select-goto"
        ref="selectExceedThenGoto"
        v-model="exceedThenGoto"
        :options="nodeOptions"
        :showCheckedIcon="false"
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
        v-model="exceedThenGoto"
        :options="nodeOptions"
        :showCheckedIcon="false"
        width="200px"
        :inputBarStyle="selectStyle"
      />
    </div>
  </div>
</div>
</template>

<script>
import DropdownSelect from '@/components/DropdownSelect';
import ConditionBlock from './ConditionBlock';

export default {
  name: 'edge-edit-tab',
  components: {
    'dropdown-select': DropdownSelect,
    'condition-block': ConditionBlock,
  },
  data() {
    return {
      exceedThenGoto: [],
      nodeOptions: [],
      selectStyle: {
        height: '36px',
        'border-radius': '5px',
      },
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
    // moreOptions(scenario) {
    // },
  },
  beforeMount() {},
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
    margin: 0px 0px 10px 0px;
    cursor: pointer;
    &:hover{
      transition: background-color 0.5s ease;
      background: lighten(#46BE8A, 10%);
    }
  }
}
</style>
