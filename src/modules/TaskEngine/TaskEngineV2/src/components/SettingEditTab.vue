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
        :options="parserOptions"
        :showCheckedIcon="true"
        width="200px"
      />
    </div>
    <div class="row">
      <div class="label-text">{{$t("task_engine_v2.setting_edit_tab.target_data")}}</div>
      <dropdown-select
        class="select select-target-entity"
        v-if="parser[0] !== 'none'"
        ref="selectTargetEntity"
        :multi="true"
        v-model="targetEntities"
        :options="entityModuleOptions"
        :showCheckedIcon="true"
        width="200px"
      />
    </div>
    <div class="row">
      <div class="label-text">{{$t("task_engine_v2.setting_edit_tab.skip_if_exist")}}</div>
      <dropdown-select
        class="select select-skip-if-key-exist"
        v-if="parser[0] !== 'none'"
        ref="selectSkipIfKeyExist"
        :multi="true"
        v-model="skipIfKeyExist"
        :options="entityKeyNameOptions"
        :showCheckedIcon="true"
        width="200px"
      />
    </div>
    <div class="row">
      <div class="label-text">{{$t("task_engine_v2.setting_edit_tab.parse_from_this_node")}}</div>
      <input class="checkbox" type="checkbox" v-model="parseFromThisNode">
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
      parserOptions: this.getParserOptions(),
      targetEntities: [],
      skipIfKeyExist: [],
      initialResponse: '',
      failureResponse: '',
      parseFromThisNode: false,
    };
  },
  computed: {
    settingTab() {
      const result = {
        parser: this.parser[0],
        targetEntities: this.targetEntities,
        skipIfKeyExist: this.skipIfKeyExist,
        initialResponse: this.initialResponse,
        failureResponse: this.failureResponse,
        parseFromThisNode: this.parseFromThisNode,
      };
      console.log(result);
      return result;
    },
    entityModuleOptions() {
      const entityModuleOptions = this.getEntityModuleOptions();
      return entityModuleOptions[this.parser[0]];
    },
    entityKeyNameOptions() {
      const entityKeyNameOptions = this.getEntityKeyNameOptions();
      return entityKeyNameOptions[this.parser[0]];
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
    entityModuleOptions: {
      handler() {
        console.log(this.parser[0]);
        console.log(this.entityModuleOptions);
        if (this.parser[0] !== 'none') {
          this.$refs.selectTargetEntity.$emit('updateOptions', this.entityModuleOptions);
          this.$refs.selectTargetEntity.$emit('select', this.targetEntities);
        }
      },
      deep: true,
    },
    entityKeyNameOptions: {
      handler() {
        console.log(this.parser[0]);
        console.log(this.entityKeyNameOptions);
        if (this.parser[0] !== 'none') {
          this.$refs.selectSkipIfKeyExist.$emit('updateOptions', this.entityKeyNameOptions);
          this.$refs.selectSkipIfKeyExist.$emit('select', this.skipIfKeyExist);
        }
      },
      deep: true,
    },
  },
  methods: {
    renderTabContent() {
      // render parser, targetEntities, skipIfKeyExist
      const c = this.node.edges[1].condition_rules;
      if (c.length > 0 && c[0].length > 1) {
        this.parser = [c[0][1].functions[0].function_name];
        this.targetEntities = c[0][1].functions[0].content.tags.split(',');
        this.skipIfKeyExist = c[0][0].functions[0].content.map(obj => obj.key);
      } else {
        this.parser = ['none'];
        this.targetEntities = [];
        this.skipIfKeyExist = [];
      }

      // render responses
      this.initialResponse = this.node.content.questions.find(
        q => q.question_type === 'initial_response',
      ).msg;
      this.failureResponse = this.node.content.questions.find(
        q => q.question_type === 'failure_response',
      ).msg;

      // render parseFromThisNode
      this.parseFromThisNode = this.node.default_parser_with_suffix;
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
    getEntityListMap() {
      const commonEntityOptions = [
        'time', 'city', 'landmark', 'money', 'time_period',
        'phone_call', 'adjust_light', 'adjust_volume', 'movie_name', 'song_name',
        'star_name', 'teleplay_name', 'album_name', 'number',
      ];
      const taskEntityOptions = [
        'fromPlace', 'toPlace', 'departDate', 'arriveDate', 'returnDate',
      ];
      const hotelEntityOptions = [
        'City', 'CheckinDate', 'CheckoutDate', 'LandMark', 'HotelName',
        'Star', 'Price',
      ];
      return {
        common_parser: commonEntityOptions,
        task_parser: taskEntityOptions,
        hotel_parser: hotelEntityOptions,
      };
    },
    getEntityModuleOptions() {
      const entityListMap = this.getEntityListMap();
      return {
        none: [],
        common_parser: entityListMap.common_parser.map(option => ({
          // 'time_module', 'city_module', 'landmark_module', 'money_module', 'time_period_module',
          text: option,
          value: `${option}_module`,
        })),
        task_parser: entityListMap.task_parser.map((option) => {
          // from_place,to_place,depart_date,arrive_date,return_date
          const snakeCase = option.replace(/[\w]([A-Z])/g, m => `${m[0]}_${m[1]}`).toLowerCase();
          return {
            text: option,
            value: snakeCase,
          };
        }),
        hotel_parser: entityListMap.hotel_parser.map(option => ({
          // City,CheckinDate,CheckoutDate,LandMark,HotelName,Star,Price
          text: option,
          value: option,
        })),
      };
    },
    getEntityKeyNameOptions() {
      const entityListMap = this.getEntityListMap();
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
