<template lang="html">
<div id="condition-block">
  <div class="button-delete-condition" v-if="edgeType!=='pc_succeed' && edgeType!=='pc_failed'">
    <icon icon-type="delete" :enableHover="true" :size=24 @click="deleteEdge()"/>
  </div>
  <div class="normal-edge" v-if="edgeType==='normal' || edgeType==='trigger'">
    <template v-for="(rule, index) in andRules">
      <div class="rule-block" :key="rule.id">
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
            :options="sourceOptions"
            :showCheckedIcon="false"
            width="250px"
            :inputBarStyle="selectStyle"
          />
          <dropdown-select
            class="select select-function"
            :ref="`selectFunction_${index}`"
            :value="[rule.funcName]"
            @input="onSelectFunctionInput(index, $event)"
            :options="getFuncOptions(rule.source, index)"
            :showCheckedIcon="false"
            width="160px"
            :inputBarStyle="selectStyle"
          />
          <button
            class="button button-add-if"
            v-if="index === 0"
            @click="addRule()">
            ＋and if
          </button>
          <button
            class="button"
            style="width: 60px;"
            v-if="index !== 0"
            @click="deleteRule(index)">
            {{$t("task_engine_v2.condition_block.button_remove")}}
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
          <template v-for="(operation, idx) in rule.content.operations">
            <div class="row">
              <div class="label label-start">
                {{$t("task_engine_v2.condition_block.label_nth_match")}}
              </div>
              <input class="input-content"
                oninput="this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(^[0-9]{1,2}).*/g, '$1');"
                v-model.number="operation.index">
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
              :showSearchBar="true"
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
        <!-- 键值匹配 -->
        <div class="content-api-parser" v-if="rule.funcName === 'key_val_match'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_compare_operator")}}
            </div>
            <dropdown-select
              class="select"
              :value="[rule.content[0].compare]"
              @input="rule.content[0].compare = $event[0]"
              :options="keyValMatchCompareOptions"
              :showCheckedIcon="false"
              width="420px"
              :inputBarStyle="selectStyle"
            />
          </div>
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_key")}}
            </div>
            <input class="input-content" list="globalVars" v-model="rule.content[0].key"
              onmouseover="old=value;" 
              onmousedown="value='';" 
              onmouseup="value=old;">
            </input>
          </div>
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_value")}}
            </div>
            <input class="input-content" v-model="rule.content[0].val"></input>
          </div>
        </div>
        <!-- 键键匹配 -->
        <div class="content-api-parser" v-if="rule.funcName === 'key_key_match'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_compare_operator")}}
            </div>
            <dropdown-select
              class="select"
              :value="[rule.content[0].compare]"
              @input="rule.content[0].compare = $event[0]"
              :options="keyKeyMatchCompareOptions"
              :showCheckedIcon="false"
              width="420px"
              :inputBarStyle="selectStyle"
            />
          </div>
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_key")}}
            </div>
            <input class="input-content" list="globalVars" v-model="rule.content[0].key1"
              onmouseover="old=value;" 
              onmousedown="value='';" 
              onmouseup="value=old;">
            </input>
          </div>
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_key")}}
            </div>
            <input class="input-content" v-model="rule.content[0].key2"></input>
          </div>
        </div>
        <!-- 包含键 -->
        <div class="content-api-parser" v-if="rule.funcName === 'contain_key'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_content")}}
            </div>
            <input class="input-content" list="globalVars" v-model="rule.content[0].key"
              onmouseover="old=value;" 
              onmousedown="value='';" 
              onmouseup="value=old;">
            </input>
          </div>
        </div>
        <!-- 不包含键 -->
        <div class="content-api-parser" v-if="rule.funcName === 'not_contain_key'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_content")}}
            </div>
            <input class="input-content" list="globalVars" v-model="rule.content[0].key"
              onmouseover="old=value;" 
              onmousedown="value='';" 
              onmouseup="value=old;">
            </input>
          </div>
        </div>
        <!-- 序列长度匹配 -->
        <div class="content-api-parser" v-if="rule.funcName === 'list_length_match'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_compare_operator")}}
            </div>
            <dropdown-select
              class="select"
              :value="[rule.content[0].compare]"
              @input="rule.content[0].compare = $event[0]"
              :options="listLengthMatchCompareOptions"
              :showCheckedIcon="false"
              width="420px"
              :inputBarStyle="selectStyle"
            />
          </div>
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_key")}}
            </div>
            <input class="input-content" list="globalVars" v-model="rule.content[0].key"
              onmouseover="old=value;" 
              onmousedown="value='';" 
              onmouseup="value=old;">
            </input>
          </div>
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_value")}}
            </div>
            <input class="input-content"
              oninput="this.value = this.value.replace(/[^0-9]/g, '');"
              v-model="rule.content[0].val">
            </input>
          </div>
        </div>
        <!-- 轮次检查 -->
        <div class="content-api-parser" v-if="rule.funcName === 'counter_check'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_content")}}
            </div>
            <dropdown-select
              class="select"
              :value="[rule.content]"
              @input="rule.content = $event[0]"
              :options="counterCheckOptions"
              :showCheckedIcon="false"
              width="420px"
              :inputBarStyle="selectStyle"
            />
          </div>
        </div>
        <!-- 转换数据 -->
        <div class="content-api-parser" v-if="rule.funcName === 'user_custom_transform'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_mapping_table")}}
            </div>
            <dropdown-select
              class="select"
              :value="[rule.content.trans]"
              @input="rule.content.trans = $event[0]"
              :options="mapTableOptions"
              :showCheckedIcon="false"
              :showSearchBar="true"
              width="420px"
              :inputBarStyle="selectStyle"
            />
          </div>
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_source_key")}}
            </div>
            <input class="input-content" list="globalVars" v-model="rule.content.from_key"
              onmouseover="old=value;" 
              onmousedown="value='';" 
              onmouseup="value=old;">
            </input>
          </div>
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_target_key")}}
            </div>
            <input class="input-content" v-model="rule.content.to_key"></input>
          </div>
        </div>
        <!-- 正则表示式 -->
        <div class="content-api-parser" v-if="rule.funcName === 'regular_exp_from_var'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_pattern")}}
            </div>
            <input class="input-content" v-model="rule.content.pattern"></input>
          </div>
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_source_key")}}
            </div>
            <input class="input-content" list="globalVars" v-model="rule.content.from_key"
              onmouseover="old=value;" 
              onmousedown="value='';" 
              onmouseup="value=old;">
            </input>
          </div>
          <template v-for="(operation, idx) in rule.content.operations">
            <div class="row">
              <div class="label label-start">
                {{$t("task_engine_v2.condition_block.label_nth_match")}}
              </div>
              <input class="input-content"
                oninput="this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(^[0-9]{1,2}).*/g, '$1');"
                v-model.number="operation.index">
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
              <input class="input-content" v-model="operation.key"></input>
            </div>
          </template>
        </div>
        <!-- 赋值 -->
        <div class="content-api-parser" v-if="rule.funcName === 'assign_value'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_key")}}
            </div>
            <input class="input-content" list="globalVars" v-model="rule.content[0].key"
              onmouseover="old=value;" 
              onmousedown="value='';" 
              onmouseup="value=old;">
            </input>
          </div>
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_value")}}
            </div>
            <input class="input-content" v-model="rule.content[0].val"></input>
          </div>
        </div>
        <!-- 语句解析数据提取 -->
        <div class="content-api-parser" v-if="rule.funcName === 'cu_parser'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_content")}}
            </div>
            <dropdown-select
              class="select"
              :value="[rule.content]"
              @input="rule.content = $event[0]"
              :options="cuParserOptions"
              :showCheckedIcon="false"
              width="420px"
              :inputBarStyle="selectStyle"
            />
          </div>
        </div>
        <!-- 自定义语句解析数据提取 -->
        <div class="content-api-parser" v-if="rule.funcName === 'custom_cu_parser'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_content")}}
            </div>
            <input class="input-content" v-model="rule.content"></input>
          </div>
        </div>
      </div>
    </template>
    <div class="row row-then-goto" v-if="edgeType!=='trigger'">
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
        :showSearchBar="true"
        width="200px"
        :inputBarStyle="selectStyle"
      />
    </div>
  </div>
  <!-- 语句相似度 -->
  <div class="qq-edge" v-if="edgeType==='qq'">
    <div class="rule-block">
      <div class="row row-function">
        <div class="label label-start">
          if
        </div>
        <dropdown-select
          class="select select-source"
          ref="selectSource_0"
          :value="['text']"
          @input="onSelectSourceInput(0, $event)"
          :options="sourceOptions"
          :showCheckedIcon="false"
          width="250px"
          :inputBarStyle="selectStyle"
        />
        <dropdown-select
          class="select select-function"
          ref="selectFunction_0"
          :value="['qq']"
          @input="onSelectFunctionInput(0, $event)"
          :options="getFuncOptions('text', 0)"
          :showCheckedIcon="false"
          width="160px"
          :inputBarStyle="selectStyle"
        />
      </div>
      <div class="row">
        <div class="label label-start">
          {{$t("task_engine_v2.condition_block.label_similarity_threshold")}}
        </div>
        <input class="input-content" v-model="threshold"></input>
      </div>
      <template v-for="(edge, index) in candidateEdges">
        <div class="row">
          <div class="label label-start">
            {{$t("task_engine_v2.condition_block.label_sentence")}}
          </div>
          <input class="input-content" v-model="edge.tar_text"></input>
          <button
            v-if="index===0"
            class="button"
            style="width: 100px;"
            @click="addQQCandidateEdge()">
            {{`${$t("task_engine_v2.condition_block.button_add")}${$t("task_engine_v2.condition_block.label_sentence")}`}}
          </button>
          <button
            v-if="index!==0"
            class="button"
            style="width: 60px;"
            @click="deleteQQCandidateEdge(index)">
            {{$t("task_engine_v2.condition_block.button_remove")}}
          </button>
        </div>
        <div class="row">
          <div class="label label-start">
            {{$t("task_engine_v2.edge_edit_tab.label_then_goto")}}
          </div>
          <dropdown-select
            class="select select-goto"
            ref="selectGoto"
            :value="[edge.to_node_id]"
            @input="edge.to_node_id = $event[0]"
            :options="toNodeOptions"
            :showCheckedIcon="false"
            :showSearchBar="true"
            width="200px"
            :inputBarStyle="selectStyle"
          />
        </div>
      </template>
    </div>
  </div>
  <!---->
  <div class="succeed_then_goto pc_block" v-if="edgeType==='pc_succeed'">
    <div class="row">
      <div class="label label-bold">
        {{$t("task_engine_v2.params_collecting_edge_tab.succeed")}}
      </div>
      <div class="label label-margin-left">
        {{$t("task_engine_v2.params_collecting_edge_tab.succeed_description")}}
      </div>
      <div class="label label-margin-left">
        {{$t("task_engine_v2.edge_edit_tab.label_then_goto")}}
      </div>
      <dropdown-select
        class="select select-goto"
        ref="selectExceedThenGoto"
        :value="[toNode]"
        @input="toNode = $event[0]"
        :options="toNodeOptions.filter(option => option.text !== 'do nothing')"
        :showCheckedIcon="false"
        :showSearchBar="true"
        width="200px"
        :inputBarStyle="selectStyle"
      />
    </div>
  </div>
  <!---->
  <div class="exceed_limit pc_block" v-if="edgeType==='pc_failed'">
    <div class="row">
      <div class="label label-bold">
        {{$t("task_engine_v2.params_collecting_edge_tab.failed")}}
      </div>
      <div class="label label-margin-left">
        {{$t("task_engine_v2.params_collecting_edge_tab.failed_description")}}
      </div>
      <input class="input-limit" v-model="dialogueLimit"></input>
      <div class="label">
        {{$t("task_engine_v2.edge_edit_tab.label_time")}}
      </div>
      <div class="label label-margin-left">
        {{$t("task_engine_v2.edge_edit_tab.label_then_goto")}}
      </div>
      <dropdown-select
        class="select select-goto"
        ref="selectExceedThenGoto"
        :value="[toNode]"
        @input="toNode = $event[0]"
        :options="toNodeOptions.filter(option => option.text !== 'do nothing')"
        :showCheckedIcon="false"
        :showSearchBar="true"
        width="200px"
        :inputBarStyle="selectStyle"
      />
    </div>
  </div>
  <datalist id="globalVars">
    <template v-for="(option, index) in globalVarOptions">
      <option :value="option.value">{{option.text}}</option>
    </template>
  </datalist>
