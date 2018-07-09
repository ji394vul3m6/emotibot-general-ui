<template lang="html">
<div id="tde-setting-editor-pop" class="tde-setting-editor-pop">
    <h1 class="header-title">{{$t("task_engine_v3.tde-setting-editor-pop.title")}}</h1>
    <div class="row">
      <div class="title_column">{{$t("task_engine_v3.tde-setting-editor-pop.nlgTemplate")}}</div>
      <div class="input_column"><input type="text" v-model="tde_setting.nlgTemplate"></div>
    </div>
    <div class="row">
      <div class="title_column">{{$t("task_engine_v3.tde-setting-editor-pop.service")}}</div>
      <div class="input_column"><input type="text" v-model="tde_setting.service"></div>
    </div>
    <div class="row">
      <div class="title_column">{{$t("task_engine_v3.tde-setting-editor-pop.jumpOutTimes")}}</div>
      <div class="input_column"><input type="text" v-model="tde_setting.jumpOutTimes"></div>
    </div>
</div>
</template>

<script>
export default {
  name: 'tde-setting-editor-pop',
  components: {},
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tde_setting: {},
    };
  },
  computed: {},
  watch: {},
  methods: {
    validateDate() {
      this.$emit(
        'validateSuccess',
        JSON.parse(JSON.stringify(this.tde_setting)),
      );
    },
  },
  beforeMount() {},
  mounted() {
    const obj = JSON.parse(JSON.stringify(this.value));
    this.tde_setting = obj.tde_setting;
    this.$on('validate', this.validateDate);
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/teVariable.scss";
.tde-setting-editor-pop {
  min-width: 800px;
  min-height: 500px;
  padding: 20px;
  .header-title{
    min-width: 300px;
  }
  .row{
    display:flex;
    flex-direction: row;
    .title_column{
      flex:1;
      display:flex;
      flex-direction: row;
      min-width: 200px;
    }
    .input_column{
      flex:4;
      display:flex;
      flex-direction: row;
      .entity_category_select{
        min-width: 150px;
      }
    }
  }
  .full_width {
    width: 100%;
  }
  .no_border {
    border: none;
  }
}
</style>