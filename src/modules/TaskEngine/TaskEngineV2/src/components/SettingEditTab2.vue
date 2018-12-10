<template>
<div id="setting-edit-tab">
  <div class="block">
    <div class="label-header">{{$t('task_engine_v2.setting_edit_tab2.node_name')}}</div>
    <input class="input-rounded" ref="input-content" v-tooltip="tooltip"
      v-model="nodeName"
      @focus="onInputFocus"/>
  </div>
  <div class="block fill-h reset-margin">
    <div class="label-header">{{$t('task_engine_v2.setting_edit_tab2.response_setting')}}</div>
    <div class="response-setting">
      <div class="block">
        <label>
          <input type="checkbox" v-model="isUsingResponse"/>
          <span v-t="'task_engine_v2.setting_edit_tab2.enable_response'"></span>
        </label>
      </div>
      <div class="skip-response fill-h" v-if="!isUsingResponse" v-t="'task_engine_v2.setting_edit_tab2.skip_response'"></div>
      <template v-else>
        <div class="block">
          <div class="title-wrapper">
            <div class="label-header">{{$t('task_engine_v2.setting_edit_tab2.default_q')}}</div>
            <icon class="icon" iconType="info" :size="16" enableHover v-tooltip="defaultQTooltip"></icon>
          </div>
          <textarea 
            class="text-response"
            ref="defaultQ"
            :placeholder="$t('task_engine_v2.setting_edit_tab2.default_q_placeholder')"
            v-model="initialResponse"
            v-tooltip="tooltip"
            @focus="onInputFocus">
          </textarea>
        </div>
        <div class="block">
          <div class="title-wrapper">
            <div class="label-header">{{$t('task_engine_v2.setting_edit_tab2.parse_fail_q')}}</div>
            <icon class="icon" iconType="info" :size="16" enableHover v-tooltip="failQTooltip"></icon>
          </div>
          <textarea 
            class="text-response" 
            ref="fail-textarea"
            :placeholder="$t('task_engine_v2.setting_edit_tab2.fail_q_placeholder')"
            v-model="failureResponse"
            v-tooltip="tooltip"
            @focus="onInputFocus">
          </textarea>
        </div>
        <template v-if="showAdvancedSetting">
          <div class="block">
            <div class="title-wrapper">
              <div class="label-header">{{$t('task_engine_v2.setting_edit_tab2.repeat_q')}}</div>
              <icon class="icon" iconType="info" :size="16" enableHover v-tooltip="repeatQTooltip"></icon>
            </div>
            <textarea 
              class="text-response"
              ref="repeatQ"
              :placeholder="$t('task_engine_v2.setting_edit_tab2.repeat_q_placeholder')"
              v-model="repeatResponse">
            </textarea>
          </div>
          <div class="block">
            <div class="title-wrapper">
              <div class="label-header">{{$t('task_engine_v2.setting_edit_tab2.rewind_q')}}</div>
              <icon class="icon" iconType="info" :size="16" enableHover v-tooltip="rewindQTooltip"></icon>
            </div>
            <textarea 
              class="text-response" 
              ref="rewindQ"
              :placeholder="$t('task_engine_v2.setting_edit_tab2.rewind_q_placeholder')"
              v-model="rewindResponse">
            </textarea>
          </div>
        </template>
        <button class="advanced_setting" @click.stop="showAdvancedSetting = !showAdvancedSetting">
          {{ showAdvancedSetting ? $t('task_engine_v2.setting_edit_tab2.hide_advanced_setting') : $t('task_engine_v2.setting_edit_tab2.advanced_setting')}}
        </button>
      </template>
    </div>
  </div>
</div>
</template>

<script>
import event from '@/utils/js/event';
import optionConfig from '../_utils/optionConfig';

