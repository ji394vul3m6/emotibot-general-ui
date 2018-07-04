<template>
<div id="wizard_mode">
  <div class="side-menu">
    <div @click="routeTo('/scenarios')" class="clickable side-menu-item">{{$t("wizard_mode.side_menu_tab.scenario_list")}}</div>
    <div @click="routeTo('/entity')" class="clickable side-menu-item">{{$t("wizard_mode.side_menu_tab.entity_list")}}</div>
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
import Vue from '../js/vue-2.4.2';
import PopWindow from './PopWindow.vue';
import i18nUtils from '../utils/i18nUtil';

export default {
  name: 'wizard_mode',
  components: {
    'pop-window': PopWindow,
  },
  data () {
    return {
      i18n: {},
      popWindows: [],
    }
  },
  computed: {},
  watch: {},
  methods: {
    routeTo(toPath){
      this.$router.replace(toPath);
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
      Vue.nextTick(() => {
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
    console.log('root');
    console.log(this.$root);
  },
}
</script>

<style lang="scss">
@import "../scss/wizardMode.scss";
@import "../scss/scenarioEditPage.scss";
@import "../scss/skillEditPage.scss";
@import "../scss/triggerPage.scss";
@import "../scss/actionPage.scss";
@import "../scss/actionGroup.scss";
@import "../scss/actionCard.scss";
@import "../scss/conditionCard.scss";
@import "../scss/createScenarioPop.scss";
@import "../scss/createSkillPop.scss";
@import "../scss/intentEditorPop.scss";
@import "../scss/intentTesterPop.scss";
@import "../scss/popWindow.scss";
@import '../node_modules/vue-on-toast/dist/vue-on-toast.css'
</style>
