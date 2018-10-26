<template lang="html">
<div id="params-collecting-block">
  <div class="button-delete-param">
    <icon icon-type="delete" :enableHover="true" :size=24 @click="deleteParam()"/>
  </div>
  <div class="param">
    <template v-for="(parser, index) in parsers">
      <div class="parser-block" :key="parser.id">
        <div class="row row-function">
          <div class="label label-start">
            {{$t("task_engine_v2.params_collecting_tab.parser")}}
          </div>
          <dropdown-select
            class="select select-function"
            :ref="`selectFunction_${index}`"
            :value="[parser.funcName]"
            @input="onSelectFunctionInput(index, $event)"
            :options="getFuncOptions()"
            :showCheckedIcon="false"
            width="160px"
            :inputBarStyle="selectStyle"
          />
          <button
            class="button button-add-parser"
            v-if="index === 0"
            @click="addParser()">
            {{$t("task_engine_v2.params_collecting_tab.button_add_parser")}}
          </button>
          <button
            class="button"
            style="width: 60px;"
            v-if="index !== 0"
            @click="deleteParser(index)">
            {{$t("task_engine_v2.condition_block.button_remove")}}
          </button>
        </div>
        <!-- 正则表示式 -->
        <div class="content-regular-exp" v-if="parser.funcName === 'regular_exp'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_pattern")}}
            </div>
            <input class="input-content" v-model="parser.content.pattern" @input="emitUpdate"></input>
          </div>
          <template v-for="(operation, idx) in parser.content.operations">
            <div class="row">
              <div class="label label-start">
                {{$t("task_engine_v2.condition_block.label_nth_match")}}
              </div>
              <input class="input-content" 
                v-model.number="operation.index"
                oninput="this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(^[0-9]{1,2}).*/g, '$1');"
                @input="emitUpdate">
              </input>
              <button
                v-if="idx === 0"
                class="button"
                style="width: 70px;"
                @click="addRegTargetKey(index)">
                {{$t("task_engine_v2.condition_block.button_add")}}
              </button>
              <button
                v-if="idx !== 0"
                class="button"
                style="width: 60px;"
                @click="deleteRegTargetKey(index, idx)">
                {{$t("task_engine_v2.condition_block.button_remove")}}
              </button>
            </div>
            <div class="row">
              <div class="label label-start">
                {{$t("task_engine_v2.condition_block.label_target_key")}}
              </div>
              <input class="input-content" 
                v-model="operation.key"
                @input="emitUpdate"
              ></input>
            </div>
          </template>
        </div>
        <!-- 酒店预定语句解析器 / 通用语句解析器 / 场景语句解析器 -->
        <div class="content-parser"
          v-if="parser.funcName === 'hotel_parser' ||
                parser.funcName === 'common_parser' ||
                parser.funcName === 'task_parser'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_content")}}
            </div>
            <dropdown-select
              class="select select-target-entity"
              :ref="`selectTargetEntity_${index}`"
              :multi="true"
              :value="parser.content.tags.split(',')"
              @input="onSelectTargetEntity(index, $event)"
              :options="entityModuleOptions(parser.funcName)"
              :showCheckedIcon="true"
              :showSearchBar="true"
              width="200px"
              :inputBarStyle="selectStyle"
            />
          </div>
        </div>
        <!-- 转换数据解析器 -->
        <div class="content-map-table" v-if="parser.funcName === 'user_custom_parser'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_mapping_table")}}
            </div>
            <dropdown-select
              class="select"
              :ref="`selectMapTable_${index}`"
              :value="[parser.content.trans]"
              @input="onSelectMapTableInput(index, $event)"
              :options="mapTableOptions"
              :showCheckedIcon="false"
              :showSearchBar="true"
              width="420px"
              :inputBarStyle="selectStyle"
            />
          </div>
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_target_key")}}
            </div>
            <input class="input-content" v-model="parser.content.to_key" @input="emitUpdate"></input>
          </div>
        </div>
        <!-- 是否判断解析器 -->
        <div class="content-polarity-parser" v-if="parser.funcName === 'polarity_parser'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_target_key")}}
            </div>
            <input class="input-content" 
              v-model="parser.content.key"
              @input="emitUpdate"
            ></input>
          </div>
        </div>
        <!-- Web API 调用 -->
        <div class="content-api-parser" v-if="parser.funcName === 'api_parser'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_link")}}
            </div>
            <input class="input-content" v-model="parser.content" @input="emitUpdate"></input>
          </div>
          <div class="row">
            <div class="label label-tooltip">
              {{$t("task_engine_v2.params_collecting_tab.skip_if_key_exit")}}
              <div class="tooltip_container" v-tooltip="{ msg: $t('task_engine_v2.params_collecting_tab.skip_if_key_exit_info')}">
                <icon icon-type="info" :enableHover="true" :size=20 />
              </div>
            </div>
            <input class="input-content"
              :value="getWebApiSkipIfKeyExist(index)"
              @input="onInputWebApiSkipIfKeyExist(index, $event.target.value)"
            ></input>
          </div>
        </div>
      </div>
    </template>
    <div class="row">
      <div class="label">
        {{$t("task_engine_v2.params_collecting_tab.msg")}}
      </div>
    </div>
    <textarea class="text-response"
      @input="emitUpdate"
      v-model="msg">
    </textarea>
    <div class="row">
      <div class="label">
        {{$t("task_engine_v2.params_collecting_tab.parse_failed_msg")}}
      </div>
    </div>
    <textarea class="text-response"
      @input="emitUpdate"
      v-model="parse_failed_msg">
    </textarea>
  </div>
