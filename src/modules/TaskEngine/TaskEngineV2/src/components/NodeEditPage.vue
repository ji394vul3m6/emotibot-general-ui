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
import TriggerEditTab from './TriggerEditTab';
import SettingEditTab from './SettingEditTab';
import EdgeEditTab from './EdgeEditTab';
import scenarioConvertor from '../_utils/scenarioConvertor';

export default {
  name: 'node-edit-page',
  components: {
    'trigger-edit-tab': TriggerEditTab,
    'setting-edit-tab': SettingEditTab,
    'edge-edit-tab': EdgeEditTab,
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
      jsonVersion: undefined,
      toNodeOptions: this.getToNodeOptions(),
      allTabs: this.getAllTabs(),
      initialSettingTab: {},
      initialEdgeTab: {},
      settingTab: undefined,
      edgeTab: undefined,
      nodeType2Tabs: {
        entry: ['triggerTab', 'edgeTab'],
        dialogue: ['settingTab', 'edgeTab'],
      },
    };
  },
  computed: {
    tabs() {
      const nodeType = this.node.node_type;
      if (nodeType in this.nodeType2Tabs) {
        const nodeTabs = this.nodeType2Tabs[this.node.node_type];
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
      this.nodeType = this.node.node_type;
      this.jsonVersion = this.extData.jsonVersion;
      // render tab data
      let tabs = [];
      if (this.nodeType in this.nodeType2Tabs) {
        tabs = this.nodeType2Tabs[this.nodeType];
      }
      tabs.forEach((tab) => {
        if (tab === 'settingTab') {
          this.initialSettingTab = this.renderSettingTab();
        } else if (tab === 'edgeTab') {
          this.initialEdgeTab = this.renderEdgeTab();
        }
      });
    },
    renderSettingTab() {
      const tab = {};
      // render parser, targetEntities, skipIfKeyExist
      const c = this.node.edges[1].condition_rules;
      if (c.length > 0 && c[0].length > 1) {
        tab.parser = c[0][1].functions[0].function_name;
        tab.targetEntities = c[0][1].functions[0].content.tags.split(',');
        tab.skipIfKeyExist = c[0][0].functions[0].content.map(obj => obj.key.split('_')[0]);
      } else {
        tab.parser = 'none';
        tab.targetEntities = [];
        tab.skipIfKeyExist = [];
      }

      // render responses
      tab.initialResponse = this.node.content.questions.find(
        q => q.question_type === 'initial_response',
      ).msg;
      tab.failureResponse = this.node.content.questions.find(
        q => q.question_type === 'failure_response',
      ).msg;

      // render parseFromThisNode
      tab.parseFromThisNode = this.node.default_parser_with_suffix;

      // render nodeType, nodeName
      tab.nodeType = this.node.node_type || '';
      tab.nodeName = this.node.description || '';

      // initialize settingTab
      this.settingTab = {
        nodeName: tab.nodeName,
        parser: tab.parser,
        targetEntities: tab.targetEntities,
        skipIfKeyExist: tab.skipIfKeyExist,
        initialResponse: tab.initialResponse,
        failureResponse: tab.failureResponse,
        parseFromThisNode: tab.parseFromThisNode,
      };
      return tab;
    },
    renderEdgeTab() {
      const tab = {};
      // render nodeType
      tab.nodeId = this.node.node_id || '';
      tab.nodeType = this.node.node_type || '';

      // render edges, normalEdges
      tab.edges = this.node.edges;
      tab.normalEdges = tab.edges.filter(edge => edge.edge_type === 'normal' || edge.edge_type === 'qq');

      // render exceedThenGoto, elseInto
      if (tab.nodeType !== 'entry') {
        const exceedGotoEdge = tab.edges.find(edge => edge.edge_type === 'exceedThenGoTo');
        tab.exceedThenGoto = exceedGotoEdge.to_node_id;
      }
      const elseIntoEdge = tab.edges.find(edge => edge.edge_type === 'else_into');
      tab.elseInto = elseIntoEdge.to_node_id;

      // render dialogueLimit
      if (this.node.node_dialogue_cnt_limit) {
        tab.dialogueLimit = this.node.node_dialogue_cnt_limit;
      } else {
        const dialogueLimitEdge = tab.edges.find(edge =>
          edge.edge_type === 'hidden' &&
          edge.actions &&
          edge.actions.length >= 1 &&
          edge.actions[0].key === 'sys_node_dialogue_cnt_limit',
        );
        if (dialogueLimitEdge) {
          tab.dialogueLimit = dialogueLimitEdge.actions[0].val;
        } else {
          tab.dialogueLimit = 3;
        }
      }

      // initialize edgeTab
      this.edgeTab = {
        dialogueLimit: tab.dialogueLimit,
        exceedThenGoto: tab.exceedThenGoto,
        elseInto: tab.elseInto,
        normalEdges: tab.normalEdges,
      };
      return tab;
    },
    changeTab(tab) {
      this.currentTab = tab;
    },
    getNodeData() {
      if (this.extData.node) {
        return JSON.parse(JSON.stringify(this.extData.node));
      }
      return {};
    },
    getToNodeOptions() {
      if (this.extData.toNodeOptions) {
        // return JSON.parse(JSON.stringify(this.extData.toNodeOptions));
        return this.extData.toNodeOptions;
      }
      return {};
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
      };
    },
    validTabResult(tabResult) {
      // TODO: add node validation logics
      if ('edgeTab' in tabResult) {
        return true;
      }
      return false;
    },
    validate() {
      const tabData = {
        nodeId: this.node.node_id,
        nodeType: this.node.node_type,
        settingTab: this.settingTab,
        edgeTab: this.edgeTab,
      };
      if (this.node.node_type === 'entry') {
        tabData.nodeName = this.$t('task_engine_v2.node_type.entry');
      } else {
        tabData.nodeName = this.settingTab.nodeName;
      }
      if (this.validTabResult(tabData)) {
        // console.log(tabData);
        const nodeResult = scenarioConvertor.convertTabDataToNode(tabData, this.jsonVersion);
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
    console.log(this.node);
    this.$on('validate', this.validate);
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

#node-edit-page{
  width: 880px;
  height: 70vh;
  min-width: 880px;
  min-height: 70vh;
  display: flex;
  flex-direction: row;
  .nav-bar{
    display: flex;
    flex-direction: column;
    width: 160px;
    border-right: 1px solid $color-borderline;
    .tab-button{
      display: flex;
      flex-direction: row;
      height: 44px;
      line-height: 44px;
      font-size: 14px;
      color: $color-font-normal;
      padding: 0px 0px 0px 60px;
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
