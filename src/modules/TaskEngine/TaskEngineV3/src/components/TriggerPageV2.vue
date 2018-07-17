<template lang="html">
<div id="trigger-page" class="page trigger-page">
  <div class="title-container">
    <div class="title">{{$t("task_engine_v3.trigger_page.label_title")}}</div>
    <div class="title-description">{{$t("task_engine_v3.trigger_page.label_title_description")}}</div>
  </div>
  <div class="hr"><hr/></div>
  <div class="label-intent-setting">{{$t("task_engine_v3.trigger_page.label_intent_setting")}}</div>
  <div class="content-container">
    <template v-for="(trigger, triggerIndex) in triggerList">
      <div class="intent-editor-box">
        <div class="delete-intent-button" @click="deleteThisTrigger(triggerIndex)">X</div>
        <div class="intent-editor-container">
          <div class="left">
            <div class="label-choose-intent">{{$t("task_engine_v3.trigger_page.label_choose_intent")}}</div>
            <v-select
              v-model="triggerList[triggerIndex]"
              :options="intentOptionList"
              :searchable="false"
              label="intent_name">
            </v-select>
          </div>
        </div>
      </div>
    </template>
    <div class="button-add-new-trigger" @click="addNewTrigger">{{$t("task_engine_v3.trigger_page.btn_add_new_trigger")}}</div>
  </div>
</div>
</template>

<script>
import IntentEngine from './_api/intentEngine';
import i18nUtils from '../utils/i18nUtil';
import general from '../utils/general';

export default {
  name: 'trigger-page',
  components: {
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
      intentList: [],
      intentOptionList: [],
    };
  },
  computed: {},
  watch: {
    triggerList() {
      this.$emit('update', this.triggerList);
    },
  },
  methods: {
    addNewTrigger() {
      this.triggerList.push(null);
    },
    deleteThisTrigger(index) {
      this.triggerList.splice(index, 1);
    },
    loadIntentOptionList() {
      this.ieApi.listIntents().then((resp) => {
        console.log(resp);
        this.intentList = resp.data.result;
        this.intentOptionList = [];
        this.intentList.forEach((intent) => {
          if (intent === 'other' || intent === '其他') {
            return;
          }
          const object = {
            intent_name: intent,
            type: 'intent_engine_2.0',
            editable: true,
          };
          this.intentOptionList.push(object);
        });
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
@import "../scss/triggerPage.scss";
</style>
