<template lang="html">
<div id="nlu-pc-setting-tab">
  <div class="block">
    <div class="label-header">{{$t("task_engine_v2.setting_edit_tab.node_type")}}</div>
    <input class="input-rounded input-readonly"
      disabled
      :value="$t(`task_engine_v2.node_type.${nodeType}`)">
    </input>
  </div>
  <div class="block">
    <div class="label-header">{{$t("task_engine_v2.setting_edit_tab.node_name")}}</div>
    <input class="input-rounded"
      v-model="nodeName">
    </input>
  </div>
  <div class="block">
    <div class="label-header">{{$t("task_engine_v2.setting_edit_tab.default_q")}}</div>
    <textarea class="text-response"
      v-model="msg">
    </textarea>
  </div>
</div>
</template>

<script>
export default {
  name: 'nlu-pc-setting-tab',
  components: {},
  props: {
    initialNLUPCSettingTab: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      nodeType: '',
      nodeName: '',
      msg: '',
    };
  },
  computed: {
    settingTab() {
      const result = {
        nodeName: this.nodeName,
        msg: this.msg,
      };
      console.log(result);
      return result;
    },
  },
  watch: {
    settingTab: {
      handler() {
        this.$emit('update', this.settingTab);
      },
      deep: true,
    },
  },
  methods: {
    renderTabContent() {
      const settingTab = JSON.parse(JSON.stringify(this.initialNLUPCSettingTab));
      this.nodeType = settingTab.nodeType;
      this.nodeName = settingTab.nodeName;
      this.msg = settingTab.msg;
    },
  },
  beforeMount() {
    this.renderTabContent();
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

#nlu-pc-setting-tab{
  display: flex;
  flex-direction: column;
  padding: 10px 20px 10px 20px;
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
    .text-response{
      height: 100px;
      color: $color-font-normal;
    }
    .row{
      display: flex;
      flex-direction: row;
      align-items: center;
      &:not(:first-child){
        margin: 5px 0px 0px 0px;
      }
      .label-text{
        height: 36px;
        font-size: 14px;
        line-height: 36px;
        color: $color-font-normal;
        margin: 0px 10px 0px 0px;
      }
    }
  }
  input[type=checkbox]{
    @include general-checkbox();
  }
}
</style>
