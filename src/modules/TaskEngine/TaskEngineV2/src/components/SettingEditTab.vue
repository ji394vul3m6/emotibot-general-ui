<template lang="html">
<div id="setting-edit-tab">
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
      v-model="initialResponse">
    </textarea>
  </div>
  <div class="block">
    <div class="label-header">{{$t("task_engine_v2.setting_edit_tab.parse_text")}}</div>
    <div class="row">
      <div class="label-text">{{$t("task_engine_v2.setting_edit_tab.parser")}}</div>
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
      <div class="label-text">{{$t("task_engine_v2.setting_edit_tab.target_data")}}</div>
      <dropdown-select
        class="select select-target-entity"
        v-if="parser !== 'none'"
        ref="selectTargetEntity"
        :multi="true"
        v-model="targetEntities"
        :options="entityModuleOptions"
        :showCheckedIcon="true"
        width="200px"
        :inputBarStyle="selectStyle"
      />
    </div>
    <div class="row">
      <div class="label-text">{{$t("task_engine_v2.setting_edit_tab.skip_if_exist")}}</div>
      <dropdown-select
        class="select select-skip-if-key-exist"
        v-if="parser !== 'none'"
        ref="selectSkipIfKeyExist"
        :multi="true"
        v-model="skipIfKeyExist"
        :options="entityKeyNameOptions"
        :showCheckedIcon="true"
        width="200px"
        :inputBarStyle="selectStyle"
      />
    </div>
    <div class="row">
      <div class="label-text">{{$t("task_engine_v2.setting_edit_tab.parse_from_this_node")}}</div>
      <input class="checkbox" type="checkbox" v-if="parser !== 'none'" v-model="parseFromThisNode">
    </div>
  </div>
  <div class="block">
    <div class="label-header">{{$t("task_engine_v2.setting_edit_tab.parse_fail_q")}}</div>
    <textarea class="text-response"
      v-model="failureResponse">
    </textarea>
  </div>
</div>
</template>

<script>
import DropdownSelect from '@/components/DropdownSelect';
import optionConfig from '../_utils/optionConfig';

export default {
  name: 'setting-edit-tab',
  components: {
    'dropdown-select': DropdownSelect,
  },
  props: {
    initialSettingTab: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      nodeType: '',
      nodeName: '',
      parser: undefined,
      parserOptions: this.getParserOptions(),
      targetEntities: [],
      skipIfKeyExist: [],
      initialResponse: '',
      failureResponse: '',
      parseFromThisNode: false,
      entityModuleOptions: [],
      entityKeyNameOptions: [],
      selectStyle: {
        height: '36px',
        'border-radius': '5px',
      },
    };
  },
  computed: {
    settingTab() {
      const result = {
        nodeName: this.nodeName,
        parser: this.parser,
        targetEntities: this.targetEntities,
        skipIfKeyExist: this.skipIfKeyExist,
        initialResponse: this.initialResponse,
        failureResponse: this.failureResponse,
        parseFromThisNode: this.parseFromThisNode,
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
      const settingTab = JSON.parse(JSON.stringify(this.initialSettingTab));
      console.log(settingTab);
      this.nodeType = settingTab.nodeType;
      this.nodeName = settingTab.nodeName;
      this.parser = settingTab.parser;
      this.targetEntities = settingTab.targetEntities;
      this.skipIfKeyExist = settingTab.skipIfKeyExist;
      this.initialResponse = settingTab.initialResponse;
      this.failureResponse = settingTab.failureResponse;
      this.parseFromThisNode = settingTab.parseFromThisNode;

      // render entityModuleOptions, entityKeyNameOptions
      const entityModuleOptionsMap = optionConfig.getEntityModuleOptionsMap();
      this.entityModuleOptions = entityModuleOptionsMap[this.parser];
      console.log(this.parser);
      console.log(this.entityModuleOptions);
      const entityKeyNameOptionsMap = this.getEntityKeyNameOptionsMap();
      this.entityKeyNameOptions = entityKeyNameOptionsMap[this.parser];
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
    getParserOptions() {
      return [
        {
          text: this.$t('task_engine_v2.parser.none'),
          value: 'none',
        },
        {
          text: this.$t('task_engine_v2.parser.common_parser'),
          value: 'common_parser',
        },
        {
          text: this.$t('task_engine_v2.parser.task_parser'),
          value: 'task_parser',
        },
        {
          text: this.$t('task_engine_v2.parser.hotel_parser'),
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
  beforeMount() {
    this.renderTabContent();
  },
  mounted() {
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
