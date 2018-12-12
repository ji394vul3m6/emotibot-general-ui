<template>
<div class="condition-action-block">
  <div class="header">
    <button class="add" @click="toggleAddCondition = !toggleAddCondition" v-dropdown="sourceDropdown">
      {{ $t('task_engine_v2.condition_action_block.add_condition')}}
      <img class="arrow" :class="{rotate180: toggleAddCondition}" src="@/assets/icons/expand_blue_icon.svg"/>
    </button>
    <button class="add" @click="toggleAddAction = !toggleAddAction" v-dropdown="actionDropdown">
      {{ $t('task_engine_v2.condition_action_block.add_action')}}
      <img class="arrow" :class="{rotate180: toggleAddAction}" src="@/assets/icons/expand_blue_icon.svg"/>
    </button>
    <span class="info">
      {{ $t('task_engine_v2.condition_action_block.to') }}
      {{ $t('task_engine_v2.condition_action_block.colon') }}
      <div class="to-node">{{ toNodeText }}</div>
      {{ $t('task_engine_v2.condition_action_block.condition_action', { condition: andRules.length, action: actions.length + 1}) }}
    </span>
    <button 
      class="delete"
      v-if="edgeType!=='pc_succeed' && edgeType!=='pc_failed' && edgeType!=='virtual_global_edges'"
      @click="deleteEdge">
      {{ $t('task_engine_v2.condition_action_block.delete') }}
    </button>
    <button class="toggle" :class="{collapse: !showConditionsAndActions}" @click="showConditionsAndActions = !showConditionsAndActions">
      <img src="@/assets/icons/month_left_icon.svg"/>
    </button>
  </div>
  <template v-if="showConditionsAndActions">
    <!-- 条件设置 -->
    <div class="normal-edge" v-if="(edgeType==='normal' || edgeType==='trigger' || edgeType==='normal_2.0') && andRules.length">
      <div class="title" v-t="'task_engine_v2.condition_action_block.condition_setup'"></div>
      <div class="dropdown-select-container">
        {{ $t('task_engine_v2.condition_action_block.match') }}
        <dropdown-select 
          class="dropdown-select"
          :options="conditionOptions"
          :showCheckedIcon="false"
          width="100px"
          @input="selectedOption = [conditionOptions.find(option => option.value === $event[0]).value]"
          :value="selectedOption"
          :inputBarStyle="selectStyle">
          </dropdown-select>
        {{ $t('task_engine_v2.condition_action_block.below_conditions')}}
      </div>
      <template v-for="(rule, index) in andRules">
        <div :key="rule.id" class="block">
          <div class="row">
            <span class="label" v-if="index === 0" v-t="'task_engine_v2.condition_action_block.if'"></span>
            <span class="label" v-if="index !== 0" v-t="'task_engine_v2.condition_action_block.and_if'"></span>
            <dropdown-select
              class="dropdown-select"
              :ref="`selectSource_${index}`"
              :value="[rule.source]"
              @input="onSelectSourceInput(index, $event)"
              :options="sourceOptions"
              :showCheckedIcon="false"
              :inputBarStyle="selectStyle"/>
            <dropdown-select
              class="dropdown-select"
              :ref="`selectFunction_${index}`"
              :value="[rule.funcName]"
              @input="onSelectFunctionInput(index, $event)"
              :options="getFuncOptions(rule.source, index)"
              :showCheckedIcon="false"
              :fixedListWidth="false"
              :inputBarStyle="selectStyle"/>
            <icon class="trash" :size="14" iconType="trash" @click="deleteRule(index)"></icon>
          </div>
          <!-- 完全相符 / 包含文本 -->
          <div class="row" v-if="rule.funcName === 'match' || rule.funcName == 'contains'">
            <span class="label" v-t="'task_engine_v2.condition_action_block.label_content'"></span>
            <input ref="input-content" class="input-content" v-model="rule.content" v-tooltip="inputTooltip" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus"/>
          </div>
          <!-- 正则表示式 -->
          <div class="row" v-if="rule.funcName === 'regular_exp'">
            <span class="label" v-t="'task_engine_v2.condition_action_block.label_pattern'"></span>
            <input ref="input-content" class="input-content" v-model="rule.content.pattern" v-tooltip="inputTooltip" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus"/>
            <!-- <template v-for="(operation, idx) in rule.content.operations">
              <div :key="idx">
                <div class="row">
                  <div class="label label-start">
                    {{$t("task_engine_v2.condition_block.label_nth_match")}}
                  </div>
                  <input class="input-content" ref="input-content" v-tooltip="inputTooltip"
                    oninput="this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(^[0-9]{1,2}).*/g, '$1');"
                    v-model.number="operation.index"
                    @focus="onInputFocus"/>
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
                  <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="operation.key" @focus="onInputFocus"/>
                </div>
              </div>
            </template> -->
          </div>
          <!-- Intent -->
          <div class="row" v-if="rule.funcName === 'intent_parser'">
            <span class="label" v-t="'task_engine_v2.condition_action_block.label_content'"></span>
            <dropdown-select
              class="dropdown-select"
              :value="[rule.content]"
              @input="rule.content = $event[0]"
              :options="intentOptions"
              :fixedListWidth="false"
              :showCheckedIcon="false"
              :inputBarStyle="selectStyle"/>
          </div>
          <!-- 键值匹配 -->
          <template v-if="rule.funcName === 'key_val_match'">
            <div class="row">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_compare_operator'"></span>
              <dropdown-select
                class="dropdown-select"
                :key="rule.funcName"
                :value="[rule.content[0].compare]"
                @input="rule.content[0].compare = $event[0]"
                :options="keyValMatchCompareOptions"
                :showCheckedIcon="false"
                :inputBarStyle="selectStyle"/>
            </div>
            <div class="row" v-if="rule.funcName === 'key_val_match'">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_key'"></span>
              <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(rule.id, rule.content[0], 'key')">
                <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content[0].key" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus">
              </div>
            </div>
            <div class="row">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_value'"></span>
              <input v-if="rule.content[0].compare === '>'  ||
                          rule.content[0].compare === '>=' ||
                          rule.content[0].compare === '<'  ||
                          rule.content[0].compare === '<=' "
                ref="input-content" 
                v-tooltip="inputTooltip"
                class="input-content"
                oninput="this.value = this.value.replace(/[^0-9]/g, '');"
                v-model="rule.content[0].val"
                :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')"
                @focus="onInputFocus"/>
              <input v-else
                ref="input-content" 
                class="input-content"
                v-tooltip="inputTooltip"
                v-model="rule.content[0].val"
                :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')"
                @focus="onInputFocus"/>
            </div>
          </template>
          <!-- 键键匹配 -->
          <template v-if="rule.funcName === 'key_key_match'">
            <div class="row">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_compare_operator'"></span>
              <dropdown-select
                class="dropdown-select"
                :key="rule.funcName"
                :value="[rule.content[0].compare]"
                @input="rule.content[0].compare = $event[0]"
                :options="keyKeyMatchCompareOptions"
                :showCheckedIcon="false"
                :inputBarStyle="selectStyle"/>
            </div>
            <div class="row">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_key'"></span>
              <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(rule.id, rule.content[0], 'key1')">
                <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content[0].key1" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus">
              </div>
            </div>
            <div class="row">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_key'"></span>
              <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content[0].key2" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus"/>
            </div>
          </template>
          <!-- 包含键 -->
          <div class="row" v-if="rule.funcName === 'contain_key'">
            <span class="label" v-t="'task_engine_v2.condition_action_block.label_key'"></span>
            <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(rule.id, rule.content[0], 'key')">
              <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content[0].key" :key="rule.funcName" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus">
            </div>
          </div>
          <!-- 不包含键 -->
          <div class="row" v-if="rule.funcName === 'not_contain_key'">
            <span class="label" v-t="'task_engine_v2.condition_action_block.label_key'"></span>
            <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(rule.id, rule.content[0], 'key')">
              <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content[0].key" :key="rule.funcName" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus">
            </div>
          </div>
           <!-- 序列长度匹配 -->
           <template v-if="rule.funcName === 'list_length_match'">
            <div class="row">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_compare_operator'"></span>
              <dropdown-select
                class="dropdown-select"
                :key="rule.funcName"
                :value="[rule.content[0].compare]"
                @input="rule.content[0].compare = $event[0]"
                :options="listLengthMatchCompareOptions"
                :showCheckedIcon="false"
                :inputBarStyle="selectStyle"/>
            </div>
            <div class="row">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_key'"></span>
              <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(rule.id, rule.content[0], 'key')">
                <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content[0].key" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus">
              </div>
            </div>
            <div class="row">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_value'"></span>
              <input 
                class="input-content" 
                ref="input-content" 
                v-tooltip="inputTooltip"
                oninput="this.value = this.value.replace(/[^0-9]/g, '');"
                v-model="rule.content[0].val"
                :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')"
                @focus="onInputFocus"/>
            </div>
          </template>
          <!-- 轮次检查 -->
          <div class="row" v-if="rule.funcName === 'counter_check'">
            <span class="label" v-t="'task_engine_v2.condition_action_block.label_content'"></span>
            <dropdown-select
              class="dropdown-select"
              :key="rule.funcName"
              :value="[rule.content]"
              @input="rule.content = $event[0]"
              :options="counterCheckOptions"
              :showCheckedIcon="false"
              :inputBarStyle="selectStyle"/>
          </div>
          <!-- 正则表示式 -->
          <template v-if="rule.funcName === 'regular_exp_from_var'">
            <div class="row">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_pattern'"></span>
              <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content.pattern" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus"/>
            </div>
            <div class="row">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_source_key'"></span>
              <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(rule.id, rule.content, 'from_key')">
                <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content.from_key" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus">
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
    <!-- 执行动作 -->
    <div class="normal-edge" v-if="(edgeType==='normal' || edgeType==='trigger' || edgeType==='normal_2.0')">
      <div class="title" v-t="'task_engine_v2.condition_action_block.action_setup'"></div>
      <template v-for="(action, index) in actions">
        <div :key="action.id" class="block">
          <!-- 键值赋值 / 键键赋值-->
          <template v-if="action.type === ActionType.AssignValue">
            <div class="row">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_assign_value'"></span>
              <dropdown-select
                class="dropdown-select"
                :ref="`selectSource_${index}`"
                :value="[action.content.operation]"
                @input="action.content.operation = $event[0];"
                :options="assignValueOptions"
                :showCheckedIcon="false"
                :inputBarStyle="selectStyle"/>
              <icon class="trash" :size="14" iconType="trash" @click="deleteAction(index)"></icon>
            </div>
            <div class="row" v-if="action.content.operation === 'set_key_to_value'">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_exec'"></span>
              <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(action.id, action.content, 'key')">
                <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.key" :placeholder="$t('task_engine_v2.condition_action_block.key_placeholder')" @focus="onInputFocus">
              </div>
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_equal'"></span>
              <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.val" :placeholder="$t('task_engine_v2.condition_action_block.value_placeholder')" @focus="onInputFocus"/>
            </div>
            <div class="row" v-if="action.content.operation === 'set_key_to_key'">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_exec'"></span>
              <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(action.id, action.content, 'key')">
                <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.key" :placeholder="$t('task_engine_v2.condition_action_block.key_placeholder')" @focus="onInputFocus">
              </div>
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_equal'"></span>
              <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.val" :placeholder="$t('task_engine_v2.condition_action_block.key_placeholder')" @focus="onInputFocus"/>
            </div>
          </template>
          <!-- Web API 调用 -->
          <div class="row" v-if="action.type === ActionType.WebAPI">
            <span class="label" v-t="'task_engine_v2.condition_action_block.label_web_api'"></span>
            <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content" :placeholder="$t('task_engine_v2.condition_action_block.http_placeholder')" @focus="onInputFocus"/>
            <icon class="trash" :size="14" iconType="trash" @click="deleteAction(index)"></icon>
          </div>
          <!-- 文字回复 -->
          <div class="row" v-if="action.type === ActionType.ResponseText">
            <span class="label" v-t="'task_engine_v2.condition_action_block.label_text_response'"></span>
            <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus"/>
            <icon class="trash" :size="14" iconType="trash" @click="deleteAction(index)"></icon>
          </div>
          <!-- 解析器 -->
          <template v-if="action.type === ActionType.Parser">
            <div class="row">
              <span class="label" v-t="'task_engine_v2.condition_action_block.label_parser'"></span>
              <dropdown-select
                class="dropdown-select"
                :ref="`selectSource_${index}`"
                :value="[action.parser]"
                @input="parserInput(action, {parser: $event[0], source: 'text'})"
                :options="parserOptions"
                :placeholder="$t('task_engine_v2.condition_action_block.parser_placeholder')"
                :showCheckedIcon="false"
                :inputBarStyle="selectStyle"/>
              <icon class="trash" :size="14" iconType="trash" @click="deleteAction(index)"></icon>
            </div>
            <!-- 规则解析器 -->
            <div :key="action.parser" v-if="action.parser === 'reg_parser'">
              <div class="row">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_source'"></span>
                <dropdown-select
                  class="dropdown-select"
                  :ref="`selectSource_${index}`"
                  :value="[action.source]"
                  @input="parserInput(action, {source: $event[0], parser: action.parser})"
                  :options="sourceOptions"
                  :showCheckedIcon="false"
                  :inputBarStyle="selectStyle"/>
              </div>
              <div class="row">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_pattern'"></span>
                <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.pattern" :placeholder="$t('task_engine_v2.condition_action_block.reg_placeholder')" @focus="onInputFocus"/>
              </div>
              <div class="row" v-if="action.source === 'global_info'">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_source_key'"></span>
                <div ref="insertVarDropdown" class="dropdown-container" v-dropdown="insertVarDropdown(action.id, action.content, 'from_key')">
                  <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.from_key" @focus="onInputFocus">
                </div>
              </div>
              <div class="row">
                <span class="label"></span>
                <button 
                  class="add-target-key" 
                  v-t="'task_engine_v2.condition_action_block.add_target_key'"
                  @click="action.content.operations.push({index: 0, key: '', operation: 'set_to_global_info'})">
                </button>
              </div>
              <template v-for="(operation, idx) in action.content.operations">
                <div class="row" :key="idx">
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_match'"></span>
                  <input class="input-content" ref="input-content" v-tooltip="inputTooltip"
                      oninput="this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(^[0-9]{1,2}).*/g, '$1');"
                      v-model.number="operation.index"
                      @focus="onInputFocus"/>
                  <span class="label" v-t="'task_engine_v2.condition_action_block.label_target_key'"></span>
                  <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="operation.key" @focus="onInputFocus">
                  <button class="grey-delete" v-t="'task_engine_v2.condition_action_block.delete'" @click="action.content.operations.splice(idx, 1)"></button>
                </div>
              </template>
            </div>
            <!-- 是否解析器 -->
            <div :key="action.parser" v-if="action.parser === 'polarity_parser'">
              <div class="row">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_source'"></span>
                <dropdown-select
                  class="dropdown-select"
                  :ref="`selectSource_${index}`"
                  :value="[action.source]"
                  @input="parserInput(action, {source: $event[0], parser: action.parser})"
                  :options="sourceOptions"
                  :showCheckedIcon="false"
                  :inputBarStyle="selectStyle"/>
              </div>
              <div class="row">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_target_key'"></span>
                <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="action.content.key" :placeholder="$t('task_engine_v2.condition_action_block.input_placeholder')" @focus="onInputFocus"/>
              </div>
            </div>
            <!-- 酒店预定语句解析器 / 通用语句解析器 / 场景语句解析器 -->
            <div :key="action.parser" v-if="action.parser === 'common_parser' || action.parser === 'hotel_parser' || action.parser === 'task_parser'">
              <div class="row">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_source'"></span>
                <dropdown-select
                  class="dropdown-select"
                  :ref="`selectSource_${index}`"
                  :value="[action.source]"
                  @input="parserInput(action, {source: $event[0], parser: action.parser})"
                  :options="sourceOptions"
                  :showCheckedIcon="false"
                  :inputBarStyle="selectStyle"/>
              </div>
              <div class="row">
                <span class="label" v-t="'task_engine_v2.condition_action_block.label_content'"></span>
                <dropdown-select
                  class="dropdown-select"
                  :key="action.funcName"
                  :ref="`selectTargetEntity_${index}`"
                  :multi="true"
                  :value="action.content.tags.split(',')"
                  @input="action.content.tags = $event.join(',')"
                  :options="entityModuleOptions(action.funcName)"
                  :showCheckedIcon="true"
                  :showSearchBar="true"
                  :placeholder="$t('task_engine_v2.condition_action_block.multi_placeholder')"
                  :inputBarStyle="selectStyle"/>
              </div>
            </div>
          </template>
        </div>
      </template>
      <div class="block">
        <div class="row" v-if="edgeType!=='trigger'">
          <span class="label" v-t="'task_engine_v2.condition_action_block.to'"></span>
          <dropdown-select
            class="dropdown-select"
            ref="selectGoto"
            :value="[toNode]"
            @input="onSelectGoto($event[0])"
            :options="toNodeOptions"
            :fixedListWidth="false"
            :showCheckedIcon="false"
            :showSearchBar="true"
            :inputBarStyle="selectStyle"/>
        </div>
      </div>
    </div>
  </template>
  <div class="normal-edge" v-if="edgeType==='normal' || edgeType==='trigger' || edgeType==='normal_2.0'">
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
            :fixedListWidth="false"
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
            <input ref="input-content" class="input-content" v-model="rule.content" v-tooltip="inputTooltip" @focus="onInputFocus"/>
          </div>
        </div>
        <!-- 正则表示式 -->
        <div class="content-regular-exp" v-if="rule.funcName === 'regular_exp'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_pattern")}}
            </div>
            <input ref="input-content" class="input-content" v-model="rule.content.pattern" v-tooltip="inputTooltip" @focus="onInputFocus"/>
          </div>
          <template v-for="(operation, idx) in rule.content.operations">
            <div :key="idx">
            <div class="row">
              <div class="label label-start">
                {{$t("task_engine_v2.condition_block.label_nth_match")}}
              </div>
              <input class="input-content" ref="input-content" v-tooltip="inputTooltip"
                oninput="this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(^[0-9]{1,2}).*/g, '$1');"
                v-model.number="operation.index"
                @focus="onInputFocus"/>
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
              <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="operation.key" @focus="onInputFocus"/>
            </div>
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
              :key="rule.funcName"
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
              :key="rule.funcName"
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
            <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content.to_key" @focus="onInputFocus"/>
          </div>
        </div>
        <!-- 是否判断解析器 -->
        <div class="content-polarity-parser" v-if="rule.funcName === 'polarity_parser'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_target_key")}}
            </div>
            <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content.key" @focus="onInputFocus"/>
          </div>
        </div>
        <!-- Web API 调用 -->
        <div class="content-api-parser" v-if="rule.funcName === 'api_parser'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_link")}}
            </div>
            <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content" @focus="onInputFocus"/>
          </div>
        </div>
        <!-- Intent -->
        <div class="content-api-parser" v-if="rule.funcName === 'intent_parser'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_content")}}
            </div>
            <div :key="intentDropdown.options.length ? `${index}_has_options`: index" class="input-with-dropdown-container" v-dropdown="renderIntentDropdown(index)" :data-index="index">
              <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content.intentName" :key="rule.funcName" @focus="onInputFocus">
            </div>
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
              :key="rule.funcName"
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
            <div ref="insertVarDropdown" class="input-with-dropdown-container" v-dropdown="insertVarDropdown(rule.id, rule.content[0], 'key')">
              <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content[0].key" @focus="onInputFocus">
            </div>
          </div>
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_value")}}
            </div>
            <input v-if="rule.content[0].compare === '>'  ||
                         rule.content[0].compare === '>=' ||
                         rule.content[0].compare === '<'  ||
                         rule.content[0].compare === '<=' "
              ref="input-content" 
              v-tooltip="inputTooltip"
              class="input-content"
              oninput="this.value = this.value.replace(/[^0-9]/g, '');"
              v-model="rule.content[0].val"
              @focus="onInputFocus"
            >
            <input v-else
              ref="input-content" 
              class="input-content"
              v-tooltip="inputTooltip"
              v-model="rule.content[0].val"
              @focus="onInputFocus"
            >
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
              :key="rule.funcName"
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
            <div ref="insertVarDropdown" class="input-with-dropdown-container" v-dropdown="insertVarDropdown(rule.id, rule.content[0], 'key1')">
              <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content[0].key1" @focus="onInputFocus">
            </div>
          </div>
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_key")}}
            </div>
            <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content[0].key2" @focus="onInputFocus"/>
          </div>
        </div>
        <!-- 包含键 -->
        <div class="content-api-parser" v-if="rule.funcName === 'contain_key'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_content")}}
            </div>
            <div ref="insertVarDropdown" class="input-with-dropdown-container" v-dropdown="insertVarDropdown(rule.id, rule.content[0], 'key')">
              <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content[0].key" :key="rule.funcName" @focus="onInputFocus">
            </div>
          </div>
        </div>
        <!-- 不包含键 -->
        <div class="content-api-parser" v-if="rule.funcName === 'not_contain_key'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_content")}}
            </div>
            <div ref="insertVarDropdown" class="input-with-dropdown-container" v-dropdown="insertVarDropdown(rule.id, rule.content[0], 'key')">
              <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content[0].key" :key="rule.funcName" @focus="onInputFocus">
            </div>
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
              :key="rule.funcName"
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
            <div ref="insertVarDropdown" class="input-with-dropdown-container" v-dropdown="insertVarDropdown(rule.id, rule.content[0], 'key')">
              <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content[0].key" @focus="onInputFocus">
            </div>
          </div>
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_value")}}
            </div>
            <input class="input-content" ref="input-content" v-tooltip="inputTooltip"
              oninput="this.value = this.value.replace(/[^0-9]/g, '');"
              v-model="rule.content[0].val"
              @focus="onInputFocus"/>
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
              :key="rule.funcName"
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
            <div ref="insertVarDropdown" class="input-with-dropdown-container" v-dropdown="insertVarDropdown(rule.id, rule.content, 'from_key')">
              <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content.from_key" @focus="onInputFocus">
            </div>
          </div>
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_target_key")}}
            </div>
            <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content.to_key" @focus="onInputFocus"/>
          </div>
        </div>
        <!-- 正则表示式 -->
        <div class="content-api-parser" v-if="rule.funcName === 'regular_exp_from_var'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_pattern")}}
            </div>
            <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content.pattern" @focus="onInputFocus"/>
          </div>
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_source_key")}}
            </div>
            <div ref="insertVarDropdown" class="input-with-dropdown-container" v-dropdown="insertVarDropdown(rule.id, rule.content, 'from_key')">
              <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content.from_key" @focus="onInputFocus">
            </div>
          </div>
          <template v-for="(operation, idx) in rule.content.operations">
            <div :key="idx">
              <div class="row">
                <div class="label label-start">
                  {{$t("task_engine_v2.condition_block.label_nth_match")}}
                </div>
                <input class="input-content" ref="input-content" v-tooltip="inputTooltip"
                  oninput="this.value = this.value.replace(/[^0-9]/g, ''); this.value = this.value.replace(/(^[0-9]{1,2}).*/g, '$1');"
                  v-model.number="operation.index"
                  @focus="onInputFocus"
                >
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
                <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="operation.key" @focus="onInputFocus">
              </div>
            </div>
          </template>
        </div>
        <!-- 赋值 -->
        <div class="content-api-parser" v-if="rule.funcName === 'assign_value'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_key")}}
            </div>
            <div ref="insertVarDropdown" class="input-with-dropdown-container" v-dropdown="insertVarDropdown(rule.id, rule.content[0], 'key')">
              <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content[0].key" @focus="onInputFocus">
            </div>
          </div>
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_value")}}
            </div>
            <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content[0].val" @focus="onInputFocus"/>
          </div>
        </div>
        <!-- 删除键 -->
        <div class="content-api-parser" v-if="rule.funcName === 'remove_key'">
          <div class="row">
            <div class="label label-start">
              {{$t("task_engine_v2.condition_block.label_key")}}
            </div>
            <div ref="insertVarDropdown" class="input-with-dropdown-container" v-dropdown="insertVarDropdown(rule.id, rule.content[0], 'key')">
              <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content[0].key" @focus="onInputFocus">
            </div>
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
              :key="rule.funcName"
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
            <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="rule.content" @focus="onInputFocus"/>
          </div>
        </div>
      </div>
    </template>
    <div class="row row-no-bottom-margin" v-if="edgeType!=='trigger'">
      <div class="label label-start">
        {{$t("task_engine_v2.edge_edit_tab.label_then_goto")}}
      </div>
      <dropdown-select
        class="select select-goto"
        ref="selectGoto"
        :value="[toNode]"
        @input="onSelectGoto($event[0])"
        :options="toNodeOptions"
        :fixedListWidth="false"
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
        <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="threshold" @focus="onInputFocus"/>
      </div>
      <template v-for="(edge, index) in candidateEdges">
        <div :key="index">
        <div class="row">
          <div class="label label-start">
            {{$t("task_engine_v2.condition_block.label_sentence")}}
          </div>
          <input ref="input-content" v-tooltip="inputTooltip" class="input-content" v-model="edge.tar_text" @focus="onInputFocus"/>
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
            :ref="`qqSelectGoto_${index}`"
            :value="[edge.to_node_id]"
            @input="onQQSelectGoto($event[0], index)"
            :options="toNodeOptions"
            :fixedListWidth="false"
            :showCheckedIcon="false"
            :showSearchBar="true"
            width="200px"
            :inputBarStyle="selectStyle"
          />
        </div>
        </div>
      </template>
    </div>
  </div>
  <!--[参数收集节点]取得所有必要参数-->
  <div class="succeed_then_goto pc_block" v-if="edgeType==='pc_succeed'">
    <div class="row row-no-bottom-margin">
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
        @input="onSelectGoto($event[0])"
        :options="toNodeOptions.filter(option => option.text !== 'do nothing')"
        :fixedListWidth="false"
        :showCheckedIcon="false"
        :showSearchBar="true"
        width="200px"
        :inputBarStyle="selectStyle"
      />
    </div>
  </div>
  <!--[参数收集节点]解析失败-->
  <div class="exceed_limit pc_block" v-if="edgeType==='pc_failed'">
    <div class="row row-no-bottom-margin">
      <div class="label label-bold">
        {{$t("task_engine_v2.params_collecting_edge_tab.failed")}}
      </div>
      <div class="label label-margin-left">
        {{$t("task_engine_v2.params_collecting_edge_tab.failed_description")}}
      </div>
      <input ref="input-content" v-tooltip="inputTooltip" class="input-limit" v-model="dialogueLimit" @focus="onInputFocus"/>
      <div class="label">
        {{$t("task_engine_v2.edge_edit_tab.label_time")}}
      </div>
      <div class="label label-margin-left">
        {{$t("task_engine_v2.edge_edit_tab.label_then_goto")}}
      </div>
      <dropdown-select
        class="select select-goto"
        :value="[toNode]"
        ref="selectSucceedThenGoto"
        @input="onSelectGoto($event[0])"
        :options="toNodeOptions.filter(option => option.text !== 'do nothing')"
        :fixedListWidth="false"
        :showCheckedIcon="false"
        :showSearchBar="true"
        width="200px"
        :inputBarStyle="selectStyle"
      />
    </div>
  </div>
  <!--[参数收集节点]虚拟通用连线-->
  <div class="virtual_global_edges pc_block" v-if="edgeType==='virtual_global_edges'">
    <div class="row row-no-bottom-margin">
      <div class="label label-bold">
        {{$t("task_engine_v2.params_collecting_edge_tab.virtual_global_edges")}}
      </div>
      <div class="label label-margin-left">
        {{$t("task_engine_v2.params_collecting_edge_tab.virtual_global_edges_description")}}
      </div>
    </div>
  </div>
