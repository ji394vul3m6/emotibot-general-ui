<template>
<div id="wizard_mode">
  <div class="side-menu">
    <div @click="routeTo('/task-engine-scenario-v3')" :class="{ 'selected': '/task-engine-scenario-v3' === selectedMenu }" class="clickable side-menu-item">{{$t("task_engine_v3.wizard_mode.side_menu_tab.scenario_list")}}</div>
    <div @click="routeTo('/task-engine-scenario-v3/entity')" :class="{ 'selected': '/task-engine-scenario-v3/entity' === selectedMenu }" class="clickable side-menu-item">{{$t("task_engine_v3.wizard_mode.side_menu_tab.entity_list")}}</div>
  </div>
  <div class="main-content">
    <router-view></router-view>
  </div>
  <template v-for="popWindow in popWindows">
    <pop-window ref="pops" :key="popWindow.name"></pop-window>
  </template>
  <toast-container></toast-container>
</div>
</template>

<script>
import PopWindow from './PopWindow';
import i18nUtils from '../utils/i18nUtil';

export default {
  name: 'wizard_mode',
  components: {
    'pop-window': PopWindow,
  },
  data() {
    return {
      i18n: {},
      popWindows: [],
      selectedMenu: '/task-engine-scenario-v3',
    };
  },
  computed: {},
  watch: {},
  methods: {
    routeTo(toPath) {
      this.$router.replace(toPath);
      this.selectedMenu = toPath;
    },
    showPopWindow(option) {
      if (this.popWindows.length > 0) {
        const lastOption = this.popWindows[this.popWindows.length - 1];
        if (option.component === lastOption.component) {
          this.popWindows.pop();
        }
      }
      this.popWindows.push(option);

      const idx = this.popWindows.length - 1;
      const that = this;
      this.$nextTick(() => {
        that.$refs.pops[idx].showWindow(option);
      });
    },
    closePopWindow(popWindow) {
      const idx = this.$refs.pops.findIndex(p => p === popWindow);
      if (idx >= 0) {
        this.popWindows.splice(idx, 1);
      }
    },
  },
  beforeMount() {},
  mounted() {
    this.i18n = i18nUtils.getLocaleMsgs(this.$i18n);
    // listen showWindow event
    this.$root.$on('showWindow', this.showPopWindow);
    this.$root.$on('closeWindow', this.closePopWindow);
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/teVariable.scss";
@import "../scss/wizardMode.scss";
// @import '../node_modules/vue-on-toast/dist/vue-on-toast.css'
</style>
