<template lang="html">
<div id="condition-card">
  <div class="delete-condition-button" @click="deleteThisCondition">X</div>
  <div class="condition-text" v-if="index==0">{{$t("condition_card.if")}}</div>
  <div class="condition-text" v-if="index!=0">{{$t("condition_card.and")}}</div>
  <div class="condition-input-with-menu"
    v-click-outside="{method:'showTargetItemMenu', parameters:false, exceptClasses:['item']}">
    <input type="text" v-model="condition.target.displayText"
      readonly
      @click="showTargetItemMenu(true)"
      @focus="showTargetItemMenu(true)"
      @keydown.tab.prevent=""
    ></input>
    <div v-if="isInputMenuVisible" class="condition-input-menu-container">
      <div class="condition-input-menu-table">
        <div v-for="column in columns" class="condition-input-menu-column" :class="[`${column}-column`]">
          <div>
            <label class="column-label">{{$t(`condition_card.columns.${column}`)}}</label>
            <div v-for="(item, index) in targetItems[column]"
              class="item"
              :class="{'active-item': isTargetItemActive(column, index)}"
              @click="targetItemClick(column, index)"
            >{{item.displayText}}</div>
          </div>
        </div>
      </div>
      <div class="condition-input-menu-footer"></div>
    </div>
  </div>
  <div class="condition-select-with-menu"
    v-click-outside="{method:'showComparisonItemMenu', parameters:false, exceptClasses:['item']}"
    v-if="condition.target.displayText!=='' && condition.target.type=='entity'">
    <input type="text" v-model="condition.comparisonOperator.displayText"
      readonly
      @click="showComparisonItemMenu(true)"
      @focus="showComparisonItemMenu(true)"
      @keydown.tab.prevent=""
    ></input>
    <div v-if="isSelectMenuVisible">
      <div class="condition-select-menu">
        <div v-for="(item, index) in comparisonItems[condition.target.type]"
          class="item"
          :class="{'active-item': isComparisonItemActive(condition.target.type, index)}"
          @click="comparisonItemClick(condition.target.type, index)"
        >{{item.displayText}}</div>
      </div>
    </div>
  </div>
  <div class="content-input" v-if="isContentInputVisible">
    <input type="text" v-model="condition.content"></input>
  </div>
</div>
</template>

<script>
import i18nUtils from '../utils/i18nUtil';

export default {
  name: 'condition-card',
  components: {
  },
  props: {
    initialCondition: {
      type: Object,
      required: true,
    },
    initialEntityCollectorList: {
      type: Array,
      required: true,
    },
    index: {
      type: Number,
    }
  },
  data () {
    return {
      i18n: {},
      condition: JSON.parse(JSON.stringify(this.initialCondition)),
      isInputMenuVisible: false,
      isSelectMenuVisible: false,
      columns: ["entity", "context"],
      contexts: ["on_complete", "on_cancel", "on_transfer_to_manual", "on_parse_fail"],
      comparisonOperators: [],
    }
  },
  computed: {
    entityOptions() {
      return this.entities.map((entity) => {
        const object = {
          name: entity.entityName,
          displayText: entity.entityName,
        };
        return object;
      });
    },
    contextOptions() {
      return this.contexts.map((context) => {
        const object = {
          name: context,
          displayText: this.i18n.condition_card.context_status[context],
        };
        return object;
      });
    },
    targetItems() {
      return {
        "entity": this.entityOptions,
        "context": this.contextOptions,
      }
    },
    comparisonItems() {
      return {
        "entity": this.comparisonOperators,
      }
    },
    isContentInputVisible() {
      if(this.condition.target.displayText!=='' && this.condition.target.type=='entity'){
        if(this.condition.comparisonOperator.needContent === true){
          return true;
        }
      }
      this.condition.content = '';
      return false;
    },
    entities() {
      return JSON.parse(JSON.stringify(this.initialEntityCollectorList));
    },
  },
  watch: {
    condition: {
      handler: function() {
        this.$emit('update', this.condition);
      },
      deep: true
    },
  },
  methods: {
    deleteThisCondition(){
      this.$emit('deleteConditionButtonClick');
    },
    showTargetItemMenu(visible){
      this.isInputMenuVisible = visible;
    },
    showComparisonItemMenu(visible) {
      this.isSelectMenuVisible = visible;
    },
    isTargetItemActive(column, index) {
      const displayText = this.targetItems[column][index]['displayText'];
      return this.condition.target.type === column && this.condition.target.displayText === displayText;
    },
    isComparisonItemActive(column, index) {
      const displayText = this.comparisonItems[column][index]['displayText'];
      return this.condition.comparisonOperator.displayText === displayText;
    },
    targetItemClick(column, index) {
      this.condition.target.name = this.targetItems[column][index]['name'];
      this.condition.target.displayText = this.targetItems[column][index]['displayText'];
      this.condition.target.type = column;
      if (this.comparisonItems[column] !== undefined && this.comparisonItems[column].length > 0){
        this.condition.comparisonOperator = JSON.parse(JSON.stringify(this.comparisonItems[column][0]));
      }
      this.showTargetItemMenu(false);
    },
    comparisonItemClick(column, index) {
      const item = this.comparisonItems[column][index];
      this.condition.comparisonOperator = JSON.parse(JSON.stringify(item));
      this.showComparisonItemMenu(false);
    },
  },
  activated() {},
  beforeMount() {},
  mounted() {
    this.i18n = i18nUtils.getLocaleMsgs(this.$i18n);
    this.comparisonOperators = [
      {
        // 存在
        displayText: this.i18n.condition_card.comparison_operators.present,
        functionName: 'contain_key',
        source: 'global_info',
        needContent: false,
      },
      {
        // 不存在
        displayText: this.i18n.condition_card.comparison_operators.not_present,
        functionName: 'not_contain_key',
        source: 'global_info',
        needContent: false,
      },
      {
        // 包含
        displayText: this.i18n.condition_card.comparison_operators.contain,
        functionName: 'value_contains',
        source: 'global_info',
        needContent: true,
      },
      {
        // 不包含
        displayText: this.i18n.condition_card.comparison_operators.not_contain,
        functionName: 'value_not_contains',
        source: 'global_info',
        needContent: true,
      },
      {
        // 大于
        displayText: this.i18n.condition_card.comparison_operators.greater_than,
        functionName: 'key_val_match',
        source: 'global_info',
        needContent: true,
        compare: '>',
      },
      {
        // 小于
        displayText: this.i18n.condition_card.comparison_operators.smaller_than,
        functionName: 'key_val_match',
        source: 'global_info',
        needContent: true,
        compare: '<',
      },
      {
        // 等于
        displayText: this.i18n.condition_card.comparison_operators.equal_to,
        functionName: 'key_val_match',
        source: 'global_info',
        needContent: true,
        compare: '==',
      },
      {
        // 不等于
        displayText: this.i18n.condition_card.comparison_operators.not_equal_to,
        functionName: 'key_val_match',
        source: 'global_info',
        needContent: true,
        compare: '!=',
      },
      {
        // 属于
        displayText: this.i18n.condition_card.comparison_operators.belong_to,
        functionName: 'value_in',
        source: 'global_info',
        needContent: true,
      },
      {
        // 不属于
        displayText: this.i18n.condition_card.comparison_operators.not_belong_to,
        functionName: 'value_not_in',
        source: 'global_info',
        needContent: true,
      },
    ];
  },
}
</script>
