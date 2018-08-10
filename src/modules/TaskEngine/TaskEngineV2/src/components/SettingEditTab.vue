<template lang="html">
<div id="setting-edit-tab">
  <div class="block">
    <div class="label-header">{{$t("task_engine_v2.setting_edit_tab.node_type")}}</div>
    <input class="input-rounded input-readonly"
      disabled
      :value="$t(`task_engine_v2.node_type.${node.node_type}`)">
    </input>
  </div>
  <div class="block">
    <div class="label-header">{{$t("task_engine_v2.setting_edit_tab.node_name")}}</div>
    <input class="input-rounded"
      v-model="node.description">
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
        v-model="parser"
        :options="parserList"
        :showCheckedIcon="true"
        width="200px"
      />
    </div>
    <div class="row">
      <div class="label-text">{{$t("task_engine_v2.setting_edit_tab.target_data")}}</div>
    </div>
    <div class="row">
      <div class="label-text">{{$t("task_engine_v2.setting_edit_tab.skip_if_exist")}}</div>
    </div>
    <div class="row">
      <div class="label-text">{{$t("task_engine_v2.setting_edit_tab.parse_from_this_node")}}</div>
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

export default {
  name: 'setting-edit-tab',
  components: {
    'dropdown-select': DropdownSelect,
  },
  props: {
    initialNode: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      node: JSON.parse(JSON.stringify(this.initialNode)),
      parser: ['none'],
      parserList: this.getParserList(),
      initialResponse: '',
      failureResponse: '',
    };
  },
  computed: {
    settingTab() {
      const result = {
        parser: this.parser[0],
        initialResponse: this.initialResponse,
        failureResponse: this.failureResponse,
      };
      console.log(result);
      return result;
    },
    // initialResponse: {
    //   get() {
    //     return this.node.content.questions.find(
    //       q => q.question_type === 'initial_response',
    //     ).msg;
    //   },
    //   set(newValue) {
    //     this.node.content.questions.find(
    //       q => q.question_type === 'initial_response',
    //     ).msg = newValue;
    //   },
    // },
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
      // render parser
      const c = this.node.edges[1].condition_rules;
      if (c.length > 0 && c[0].length > 1) {
        this.parser = [c[0][1].functions[0].function_name];
      } else {
        this.parser = ['none'];
      }

      // render responses
      this.initialResponse = this.node.content.questions.find(
        q => q.question_type === 'initial_response',
      ).msg;
      this.failureResponse = this.node.content.questions.find(
        q => q.question_type === 'failure_response',
      ).msg;
    },
    getParserList() {
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
      .label-text{
        height: 36px;
        font-size: 14px;
        line-height: 36px;
        color: $color-font-normal;
        margin: 0px 10px 0px 0px;
      }
    }
  }
}
</style>
