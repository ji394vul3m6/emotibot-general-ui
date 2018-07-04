<template>
<div id="scenario_edit_page">
  <div id="page-header" class="page-header">
    <div class="scenario-name">
      <div class="arrow">&lt;</div>
      <input
        ref="scenarioName"
        v-model="scenarioName"
        :placeholder="$t('scenario_edit_page.placeholder_name_the_scenario')"
        @input="resizeScenarioNameInput">
      </input>
      <a>:</a>
      <v-select
        v-model="currentSkillName"
        :options="skillNameList"
        :searchable="false"
        label="skillName">
      </v-select>
    </div>
    <div class="multi-window-radio">
      <template v-for="(page, key, idx) in pages">
        <input :id="key" type="radio" name="name" :checked="currentPage==key"></input>
        <div>
          <label :for="key" style="padding:20px;"
                @click="pageChange(key)">
          {{ page.name }}
          </label>
        </div>
      </template>
    </div>
  </div>
  <div id="multi-window-container" class="multi-window-container">
    <skill-edit-page
      ref="skillEditPage"
      :currentPage="currentPage"
      :initialIdToNerMap="idToNerMap"
      :initialSkillNameList="skillNameList"
      @update="updateSkill"
      @updateIdToNerMap="updateIdToNerMap"
    ></skill-edit-page>
  </div>
  <div id="page-footer" class="page-footer">
    <button class="btn-basic btn-border primary" @click="toNextPage">{{saveButtonText}}</button>
    <button class="btn-basic btn-border" @click="$router.replace('/scenarios');">{{$t("general.close")}}</button>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import SkillEditPage from './SkillEditPage.vue';
import TriggerPage from './TriggerPage.vue';
import EntityCollectingPage from './EntityCollectingPage.vue';
import ActionPage from './ActionPage.vue';
import i18nUtils from '../utils/i18nUtil';
import api from './_api/taskEngine';
import general from '../utils/general';
import scenarioConvertor from '../utils/scenarioConvertor';

