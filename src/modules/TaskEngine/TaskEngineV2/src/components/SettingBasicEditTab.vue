<i18n>
{
  "zh-cn": {
    "err_empty": "不可为空",
    "setting_edit_tab": {
      "node_type": "节点类型",
      "node_name": "节点名称"
    },
    "node_type": {
      "entry": "入口节点",
      "dialogue": "对话节点",
      "restful": "RESTful数据调用节点",
      "nlu_pc": "TDE参数收集节点",
      "parameter_collecting": "参数收集节点",
      "action": "动作节点",
      "dialogue_description": "与使用者进行交互的节点",
      "restful_description": "使用RESTful接口调用数据",
      "nlu_pc_description": "利用TDE接口收集所需参数的节点",
      "parameter_collecting_description": "收集所需参数的节点",
      "action_description": "执行动作的节点"
    }
  }
}
</i18n>

<template lang="html">
<div id="nlu-pc-setting-tab">
  <div class="block">
    <div class="label-header">{{$t("setting_edit_tab.node_type")}}</div>
    <input class="input-rounded input-readonly"
      disabled
      :value="$t(`node_type.${nodeType}`)">
    </input>
  </div>
  <div class="block">
    <div class="label-header">{{$t("setting_edit_tab.node_name")}}</div>
    <input class="input-rounded"
      ref="input-content" v-tooltip="tooltip" @focus="onInputFocus"
      v-model="nodeName">
    </input>
  </div>
</div>
</template>

<script>
import event from '@/utils/js/event';

export default {
  name: 'nlu-pc-setting-tab',
  props: {
    validateTab: {
      type: Boolean,
      default: false,
    },
    settingBasicTab: {
      type: Object,
      required: true,
    },
  },
  data() {
    const settingTab = this.settingBasicTab;
    const nodeType = settingTab.nodeType;
    const nodeName = settingTab.nodeName;
    return {
      nodeType,
      nodeName,
      tooltip: {
        msg: this.$t('err_empty'),
        eventOnly: true,
        errorType: true,
        alignLeft: true,
        absolute: true,
      },
    };
  },
  computed: {
    settingTab() {
      const result = {
        nodeName: this.nodeName,
        nodeType: this.nodeType,
      };
      // console.log(result);
      return result;
    },
  },
  watch: {
    validateTab(newV, oldV) {
      if (newV && !oldV) {
        const valid = this.isValueEmpty(this.$refs['input-content']);
        this.$emit('update:valid', valid);
      }
    },
    settingTab: {
      handler() {
        this.$emit('update', this.settingTab);
      },
      deep: true,
    },
  },
  methods: {
    onInputFocus(evt) {
      evt.target.dispatchEvent(event.createEvent('tooltip-hide'));
    },
    isValueEmpty(el) {
      let valid = true;
      if (!el.value) {
        valid = false;
        el.dispatchEvent(event.createEvent('tooltip-show'));
      }
      return valid;
    },
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
  }
}
</style>
