<i18n>
{
  "zh-cn": {
    "err_empty": "不可为空",
    "setting_edit_tab": {
      "node_type": "节点类型",
      "node_name": "节点名称",
      "default_q": "预设文本",
      "insert_var": "插入变量",
      "insert_sys_var": "插入系统变量",
      "all_sys_var": "所有系统变量",
      "unconfirmed_sys_var": "尚未确认的系统变量",
      "parse_text": "语句解析",
      "parse_fail_q": "解析失败文本",
      "parser": "解析器：",
      "target_data": "提取数据 (可多选)：",
      "skip_if_exist": "若已提取以下任一数据则跳过出话和数据提取：",
      "parse_from_this_node": "限定由此节点提取："
    },
    "parser": {
      "none": "无",
      "common_parser": "通用语句解析器",
      "task_parser": "场景语句解析器",
      "hotel_parser": "酒店预定语句解析器"
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
<div id="setting-edit-tab">
  <div class="block">
    <div class="label-header">{{$t("setting_edit_tab.node_type")}}</div>
    <input class="input-rounded input-readonly"
      disabled
      :value="$t(`node_type.${nodeType}`)">
    </input>
  </div>
  <div class="block">
    <div class="label-header">{{$t("setting_edit_tab.node_name")}}</div>
    <input class="input-rounded" ref="input-content" v-tooltip="tooltip"
      v-model="nodeName"
      @focus="onInputFocus">
    </input>
  </div>
  <div class="block">
    <div class="label-header">{{$t("setting_edit_tab.default_q")}}</div>
    <div class="insert-var-button-row">
      <div ref="insertVarDropdown" class="button-insert var" v-dropdown="insertVarDropdown()">
        {{$t("setting_edit_tab.insert_var")}}
      </div>
      <div class="button-insert sys-var" v-dropdown="insertSysVarDropdown()">
        {{$t("setting_edit_tab.insert_sys_var")}}
      </div>
    </div>
    <textarea class="text-response"
      ref="defaultQ"
      v-tooltip="tooltip"
      v-model="initialResponse"
      @focus="onInputFocus">
    </textarea>
  </div>
  <div class="block">
    <div class="label-header">{{$t("setting_edit_tab.parse_text")}}</div>
    <div class="row">
      <div class="label-text">{{$t("setting_edit_tab.parser")}}</div>
      <dropdown-select
        class="select select-parser"
        ref="selectParser"
        :value="[parser]"
        @input="onSelectParserInput($event)"
        :options="parserOptions"
        :showCheckedIcon="true"
        width="200px"
        :inputBarStyle="selectStyle"
      />
    </div>
    <div class="row">
      <div class="label-text">{{$t("setting_edit_tab.target_data")}}</div>
      <dropdown-select
        class="select select-target-entity"
        v-if="parser !== 'none'"
        ref="selectTargetEntity"
        :multi="true"
        v-model="targetEntities"
        :options="entityModuleOptions"
        :showCheckedIcon="true"
        :showSearchBar="true"
        width="200px"
        :inputBarStyle="selectStyle"
      />
    </div>
    <div class="row">
      <div class="label-text">{{$t("setting_edit_tab.skip_if_exist")}}</div>
      <dropdown-select
        class="select select-skip-if-key-exist"
        v-if="parser !== 'none'"
        ref="selectSkipIfKeyExist"
        :multi="true"
        v-model="skipIfKeyExist"
        :options="entityKeyNameOptions"
        :showCheckedIcon="true"
        :showSearchBar="true"
        width="200px"
        :inputBarStyle="selectStyle"
      />
    </div>
    <div class="row">
      <div class="label-text">{{$t("setting_edit_tab.parse_from_this_node")}}</div>
      <input class="checkbox" type="checkbox" v-if="parser !== 'none'" v-model="parseFromThisNode">
    </div>
  </div>
  <div class="block">
    <div class="label-header">{{$t("setting_edit_tab.parse_fail_q")}}</div>
    <textarea class="text-response" ref="fail-textarea" v-tooltip="tooltip"
      v-model="failureResponse"
      @focus="onInputFocus">
    </textarea>
  </div>
</div>
</template>

<script>
import event from '@/utils/js/event';
import DropdownSelect from '@/components/DropdownSelect';
import optionConfig from '../_utils/optionConfig';

export default {
  name: 'setting-edit-tab',
  components: {
    'dropdown-select': DropdownSelect,
  },
  props: {
    validateTab: {
      type: Boolean,
      default: false,
    },
    settingTab: {
      type: Object,
      required: true,
    },
    globalVarOptions: {
      type: Array,
      required: true,
    },
  },
  data() {
    const settingTab = this.settingTab;

    // render entityModuleOptions, entityKeyNameOptions
    const entityModuleOptionsMap = optionConfig.getEntityModuleOptionsMap();
    const entityKeyNameOptionsMap = this.getEntityKeyNameOptionsMap();
    return {
      nodeType: settingTab.nodeType,
      nodeName: settingTab.nodeName,
      parser: settingTab.parser,
      parserOptions: this.getParserOptions(),
      targetEntities: settingTab.targetEntities,
      skipIfKeyExist: settingTab.skipIfKeyExist,
      initialResponse: settingTab.initialResponse,
      failureResponse: settingTab.failureResponse,
      parseFromThisNode: settingTab.parseFromThisNode,
      entityModuleOptions: entityModuleOptionsMap[this.parser],
      entityKeyNameOptions: entityKeyNameOptionsMap[this.parser],
      selectStyle: {
        height: '36px',
        'border-radius': '5px',
      },
      varDropdown: undefined,
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
    result() {
      const result = {
        nodeName: this.nodeName,
        parser: this.parser,
        targetEntities: this.targetEntities,
        skipIfKeyExist: this.skipIfKeyExist,
        initialResponse: this.initialResponse,
        failureResponse: this.failureResponse,
        parseFromThisNode: this.parseFromThisNode,
      };
      // console.log(result);
      return result;
    },
  },
  watch: {
    validateTab(newV, oldV) {
      if (newV && !oldV) {
        const valid =
        [this.isValueEmpty(this.$refs['input-content']), this.isValueEmpty(this.$refs.defaultQ), this.isValueEmpty(this.$refs['fail-textarea'])]
        .indexOf(false) === -1;
        this.$emit('update:valid', valid);
      }
    },
    result: {
      handler() {
        this.$emit('update', this.result);
      },
      deep: true,
    },
    globalVarOptions: {
      handler() {
        this.$nextTick(() => {
          if (this.$refs.insertVarDropdown) {
            this.$refs.insertVarDropdown.dispatchEvent(event.createEvent('dropdown-reload'));
          }
        });
      },
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
    onSelectParserInput(newValue) {
      const newParser = newValue[0];
      const originParser = this.parser;
      if (originParser === newParser) return;
      this.parser = newParser;
      if (originParser !== undefined) {
        this.targetEntities = [];
        this.skipIfKeyExist = [];
      }
      if (this.parser === 'none') return;

      const entityModuleOptionsMap = optionConfig.getEntityModuleOptionsMap();
      this.entityModuleOptions = entityModuleOptionsMap[this.parser];
      const entityKeyNameOptionsMap = this.getEntityKeyNameOptionsMap();
      this.entityKeyNameOptions = entityKeyNameOptionsMap[this.parser];

      if (this.$refs.selectTargetEntity) {
        this.$refs.selectTargetEntity.$emit('updateOptions', this.entityModuleOptions);
        this.$refs.selectTargetEntity.$emit('select', this.targetEntities);
      }
      if (this.$refs.selectSkipIfKeyExist) {
        this.$refs.selectSkipIfKeyExist.$emit('updateOptions', this.entityKeyNameOptions);
        this.$refs.selectSkipIfKeyExist.$emit('select', this.skipIfKeyExist);
      }
    },
    insertVarDropdown() {
      if (this.varDropdown === undefined) {
        this.varDropdown = { width: '500px' };
      }
      this.varDropdown.options = this.globalVarOptions.map(option => ({
        text: `${option.text}：${option.value}`,
        onclick: this.insertVarSelect.bind(this, `$global{${option.value}}`),
      }));
      return this.varDropdown;
    },
    insertSysVarDropdown() {
      return {
        options: [
          {
            text: this.$t('setting_edit_tab.all_sys_var'),
            onclick: this.insertVarSelect.bind(this, '$item_list'),
          },
          {
            text: this.$t('setting_edit_tab.unconfirmed_sys_var'),
            onclick: this.insertVarSelect.bind(this, '$msg_confirm'),
          },
        ],
        width: '200px',
      };
    },
    insertVarSelect(toInsert) {
      const selectStart = this.$refs.defaultQ.selectionStart;
      const selectEnd = this.$refs.defaultQ.selectionEnd;
      this.initialResponse = `${this.initialResponse.substring(0, selectStart)}${toInsert}${this.initialResponse.substring(selectEnd)}`;
      this.$nextTick(() => {
        this.$refs.defaultQ.selectionStart = selectStart + toInsert.length;
        this.$refs.defaultQ.selectionEnd = selectStart + toInsert.length;
        this.$refs.defaultQ.focus();
      });
    },
    getParserOptions() {
      return [
        {
          text: this.$t('parser.none'),
          value: 'none',
        },
        {
          text: this.$t('parser.common_parser'),
          value: 'common_parser',
        },
        {
          text: this.$t('parser.task_parser'),
          value: 'task_parser',
        },
        {
          text: this.$t('parser.hotel_parser'),
          value: 'hotel_parser',
        },
      ];
    },
    getEntityKeyNameOptionsMap() {
      const entityListMap = optionConfig.getEntityListMap();
      return {
        none: [],
        common_parser: entityListMap.common_parser.map(option => ({
          text: option,
          value: option,
        })),
        task_parser: entityListMap.task_parser.map(option => ({
          text: option,
          value: option,
        })),
        hotel_parser: entityListMap.hotel_parser.map(option => ({
          text: option,
          value: option,
        })),
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

#setting-edit-tab{
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
    .insert-var-button-row{
      display: flex;
      flex-direction: row;
      .button-insert{
        position: relative;
        display: flex;
        flex-direction: row;
        height: 36px;
        background: #E4EAEC;
        font-size: 14px;
        line-height: 36px;
        justify-content: center;
        border-radius: 2px;
        cursor: pointer;
        &:not(:first-child){
          margin: 0px 0px 0px 3px;
        }
        &:hover{
          background: lighten(#E4EAEC, 3%);
        }
      }
      .var{
        width: 100px;
      }
      .sys-var{
        width: 120px;
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
