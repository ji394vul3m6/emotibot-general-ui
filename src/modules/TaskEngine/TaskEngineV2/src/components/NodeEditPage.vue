<template lang="html">
<div id="node-edit-page" :style="pageStyle">
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
        :initialTriggerTab="initialTriggerTab"
        :globalVarOptions="globalVarOptions"
        :mapTableOptions="mapTableOptions"
        @update="triggerTab = $event"
      ></trigger-edit-tab>
      <setting-edit-tab ref="settingTab"
        v-if="currentTab === 'settingTab'"
        :initialSettingTab="initialSettingTab"
        :globalVarOptions="globalVarOptions"
        @update="settingTab = $event"
      ></setting-edit-tab>
      <setting-basic-edit-tab ref="settingBasicTab"
        v-if="currentTab === 'settingBasicTab'"
        :initialSettingBasicTab="settingBasicTab"
        @update="settingBasicTab = $event"
      ></setting-basic-edit-tab>
      <entity-collecting-edit-tab ref="entityCollectingTab"
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
      ></entity-collecting-edit-tab>
      <params-collecting-edit-tab ref="paramsCollectingTab"
        v-if="currentTab === 'paramsCollectingTab'"
        :initialParamsCollectingTab="initialParamsCollectingTab"
        :mapTableOptions="mapTableOptions"
        @update="paramsCollectingTab = $event"
      ></params-collecting-edit-tab>
      <params-collecting-edge-edit-tab ref="paramsCollectingEdgeTab"
        v-if="currentTab === 'paramsCollectingEdgeTab'"
        :initialPCEdgeTab="initialParamsCollectingEdgeTab"
        :initialToNodeOptions="toNodeOptions"
        :globalVarOptions="globalVarOptions"
        :mapTableOptions="mapTableOptions"
        @update="paramsCollectingEdgeTab = $event"
        @updateNewNodeOptions="updateNewNodeOptions"
      ></params-collecting-edge-edit-tab>
      <edge-edit-tab ref="edgeTab"
        v-if="currentTab === 'edgeTab'"
        :initialEdgeTab="initialEdgeTab"
        :initialToNodeOptions="toNodeOptions"
        :globalVarOptions="globalVarOptions"
        :mapTableOptions="mapTableOptions"
        @update="edgeTab = $event"
        @updateNewNodeOptions="updateNewNodeOptions"
      ></edge-edit-tab>
      <restful-setting-edit-tab ref="restfulSettingTab"
        v-if="currentTab === 'restfulSettingTab'"
        :initialRestfulSettingTab="restfulSettingTab"
        :initialToNodeOptions="toNodeOptions"
        @update="restfulSettingTab = $event"
      ></restful-setting-edit-tab>
      <restful-edge-edit-tab ref="restfulEdgeTab"
        v-if="currentTab === 'restfulEdgeTab'"
        :nodeId="node.nodeId"
        :initialRestfulEdgeTab="restfulEdgeTab"
        :initialToNodeOptions="toNodeOptions"
        @update="restfulEdgeTab = $event"
        @updateNewNodeOptions="updateNewNodeOptions"
      ></restful-edge-edit-tab>
    </keep-alive>
    </keep-alive>
  </div>
</div>
</template>

<script>
import general from '@/modules/TaskEngine/_utils/general';
import mappingtable from '@/modules/TaskEngine/_api/taskEngine_mappingtable';
import EntityCollectingEditTab from '@/modules/TaskEngine/TaskEngineV3/src/components/EntityCollectingPage';
import TriggerEditTab from './TriggerEditTab';
import SettingEditTab from './SettingEditTab';
import EdgeEditTab from './EdgeEditTab';
import ParamsCollectingEditTab from './ParamsCollectingEditTab';
import ParamsCollectingEdgeEditTab from './ParamsCollectingEdgeEditTab';
// import scenarioConvertor from '../_utils/scenarioConvertor';
import SettingBasicEditTab from './SettingBasicEditTab';
import RestfulSettingEditTab from './RestfulSettingEditTab';
import RestfulEdgeEditTab from './RestfulEdgeEditTab';
import optionConfig from '../_utils/optionConfig';
import scenarioConvertor from '../_utils/scenarioConvertor';

