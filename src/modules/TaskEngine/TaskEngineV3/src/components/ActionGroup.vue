<template lang="html">
<div id="action-group" class="action-group">
  <div class="delete-action-group-button" @click="deleteThisActionGroup">X</div>
  <div class="button-add-new-condition margin-top-bottom"
    v-if="actionGroup.conditionList.length == 0"
    @click="addNewCondition">
    {{$t("action_card.btn_add_new_condition")}}
  </div>
  <div class="condition-list-container">
    <template v-for="(condition, index) in actionGroup.conditionList">
      <div class="condition-card-row">
        <condition-card class="condition-card"
          :initialCondition="condition"
          :index="index"
          :initialEntityCollectorList="initialEntityCollectorList"
          @update="updateCondition(index, $event)"
          @deleteConditionButtonClick="deleteCondition(index)"
        ></condition-card>
        <div class="button-block button-box-add-new-condition"
          v-if="index == actionGroup.conditionList.length - 1"
          @click="addNewCondition">
          <a>+</a>
        </div>
        <div class="button-block"
          v-if="index != actionGroup.conditionList.length - 1">
        </div>
      </div>
    </template>
  </div>
  <div class="action-list-container">
    <template v-for="(action, index) in actionGroup.actionList">
      <action-card
        :initialAction="action"
        :initialSkillNameList="initialSkillNameList"
        @update="updateAction(index, $event)"
      ></action-card>
    </template>
  </div>
</div>
</template>

<script>
import i18nUtils from '../utils/i18nUtil';
import ConditionCard from '../components/ConditionCard.vue';
import ActionCard from '../components/ActionCard.vue';

export default {
  name: 'action-group',
  components: {
    'condition-card': ConditionCard,
    'action-card': ActionCard,
  },
  props: {
    initialActionGroup: {
      type: Object,
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
      i18n: {},
      actionGroup: JSON.parse(JSON.stringify(this.initialActionGroup)),
    };
  },
  computed: {},
  watch: {},
  methods: {
    updateCondition(index, newCondition) {
      this.actionGroup.conditionList[index] = newCondition;
      this.$emit('update', this.actionGroup);
    },
    updateAction(index, newAction) {
      this.actionGroup.actionList[index] = newAction;
      this.$emit('update', this.actionGroup);
    },
    deleteThisActionGroup() {
      this.$emit('deleteActionGroupButtonClick');
    },
    addNewCondition() {
      this.actionGroup.conditionList.push({
        target: {
          name: '',
          displayText: '',
          type: '',
        },
        comparisonOperator: {
          displayText: '',
          source: '',
          functionName: '',
          needContent: false,
        },
        content: '',
      });
    },
    deleteCondition(index) {
      this.actionGroup.conditionList.splice(index, 1);
      this.$emit('update', this.actionGroup);
    },
  },
  beforeMount() {
  },
  mounted() {
    this.i18n = i18nUtils.getLocaleMsgs(this.$i18n);
  },
};
</script>
