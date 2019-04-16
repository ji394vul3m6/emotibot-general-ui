<template>
  <div class="wechat-enterprise-wrapper">
    <img src="../../../assets/images/wx_enterprise.svg">
    <div class="input-area">
      <div class="line">
        <span class="input-label">{{$t('robot_setting.enterprise')}}ID</span>
        <info-input v-model="inputEnterpriseID"
        :msg="$t('robot_setting.tip_enterprise')"
        :placeholder="$t('robot_setting.enter_enterprise_id')"></info-input>
      </div>
      <div class="line">
        <span class="input-label">AgentID</span>
        <info-input v-model="inputAgentID"
        :msg="$t('robot_setting.tip_agent')"
        :placeholder="$t('robot_setting.search_keyword')"></info-input>
      </div>
      <div class="line">
        <span class="input-label">Secret</span>
        <info-input v-model="inputSecret"
        :msg="$t('robot_setting.tip_secret')"
        :placeholder="$t('robot_setting.search_keyword')"></info-input>
      </div>
      <text-button class="generate-btn" :button-type="enableGenerate?'fill':'disable'">生成</text-button>
      <p class="genereate-tip1">{{$t('robot_setting.generate_tip1')}}</p>
    </div>
    <div class="result-area">
      <span class="genereate-tip2">{{$t('robot_setting.generate_tip2')}}</span>
      <span class="check-guide">{{$t('robot_setting.check_guide')}}</span>
      <p class="result-title">{{$t('robot_setting.generate_info')}}</p>
      <div class="line">
        <span class="label">URL</span>
        <input v-model="generateURL" type="password" disabled></input>
        <span class="copy-btn">{{$t('general.copy')}}</span>
      </div>
      <div class="line">
        <span class="label">Token</span>
        <input v-model="generateURL" type="password" disabled></input>
        <span class="copy-btn">{{$t('general.copy')}}</span>
      </div>
      <div class="line">
        <span class="label">EncodingASEKey</span>
        <input v-model="generateURL" type="password" disabled></input>
        <span class="copy-btn">{{$t('general.copy')}}</span>
      </div>
      <p class="check-bind-wechat" @click="popUpBindWechat">
      {{$t('general.view')}}{{$t('robot_setting.check_bind_wechat')}}</p>
    </div>
  </div>
</template>

<script>
import WechatBindEnterprise from './WechatBindEnterprise';

export default {
  data() {
    return {
      inputEnterpriseID: '',
      inputAgentID: '',
      inputSecret: '',
      generateURL: '***',
    };
  },
  computed: {
    enableGenerate() {
      return this.inputEnterpriseID && this.inputAgentID && this.inputSecret;
    },
  },
  methods: {
    checkBindWechat() {
      this.$emit('cancel', 'showBindWechat');
    },
    popUpBindWechat() {
      this.$emit('cancel');
      const options = {
        title: this.$t('robot_setting.check_bind_wechat'),
        component: WechatBindEnterprise,
        data: {
          readonly: true,
        },
        buttons: ['cancel', 'ok'],
        validate: false,
      };
      this.$pop(options);
    },
  },
};
</script>

<style lang="scss" scoped>
.wechat-enterprise-wrapper{
  width: 480px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  border-top: 1px solid $color-borderline-disabled;
  border-bottom: 1px solid $color-borderline-disabled;
  img{
    width: 64px;
    height: 64px;
    margin-bottom: 10px;
  }
  .input-area{
    width: 100%;
    border-bottom: 1px solid $color-borderline;
    .line{
      display: flex;
      margin-bottom: 10px;
      .input-label{
        width: 56px;
        @include font-14px-line-height-28px();
      }
      .info-input{
        margin-left: 10px;
        flex: 1;
      }
    }
    .generate-btn{
      margin: 10px 0px;
      width: 100%;
    }
    .genereate-tip1{
      color: $color-font-mark;
      margin-bottom: 20px;
    }
  }
  .result-area{
    padding-top: 35px;
    .genereate-tip2{
      @include font-14px();
    }
    .check-guide{
      @include font-14px();
      color: $app-active-color;
      cursor: pointer;
    }
    .result-title{
      @include font-14px-line-height-28px();
      color: $color-font-active;
    }
    .line{
      margin-top: 10px;
      display: flex;
      .label{
        width: 118px;
        @include font-14px-line-height-28px();
      }
      input{
        flex: 1;
      }
      .copy-btn{
        @include font-14px-line-height-28px();
        color: $color-primary;
        margin-left: 10px;
        cursor: pointer;
      }
    }
    .check-bind-wechat{
      @include font-14px-line-height-28px();
      color: $color-primary;
      margin-top: 20px;
      cursor: pointer;
    }
  }
}
</style>