</div>
</template>

<script>
import DropdownSelect from '@/components/DropdownSelect';
import scenarioInitializer from '../_utils/scenarioInitializer';
import optionConfig from '../_utils/optionConfig';

export default {
  name: 'params-collecting-block',
  components: {
    'dropdown-select': DropdownSelect,
  },
  props: {
    nodeId: {
      type: String,
      required: true,
    },
    mapTableOptions: {
      type: Array,
      required: true,
    },
    initialParam: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      msg: '',
      parse_failed_msg: '',
      parsers: [],
      selectStyle: {
        height: '36px',
        'border-radius': '5px',
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    emitUpdate() {
      const param = {
        id: this.$uuid.v1(),
        msg: this.msg,
        parse_failed_msg: this.parse_failed_msg,
        parsers: this.parsers,
      };
      this.$emit('update', param);
    },
    renderConditionContent() {
      const param = JSON.parse(JSON.stringify(this.initialParam));
      this.msg = param.msg;
      this.parse_failed_msg = param.parse_failed_msg;
      this.parsers = param.parsers;
      // console.log(this.initialParam);
    },
    deleteParam() {
      this.$emit('deleteParam');
    },
    addParser() {
      const parser = scenarioInitializer.initialParser();
      parser.id = this.$uuid.v1();
      this.parsers.push(parser);
      this.emitUpdate();
    },
    deleteParser(index) {
      this.parsers.splice(index, 1);
      this.emitUpdate();
    },
    addRegTargetKey(index) {
      const operation = scenarioInitializer.initialRegularOperation();
      this.parsers[index].content.operations.push(operation);
      this.emitUpdate();
    },
    deleteRegTargetKey(index, idx) {
      this.parsers[index].content.operations.splice(idx, 1);
      this.emitUpdate();
    },
    getWebApiSkipIfKeyExist(index) {
      if (this.parsers[index].skipIfKeyExist) {
        return this.parsers[index].skipIfKeyExist.join(',');
      } return '';
    },
    onInputWebApiSkipIfKeyExist(index, newValue) {
      this.parsers[index].skipIfKeyExist = newValue.split(',');
      this.emitUpdate();
    },
    onSelectTargetEntity(index, newValue) {
      this.parsers[index].content.tags = newValue.join(',');
      this.emitUpdate();
    },
    onSelectMapTableInput(index, newValue) {
      const newMapTable = newValue[0];
      if (this.parsers[index].content.trans === newMapTable) return;
      this.parsers[index].content.trans = newMapTable;
      this.emitUpdate();
    },
    onSelectFunctionInput(index, newValue) {
      const newFuncName = newValue[0];
      if (this.parsers[index].funcName === newFuncName) return;
      this.parsers[index].funcName = newFuncName;
      // initial content
      const content = scenarioInitializer.initialFunctionContent(newFuncName, this.nodeId);
      this.parsers[index].content = content;
      // update parser options
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
      this.emitUpdate();
    },
    entityModuleOptions(parser) {
      const entityModuleOptions = optionConfig.getEntityModuleOptionsMap();
      return entityModuleOptions[parser];
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
    getFuncOptions() {
      return [
        'regular_exp', 'common_parser', 'task_parser',
        'hotel_parser', 'user_custom_parser', 'polarity_parser', 'api_parser',
      ].map((func) => {
        const key = `task_engine_v2.condition_block.func.${func}`;
        return {
          text: this.$t(key),
          value: func,
        };
      });
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

#params-collecting-block{
  position: relative;
  display: flex;
  flex-direction: column;
  background: #F3F7F9;
  padding: 20px 20px 20px 20px;
  border: 1px solid $color-borderline;
  border-radius: 5px;
  margin: 0px 0px 20px 0px;
  cursor: move;
  .button-delete-param{
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .parser-block{
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
    .label-tooltip{
      display: flex;
      .tooltip_container{
        .button{
          margin-left: 0;
          background-color: transparent;
        }
        display: flex;
        align-items: center;
      }
    }
    .label-start{
      width: 84px;
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
      margin-left: 10px;
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
    .button-add-parser{
      width: 100px;
    }
  }
  .text-response{
    height: 100px;
    width: 100%;
    color: $color-font-normal;
  }
}
</style>
