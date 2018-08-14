<template lang="html">
<div id="condition-block">
  <div class="button-delete-condition">
    <icon icon-type="delete" :enableHover="true" :size=24 @click=""/>
  </div>
  <div class="row row-function">
    <div class="label label-start">
      if
    </div>
    <dropdown-select
      class="select select-source"
      ref="selectSource"
      v-model="source"
      :options="getSourceOptions()"
      :showCheckedIcon="false"
      width="250px"
      :inputBarStyle="selectStyle"
    />
    <dropdown-select
      class="select select-function"
      ref="selectFunction"
      v-model="func"
      :options="funcOptions"
      :showCheckedIcon="false"
      width="160px"
      :inputBarStyle="selectStyle"
    />
    <button
      class="button button-add-if"
      @click="">
      ＋and if
    </button>
  </div>
  <!-- 完全相符 / 包含文本 -->
  <div class="content-contain" v-if="funcName === 'match' || funcName == 'contains'">
    <div class="row row-content">
      <div class="label label-start">
        {{$t("task_engine_v2.condition_block.label_content")}}
      </div>
      <input class="input-content" v-model="content"></input>
    </div>
  </div>  
  
  <div class="row row-then-goto">
    <div class="label label-start">
      {{$t("task_engine_v2.edge_edit_tab.label_then_goto")}}
    </div>
    <dropdown-select
      class="select select-goto"
      ref="selectGoto"
      v-model="toNode"
      :options="toNodeOptions"
      :showCheckedIcon="false"
      width="200px"
      :inputBarStyle="selectStyle"
    />
  </div>
</div>
</template>

<script>
import DropdownSelect from '@/components/DropdownSelect';

export default {
  name: 'condition-block',
  components: {
    'dropdown-select': DropdownSelect,
  },
  props: {
    initialEdge: {
      type: Object,
      required: true,
    },
    toNodeOptions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      edge: {},
      source: ['text'],
      sourceOptions: [],
      funcName: null,
      content: {},
      toNode: [],
      selectStyle: {
        height: '36px',
        'border-radius': '5px',
      },
    };
  },
  computed: {
    func() {
      return [this.funcName];
    },
    funcOptions() {
      const funcOptionMap = this.getFuncOptionMap();
      const options = funcOptionMap[this.source[0]];
      return options;
    },
  },
  watch: {
    funcOptions: {
      handler() {
        if (this.$refs.selectFunction) {
          this.$refs.selectFunction.$emit('updateOptions', this.funcOptions);
          if (!this.funcOptions.find(opt => opt.value === this.funcName)) {
            this.funcName = this.funcOptions[0].value;
          }
          this.$refs.selectFunction.$emit('select', this.funcName);
        }
      },
      deep: true,
    },
  },
  methods: {
    renderConditionContent() {
      this.edge = JSON.parse(JSON.stringify(this.initialEdge));
      const rules = this.edge.condition_rules || [];
      let rule;
      if (rules.length > 0 && rules[0].length > 0) {
        rule = rules[0][0];
      }
      // render source, func, content
      if (this.edge.edge_type === 'qq') {
        this.source = ['text'];
        this.funcName = 'qq';
      } else if (rule && rule.source && rule.functions && rule.functions.length > 0) {
        this.source = [rule.source];
        this.funcName = rule.functions[0].function_name;
        this.content = rule.functions[0].content;
      } else {
        this.source = ['text'];
        this.funcName = null;
        this.content = {};
      }

      // render toNode
      this.toNode = [this.edge.to_node_id];
    },
    getSourceOptions() {
      return [
        {
          text: this.$t('task_engine_v2.condition_block.source.text'),
          value: 'text',
        },
        {
          text: this.$t('task_engine_v2.condition_block.source.global_info'),
          value: 'global_info',
        },
        {
          text: this.$t('task_engine_v2.condition_block.source.cu'),
          value: 'cu',
        },
      ];
    },
    getFuncOptionMap() {
      const textFuncs = [
        'match', 'contains', 'regular_exp', 'hotel_parser', 'common_parser',
        'task_parser', 'user_custom_parser', 'polarity_parser', 'api_parser', 'qq',
      ];
      const globalIngoFuncs = [
        'key_val_match', 'key_key_match', 'contain_key', 'not_contain_key', 'list_length_match',
        'counter_check', 'user_custom_transform', 'regular_exp_from_var', 'assign_value',
      ];
      const cuFuncs = ['cu_parser', 'custom_cu_parser'];
      return {
        text: textFuncs.map((func) => {
          const key = `task_engine_v2.condition_block.func.${func}`;
          return {
            text: this.$t(key),
            value: func,
          };
        }),
        global_info: globalIngoFuncs.map((func) => {
          const key = `task_engine_v2.condition_block.func.${func}`;
          return {
            text: this.$t(key),
            value: func,
          };
        }),
        cu: cuFuncs.map((func) => {
          const key = `task_engine_v2.condition_block.func.${func}`;
          return {
            text: this.$t(key),
            value: func,
          };
        }),
      };
    },
  },
  beforeMount() {
    this.renderConditionContent();
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

#condition-block{
  position: relative;
  display: flex;
  flex-direction: column;
  background: #F3F7F9;
  padding: 20px 20px 20px 20px;
  border: 1px solid $color-borderline;
  border-radius: 5px;
  margin: 0px 0px 20px 0px;
  cursor: move;
  .button-delete-condition{
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .row{
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 36px;
    margin: 0px 0px 10px 0px;
    &.row-then-goto{
      margin: 0px 0px 0px 0px;
    }
    .label{
      height: 36px;
      line-height: 36px;
      font-size: 16px;
    }
    .label-start{
      width: 80px;
    }
    .select{
      background: white;
    }
    .select-function{
      margin-left: 10px;
    }
    input{
      height: 36px;
    }
    .input-content{
      width: 420px;
    }
    .button{
      background: #57C7D4;
      height: 36px;
      margin-left: 15px;
      border-radius: 5px;
      color: white;
      font-size: 14px;
      font-weight: 600;
    }
    .button-add-if{
      width: 80px;
    }
  }
}
</style>
