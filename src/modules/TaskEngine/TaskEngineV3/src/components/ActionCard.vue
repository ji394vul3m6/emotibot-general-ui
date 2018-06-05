<template lang="html">
<div id="action-card" class="action-card">
  <div id="webhook-action" class="action-block" v-if="action.type=='webhook'">
    <div class="title margin-top-bottom">{{$t("task_engine_v3.action_card.webhook.label_call_webhook")}}</div>
    <div class="webhook-row-container row-container margin-top-bottom" v-if="action.type=='webhook'">
      <div class="left-half input-label">{{$t("task_engine_v3.action_card.webhook.label_variable")}}</div>
      <div class="right-half">
        <input v-model="action.variable_name" class="input" :placeholder="$t('task_engine_v3.action_card.webhook.placeholder_input_variable_name')"></input>
        <div class="input-label select-method-label">{{$t("task_engine_v3.action_card.webhook.label_method")}}</div>
        <v-select v-model="action.method" :options="methods" class="select-method narrow-select" :searchable="false"></v-select>
      </div>
    </div>
    <div class="webhook-row-container row-container margin-top-bottom">
      <div class="left-half input-label">{{$t("task_engine_v3.action_card.webhook.label_url")}}</div>
      <div class="right-half">
        <input v-model="action.url" class="input input-url" :placeholder="$t('task_engine_v3.action_card.webhook.placeholder_input_url')"></input>
      </div>
    </div>
    <div class="webhook-row-container row-container margin-top-bottom" v-if="action.method!='GET'">
      <div class="left-half input-label">{{$t("task_engine_v3.action_card.webhook.label_header_content_type")}}</div>
      <div class="right-half">
        <v-select v-model="action.contentTypes" :options="contentTypes" :searchable="false"></v-select>
      </div>
    </div>
    <div class="webhook-row-container row-container margin-top-bottom" v-if="action.method!='GET'">
      <div class="left-half input-label">{{$t("task_engine_v3.action_card.webhook.label_body")}}</div>
      <div class="right-half">
        <input v-model="action.body" class="input input-body" :placeholder="$t('task_engine_v3.action_card.webhook.placeholder_input_body')"></input>
      </div>
    </div>
  </div>

  <div id="msg-action" class="action-block" v-if="action.type=='msg'">
    <div class="title margin-top-bottom">{{$t("task_engine_v3.action_card.msg.label_msg_return")}}</div>
    <div class="msg-row-container row-container margin-top-bottom" v-if="action.type=='msg'">
      <div class="left-half input-label">{{$t("task_engine_v3.action_card.msg.label_return_msg")}}</div>
      <div class="right-half">
        <input class="input input-msg" v-model="action.msg"></input>
      </div>
    </div>
  </div>

  <div id="goto-action" class="action-block" v-if="action.type=='goto'">
    <div class="title margin-top-bottom">{{$t("task_engine_v3.action_card.goto.label_goto_next_skill")}}</div>
    <div class="goto-row-container row-container margin-top-bottom" v-if="action.type=='goto'">
      <div class="left-half input-label">{{$t("task_engine_v3.action_card.goto.label_goto")}}</div>
      <div class="right-half">
        <v-select
          v-model="selectedSkillName"
          :options="skillNameList"
          label="skillName"
          class="narrow-select"
          :searchable="false">
        </v-select>
        <button class="btn-basic btn-hightlight-border" @click="addNewSkill">{{$t("task_engine_v3.action_card.goto.button_add_new_task")}}</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import i18nUtils from '../utils/i18nUtil';
import CreateSkillPop from './CreateSkillPop';

export default {
  name: 'action-card',
  components: {},
  props: {
    initialAction: {
      type: Object,
      required: true,
    },
    initialSkillNameList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      i18n: {},
      action: JSON.parse(JSON.stringify(this.initialAction)),
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      contentTypes: ['application/json', 'application/x-www-form-urlencoded'],
      skills: [],
    };
  },
  computed: {
    skillNameList() {
      const skillNameList = JSON.parse(JSON.stringify(this.initialSkillNameList));
      // add the finish_scenario_option
      skillNameList.push({
        skillId: 'exit',
        skillName: this.i18n.task_engine_v3.action_card.goto.option_finish_scenario,
      });
      return skillNameList;
    },
    selectedSkillName: {
      get() {
        return this.skillNameList.find(skill => skill.skillId === this.action.targetSkillId);
      },
      set(newValue) {
        this.action.targetSkillId = newValue.skillId;
      },
    },
  },
  watch: {
    action: {
      handler() {
        this.$emit('update', this.action);
      },
      deep: true,
    },
  },
  methods: {
    addNewSkill() {
      const options = {
        component: CreateSkillPop,
        buttons: ['ok', 'cancel'],
        validate: true,
        data: {
          skillName: '',
        },
        ok_msg: this.$t('general.add'),
        cancel_msg: this.$t('general.cancel'),
        callback: {
          ok: (skillName) => {
            this.$root.$emit('addNewSkill', skillName);
          },
        },
        customPopContentStyle: {
          width: '40%',
          height: '30%',
          'min-width': '500px',
          'min-height': '275px',
        },
      };
      this.$root.$emit('showWindow', options);
    },
  },
  beforeMount() {
    this.i18n = i18nUtils.getLocaleMsgs(this.$i18n);
  },
  mounted() {},
};
</script>
