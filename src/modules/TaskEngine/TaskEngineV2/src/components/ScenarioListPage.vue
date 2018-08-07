<template lang="html">
<div id="scenario-list-page">
  <template v-for="(scenario, index) in filteredScenarioList">
    <div class="row">
      <div id="scenario-grid">
        <div id="scenario-content-container">
          <div class="name-label"  @click="editScenario(scenario.scenarioID)">
            {{scenario.scenarioName}}
          </div>
        </div>
      </div>
    </div>
  </template>
</div>
</template>

<script>
import taskEngineApi from '@/modules/TaskEngine/_api/taskEngine';
import general from '@/modules/TaskEngine/_utils/general';

export default {
  name: 'scenario-list-page',
  components: {},
  data() {
    return {
      scenarioList: [],
      filteredKeyWord: '',
    };
  },
  computed: {
    filteredScenarioList() {
      return this.scenarioList.filter(
        scenario => scenario.scenarioName.indexOf(this.filteredKeyWord) !== -1);
    },
  },
  watch: {},
  methods: {
    listAllScenarios() {
      taskEngineApi.listScenarios(this.appId).then((data) => {
        if (typeof (data) === 'object' && 'msg' in data) {
          this.scenarioList = data.msg.filter(scenario => scenario.version !== '2.0')
                                      .map((scenario) => {
                                        scenario.show = false;
                                        return scenario;
                                      });
        } else {
          general.popErrorWindow(this, 'listAllScenarios error',
            `unexpected return value from listScenarios API: ${data}`);
        }
      }, (err) => {
        general.popErrorWindow(this, 'listAllScenarios error', err.message);
      });
    },
    editScenario(scenarioId) {
      const path = general.composeV2Path(`scenario/${scenarioId}`);
      this.$router.replace(path);
    },
  },
  beforeMount() {},
  mounted() {
    this.listAllScenarios();
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

#scenario-list-page{
}
</style>
