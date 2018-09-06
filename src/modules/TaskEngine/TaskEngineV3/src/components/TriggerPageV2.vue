<template lang="html">
<div id="trigger-page" class="page trigger-page">
  <div class="add-trigger-container">
    <div class="row">
      <div class="label-add-trigger">{{$t("task_engine_v3.trigger_page.label_add_trigger")}}</div>
      <div class="icon-container" v-tooltip="{ msg: $t('task_engine_v3.trigger_page.description')}">
        <icon icon-type="info" :enableHover="true" :size=18 />
      </div>
    </div>
    <div class="row row-margin-top">
      <dropdown-select
        class="select-add-trigger"
        ref="selectAddTrigger"
        v-model="newIntentModel"
        :options="intentOptionList"
        :showCheckedIcon="false"
        width="160px"
        :placeholder="$t('general.please_choose')"
      />
      <text-button
        class="button-add-trigger"
        :button-type="buttonAddEnabled ? 'primary' : 'disable'"
        @click="addNewTrigger">
        {{$t("task_engine_v3.trigger_page.button_add_trigger")}}
      </text-button>
    </div>
  </div>
  <intent-list
    class="intent-list"
    :intentList="intentList"
    :canDeleteIntent="false"
    :canRemoveIntent="true"
    @removeIntent="deleteThisTrigger"
  ></intent-list>
</div>
</template>

<script>
import IntentList from '@/modules/IntentEngine/_components/IntentList';
import IntentEngine from './_api/intentEngine';
import i18nUtils from '../utils/i18nUtil';
import general from '../utils/general';

export default {
  name: 'trigger-page',
  components: {
    IntentList,
  },
  props: {
    initialTriggerList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      i18n: {},
      appId: '',
      ieApi: null,
      triggerList: JSON.parse(JSON.stringify(this.initialTriggerList)),
      newIntent: '',
      intentList: [],
      intentOptionList: [],
      buttonAddEnabled: false,
    };
  },
  computed: {
    newIntentModel: {
      get() {
        if (this.newIntent === '') {
          return [];
        }
        return [this.newIntent];
      },
      set(newSelected) {
        this.newIntent = newSelected[0];
      },
    },
  },
  watch: {
    triggerList() {
      this.$emit('update', this.triggerList);
      this.intentList = this.triggerList.map(triggered => ({
        name: triggered.intent_name,
      }));
    },
  },
  methods: {
    isDuplicateTrigger() {
      const that = this;
      return that.triggerList.findIndex(intent => intent.intent_name === that.newIntent) !== -1;
    },
    addNewTrigger() {
      if (!this.buttonAddEnabled) {
        return;
      }
      if (!this.isDuplicateTrigger()) {
        this.triggerList.push({
          type: 'intent_engine_2.0',
          intent_name: this.newIntent,
          editable: true,
        });
      }
    },
    deleteThisTrigger(index) {
      this.triggerList.splice(index, 1);
    },
    loadIntentOptionList() {
      this.ieApi.listIntents().then((resp) => {
        this.intentOptionList = [];
        resp.data.result.forEach((intent) => {
          if (intent === 'other' || intent === '其他') {
            return;
          }
          const object = {
            text: intent,
            value: intent,
          };
          this.intentOptionList.push(object);
        });
        if (this.intentOptionList.length === 0) {
          this.intentOptionList.push({
            text: this.$t('task_engine_v3.trigger_page.placeholder_import_intent_first'),
            value: this.$t('task_engine_v3.trigger_page.placeholder_import_intent_first'),
            isGroup: true,
          });
          this.buttonAddEnabled = false;
        } else {
          this.newIntent = this.intentOptionList[0].value;
          this.buttonAddEnabled = true;
        }
        this.$refs.selectAddTrigger.$emit('updateOptions', this.intentOptionList);
        this.$refs.selectAddTrigger.$emit('select', this.intentOptionList[0].value);
      }, (err) => {
        general.popErrorWindow(this, 'listIntents error', err.message);
      });
    },
    rerender() {
      this.triggerList = JSON.parse(JSON.stringify(this.initialTriggerList));
    },
  },
  beforeMount() {
    this.appId = this.$cookie.get('appid');
    // this.ieApi = new IntentEngine(this, '1.0', this.appId);
    this.ieApi = new IntentEngine(this, '2.0', '');
    this.loadIntentOptionList();
    this.$on('rerender', this.rerender);
  },
  mounted() {
    this.i18n = i18nUtils.getLocaleMsgs(this.$i18n);
    // this.deleteIntent('PING');
  },
  activated() {
    this.rerender();
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/teVariable.scss";
#trigger-page{
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  padding: 20px;
  .add-trigger-container{
    flex: 0 0 auto;
    padding: 10px 20px;
    height: 86px;
    background: #f8f8f8;
    border-radius: 4px;
    .row{
      display: flex;
      flex-direction: row;
      .label-add-trigger{
        color: $color-font-active;
        line-height: 28px;
        font-size: 14px;
      }
      .icon-container{
        margin-left: 4px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .select-add-trigger{
        height: 28px;
        background: #ffffff;
      }
      .button-add-trigger{
        margin-left: 10px;
      }
    }
    .row-margin-top{
      margin-top: 10px;
    }
  }
  .intent-list{
    padding-top: 25px;
  }
}
</style>
