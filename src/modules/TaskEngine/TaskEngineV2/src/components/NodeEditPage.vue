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
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentTab: 'settingTab',
      node: {},
      tabs: [],
    };
  },
  computed: {
  },
  watch: {
    value() {
      const data = JSON.parse(JSON.stringify(this.value));
      if (data.currentTab) {
        this.currentTab = data.currentTab;
      }
      if (data.node) {
        this.node = data.node;
      }
    },
  },
  methods: {
    changeTab(tab) {
      this.currentTab = tab;
    },
  },
  beforeMount() {},
  mounted() {
    this.tabs = [
      {
        type: 'triggerTab',
        name: this.$t('task_engine_v2.node_edit_page.tabs.trigger'),
        icon: 'setting',
      },
      {
        type: 'settingTab',
        name: this.$t('task_engine_v2.node_edit_page.tabs.setting'),
        icon: 'setting',
      },
      {
        type: 'edgeTab',
        name: this.$t('task_engine_v2.node_edit_page.tabs.edge'),
        icon: 'setting',
      },
    ];
    console.log(this.tabs);
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

#node-edit-page{
  width: 80vh;
  height: 80vh;
  min-width: 80vh;
  min-height: 80vh;
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