export default {
  name: 'scenario_edit_page',
  components: {
    'skill-edit-page': SkillEditPage,
    'trigger-page': TriggerPage,
    'entity-collecting-page': EntityCollectingPage,
    'action-page': ActionPage,
  },
  data () {
    return {
      i18n: {},
      appId: '',
      scenarioId: '',
      scenarioName: '',
      skills: {},
      currentSkill: {},
      currentSkillId: '',
      skillNameList: [],
      allPages: {},
      pages: {},
      currentPage: 'triggerPage',
      idToNerMap: {},
    }
  },
  computed: {
    currentSkillName: {
      get: function () {
        if (this.skills[this.currentSkillId] !== undefined){
          return {
            'skillId': this.currentSkillId,
            'skillName': this.skills[this.currentSkillId].skillName,
          }
        }
      },
      set: function (newValue) {
        this.currentSkillId = newValue.skillId;
      },
    },
    saveButtonText(){
      if (this.currentPage === 'actionPage'){
        return this.i18n.general.save_change;
      }else{
        return this.i18n.scenario_edit_page.button_save_and_next_step;
      }
    },
  },
  watch: {
    skills: {
      handler(newSkills, oldSkills) {
        this.updateSkillNameList();
      },
      deep: true,
    },
    currentSkillId: {
      handler(newSkillId, oldSkillId) {
        if (newSkillId === oldSkillId) return;
        if (this.skills[newSkillId] === undefined) return;

        // update pages
        if (newSkillId === 'mainSkill'){
          this.pages = this.allPages;
          this.currentPage = 'triggerPage';
        }else{
          // remove triggerPage
          const { triggerPage, ...newPages } = this.allPages;
          this.pages = newPages;
          this.currentPage = 'entityCollectingPage';
        }

        // update and propagate currentSkill
        const currentSkill = this.skills[newSkillId];
        this.$refs.skillEditPage.$emit('propSkill', currentSkill);
      },
      deep: true,
    },
  },
  methods: {
    pageChange(key){
      this.currentPage = key;
    },
    updateSkill(newSkill){
      this.skills[this.currentSkillId] = newSkill;
    },
    updateSkillNameList(){
      this.skillNameList = Object.keys(this.skills).map((skillId) => {
        return {
          'skillId': skillId,
          'skillName': this.skills[skillId].skillName,
        }
      });
    },
    addNewSkill(skillName){
      const skillId = this.$uuid.v1();
      this.skills[skillId] = {
        "skillName": skillName,
        "entityCollectorList": [],
        "actionGroupList": [],
        "relatedEntities": {
          "relatedEntityCollectorList": [],
          "relatedEntityMatrix": []
        },
        "re_parsers": [],
        "tde_setting": {},
      };
      this.updateSkillNameList();
      // route to new skill
      this.currentSkillId = skillId;
    },
    updateIdToNerMap(idToNerMap){
      // save new nerMap
      this.idToNerMap = idToNerMap;
      window.moduleData.idToNerMap = this.idToNerMap;
      this.saveScenario(window.moduleData);
    },
    loadScenario(scenarioId) {
      return api.loadScenario(scenarioId).then((data) => {
        window.moduleData = JSON.parse(data.result.editingContent);
        window.moduleDataLayouts = JSON.parse(data.result.editingLayout);
        this.scenarioName = window.moduleData.metadata.scenario_name;
        this.resizeScenarioNameInput();
        this.renderData(window.moduleData);
      }, (err) => {
        general.popErrorWindow(this, 'loadScenario error', err.message);
      });
    },
    resizeScenarioNameInput(){
      this.$refs.scenarioName.style.width = ((this.scenarioName.length+1) * 16) + 'px'
    },
    renderData(modulData){
      // propagate currentSkill
      this.skills = moduleData.skills;
      const currentSkill = this.skills[this.currentSkillId]
      this.$refs.skillEditPage.$emit('propSkill', currentSkill);
      // propagate ner map (entity map)
      this.idToNerMap = Array.isArray(moduleData.idToNerMap) ? {} : moduleData.idToNerMap;
    },
    saveScenario(content){
      return api.saveScenario(
        this.appId,
        this.scenarioId,
        JSON.stringify(content),
        JSON.stringify(window.moduleDataLayouts)
      ).then((data) => {
        window.moduleData = content;
        // TODO use toast instead
        console.log('场景已更新');
      }, (err) => {
        general.popErrorWindow(this, 'saveScenario error', err.message);
      });
    },
    toNextPage(){
      const keys = Object.keys(this.pages);
      const idx = keys.indexOf(this.currentPage) + 1;
      if (idx < keys.length){
        this.currentPage = keys[idx];
      }
      this.saveScenarioContent();
    },
    saveScenarioContent(){
      if(!this.isValidScenario()){
        return;
      }
      let content = {
        "version": "2.0",
        "setting": window.moduleData.setting,
        "metadata": window.moduleData.metadata,
        "msg_confirm": window.moduleData.msg_confirm,
        "skills": this.skills,
        "idToNerMap": this.idToNerMap,
      };
      content.metadata.scenario_name = this.scenarioName;
      content.metadata.update_time = general.getLocalDateTimeIsoString();
      this.saveScenario(content).then(()=>{
        this.$vueOnToast.pop('success', this.i18n.scenario_edit_page.toast_save_success, '')
        this.registerNluTdeScenario(this.scenarioId, content);
        this.publishScenario(content);
      });
    },
    registerNluTdeScenario(scenarioId, content){
      Object.keys(content.skills).map((skillId) => {
        const skill = content.skills[skillId];
        if(skill.entityCollectorList.length > 0){
          const data = scenarioConvertor.convertToRegistryData(scenarioId, skill, skillId);
          api.registerNluTdeScenario(data);
        }
      });
    },
    publishScenario(content){
      const convertedContent = scenarioConvertor.convertToNodes(content);
      this.saveScenario(convertedContent).then(()=>{
        api.publishScenario(this.appId, this.scenarioId).then((data) => {
          console.log('场景已发布');
          this.enableScenario();
        }, (err) => {
          general.popErrorWindow(this, 'publishScenario error', err.message);
        });
      });
    },
    enableScenario(){
      api.switchScenario(this.appId, this.scenarioId, true).then((data) => {
        console.log('场景已开启');
      }, (err) => {
        general.popErrorWindow(this, 'enableScenario error', err.message);
      });;
    },
    isValidScenario(){
      if(this.scenarioName == ''){
        general.popErrorWindow(this, this.i18n.error_msg.please_enter_the_scenario_name, '')
        return false;
      }
      return true;
    },
  },
  beforeMount() {
    this.appId = general.getAppId();
    this.scenarioId = this.$route.params.id
    this.i18n = i18nUtils.getLocaleMsgs(this.$i18n);
    this.currentSkillId = 'mainSkill';
    this.loadScenario(this.scenarioId);
  },
  mounted() {
    this.allPages = {
      'triggerPage': {
        'name': this.i18n.scenario_edit_page.tab.trigger,
        'component': 'trigger-page',
      },
      'entityCollectingPage': {
        'name': this.i18n.scenario_edit_page.tab.entity_collecting,
        'component': 'entity-collecting-page',
      },
      'actionPage': {
        'name': this.i18n.scenario_edit_page.tab.action,
        'component': 'action-page',
      },
    };
    this.pages = this.allPages;
    this.$root.$on('addNewSkill', this.addNewSkill);
  },
}
</script>
