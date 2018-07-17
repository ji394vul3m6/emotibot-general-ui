<template lang="html">
<div id="scenario-editor-pop">
  <div class="edit-title">{{$t("task_engine_v3.create_scenario_pop.label_name_the_scenario")}}</div>
  <div class="edit-data">
    <input v-model="scenarioName" :placeholder="$t('task_engine_v3.create_scenario_pop.placeholder_enter_scenario_name')"></input>
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
          this.i18n.task_engine_v3.error_msg.please_enter_the_scenario_name,
          '',
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

<style lang="scss" scoped>
@import 'styles/variable.scss';
$row-height: $default-line-height;
@import "../scss/teVariable.scss";
@import "../scss/createScenarioPop.scss";
</style>
