<template>
  <div id="task-engine-v2">
    <!-- <scenario-list-page>
    </scenario-list-page> -->
    <router-view></router-view>
  </div>
</template>

<script>
import ScenarioEditPage from './TaskEngineV2/src/components/ScenarioEditPage';
import ScenarioListPage from './TaskEngineV2/src/components/ScenarioListPage';

export default {
  name: 'task-engine-scenario-v2',
  path: 'task-engine-scenario-v2',
  childrenPath: [
    { path: '', component: ScenarioListPage },
    { path: 'scenario/:id', component: ScenarioEditPage },
  ],
  privCode: 'task_engine',
  displayNameKey: 'task_engine_scenario_v2',
  icon: 'white_task_engine',
  components: {
    'scenario-edit-page': ScenarioEditPage,
    'scenario-list-page': ScenarioListPage,
  },
  data() {
    return {
    };
  },
  computed: {},
  watch: {},
  methods: {},
};
</script>
