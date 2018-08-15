<template lang="html">
<div id="condition-block">
  <div class="button-delete-condition">
    <icon icon-type="delete" :enableHover="true" :size=24 @click=""/>
  </div>
  <div class="normal-edge" v-if="edgeType==='normal'">
    <template v-for="(rule, index) in andRules">
      <div class="rule-block">
        <div class="row row-function" v-bind:class="{'not-first': index !== 0}">
          <div class="label label-start" v-if="index === 0">
            if
          </div>
          <div class="label label-start" v-if="index !== 0">
            and if
          </div>
          <dropdown-select
            class="select select-source"
            :ref="`selectSource_${index}`"
            :value="[rule.source]"
            @input="onSelectSourceInput(index, $event)"
            :options="getSourceOptions()"
            :showCheckedIcon="false"
            width="250px"
            :inputBarStyle="selectStyle"
          />
          <dropdown-select
            class="select select-function"
            :ref="`selectFunction_${index}`"
            :value="[rule.funcName]"
            @input="onSelectFunctionInput(index, $event)"
            :options="getFuncOptions(rule.source)"
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
        <div class="content-contain" v-if="rule.funcName === 'match' || rule.funcName == 'contains'">
          <div class="row row-content">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_content")}}
            </div>
            <input class="input-content" v-model="rule.content"></input>
          </div>
        </div>
        <!-- 正则表示式 -->
        <div class="content-regular-exp" v-if="rule.funcName === 'regular_exp'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_pattern")}}
            </div>
            <input class="input-content" v-model="rule.content.pattern"></input>
          </div>
          <template v-for="(operation, index) in rule.content.operations">
            <div class="row">
              <div class="label label-start">
                {{$t("task_engine_v2.condition_block.label_nth_match")}}
              </div>
              <input class="input-content" v-model="operation.index"></input>
              <button
                v-if="index === 0"
                class="button"
                style="width: 60px;"
                @click="">
                {{$t("task_engine_v2.condition_block.button_add")}}
              </button>
              <button
                v-if="index !== 0"
                class="button"
                style="width: 60px;"
                @click="">
                {{$t("task_engine_v2.condition_block.button_remove")}}
              </button>
            </div>
            <div class="row">
              <div class="label label-start">
                {{$t("task_engine_v2.condition_block.label_target_key")}}
              </div>
              <input class="input-content" v-model="operation.key"></input>
            </div>
          </template>
        </div>
        <!-- 酒店预定语句解析器 / 通用语句解析器 / 场景语句解析器 -->
        <div class="content-parser"
          v-if="rule.funcName === 'hotel_parser' ||
                rule.funcName === 'common_parser' ||
                rule.funcName === 'task_parser'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_content")}}
            </div>
            <dropdown-select
              class="select select-target-entity"
              :ref="`selectTargetEntity_${index}`"
              :multi="true"
              :value="rule.content.tags.split(',')"
              @input="onSelectTargetEntity(index, $event)"
              :options="entityModuleOptions(rule.funcName)"
              :showCheckedIcon="true"
              width="200px"
              :inputBarStyle="selectStyle"
            />
          </div>
        </div>
        <!-- 转换数据解析器 -->
        <div class="content-map-table" v-if="rule.funcName === 'user_custom_parser'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_mapping_table")}}
            </div>
            <dropdown-select
              class="select"
              :ref="`selectMapTable_${index}`"
              :value="[rule.content.trans]"
              @input="onSelectMapTableInput(index, $event)"
              :options="[]"
              :showCheckedIcon="false"
              width="420px"
              :inputBarStyle="selectStyle"
            />
          </div>
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_target_key")}}
            </div>
            <input class="input-content" v-model="rule.content.to_key"></input>
          </div>
        </div>
        <!-- 是否判断解析器 -->
        <div class="content-polarity-parser" v-if="rule.funcName === 'polarity_parser'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_target_key")}}
            </div>
            <input class="input-content" v-model="rule.content.key"></input>
          </div>
        </div>
        <!-- Web API 调用 -->
        <div class="content-api-parser" v-if="rule.funcName === 'api_parser'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_link")}}
            </div>
            <input class="input-content" v-model="rule.content"></input>
          </div>
        </div>
      </div>
    </template>
    <div class="row row-then-goto">
      <div class="label label-start">
        {{$t("task_engine_v2.edge_edit_tab.label_then_goto")}}
      </div>
      <dropdown-select
        class="select select-goto"
        ref="selectGoto"
        :value="[toNode]"
        @input="toNode = $event[0]"
        :options="toNodeOptions"
        :showCheckedIcon="false"
        width="200px"
        :inputBarStyle="selectStyle"
      />
    </div>
  </div>
  <div class="qq-edge" v-if="edgeType==='qq'">
    <div class="rule-block">
      <div class="row row-function">
        <div class="label label-start">
          if
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import DropdownSelect from '@/components/DropdownSelect';
import scenarioConvertor from '../_utils/scenarioConvertor';
import selectOptions from '../_utils/selectOptions';

