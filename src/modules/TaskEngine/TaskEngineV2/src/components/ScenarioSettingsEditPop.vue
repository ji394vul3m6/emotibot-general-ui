<template lang="html">
<div id="scenario-settings-edit-pop">
  <div class="block">
    <div class="label-header">{{$t("task_engine_v2.scenario_settings_edit_pop.scenario_name")}}</div>
    <input class="input-rounded"
      v-model="scenarioName">
    </input>
  </div>
  <div class="block">
    <div class="label-header">{{$t("task_engine_v2.scenario_settings_edit_pop.scenario_dialogue_cnt_limit")}}</div>
    <input class="input-rounded input-small"
      placeholder="Count"
      oninput="this.value = this.value.replace(/^0$/g, ''); this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(^[0-9]{1,2}).*/g, '$1');"
      v-model="scenarioDialogueCntLimit">
    </input>
  </div>
  <div class="block">
    <div class="label-header">{{$t("task_engine_v2.scenario_settings_edit_pop.default_node_dialogue_cnt_limit")}}</div>
    <input class="input-rounded input-small"
      placeholder="Count"
      oninput="this.value = this.value.replace(/^0$/g, ''); this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(^[0-9]{1,2}).*/g, '$1');"
      v-model="nodeDialogueCntLimit">
    </input>
  </div>
</div>
</template>

<script>

export default {
  name: 'scenario-settings-edit-pop',
  components: {},
  props: {
    extData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      scenarioName: '',
      scenarioDialogueCntLimit: 0,
      nodeDialogueCntLimit: 0,
    };
  },
  computed: {},
  watch: {},
  methods: {
    renderData() {
      const setting = JSON.parse(JSON.stringify(this.extData.setting));
      this.scenarioName = setting.scenarioName;
      this.scenarioDialogueCntLimit = setting.scenarioDialogueCntLimit;
      this.nodeDialogueCntLimit = setting.nodeDialogueCntLimit;
    },
    validate() {
      const setting = {
        scenarioName: this.scenarioName,
        scenarioDialogueCntLimit: parseInt(this.scenarioDialogueCntLimit, 10) || null,
        nodeDialogueCntLimit: parseInt(this.nodeDialogueCntLimit, 10) || null,
      };
      console.log(setting);
      this.$emit(
        'validateSuccess',
        setting,
      );
    },
  },
  beforeMount() {
    this.renderData();
  },
  mounted() {
    this.$on('validate', this.validate);
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

#scenario-settings-edit-pop{
  width: 550px;
  display: flex;
  flex-direction: column;
  padding: 30px 30px 0px 30px;
  .block{
    display: flex;
    flex-direction: column;
    margin: 0px 0px 20px 0px;
    .label-header{
      font-weight: 600;
      color: #37474F;
      font-size: 18px;
      line-height: 18px;
      margin: 11px 0px 11px 0px;
    }
    .input-rounded{
      height: 36px;
      border-radius: 18px;
      background: white;
      &:disabled{
        background: #F3F7F9;
      }
    }
    .input-small{
      width: 100px;
    }
  }
}
</style>
