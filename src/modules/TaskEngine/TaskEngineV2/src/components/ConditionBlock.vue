<template lang="html">
<div id="condition-block">
  <div class="button-delete-condition">
    <icon icon-type="delete" :enableHover="true" :size=24 @click=""/>
  </div>
  <div class="row row-function">
    <div class="label label-start">
      if
    </div>
    <dropdown-select
      class="select select-source"
      ref="selectSource"
      v-model="source"
      :options="sourceOptions"
      :showCheckedIcon="false"
      width="250px"
      :inputBarStyle="selectStyle"
    />
    <dropdown-select
      class="select select-function"
      ref="selectFunction"
      v-model="func"
      :options="funcOptions"
      :showCheckedIcon="false"
      width="160px"
      :inputBarStyle="selectStyle"
    />
    <button
      class="button button-add-if"
      @click="">
      ＋and if
    </button>
  </div>
  <div class="row row-content">
    <div class="label label-start">
      {{$t("task_engine_v2.edge_edit_tab.label_content")}}
    </div>
    <input class="input-content"></input>
  </div>
  <div class="row row-then-goto">
    <div class="label label-start">
      {{$t("task_engine_v2.edge_edit_tab.label_then_goto")}}
    </div>
    <dropdown-select
      class="select select-goto"
      ref="selectGoto"
      v-model="goto"
      :options="gotoOptions"
      :showCheckedIcon="false"
      width="200px"
      :inputBarStyle="selectStyle"
    />
  </div>
</div>
</template>

<script>
import DropdownSelect from '@/components/DropdownSelect';

export default {
  name: 'condition-block',
  components: {
    'dropdown-select': DropdownSelect,
  },
  props: {
    initialEdge: {
      type: Object,
      required: true,
    },
    toNodeOptions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      source: [],
      sourceOptions: [],
      func: [],
      funcOptions: [],
      goto: [],
      gotoOptions: [],
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

#condition-block{
  position: relative;
  display: flex;
  flex-direction: column;
  background: #F3F7F9;
  padding: 20px 20px 20px 20px;
  border: 1px solid $color-borderline;
  border-radius: 5px;
  margin: 0px 0px 20px 0px;
  cursor: move;
  .button-delete-condition{
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .row{
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 36px;
    &:not(:first-child){
      margin: 10px 0px 0px 0px;
    }
    .label{
      height: 36px;
      line-height: 36px;
      font-size: 16px;
    }
    .label-start{
      width: 80px;
    }
    .select{
      background: white;
    }
    .select-function{
      margin-left: 10px;
    }
    input{
      height: 36px;
    }
    .input-content{
      width: 420px;
    }
    .button{
      background: #57C7D4;
      height: 36px;
      margin-left: 15px;
      border-radius: 5px;
      color: white;
      font-size: 14px;
      font-weight: 600;
    }
    .button-add-if{
      width: 80px;
    }
  }
}
</style>
