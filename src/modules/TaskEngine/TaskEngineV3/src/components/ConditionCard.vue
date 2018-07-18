<template lang="html">
<div id="condition-card">
  <div class="label-when" v-if="index==0">{{$t("task_engine_v3.condition_card.if")}}</div>
  <div class="label-when" v-if="index!=0">{{$t("task_engine_v3.condition_card.and")}}</div>  
  <dropdown-select
    class="select-entity selector"
    ref="selectEntity"
    v-model="targetNameModel"
    :options="entityOptions"
    width="160px"
  />
  <dropdown-select
    v-if="needOperator"
    class="select-operator selector"
    ref="selectOperator"
    v-model="operatorModel"
    :options="operatorOptions"
    width="96px"
  />
  <input
    v-if="needContent"
    class="input-content selector"
    type="text"
    v-model="condition.content"
  />

  <div class="button-delete-condition-container">
    <div class="button-delete-condition" @click="deleteThisCondition">X</div>
  </div>


  <!-- <div class="delete-condition-button" @click="deleteThisCondition">X</div>
  <div class="condition-text" v-if="index==0">{{$t("task_engine_v3.condition_card.if")}}</div>
  <div class="condition-text" v-if="index!=0">{{$t("task_engine_v3.condition_card.and")}}</div>
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
            <label class="column-label">{{$t(`task_engine_v3.condition_card.columns.${column}`)}}</label>
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
  </div> -->
</div>
</template>

<script>
import DropdownSelect from '@/components/DropdownSelect';
import i18nUtils from '../utils/i18nUtil';