</div>
</template>

<script>
import DropdownSelect from '@/components/DropdownSelect';
import scenarioInitializer from '../_utils/scenarioInitializer';
import optionConfig from '../_utils/optionConfig';

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
    globalVarOptions: {
      type: Array,
      required: true,
    },
    mapTableOptions: {
      type: Array,
      required: true,
    },
    initialDialogueLimit: {
      tyep: Number,
      required: false,
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
      threshold: '0',
      candidateEdges: [],
      keyValMatchCompareOptions: [],
      keyKeyMatchCompareOptions: [],
      listLengthMatchCompareOptions: [],
      counterCheckOptions: [],
      cuParserOptions: [],
      sourceOptions: [],
      funcOptionMap: [],
      dialogueLimit: 3,
    };
  },
  computed: {},
  watch: {
    andRules: {
      handler() {
        this.emitUpdate();
      },
      deep: true,
    },
    candidateEdges: {
      handler() {
        this.emitUpdate();
      },
      deep: true,
    },
    toNode: {
      handler() {
        this.emitUpdate();
      },
      deep: true,
    },
    threshold: {
      handler() {
        this.emitUpdate();
      },
    },
    dialogueLimit: {
      handler() {
        this.emitUpdate();
      },
    },
  },
  methods: {
    renderConditionContent() {
      this.edge = JSON.parse(JSON.stringify(this.initialEdge));
      this.dialogueLimit = this.initialDialogueLimit;
      this.edgeType = this.edge.edge_type || 'normal';
      this.sourceOptions = optionConfig.getSourceOptions(this);
      this.funcOptionMap = optionConfig.getFuncOptionMap(this);
      this.keyValMatchCompareOptions = optionConfig.getKeyValMatchCompareOptions(this);
      this.keyKeyMatchCompareOptions = optionConfig.getKeyKeyMatchCompareOptions(this);
      this.listLengthMatchCompareOptions = optionConfig.getListLengthMatchCompareOptions(this);
      this.counterCheckOptions = optionConfig.getCounterCheckOptions(this);
      this.cuParserOptions = optionConfig.getCuParserOptions(this);
      if (this.edgeType === 'qq') {
        this.renderQQEdge();
      } else {
        this.renderNormalEdge();
      }
    },
    renderQQEdge() {
      this.threshold = this.edge.threshold;
      this.candidateEdges = this.edge.candidate_edges.map((edge) => {
        let toNodeId = edge.to_node_id;
        if (toNodeId === 'null') {
          toNodeId = null;
        }
        return {
          to_node_id: toNodeId,
          tar_text: edge.tar_text,
        };
      });
    },
    renderNormalEdge() {
      // render andRules
      const rules = this.edge.condition_rules || [];
      if (rules.length > 0) {
        this.andRules = rules[0].map((rule) => {
          if (rule.source && rule.functions && rule.functions.length > 0) {
            return {
              id: this.$uuid.v1(),
              source: rule.source,
              funcName: rule.functions[0].function_name,
              content: rule.functions[0].content,
            };
          }
          return {
            id: this.$uuid.v1(),
            source: 'text',
            funcName: null,
            content: {},
          };
        });
      }
      // render toNode
      this.toNode = this.edge.to_node_id;
    },
    deleteEdge() {
      this.$emit('deleteEdge');
    },
    addRule() {
      const rule = scenarioInitializer.initialRule();
      this.andRules.push({
        id: this.$uuid.v1(),
        source: rule.source,
        funcName: rule.functions[0].function_name,
        content: rule.functions[0].content,
      });
    },
    deleteRule(index) {
      this.andRules.splice(index, 1);
    },
    addRegTargetKey(index) {
      const operation = scenarioInitializer.initialRegularOperation();
      this.andRules[index].content.operations.push(operation);
    },
    deleteRegTargetKey(index, idx) {
      this.andRules[index].content.operations.splice(idx, 1);
    },
    addQQCandidateEdge() {
      this.candidateEdges.push(scenarioInitializer.initialCandidateEdge());
    },
    deleteQQCandidateEdge(index) {
      this.candidateEdges.splice(index, 1);
    },
    onSelectSourceInput(index, newValue) {
      const newSource = newValue[0];
      const options = this.funcOptionMap[newSource];
      if (this.edgeType === 'qq') {
        this.edgeType = 'normal';
        this.toNode = null;
        this.andRules = [{
          id: this.$uuid.v1(),
          source: newSource,
          funcName: options[0].value,
          content: scenarioInitializer.initialFunctionContent(options[0].value, this.nodeId),
        }];
      } else {
        if (this.andRules[index].source === newSource) return;
        this.andRules[index].source = newSource;
        const selectFunctionRef = `selectFunction_${index}`;
        if (this.$refs[selectFunctionRef]) {
          this.$refs[selectFunctionRef][0].$emit('updateOptions', options);
          this.$refs[selectFunctionRef][0].$emit('select', options[0].value);
        }
      }
    },
    onSelectFunctionInput(index, newValue) {
      const newFuncName = newValue[0];
      const originalEdgeType = this.edgeType;
      if (newFuncName === 'qq') {
        this.changeToQQEdge(originalEdgeType);
      } else {
        this.changeToNormalEdge(originalEdgeType, index, newFuncName);
      }
    },
    changeToQQEdge(originalEdgeType) {
      if (originalEdgeType === 'qq') {
        return;
      }
      this.edgeType = 'qq';
      this.threshold = '0';
      this.candidateEdges = [scenarioInitializer.initialCandidateEdge()];
    },
    changeToNormalEdge(originalEdgeType, index, newFuncName) {
      if (originalEdgeType === 'qq') {
        this.edgeType = 'normal';
        this.toNode = null;
        this.andRules = [{
          id: this.$uuid.v1(),
          source: 'text',
          funcName: newFuncName,
          content: {},
        }];
      } else {  // originalEdgeType === 'normal'
        if (this.andRules[index].funcName === newFuncName) return;
        this.andRules[index].funcName = newFuncName;
      }
      // initial content
      const content = scenarioInitializer.initialFunctionContent(newFuncName, this.nodeId);
      this.andRules[index].content = content;

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
    },
    onSelectTargetEntity(index, newValue) {
      this.andRules[index].content.tags = newValue.join(',');
      // this.emitUpdate();
    },
    onSelectMapTableInput(index, newValue) {
      const newMapTable = newValue[0];
      if (this.andRules[index].content.trans === newMapTable) return;
      this.andRules[index].content.trans = newMapTable;
      // this.emitUpdate();
    },
    emitUpdate() {
      let conditionBlock = {};
      if (this.edgeType === 'qq') {
        conditionBlock = {
          id: this.edge.id,
          edge_type: this.edgeType,
          threshold: this.threshold,
          candidate_edges: this.candidateEdges,
        };
      } else if (this.edgeType === 'pc_succeed') {
        conditionBlock = {
          id: this.edge.id,
          edge_type: 'pc_succeed',
          to_node_id: this.toNode,
          actions: [{
            operation: 'set_to_global_info',
            key: 'sys_node_dialogue_cnt',
            val: 0,
          }],
          condition_rules: [[{
            source: 'global_info',
            functions: [{
              content: [],
              function_name: 'all_parameters_are_collected',
            }],
          }]],
        };
      } else if (this.edgeType === 'pc_failed') {
        conditionBlock = {
          id: this.edge.id,
          edge_type: 'pc_failed',
          to_node_id: this.toNode,
          actions: [{
            operation: 'set_to_global_info',
            key: 'sys_node_dialogue_cnt',
            val: 0,
          }],
          condition_rules: [[{
            source: 'global_info',
            functions: [{
              content: 'node_counter',
              function_name: 'counter_check',
            }],
          }]],
          dialogueLimit: this.dialogueLimit,
        };
      } else {
        conditionBlock = {
          id: this.edge.id,
          edge_type: this.edgeType,
          to_node_id: this.toNode,
          actions: [],
          condition_rules: [this.andRules.map(rule => ({
            source: rule.source,
            functions: [{
              function_name: rule.funcName,
              content: rule.content,
            }],
          }))],
        };
        // console.log(conditionBlock.condition_rules[0][0].functions[0].content);
      }
      // console.log(conditionBlock);
      this.$emit('update', conditionBlock);
    },
    entityModuleOptions(parser) {
      const entityModuleOptions = optionConfig.getEntityModuleOptionsMap();
      return entityModuleOptions[parser];
    },
    getFuncOptions(source, ruleIndex) {
      // hide qq option when it is not the first rule
      if (source === 'text' && ruleIndex !== 0) {
        return this.funcOptionMap[source].filter((option => option.value !== 'qq'));
      }
      return this.funcOptionMap[source];
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
  .pc_block{
    .label-bold{
      font-weight: 600;
    }
    .label-margin-left{
      margin-left: 20px;
    }
    .input-limit{
      height: 36px;
      margin: 0px 10px 0px 10px;
      width: 40px;
    }
    .select{
      background: white;
      margin-left: 20px;
      border-radius: 5px;
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
