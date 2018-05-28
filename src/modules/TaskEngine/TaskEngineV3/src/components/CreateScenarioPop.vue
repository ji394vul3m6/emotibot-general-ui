<template lang="html">
<div id="scenario-editor-pop">
  <div class="scenario-editor-title">
    <div>{{$t('task_engine_v3.create_scenario_pop.label_create_new_scenario')}}</div>
  </div>
  <div class="scenario-editor-box">
    <div class="scenario-name-container">
      <div class="input-label">{{$t("task_engine_v3.create_scenario_pop.label_name_the_scenario")}}</div>
      <input v-model="scenarioName" :placeholder="$t('task_engine_v3.create_scenario_pop.placeholder_enter_scenario_name')"></input>
    </div>
  </div>
</div>
</template>

<script>
import i18nUtils from '../utils/i18nUtil';
import general from '../utils/general';

export default {
  name: 'scenario-editor-pop',
  components: {
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      i18n: {},
      scenarioName: this.value.scenarioName,
    };
  },
  computed: {},
  watch: {},
  methods: {
    validate() {
      if (this.scenarioName === '') {
        general.popErrorWindow(this,
          this.i18n.error_msg.please_enter_the_scenario_name,
          '',
          '30%',
          '10%',
        );
      } else {
        this.$emit('validateSuccess', this.scenarioName);
      }
    },
  },
  beforeMount() {},
  mounted() {
    this.i18n = i18nUtils.getLocaleMsgs(this.$i18n);
    this.$on('validate', this.validate);
  },
};
</script>