export default {
  name: 'condition-card',
  components: {
    'dropdown-select': DropdownSelect,
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
    },
  },
  data() {
    return {
      i18n: {},
      condition: JSON.parse(JSON.stringify(this.initialCondition)),
      isInputMenuVisible: false,
      isSelectMenuVisible: false,
      columns: ['entity', 'context'],
      contexts: ['on_complete', 'on_cancel', 'on_transfer_to_manual', 'on_parse_fail'],
      comparisonOperators: [],
      operatorOptions: [],
    };
  },
  computed: {
    entityOptions() {
      return this.entities.map((entity) => {
        const object = {
          text: entity.entityName,
          value: entity.entityName,
        };
        return object;
      });
    },
    targetNameModel: {
      get() {
        return [this.condition.target.name];
      },
      set(newSelected) {
        this.condition.target = {
          displayText: newSelected[0],
          type: 'entity',
          name: newSelected[0],
        };
      },
    },
    operatorModel: {
      get() {
        return [this.condition.comparisonOperator.displayText];
      },
      set(newSelected) {
        this.condition.comparisonOperator = this.comparisonOperators.filter(
          operator => operator.displayText === newSelected[0],
        );
      },
    },
    needOperator() {
      return this.condition.target.type === 'entity';
    },
    needContent() {
      return this.condition.comparisonOperator.needContent;
    },
    entities() {
      return JSON.parse(JSON.stringify(this.initialEntityCollectorList));
    },
    // contextOptions() {
    //   return this.contexts.map((context) => {
    //     const object = {
    //       name: context,
    //       displayText: this.i18n.task_engine_v3.condition_card.context_status[context],
    //     };
    //     return object;
    //   });
    // },

    // targetItems() {
    //   return {
    //     entity: this.entityOptions,
    //     context: this.contextOptions,
    //   };
    // },

    // isContentInputVisible() {
    //   if (this.condition.target.displayText !== '' && this.condition.target.type === 'entity') {
    //     if (this.condition.comparisonOperator.needContent === true) {
    //       return true;
    //     }
    //   }
    //   this.condition.content = '';
    //   return false;
    // },
  },
  watch: {
    condition: {
      handler() {
        this.$emit('update', this.condition);
      },
      deep: true,
    },
  },
  methods: {
    deleteThisCondition() {
      this.$emit('deleteConditionButtonClick');
    },
    // targetItemClick(column, index) {
    //   this.condition.target.name = this.targetItems[column][index].name;
    //   this.condition.target.displayText = this.targetItems[column][index].displayText;
    //   this.condition.target.type = column;
    //   if (this.comparisonItems[column] !== undefined &&
    //     this.comparisonItems[column].length > 0) {
    //     this.condition.comparisonOperator = JSON.parse(
    //       JSON.stringify(this.comparisonItems[column][0]));
    //   }
    //   this.showTargetItemMenu(false);
    // },
    // comparisonItemClick(column, index) {
    //   const item = this.comparisonItems[column][index];
    //   this.condition.comparisonOperator = JSON.parse(JSON.stringify(item));
    //   this.showComparisonItemMenu(false);
    // },
  },
  activated() {},
  beforeMount() {
    this.i18n = i18nUtils.getLocaleMsgs(this.$i18n);
    this.comparisonOperators = [
      {
        // 存在
        displayText: this.i18n.task_engine_v3.condition_card.comparison_operators.present,
        functionName: 'contain_key',
        source: 'global_info',
        needContent: false,
      },
      {
        // 不存在
        displayText: this.i18n.task_engine_v3.condition_card.comparison_operators.not_present,
        functionName: 'not_contain_key',
        source: 'global_info',
        needContent: false,
      },
      {
        // 包含
        displayText: this.i18n.task_engine_v3.condition_card.comparison_operators.contain,
        functionName: 'value_contains',
        source: 'global_info',
        needContent: true,
      },
      {
        // 不包含
        displayText: this.i18n.task_engine_v3.condition_card.comparison_operators.not_contain,
        functionName: 'value_not_contains',
        source: 'global_info',
        needContent: true,
      },
      {
        // 大于
        displayText: this.i18n.task_engine_v3.condition_card.comparison_operators.greater_than,
        functionName: 'key_val_match',
        source: 'global_info',
        needContent: true,
        compare: '>',
      },
      {
        // 小于
        displayText: this.i18n.task_engine_v3.condition_card.comparison_operators.smaller_than,
        functionName: 'key_val_match',
        source: 'global_info',
        needContent: true,
        compare: '<',
      },
      {
        // 等于
        displayText: this.i18n.task_engine_v3.condition_card.comparison_operators.equal_to,
        functionName: 'key_val_match',
        source: 'global_info',
        needContent: true,
        compare: '==',
      },
      {
        // 不等于
        displayText: this.i18n.task_engine_v3.condition_card.comparison_operators.not_equal_to,
        functionName: 'key_val_match',
        source: 'global_info',
        needContent: true,
        compare: '!=',
      },
      {
        // 属于
        displayText: this.i18n.task_engine_v3.condition_card.comparison_operators.belong_to,
        functionName: 'value_in',
        source: 'global_info',
        needContent: true,
      },
      {
        // 不属于
        displayText: this.i18n.task_engine_v3.condition_card.comparison_operators.not_belong_to,
        functionName: 'value_not_in',
        source: 'global_info',
        needContent: true,
      },
    ];
    this.comparisonOperators.forEach((operator) => {
      this.operatorOptions.push({
        text: operator.displayText,
        value: operator.displayText,
      });
    });
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/teVariable.scss";
// @import "../scss/conditionCard.scss";
#condition-card{
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  .label-when{
    width: 28px;
    height: 28px;
    font-size: 14px;
    line-height: 28px;
    color: $color-font-normal;
  }
  .selector{
    height: 28px;
    margin-right: 10px;
  }
  .select-entity{
    margin-left: 15px;
  }
  .select-operator{
  }
  .input-content{
    width: 144px;
  }

  .button-delete-condition-container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    .button-delete-condition{
      width: 18px;
      height: 18px;
      border-radius: 9px;
      background-color: #f7f7f7;
      font-size: 12px;
      text-align: center;
      line-height: 18px;
      color: $color-error;
      &:hover {
        cursor: pointer;
        color: darken($color-error, 15%);
      }
    }
  }
}
</style>
