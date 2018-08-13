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
        :initialNode="node"
      ></setting-edit-tab>
      <edge-edit-tab ref="edgeTab"
        v-if="currentTab === 'edgeTab'"
      ></edge-edit-tab>
    </keep-alive>
  </div>
</div>
</template>

<script>
import TriggerEditTab from './TriggerEditTab';
import SettingEditTab from './SettingEditTab';
import EdgeEditTab from './EdgeEditTab';

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
      node: this.getNodeData(),
      allTabs: this.getAllTabs(),
    };
  },
  computed: {
    tabs() {
      const nodeType2Tabs = {
        entry: ['triggerTab', 'settingTab', 'edgeTab'],
        dialogue: ['settingTab', 'edgeTab'],
      };
      const nodeType = this.node.node_type;
      if (nodeType in nodeType2Tabs) {
        const nodeTabs = nodeType2Tabs[this.node.node_type];
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
    changeTab(tab) {
      this.currentTab = tab;
    },
    getNodeData() {
      if (this.extData.node) {
        console.log(this.extData.node);
        return JSON.parse(JSON.stringify(this.extData.node));
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
  },
  beforeMount() {
  },
  mounted() {
    console.log('mounted');
    console.log(this.node);
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

#node-edit-page{
  width: 80vh;
  height: 70vh;
  min-width: 80vh;
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
  }
}
</style>
