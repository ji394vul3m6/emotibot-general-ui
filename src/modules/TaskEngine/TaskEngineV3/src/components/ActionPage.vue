<template lang="html">
<div id="action-page" class="page action-page">
  <div class="title-container">
    <div class="title">{{$t("action_page.label_title")}}</div>
  </div>
  <div class="content-container">
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
    <div class="add-new-action-container">
      <div class="add-new-action-btn" @click="addNewActionGroup('msg')">{{$t("action_page.button_add_new_msg")}}</div>
      <div class="add-new-action-btn" @click="addNewActionGroup('webhook')">{{$t("action_page.button_add_new_webhook")}}</div>
      <div class="add-new-action-btn" @click="addNewActionGroup('goto')">{{$t("action_page.button_add_new_goto")}}</div>
    </div>
  </div>
</div>
</template>

<script>
import ActionGroup from '../components/ActionGroup.vue';

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
