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
            <button class="btn-basic btn-hightlight-border" @click="addNewIntent(triggerIndex)">{{$t("task_engine_v3.trigger_page.button_add_new_intent")}}</button>
          </div>
          <div class="right">
            <button class="btn-basic btn-white" @click="editIntent(trigger)" v-bind:class="{disabled: !isTriggerEditable(trigger)}">{{$t("general.edit")}}</button>
            <button class="btn-basic btn-white" @click="testIntent">{{$t("general.test")}}</button>
          </div>
        </div>
      </div>
    </template>
    <div class="button-add-new-trigger" @click="addNewTrigger">{{$t("task_engine_v3.trigger_page.btn_add_new_trigger")}}</div>
  </div>
</div>
</template>

<script>
import intentEngineApi from './_api/intentEngine';
import i18nUtils from '../utils/i18nUtil';
import general from '../utils/general';
import IntentEditorPop from './IntentEditorPop';
import IntentTesterPop from './IntentTesterPop';

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
    isTriggerEditable(trigger) {
      if (trigger === null || trigger.editable === false || trigger.intent_name === null) {
        return false;
      }
      return true;
    },
    checkIntent(intentName) {
      intentEngineApi.checkIntent(this.appId, intentName).then((data) => {
        console.log('checkIntent:');
        console.log(data);
      }, (err) => {
        general.popErrorWindow(this, 'checkIntent error', err.message);
      });
    },
    loadIntentOptionList() {
      intentEngineApi.listIntents(this.appId).then((data) => {
        this.intentList = data.content;
        this.intentOptionList = [
          // {
          //   'intent_name': '催促，退款',
          //   'type': 'intent_zoo',
          //   'editable': false
          // },
          // {
          //   'intent_name': '催促，物流',
          //   'type': 'intent_zoo',
          //   'editable': false
          // },
        ];
        data.content.forEach((op) => {
          const object = {
            intent_name: op.intent_name,
            type: 'intent_engine',
            editable: true,
          };
          this.intentOptionList.push(object);
        });
      }, (err) => {
        general.popErrorWindow(this, 'listIntents error', err.message);
      });
    },
    addNewIntent(triggerIndex) {
      const options = {
        component: IntentEditorPop,
        buttons: ['ok', 'cancel'],
        validate: true,
        data: {
          editor_type: 'add_new_intent',
          app_id: this.appId,
          intent_id: '',
          intent_name: '',
          sentences: [],
        },
        ok_msg: this.$t('general.add'),
        cancel_msg: this.$t('general.close'),
        callback: {
          ok: (newIntent) => {
            this.updateIntent(newIntent);
            const trigger = {
              intent_name: newIntent.intent_name,
              type: 'intent_engine',
              editable: true,
            };
            this.triggerList[triggerIndex] = trigger;
          },
        },
        customPopContentStyle: {
          width: '70%',
          height: '70%',
          'min-width': '700px',
          'min-height': '500px',
        },
      };
      this.$root.$emit('showWindow', options);
    },
    editIntent(trigger) {
      const intent = this.intentList.find(i => i.intent_name === trigger.intent_name);
      const options = {
        component: IntentEditorPop,
        buttons: ['ok', 'cancel'],
        validate: true,
        data: {
          editor_type: 'edit_intent',
          app_id: intent.app_id,
          intent_id: intent.intent_id,
          intent_name: intent.intent_name,
          sentences: intent.sentences,
        },
        ok_msg: this.$t('general.save'),
        cancel_msg: this.$t('general.close'),
        callback: {
          ok: (newIntent) => {
            this.updateIntent(newIntent);
          },
        },
        customPopContentStyle: {
          width: '70%',
          height: '70%',
          'min-width': '700px',
          'min-height': '500px',
        },
      };
      this.$root.$emit('showWindow', options);
    },
    testIntent() {
      const options = {
        component: IntentTesterPop,
        buttons: ['cancel'],
        validate: true,
        data: {
        },
        cancel_msg: this.$t('general.close'),
        customPopContentStyle: {
          width: '70%',
          height: '70%',
          'min-width': '700px',
          'min-height': '500px',
        },
      };
      this.$root.$emit('showWindow', options);
    },
    updateIntent(intent) {
      intent.sentences = intent.sentences.map((sentence) => {
        sentence.sentenceid = this.$uuid.v1();
        return sentence;
      });
      intentEngineApi.updateIntent(this.appId, JSON.stringify([intent])).then((data) => {
        if (data.code !== 0) {
          general.popErrorWindow(this, 'updateIntent error', `code: ${data.code}`);
        }
        this.loadIntentOptionList();
      }, (err) => {
        general.popErrorWindow(this, 'updateIntent error', err.message);
      });
    },
    deleteIntent(intentName) {
      intentEngineApi.deleteIntent(this.appId, intentName).then((data) => {
        if (data.code !== 0) {
          general.popErrorWindow(this, 'deleteIntent error', `code: ${data.code}`);
        }
        this.loadIntentOptionList();
      }, (err) => {
        general.popErrorWindow(this, 'deleteIntent error', err.message);
      });
    },
    rerender() {
      this.triggerList = JSON.parse(JSON.stringify(this.initialTriggerList));
    },
  },
  beforeMount() {
    this.appId = this.$cookie.get('appid');
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
