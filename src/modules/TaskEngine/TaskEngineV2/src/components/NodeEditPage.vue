<template lang="html">
<div id="node-edit-page">
  <div class="nav-bar">
    <template v-for="(tab, idx) in tabs">
      <div class="tab-button"
        :key="tab.type"
        :class="{ 'active': tab.type === currentTab }"
        @click="changeTab(tab.type)">
        <icon :icon-type="tab.icon" :enableHover="false" :size=15></icon>
        <div class="tab-name">{{ tab.name }}</div>
      </div>
    </template>
  </div>
  <div class="content">
    <keep-alive>
      <trigger-edit-tab ref="triggerTab"
        v-if="currentTab === 'triggerTab'"
      ></trigger-edit-tab>
      <setting-edit-tab ref="settingTab"
        v-if="currentTab === 'settingTab'"
        :initialSettingTab="initialSettingTab"
        @update="settingTab = $event"
      ></setting-edit-tab>
      <nlu-pc-setting-tab ref="nluPCSettingTab"
        v-if="currentTab === 'nluPCSettingTab'"
        :initialNLUPCSettingTab="nluPCSettingTab"
        @update="nluPCSettingTab = $event"
      ></nlu-pc-setting-tab>
      <entity-collecting-tab ref="entityCollectingTab"
        v-if="currentTab === 'entityCollectingTab'"
        :initialEntityCollectorList="entityCollectingTab.entityCollectorList || []"
        :initialIdToNerMap="{}"
        :initialRelatedEntities="entityCollectingTab.relatedEntities || {}"
        :initialREParsers="entityCollectingTab.re_parsers || []"
        :initialTDESetting="entityCollectingTab.tde_setting || {}"
        :initialRegisterJSON="entityCollectingTab.register_json || {}"
        @update="entityCollectingTab.entityCollectorList = $event"
        @updateREParsers="entityCollectingTab.re_parsers = $event"
        @updateTDESetting="entityCollectingTab.tde_setting = $event"
        @updateRegisterJSON="entityCollectingTab.register_json = $event"
      ></entity-collecting-tab>
      <edge-edit-tab ref="edgeTab"
        v-if="currentTab === 'edgeTab'"
        :initialEdgeTab="initialEdgeTab"
        :initialToNodeOptions="toNodeOptions"
        @update="edgeTab = $event"
      ></edge-edit-tab>
    </keep-alive>
  </div>
</div>
</template>

<script>
import EntityCollectingTab from '@/modules/TaskEngine/TaskEngineV3/src/components/EntityCollectingPage';
import TriggerEditTab from './TriggerEditTab';
import SettingEditTab from './SettingEditTab';
import EdgeEditTab from './EdgeEditTab';
// import scenarioConvertor from '../_utils/scenarioConvertor';
import NLUPCSettingEditTab from './NLUPCSettingEditTab';
import optionConfig from '../_utils/optionConfig';