export default {
  props: {
    validateTab: {
      type: Boolean,
      default: false,
    },
    settingTab: {
      type: Object,
      required: true,
    },
    globalVarOptions: {
      type: Array,
      required: true,
    },
  },
  data() {
    const settingTab = this.settingTab;
    // render entityModuleOptions
    const entityModuleOptionsMap = optionConfig.getEntityModuleOptionsMap();
    return {
      nodeType: settingTab.nodeType,
      nodeName: settingTab.nodeName,
      parser: settingTab.parser,
      targetEntities: settingTab.targetEntities,
      skipIfKeyExist: settingTab.skipIfKeyExist,
      initialResponse: settingTab.initialResponse,
      failureResponse: settingTab.failureResponse,
      repeatResponse: settingTab.repeatResponse,
      rewindResponse: settingTab.rewindResponse,
      parseFromThisNode: settingTab.parseFromThisNode,
      entityModuleOptions: entityModuleOptionsMap[this.parser],
      varDropdown: undefined,
      tooltip: {
        msg: this.$t('task_engine_v2.err_empty'),
        eventOnly: true,
        errorType: true,
        alignLeft: true,
        absolute: true,
      },
      showAdvancedSetting: false,
      defaultQTooltip: {
        msg: this.$t('task_engine_v2.setting_edit_tab2.default_q_hint'),
      },
      failQTooltip: {
        msg: this.$t('task_engine_v2.setting_edit_tab2.fail_q_hint'),
      },
      repeatQTooltip: {
        msg: this.$t('task_engine_v2.setting_edit_tab2.repeat_q_hint'),
      },
      rewindQTooltip: {
        msg: this.$t('task_engine_v2.setting_edit_tab2.rewind_q_hint'),
      },
      isUsingResponse: !settingTab.skipDialogue,
    };
  },
  computed: {
    result() {
      const result = {
        nodeName: this.nodeName,
        parser: this.parser,
        targetEntities: this.targetEntities,
        skipIfKeyExist: this.skipIfKeyExist,
        initialResponse: this.initialResponse,
        failureResponse: this.failureResponse,
        repeatResponse: this.repeatResponse,
        rewindResponse: this.rewindResponse,
        parseFromThisNode: this.parseFromThisNode,
        skipDialogue: !this.isUsingResponse,
      };
      // console.log(result);
      return result;
    },
  },
  watch: {
    validateTab(newV, oldV) {
      if (newV && !oldV) {
        const valid = this.isUsingResponse ?
        [this.isValueEmpty(this.$refs['input-content']),
          this.isValueEmpty(this.$refs.defaultQ),
          this.isValueEmpty(this.$refs['fail-textarea'])]
        .indexOf(false) === -1 : true;
        this.$emit('update:valid', valid);
      }
    },
    result: {
      handler() {
        this.$emit('update', this.result);
      },
      deep: true,
    },
  },
  methods: {
    onInputFocus(evt) {
      evt.target.dispatchEvent(event.createEvent('tooltip-hide'));
    },
    isValueEmpty(el) {
      let valid = true;
      if (!el.value) {
        valid = false;
        el.dispatchEvent(event.createEvent('tooltip-show'));
      }
      return valid;
    },
  },
};
</script>

<style lang="scss" scoped>
#setting-edit-tab{
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  height: 100%;
  .skip-response {
    display: flex;
    justify-content: center;
    align-items: center;
    color: $color-font-normal;
    @include font-14px();
  }
  .fill-h {
    height: 100%;
  }
  .response-setting {
    background-color: $color-disabled;
    flex: 1;
    padding: 20px;
    .advanced_setting {
      color: $color-primary;
      border: none;
      background-color: $color-disabled;
      padding: 0;
      @include font-14px();
    }
    .title-wrapper {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .label-header {
        margin-bottom: 0;
      }
      .icon {
        margin-left: 5px;
      }
    }
    label {
      margin-right: auto;
      color: $color-font-normal;
      @include font-14px();
    }
  }
  .block{
    &.reset-margin {
      margin: 0;
    }
    display: flex;
    flex-direction: column;
    margin: 0px 0px 20px 0px;
    .label-header{
      @include font-14px();
      color: $color-font-active;
      margin-bottom: 10px;
    }
    .input-rounded{
      height: 32px;
      background: white;
      &:disabled{
        background: #F3F7F9;
      }
    }
    .insert-var-button-row{
      display: flex;
      flex-direction: row;
      .button-insert{
        position: relative;
        display: flex;
        flex-direction: row;
        height: 36px;
        background: #E4EAEC;
        font-size: 14px;
        line-height: 36px;
        justify-content: center;
        border-radius: 2px;
        cursor: pointer;
        &:not(:first-child){
          margin: 0px 0px 0px 3px;
        }
        &:hover{
          background: lighten(#E4EAEC, 3%);
        }
      }
      .var{
        width: 100px;
      }
      .sys-var{
        width: 120px;
      }
    }
    .text-response{
      height: 100px;
      color: $color-font-normal;
    }
    .row{
      display: flex;
      flex-direction: row;
      align-items: center;
      &:not(:first-child){
        margin: 5px 0px 0px 0px;
      }
      .label-text{
        height: 36px;
        font-size: 14px;
        line-height: 36px;
        color: $color-font-normal;
        margin: 0px 10px 0px 0px;
      }
    }
  }
  input[type=checkbox]{
    @include general-checkbox();
  }
}
</style>
