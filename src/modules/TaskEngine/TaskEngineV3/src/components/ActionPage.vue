<template lang="html">
<div id="action-page" class="page action-page">
  <div class="add-action-container">
    <div class="row">
      <div class="label-add-action">{{$t("task_engine_v3.action_page.label_add_action")}}</div>
      <div class="icon-container" v-tooltip="{msg: 'tooltip'}">
        <icon icon-type="info" :size=18 />
      </div>
    </div>
    <div class="row row-margin-top">
      <text-button
        class="button-add-action-group"
        button-type='primary'
        @click="addNewActionGroup('msg')">
        {{$t("task_engine_v3.action_page.button_add_new_msg")}}
      </text-button>
      <text-button
        class="button-add-action-group"
        button-type='primary'
        @click="addNewActionGroup('webhook')">
        {{$t("task_engine_v3.action_page.button_add_new_webhook")}}
      </text-button>
      <text-button
        class="button-add-action-group"
        button-type='primary'
        @click="addNewActionGroup('goto')">
        {{$t("task_engine_v3.action_page.button_add_new_goto")}}
      </text-button>
    </div>
  </div>
  <div class="action-group-list-container">
    <template v-for="(actionGroup, index) in actionGroupList">
      <action-group :key="actionGroup.actionGroupId"
        :initialActionGroup="actionGroup"
        :initialEntityCollectorList="initialEntityCollectorList"
        :initialSkillNameList="initialSkillNameList"
        @update="updateActionGroup(index, $event)"
        @deleteActionGroupButtonClick="deleteActionGroup(index)"
      ></action-group>
    </template>
  </div>
</div>
</template>

<script>
import ActionGroup from '../components/ActionGroup';

export default {
  name: 'action-page',
  components: {
    'action-group': ActionGroup,
  },
  props: {
    initialActionGroupList: {
      type: Array,
      required: true,
    },
    initialEntityCollectorList: {
      type: Array,
      required: true,
    },
    initialSkillNameList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      actionGroupList: JSON.parse(JSON.stringify(this.initialActionGroupList)),
    };
  },
  computed: {},
  watch: {},
  methods: {
    updateActionGroup(index, newActionGroup) {
      this.actionGroupList[index] = newActionGroup;
      this.$emit('update', this.actionGroupList);
    },
    addNewActionGroup(type) {
      const actionGroup = {
        actionGroupId: this.$uuid.v1(),
        actionList: [],
        conditionList: [],
      };
      if (type === 'msg') {
        actionGroup.actionList.push({
          type: 'msg',
          msg: '',
        });
      } else if (type === 'webhook') {
        actionGroup.actionList.push({
          type: 'webhook',
          variable_name: '',
          method: 'GET',
          url: '',
          contentTypes: 'application/json',
          body: '',
        });
      } else if (type === 'goto') {
        actionGroup.actionList.push({
          type: 'goto',
          targetSkillId: 'exit',
        });
      }
      this.actionGroupList.push(actionGroup);
      this.$emit('update', this.actionGroupList);
    },
    deleteActionGroup(index) {
      this.actionGroupList.splice(index, 1);
      this.$emit('update', this.actionGroupList);
    },
    rerender() {
      this.actionGroupList = JSON.parse(JSON.stringify(this.initialActionGroupList));
    },
  },
  beforeMount() {},
  mounted() {
    this.$on('rerender', this.rerender);
  },
  activated() {
    this.rerender();
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/teVariable.scss";
#action-page{
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  padding: 20px;
  .add-action-container{
    flex: 0 0 auto;
    padding: 10px;
    height: 86px;
    background: #f8f8f8;
    .row{
      display: flex;
      flex-direction: row;
      .label-add-action{
        color: $color-font-active;
        line-height: 28px;
        font-size: 14px;
      }
      .icon-container{
        margin-left: 4px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .button-add-action-group{
        margin-right: 10px;
      }
    }
    .row-margin-top{
      margin-top: 10px;
    }
  }
  .action-group-list-container{
    flex: 1 1 auto;
    overflow: auto;
    margin-top: 10px;
  }
}
</style>