export default {
  name: 'node-edit-page',
  components: {
    'trigger-edit-tab': TriggerEditTab,
    'setting-edit-tab': SettingEditTab,
    'edge-edit-tab': EdgeEditTab,
    'entity-collecting-tab': EntityCollectingTab,
    'nlu-pc-setting-tab': NLUPCSettingEditTab,
  },
  props: {
    extData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentTab: 'settingTab',
      node: {},
      nodeType: undefined,
      toNodeOptions: {},
      allTabs: this.getAllTabs(),
      initialSettingTab: {},
      initialEdgeTab: {},
      settingTab: undefined,
      nluPCSettingTab: undefined,
      entityCollectingTab: undefined,
      edgeTab: undefined,
    };
  },
  computed: {
    tabs() {
      const nodeType = this.node.nodeType;
      const nodeType2TabsMap = optionConfig.nodeType2Tabs();
      if (nodeType in nodeType2TabsMap) {
        const nodeTabs = nodeType2TabsMap[this.node.nodeType];
        this.currentTab = nodeTabs[0];
        return nodeTabs.map(tab => this.allTabs[tab]);
      }
      this.currentTab = 'settingTab';
      return ['settingTab', 'edgeTab'].map(tab => this.allTabs[tab]);
    },
  },
  watch: {
  },
  methods: {
    renderData() {
      this.node = JSON.parse(JSON.stringify(this.extData.node));
      this.toNodeOptions = JSON.parse(JSON.stringify(this.extData.toNodeOptions));
      this.nodeType = this.node.nodeType;
      // render tab data
      let tabs = [];
      const nodeType2TabsMap = optionConfig.nodeType2Tabs();
      if (this.nodeType in nodeType2TabsMap) {
        tabs = nodeType2TabsMap[this.nodeType];
      }
      tabs.forEach((tab) => {
        if (tab === 'settingTab') {
          this.settingTab = this.node.settingTab;
          this.initialSettingTab = JSON.parse(JSON.stringify(this.settingTab));
          this.initialSettingTab.nodeType = this.nodeType;
        } else if (tab === 'edgeTab') {
          this.edgeTab = this.node.edgeTab;
          this.initialEdgeTab = JSON.parse(JSON.stringify(this.edgeTab));
          this.initialEdgeTab.nodeType = this.nodeType;
          this.initialEdgeTab.nodeId = this.node.nodeId;
        } else if (tab === 'entityCollectingTab') {
          this.entityCollectingTab = this.node.entityCollectingTab;
        } else if (tab === 'nluPCSettingTab') {
          this.nluPCSettingTab = this.node.nluPCSettingTab;
        }
      });
    },
    changeTab(tab) {
      this.currentTab = tab;
    },
    getAllTabs() {
      return {
        triggerTab: {
          type: 'triggerTab',
          name: this.$t('task_engine_v2.node_edit_page.tabs.trigger'),
          icon: 'setting',
        },
        settingTab: {
          type: 'settingTab',
          name: this.$t('task_engine_v2.node_edit_page.tabs.setting'),
          icon: 'setting',
        },
        edgeTab: {
          type: 'edgeTab',
          name: this.$t('task_engine_v2.node_edit_page.tabs.edge'),
          icon: 'setting',
        },
        entityCollectingTab: {
          type: 'entityCollectingTab',
          name: this.$t('task_engine_v3.scenario_edit_page.tab.entity_collecting'),
          icon: 'setting',
        },
        nluPCSettingTab: {
          type: 'nluPCSettingTab',
          name: this.$t('task_engine_v2.node_edit_page.tabs.setting'),
          icon: 'setting',
        },
      };
    },
    validResult(nodeResult) {
      // TODO: add node validation logics
      if ('edgeTab' in nodeResult) {
        return true;
      }
      return true;
    },
    validate() {
      const nodeResult = {
        nodeId: this.node.nodeId,
        nodeName: '',
        nodeType: this.node.nodeType,
        settingTab: this.settingTab,
        edgeTab: this.edgeTab,
        entityCollectingTab: this.entityCollectingTab,
        nluPCSettingTab: this.nluPCSettingTab,
      };
      if (this.node.nodeType === 'entry') {
        nodeResult.nodeName = this.$t('task_engine_v2.node_type.entry');
      } else if (this.node.nodeType === 'nlu_pc') {
        nodeResult.nodeName = this.nluPCSettingTab.nodeName;
      } else {
        nodeResult.nodeName = this.settingTab.nodeName;
      }
      if (this.validResult(nodeResult)) {
        // console.log(tabData);
        // const nodeResult = scenarioConvertor.convertTabDataToNode(tabData);
        // console.log(nodeResult);
        // console.log(JSON.stringify(nodeResult));
        this.$emit(
          'validateSuccess',
          nodeResult,
        );
      }
    },
  },
  beforeMount() {
    this.renderData();
  },
  mounted() {
    this.$on('validate', this.validate);
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

#node-edit-page{
  width: 1060px;
  height: 70vh;
  display: flex;
  flex-direction: row;
  .nav-bar{
    display: flex;
    flex-direction: column;
    flex: 0 0 160px;
    border-right: 1px solid $color-borderline;
    .tab-button{
      display: flex;
      flex-direction: row;
      height: 44px;
      line-height: 44px;
      font-size: 14px;
      color: $color-font-normal;
      padding: 0px 0px 0px 30px;
      margin: 0px 0px 4px 0px;
      align-items: center;
      cursor: pointer;
      border-right: 2px solid transparent;
      &:hover{
        transition: border 0.3s ease;
        border-right: 2px solid #DDDDDD;
      }
      &.active{
        color: $color-primary;
        border-right: 2px solid $color-primary;
      }
      .tab-name{
        margin-left: 8px;
      }
    }
  }
  .content{
    flex: 1 1 auto;
    @include auto-overflow();
    @include customScrollbar();  
  }
}
</style>