export default {
  name: 'condition-block',
  components: {
    'dropdown-select': DropdownSelect,
  },
  props: {
    nodeId: {
      type: String,
      required: true,
    },
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
      edgeType: 'normal',
      andRules: [],
      toNode: [],
      selectStyle: {
        height: '36px',
        'border-radius': '5px',
      },
    };
  },
  computed: {
    conditionBlock() {
      const result = {
        edge_type: this.edgeType,
        to_node_id: this.toNode,
        actions: [],
        condition_rules: [this.andRules.map((rule) => {
          console.log(rule);
          return {
            source: rule.source,
            functions: [{
              function_name: rule.funcName,
              content: rule.content,
            }],
          };
        })],
      };
      console.log(result);
      return result;
    },
  },
  watch: {
    conditionBlock: {
      handler() {
        this.$emit('update', this.conditionBlock);
      },
      deep: true,
    },
  },
  methods: {
    renderConditionContent() {
      this.edge = JSON.parse(JSON.stringify(this.initialEdge));
      this.edgeType = this.edge.edge_type || 'normal';
      if (this.edgeType === 'qq') {
        this.renderQQEdge();
      } else {
        this.renderNormalEdge();
      }
    },
    renderQQEdge() {

    },
    renderNormalEdge() {
      // render andRules
      const rules = this.edge.condition_rules || [];
      if (rules.length > 0) {
        this.andRules = rules[0].map((rule) => {
          if (rule.source && rule.functions && rule.functions.length > 0) {
            return {
              source: rule.source,
              funcName: rule.functions[0].function_name,
              content: rule.functions[0].content,
            };
          }
          return {
            source: ['text'],
            funcName: null,
            content: {},
          };
        });
      }
      // render toNode
      this.toNode = this.edge.to_node_id;
    },
    onSelectSourceInput(index, newValue) {
      const newSource = newValue[0];
      if (this.andRules[index].source === newSource) return;
      this.andRules[index].source = newSource;
      const funcOptionMap = this.getFuncOptionMap();
      const options = funcOptionMap[newSource];
      const selectFunctionRef = `selectFunction_${index}`;
      if (this.$refs[selectFunctionRef]) {
        this.$refs[selectFunctionRef][0].$emit('updateOptions', options);
        this.andRules[index].funcName = options[0].value;
        this.$refs[selectFunctionRef][0].$emit('select', this.andRules[index].funcName);
      }
    },
    onSelectFunctionInput(index, newValue) {
      const newFuncName = newValue[0];
      if (this.andRules[index].funcName === newFuncName) return;
      this.andRules[index].funcName = newFuncName;

      // render edgeType
      if (newFuncName === 'qq') {
        this.edgeType = 'qq';
      } else {
        this.edgeType = 'normal';
      }

      // initial content
      const content = scenarioConvertor.initialFunctionContent(newFuncName, this.nodeId);

      // update parser options
      this.andRules[index].content = content;
      if (newFuncName === 'common_parser' ||
          newFuncName === 'task_parser' ||
          newFuncName === 'hotel_parser') {
        const options = this.entityModuleOptions(newFuncName);
        const selectRef = `selectTargetEntity_${index}`;
        if (this.$refs[selectRef] && this.$refs[selectRef].length > 0) {
          this.$refs[selectRef][0].$emit('updateOptions', options);
          content.tags.split(',').forEach((target) => {
            this.$refs[selectRef][0].$emit('select', target);
          });
        }
      }
    },
    onSelectTargetEntity(index, newValue) {
      this.andRules[index].content.tags = newValue.join(',');
    },
    onSelectMapTableInput(index, newValue) {
      const newMapTable = newValue[0];
      if (this.andRules[index].content.trans === newMapTable) return;
      this.andRules[index].content.trans = newMapTable;
    },
    entityModuleOptions(parser) {
      const entityModuleOptions = selectOptions.getEntityModuleOptions();
      return entityModuleOptions[parser];
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
    getFuncOptions(source) {
      const funcOptionMap = this.getFuncOptionMap();
      return funcOptionMap[source];
    },
    getFuncOptionMap() {
      const textFuncs = [
        'match', 'contains', 'regular_exp', 'common_parser', 'task_parser',
        'hotel_parser', 'user_custom_parser', 'polarity_parser', 'api_parser', 'qq',
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
  .rule-block{
    &:not(:first-child){
      margin: 30px 0px 0px 0px;
    }
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