</div>
</template>

<script>
import event from '@/utils/js/event';
import DropdownSelect from '@/components/DropdownSelect';
import intentApi from '@/modules/IntentEngine/_api/intent';
import scenarioInitializer from '../_utils/scenarioInitializer';
import optionConfig from '../_utils/optionConfig';

const ActionType = optionConfig.ActionType;
const ConditionOption = {
  ALL: 0,
  ANY: 1,
};

export default {
  api: intentApi,
  components: {
    DropdownSelect,
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
      type: Number,
      required: false,
    },
    validateConditionBlock: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const edge = this.initialEdge;
    const dialogueLimit = this.initialDialogueLimit;
    const edgeType = edge.edge_type || 'normal';
    const sourceOptions = optionConfig.getSourceOptionsV2(this);
    const sourceDropdownOptions = sourceOptions.map(option => ({
      ...option,
      onclick: () => {
        this.addRule(option.value);
      },
    }));
    const sourceDropdown = {
      width: '150px',
      alignLeft: true,
      options: sourceDropdownOptions,
    };
    const actionOptions = optionConfig.getActionOptions(this);
    const actionDropdownOptions = actionOptions.map(option => ({
      ...option,
      onclick: () => {
        this.addAction(option.value);
      },
    }));
    const actionDropdown = {
      width: '150px',
      alignLeft: true,
      options: actionDropdownOptions,
    };
    const funcOptionMap = optionConfig.getFuncOptionMapV2(this);
    const actionOptionMap = optionConfig.getActionOptionMap(this);
    const keyValMatchCompareOptions = optionConfig.getKeyValMatchCompareOptions(this);
    const keyKeyMatchCompareOptions = optionConfig.getKeyKeyMatchCompareOptions(this);
    const listLengthMatchCompareOptions = optionConfig.getListLengthMatchCompareOptions(this);
    const counterCheckOptions = optionConfig.getCounterCheckOptions(this);
    const cuParserOptions = optionConfig.getCuParserOptions(this);
    let threshold;
    let candidateEdges;
    let andRules;
    let toNode;
    let actions;
    if (edgeType === 'qq') {
      const obj = this.renderQQEdge(edge);
      threshold = obj.threshold;
      candidateEdges = obj.candidateEdges;
    } else {
      const obj = this.renderNormalEdge(edge);
      andRules = obj.andRules;
      toNode = obj.toNode;
      actions = obj.actions;
    }
    const conditionOptions = [
      { text: this.$t('task_engine_v2.condition_action_block.condition_options.all'), value: ConditionOption.ALL },
      { text: this.$t('task_engine_v2.condition_action_block.condition_options.any'), value: ConditionOption.ANY },
    ];
    return {
      edge,
      edgeType,
      andRules,
      actions,
      toNode,
      selectStyle: {
        height: '32px',
        'border-radius': '2px',
      },
      threshold,
      candidateEdges,
      keyValMatchCompareOptions,
      keyKeyMatchCompareOptions,
      listLengthMatchCompareOptions,
      counterCheckOptions,
      cuParserOptions,
      sourceOptions,
      funcOptionMap,
      dialogueLimit,
      varDropdownMap: {},
      inputTooltip: {
        msg: this.$t('task_engine_v2.err_empty'),
        eventOnly: true,
        errorType: true,
        alignLeft: true,
        absolute: true,
      },
      intentDropdown: {
        width: '450px',
        options: [],
      },
      toggleAddCondition: false,
      toggleAddAction: false,
      showConditionsAndActions: true,
      sourceDropdown,
      actionDropdown,
      conditionOptions,
      selectedOption: [conditionOptions[0].value],
      intentOptions: [],
      ActionType,
      assignValueOptions: actionOptionMap[ActionType.AssignValue],
      parserOptions: actionOptionMap[ActionType.Parser],
    };
  },
  computed: {
    toNodeText() {
      return this.toNodeOptions.find(option => option.value === this.toNode).text;
    },
  },
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
    globalVarOptions: {
      handler() {
        this.$nextTick(() => {
          if (this.$refs.insertVarDropdown) {
            this.$refs.insertVarDropdown.forEach((dpd) => {
              dpd.dispatchEvent(event.createEvent('dropdown-reload'));
            });
          }
        });
      },
    },
    validateConditionBlock(newV, oldV) {
      if (newV && !oldV) {
        let valid = true;
        if (this.$refs['input-content']) {
          let refs = this.$refs['input-content'];
          if (!Array.isArray(refs)) {
            refs = [refs];
          }
          refs.forEach((el) => {
            if (!el.value) {
              valid = false;
              el.dispatchEvent(event.createEvent('tooltip-show'));
            }
          });
          this.$emit('update:valid', valid);
        } else {
          this.$emit('update:valid', true);
        }
      }
    },
  },
  methods: {
    onInputFocus(evt) {
      evt.target.dispatchEvent(event.createEvent('tooltip-hide'));
    },
    renderQQEdge(edge) {
      const threshold = edge.threshold;
      const candidateEdges = edge.candidate_edges.map((_edge) => {
        let toNodeId = _edge.to_node_id;
        if (toNodeId === 'null') {
          toNodeId = null;
        }
        return {
          to_node_id: toNodeId,
          tar_text: _edge.tar_text,
        };
      });
      return { threshold, candidateEdges };
    },
    renderNormalEdge(edge) {
      // render andRules
      const rules = edge.condition_rules || [];
      let andRules;
      if (rules.length > 0) {
        andRules = rules[0].map((rule) => {
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
      // render Actions
      const actions = edge.actions.map(action => ({
        id: this.$uuid.v1(),
        source: action.source,
        funcName: action.function.function_name,
        content: action.function.content,
      }));
      // render toNode
      const toNode = edge.to_node_id;
      return { andRules, toNode, actions };
    },
    deleteEdge() {
      this.$emit('deleteEdge');
    },
    addRule(source = 'text') {
      this.edge.valid = false;
      const rule = scenarioInitializer.initialRule(source);
      this.andRules.push({
        id: this.$uuid.v1(),
        source: rule.source,
        funcName: rule.functions[0].function_name,
        content: rule.functions[0].content,
      });
    },
    addAction(actionType = 'parser') {
      this.edge.valid = false;
      const action = scenarioInitializer.initialAction(actionType);
      this.actions.push({
        id: this.$uuid.v1(),
        source: action.source,
        funcName: action.function.function_name,
        content: action.function.content,
        type: actionType,
      });
    },
    deleteRule(index) {
      this.edge.valid = false;
      this.andRules.splice(index, 1);
    },
    deleteAction(index) {
      this.edge.valid = false;
      this.actions.splice(index, 1);
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
      this.reloadTooltip();
    },
    onSelectFunctionInput(index, newValue) {
      const newFuncName = newValue[0];
      const originalEdgeType = this.edgeType;
      if (newFuncName === 'qq') {
        this.changeToQQEdge(originalEdgeType);
      } else {
        this.changeToNormalEdge(originalEdgeType, index, newFuncName);
      }
      this.reloadTooltip();
    },
    parserInput(action, { parser, source }) {
      action.parser = parser;
      action.source = source;
      action.funcName = parser;
      if (parser === 'reg_parser') {
        if (source === 'text') {
          action.funcName = 'regular_exp';
        } else if (source === 'global_info') {
          action.funcName = 'regular_exp_from_var';
        }
      }
      action.content = scenarioInitializer.initialFunctionContent(action.funcName, this.nodeId);
      this.$forceUpdate();
    },
    reloadTooltip() {
      if (this.$refs['input-content']) {
        this.$refs['input-content'].forEach((el) => {
          el.dispatchEvent(event.createEvent('tooltip-reload'));
        });
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
    insertVarDropdown(id, obj, key) {
      if (this.varDropdownMap[id] === undefined) {
        this.varDropdownMap[id] = { width: '450px' };
      }
      const rtnObj = this.varDropdownMap[id];
      rtnObj.options = this.globalVarOptions.map(option => ({
        text: `${option.text}：${option.value}`,
        onclick: this.insertVarSelect.bind(this, obj, key, option.value),
      }));
      return rtnObj;
    },
    insertVarSelect(obj, key, value) {
      obj[key] = value;
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
      }
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
    onSelectGoto(toNode) {
      if (toNode === 'add_new_dialogue_node') {
        const newNodeID = scenarioInitializer.guid_sort();
        this.$emit('addNewDialogueNode', newNodeID);
        this.toNode = newNodeID;
      } else {
        this.toNode = toNode;
      }
    },
    onQQSelectGoto(toNode, index) {
      if (toNode === 'add_new_dialogue_node') {
        const newNodeID = scenarioInitializer.guid_sort();
        this.$emit('addNewDialogueNode', newNodeID);
        this.candidateEdges[index].to_node_id = newNodeID;
      } else {
        this.candidateEdges[index].to_node_id = toNode;
      }
    },
    renderIntentDropdown(index) {
      const options = this.intentDropdown.options.map((option) => {
        const onclick = () => {
          this.andRules[index].content = {
            module: 'intent_engine_2.0',
            intentName: option.name,
          };
        };
        return {
          ...option,
          onclick,
        };
      });
      return {
        ...this.intentDropdown,
        options,
      };
    },
  },
  mounted() {
    this.$api.getIntentsDetail().then((intents) => {
      this.intentOptions = intents.map(intent => ({
        ...intent,
        text: intent.name,
        value: {
          module: 'intent_engine_2.0',
          intentName: intent.name,
        },
      }));
      this.intentDropdown.options = intents.map(intent => ({
        ...intent,
        text: intent.name,
      }));
    });
  },
};
</script>

<style lang="scss" scoped>
.condition-action-block {
  position: relative;
  background: #f7f7f7;
  border-radius: 2px;
  @include font-14px();
  cursor: move;
  .dropdown-select {
    background-color: white;
  }
  .header {
    padding: 10px 20px;
    color: $color-font-mark;
    display: flex;
    align-items: center;
    box-shadow: inset 0 -1px 0 0 #dbdbdb;
    background-color: #eeeeee;
    button {
      border: none;
      outline: none;
      background-color: transparent;
      display: flex;
      align-items: center;
      @include font-14px();
      cursor: pointer;
      padding: 0;
    }
    .add {
      color: #3d80ff;
      &:not(:last-child) {
        margin-right: 20px;
      }
      .arrow {
        width: 12px;
        height: 12px;
        margin-left: 6px;
        transition: transform .5s ease-in-out;
        &.rotate180 {
          transform: rotate(180deg);
        }
      }
    }
    .info {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .to-node {
        text-overflow: ellipsis;
        overflow: hidden;
        display: inline-block;
        max-width: 120px;
        white-space: nowrap;
      }
    }
    .delete {
      color: #f25c62;
      margin: 0 20px;
    }
    .toggle {
      transform: rotate(90deg);
      transition: transform .5s ease-in-out;
      &.collapse {
        transform: rotate(270deg);
      }
      img {
        width: 24px;
        height: 24px;
      }
    }
  }
  .normal-edge {
    padding: 0 20px;
    margin: 10px 0;
    .title {
      padding-top: 10px;
      color: $color-font-active;
    }
    .dropdown-select-container {
      color: $color-font-normal;
      margin: 10px 38px;
      display: flex;
      align-items: center;
      .dropdown-select {
        margin: 0 10px;
      }
    }
  }
  .block {
    border-radius: 1px;
    background-color: #eeeeee;
    color: $color-font-normal;
    position: relative;
    padding: 5px 0;
    margin: 10px 0;
    &:last-of-type {
      margin-bottom: 0;
    }
    .row {
      padding: 5px 42px 5px 0;
      display: flex;
      align-items: center;
      .label {
        text-align: right;
        width: 66px;
        margin-right: 10px;
        &:not(:first-of-type) {
          margin-left: 10px;
          width: auto;
        }
      }
      .dropdown-select {
        &:not(:first-of-type) {
          margin-left: 10px;
        }
        flex: 1;
        background-color: white;
      }
      .trash {
        align-self: flex-start;
        position: absolute;
        right: 10px;
        cursor: pointer;
      }
      .dropdown-container {
        flex: 1;
        .input-content {
          width: 100%;
        }
      }
    }
    .input-content {
      flex: 1;
    }
  }
  .add-target-key {
    color: $color-primary;
    border: none;
    background-color: transparent;
    padding: 0;
    @include font-14px();
  }
  .grey-delete {
    width: 70px;
    height: 32px;
    background-color: $color-font-disabled;
    padding: 0;
    border: none;
    font-size: 12px;
    margin-left: 8px;
    color: white;
  }
}
</style>