export default {
  name: 'node-edit-page',
  components: {
    'trigger-edit-tab': TriggerEditTab,
    'setting-edit-tab': SettingEditTab,
    'setting-basic-edit-tab': SettingBasicEditTab,
    'edge-edit-tab': EdgeEditTab,
    'entity-collecting-edit-tab': EntityCollectingEditTab,
    'restful-setting-edit-tab': RestfulSettingEditTab,
    'restful-edge-edit-tab': RestfulEdgeEditTab,
    'params-collecting-edit-tab': ParamsCollectingEditTab,
    'params-collecting-edge-edit-tab': ParamsCollectingEdgeEditTab,
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
      originalNodeString: '{}',
      node: {},
      nodeType: undefined,
      toNodeOptions: [],
      globalVarOptions: [],
      globalVarOptionsMap: {},
      mapTableOptions: [],
      allTabs: this.getAllTabs(),
      initialTriggerTab: {},
      initialSettingTab: {},
      initialEdgeTab: {},
      initialParamsCollectingTab: {},
      initialParamsCollectingEdgeTab: {},
      triggerTab: undefined,
      settingTab: undefined,
      settingBasicTab: undefined,
      entityCollectingTab: undefined,
      paramsCollectingTab: undefined,
      paramsCollectingEdgeTab: undefined,
      edgeTab: undefined,
      restfulSettingTab: undefined,
      restfulEdgeTab: undefined,
      newNodeOptions: undefined,
      pageStyle: {
        width: '880px',
      },
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
    nodeType() {
      if (this.nodeType && this.nodeType === 'nlu_pc') {
        this.pageStyle = {
          width: '1060px',
        };
      }
    },
    triggerTab: {
      handler() {
        this.collectGlobalVarOptions();
      },
    },
    settingTab: {
      handler() {
        this.collectGlobalVarOptions();
      },
    },
    settingBasicTab: {
      handler() {
        this.collectGlobalVarOptions();
      },
    },
    entityCollectingTab: {
      handler() {
        this.collectGlobalVarOptions();
      },
    },
    paramsCollectingTab: {
      handler() {
        this.collectGlobalVarOptions();
      },
    },
    paramsCollectingEdgeTab: {
      handler() {
        this.collectGlobalVarOptions();
      },
    },
    edgeTab: {
      handler() {
        this.collectGlobalVarOptions();
      },
    },
    restfulSettingTab: {
      handler() {
        this.collectGlobalVarOptions();
      },
    },
    restfulEdgeTab: {
      handler() {
        this.collectGlobalVarOptions();
      },
    },
  },
  methods: {
    updateNewNodeOptions(newNodeOptions) {
      this.newNodeOptions = newNodeOptions;
    },
    renderData() {
      // reserve original node json string
      const { warnings, ...nodeWithoutWarnings } = this.extData.node;
      this.originalNodeString = JSON.stringify(nodeWithoutWarnings, general.JSONStringifyReplacer);
      // parse node
      this.node = JSON.parse(JSON.stringify(this.extData.node));
      this.toNodeOptions = JSON.parse(JSON.stringify(this.extData.toNodeOptions));
      this.globalVarOptionsMap = JSON.parse(JSON.stringify(this.extData.globalVarOptionsMap));
      this.nodeType = this.node.nodeType;
      // render tab data
      let tabs = [];
      const nodeType2TabsMap = optionConfig.nodeType2Tabs();
      if (this.nodeType in nodeType2TabsMap) {
        tabs = nodeType2TabsMap[this.nodeType];
      }
      tabs.forEach((tab) => {
        if (tab === 'triggerTab') {
          this.triggerTab = this.node.triggerTab;
          this.initialTriggerTab = JSON.parse(JSON.stringify(this.triggerTab));
          this.initialTriggerTab.nodeId = this.node.nodeId;
        } else if (tab === 'settingTab') {
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
        } else if (tab === 'settingBasicTab') {
          this.settingBasicTab = this.node.settingBasicTab;
        } else if (tab === 'paramsCollectingTab') {
          this.paramsCollectingTab = this.node.paramsCollectingTab;
          this.initialParamsCollectingTab = JSON.parse(JSON.stringify(this.paramsCollectingTab));
          this.initialParamsCollectingTab.nodeId = this.node.nodeId;
        } else if (tab === 'paramsCollectingEdgeTab') {
          this.paramsCollectingEdgeTab = this.node.paramsCollectingEdgeTab;
          this.initialParamsCollectingEdgeTab
            = JSON.parse(JSON.stringify(this.paramsCollectingEdgeTab));
          this.initialParamsCollectingEdgeTab.nodeType = this.nodeType;
          this.initialParamsCollectingEdgeTab.nodeId = this.node.nodeId;
        } else if (tab === 'restfulSettingTab') {
          this.restfulSettingTab = this.node.restfulSettingTab;
        } else if (tab === 'restfulEdgeTab') {
          this.restfulEdgeTab = this.node.restfulEdgeTab;
        }
      });
    },
    collectGlobalVarOptions() {
      const nodeResult = this.composeNodeResult();
      const dummySetting = { // only want to get global vars so use dummy setting
        scenarioName: '',
        scenarioDialogueCntLimit: 0,
        nodeDialogueCntLimit: 0,
      };
      const dummpyGlobalEdges = [];
      const edges = scenarioConvertor.convertUiNodeToEdges(
        nodeResult,
        dummySetting,
        dummpyGlobalEdges,
      );
      const nodeVars = [...new Set(scenarioConvertor.getGlobalVars(edges))];
      const nodeVarsOptions = nodeVars.map(v => ({
        text: nodeResult.nodeName,
        value: v,
      }));
      this.globalVarOptionsMap[nodeResult.nodeId] = nodeVarsOptions;
      this.globalVarOptions = [];
      Object.values(this.globalVarOptionsMap).forEach((globalVarOption) => {
        this.globalVarOptions.push(...globalVarOption);
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
        settingBasicTab: {
          type: 'settingBasicTab',
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
        restfulSettingTab: {
          type: 'restfulSettingTab',
          name: this.$t('task_engine_v2.node_edit_page.tabs.setting'),
          icon: 'setting',
        },
        restfulEdgeTab: {
          type: 'restfulEdgeTab',
          name: this.$t('task_engine_v2.node_edit_page.tabs.edge'),
          icon: 'setting',
        },
        paramsCollectingTab: {
          type: 'paramsCollectingTab',
          name: this.$t('task_engine_v2.node_edit_page.tabs.params_collecting'),
          icon: 'setting',
        },
        paramsCollectingEdgeTab: {
          type: 'paramsCollectingEdgeTab',
          name: this.$t('task_engine_v2.node_edit_page.tabs.edge'),
          icon: 'setting',
        },
      };
    },
    loadMappingTableOptions() {
      const mapTables = [];
      mappingtable.getTemplateMappingList().then((templateData) => {
        mapTables.push(...templateData.data);
        mappingtable.getMappingList().then((data) => {
          mapTables.push(...data.data);
          this.mapTableOptions = mapTables.map(table => ({
            text: table,
            value: table,
          }));
        });
      });
    },
    validResult(nodeResult) {
      // TODO: add node validation logics
      if ('edgeTab' in nodeResult) {
        return true;
      }
      return true;
    },
    composeNodeResult() {
      const nodeResult = {
        nodeId: this.node.nodeId,
        nodeName: '',
        nodeType: this.node.nodeType,
        triggerTab: this.triggerTab,
        settingTab: this.settingTab,
        edgeTab: this.edgeTab,
        entityCollectingTab: this.entityCollectingTab,
        settingBasicTab: this.settingBasicTab,
        restfulSettingTab: this.restfulSettingTab,
        restfulEdgeTab: this.restfulEdgeTab,
        paramsCollectingTab: this.paramsCollectingTab,
        paramsCollectingEdgeTab: this.paramsCollectingEdgeTab,
      };
      if (this.node.nodeType === 'entry' ||
          this.node.nodeType === 'nlu_pc' ||
          this.node.nodeType === 'parameter_collecting') {
        nodeResult.nodeName = this.settingBasicTab.nodeName;
      } else if (this.node.nodeType === 'restful') {
        nodeResult.nodeName = this.restfulSettingTab.nodeName;
      } else {
        nodeResult.nodeName = this.settingTab.nodeName;
      }
      return nodeResult;
    },
    validate() {
      const nodeResult = this.composeNodeResult();
      if (this.validResult(nodeResult)) {
        this.$emit(
          'validateSuccess',
          { nodeResult, newNodeOptions: this.newNodeOptions },
        );
      }
    },
    cancelValidate() {
      const nodeResult = this.composeNodeResult();
      const newNodeString = JSON.stringify(nodeResult, general.JSONStringifyReplacer);
      // console.log(`New Str: ${newNodeString}`);
      // console.log(`Old Str: ${this.originalNodeString}`);
      if (newNodeString === this.originalNodeString) {
        this.$emit('cancelValidateSuccess');
      } else {
        const that = this;
        that.$popCheck({
          bindValue: true,
          data: {
            msg: that.$t('task_engine_v2.node_edit_page.confirm_to_save_changes'),
          },
          callback: {
            ok() {
              if (that.validResult(nodeResult)) {
                that.$emit(
                  'validateSuccess',
                  { nodeResult, newNodeOptions: this.newNodeOptions },
                );
              }
            },
            cancel() {
              that.$emit('cancelValidateSuccess');
            },
          },
        });
      }
    },
  },
  beforeMount() {
    this.loadMappingTableOptions();
    this.renderData();
    this.collectGlobalVarOptions();
  },
  mounted() {
    this.$on('validate', this.validate);
    this.$on('cancelValidate', this.cancelValidate);
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

#node-edit-page{
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
