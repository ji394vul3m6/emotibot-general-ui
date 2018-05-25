<template>
<div id="skill-editor" class="skill-editor">
  <keep-alive>
    <trigger-page ref="triggerPage"
      v-if="currentPage === 'triggerPage'"
      :initialTriggerList="skill.triggerList"
      @update="updateTriggerList"
    ></trigger-page>
    <entity-collecting-page ref="entityCollectingPage"
      v-if="currentPage === 'entityCollectingPage'"
      :initialEntityCollectorList="skill.entityCollectorList"
      :initialIdToNerMap="initialIdToNerMap"
      :initialRelatedEntities="skill.relatedEntities"
      @update="updateEntityCollectorList"
      @updateIdToNerMap="updateIdToNerMap"
      @updateRelatedEntities="updateRelatedEntities"
    ></entity-collecting-page>
    <action-page ref="actionPage"
      v-if="currentPage === 'actionPage'"
      :initialActionGroupList="skill.actionGroupList"
      :initialEntityCollectorList="skill.entityCollectorList"
      :initialSkillNameList="initialSkillNameList"
      @update="updateActionGroupList"
    ></action-page>
  </keep-alive>
</div>
</template>

<script>
import axios from 'axios';
import TriggerPage from './TriggerPage.vue';
import EntityCollectingPage from './EntityCollectingPage.vue';
import ActionPage from './ActionPage.vue';
import i18nUtils from '../utils/i18nUtil';
import api from './_api/taskEngine';
import general from '../utils/general';
import scenarioConvertor from '../utils/scenarioConvertor';

export default {
  name: 'skill-editor',
  components: {
    'trigger-page': TriggerPage,
    'entity-collecting-page': EntityCollectingPage,
    'action-page': ActionPage,
  },
  props: {
    currentPage: {
      type: String,
      required: true,
    },
    initialIdToNerMap: {
      type: Object,
      required: true,
    },
    initialSkillNameList: {
      type: Array,
      required: true,
    },
  },
  data () {
    return {
      i18n: {},
      skill: {
        triggerList: [],
        entityCollectorList: [],
        actionGroupList: [],
        relatedEntities: {
          relatedEntityCollectorList: [],
          relatedEntityMatrix: []
        },
      },
    }
  },
  computed: {},
  watch: {},
  methods: {
    propSkill(newSkill) {
      this.skill = JSON.parse(JSON.stringify(newSkill));
      this.$nextTick(() => {
        this.$refs[this.currentPage].$emit('rerender', {});
      });
    },
    updateTriggerList(newTriggerList){
      this.skill.triggerList = newTriggerList;
      this.$emit('update', this.skill);
    },
    updateEntityCollectorList(newEntityCollectorList){
      this.skill.entityCollectorList = newEntityCollectorList;
      this.$emit('update', this.skill);
    },
    updateActionGroupList(newActionGroupList){
      this.skill.actionGroupList = newActionGroupList;
      this.$emit('update', this.skill);
    },
    updateRelatedEntities(relatedEntities){
      this.skill.relatedEntities = relatedEntities;
      this.$emit('update', this.skill);
    },
    updateIdToNerMap(idToNerMap){
      this.$emit('updateIdToNerMap', idToNerMap);
    },
  },
  beforeMount() {
    this.i18n = i18nUtils.getLocaleMsgs(this.$i18n);
    this.$on('propSkill', this.propSkill);
  },
  mounted() {},
}
</script>
