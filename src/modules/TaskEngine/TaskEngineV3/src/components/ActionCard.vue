<template lang="html">
<div id="action-card" class="action-card">
  <div class="msg-action action-block" v-if="action.type=='msg'">
    <div class="label-response">{{$t("task_engine_v3.action_card.msg.label_response")}}</div>
    <input class="input-msg" v-model="action.msg"></input>
  </div>
  
  <div class="webhook-action action-block" v-if="action.type=='webhook'">
    <div class="row">
      <div class="label-variable label-webhook">{{$t("task_engine_v3.action_card.webhook.label_variable")}}</div>
      <input
        class="input-variable input-webhook"
        v-model="action.variable_name"
        :placeholder="$t('task_engine_v3.action_card.webhook.placeholder_input_variable')"
      />
    </div>
    <div class="row">
      <div class="label-method label-webhook">{{$t("task_engine_v3.action_card.webhook.label_method")}}</div>
      <dropdown-select
        class="select-skill"
        ref="selectSkill"
        v-model="methodModel"
        :options="methodOptions"
        width="180px"
      />
    </div>
    <div class="row">
      <div class="label-url label-webhook">{{$t("task_engine_v3.action_card.webhook.label_url")}}</div>
      <input
        class="input-url input-webhook"
        v-model="action.url"
        :placeholder="$t('task_engine_v3.action_card.webhook.placeholder_input_url')"
      />
    </div>
    <div class="row" v-if="action.method!='GET'">
      <div class="label-content-type label-webhook">{{$t("task_engine_v3.action_card.webhook.label_content_type")}}</div>
      <dropdown-select
        class="select-skill"
        ref="selectSkill"
        v-model="contentTypeModel"
        :options="contentTypeOptions"
        width="300px"
      />
    </div>
    <div class="row" v-if="action.method!='GET'">
      <div class="label-body label-webhook">{{$t("task_engine_v3.action_card.webhook.label_body")}}</div>
      <input
        class="input-body
        input-webhook"
        v-model="action.body"
        :placeholder="$t('task_engine_v3.action_card.webhook.placeholder_input_body')"
      />
    </div>
  </div>

  <div class="goto-action action-block" v-if="action.type=='goto'">
    <div class="label-goto">{{$t("task_engine_v3.action_card.goto.label_goto")}}</div>
    <dropdown-select
      class="select-skill"
      ref="selectSkill"
      v-model="skillModel"
      :options="skillOptions"
      width="160px"
    />
  </div>
</div>
</template>

<script>
import i18nUtils from '../utils/i18nUtil';
import CreateSkillPop from './CreateSkillPop';

export default {
  name: 'action-card',
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
    skillOptions() {
      const skillNameList = JSON.parse(JSON.stringify(this.initialSkillNameList));
      // add finish_scenario_option
      skillNameList.push({
        text: this.i18n.task_engine_v3.action_card.goto.option_finish_scenario,
        value: 'exit',
      });
      skillNameList.push({
        text: '创建新任务',
        value: 'add_new_skill',
        isButton: true,
      });
      return skillNameList;
    },
    skillModel: {
      get() {
        return [this.action.targetSkillId];
      },
      set(newValue) {
        if (newValue[0] === 'add_new_skill') {
          this.addNewSkill();
        } else {
          this.action.targetSkillId = newValue[0];
        }
      },
    },
    methodOptions() {
      const options = [];
      this.methods.forEach((method) => {
        options.push({
          text: method,
          value: method,
        });
      });
      return options;
    },
    methodModel: {
      get() {
        return [this.action.method];
      },
      set(newValue) {
        this.action.method = newValue[0];
      },
    },
    contentTypeOptions() {
      const options = [];
      this.contentTypes.forEach((type) => {
        options.push({
          text: type,
          value: type,
        });
      });
      return options;
    },
    contentTypeModel: {
      get() {
        return [this.action.contentTypes];
      },
      set(newValue) {
        this.action.contentTypes = newValue[0];
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
      const that = this;
      that.$pop({
        title: this.i18n.task_engine_v3.create_skill_pop.label_title,
        component: CreateSkillPop,
        validate: true,
        data: {
          skillName: '',
        },
        callback: {
          ok: (skillName) => {
            that.$root.$emit('addNewSkill', skillName);
          },
        },
      });
    },
  },
  beforeMount() {
    this.i18n = i18nUtils.getLocaleMsgs(this.$i18n);
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
@import "../scss/teVariable.scss";
#action-card{
  margin-top: 10px;
  .msg-action{
    display: flex;
    flex-direction: row;
    .label-response{
      width: 28px;
      height: 28px;
      font-size: 14px;
      line-height: 28px;
      color: $color-font-normal;
    }
    .input-msg{
      flex: 1 1 auto;
      margin-left: 15px;
    }
  }
  .webhook-action{
    .row{
      display: flex;
      flex-direction: row;
      margin-top: 10px;
      .label-webhook{
        width: 122px;
        height: 28px;
        font-size: 14px;
        line-height: 28px;
        color: $color-font-normal;
        margin-right: 10px;
      }
      .input-webhook{
        width: 180px;
      }
      .input-url, .input-body{
        flex: 1 1 auto;
      }
    }
  }
  .goto-action{
    display: flex;
    flex-direction: row;
    .label-goto{
      width: 28px;
      height: 28px;
      font-size: 14px;
      line-height: 28px;
      color: $color-font-normal;
    }
    .select-skill{
      margin-left: 15px;
    }
  }
}
</style>
