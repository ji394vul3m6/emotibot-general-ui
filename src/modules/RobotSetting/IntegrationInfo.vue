<template>
  <div class="robot-special-words">
    <div class="card w-fill h-fill">
      <nav-bar :options=pageMap />
      <div class="content">
        <div class="line">
          <div class="title">{{$t('integration.enterpriseID')}}：</div><div>{{ enterpriseID }}</div>
        </div>
        <div class="line">
          <div class="title">{{$t('integration.robotID')}}：</div><div>{{ robotID }}</div>
        </div>
        <div class="line">
          <div class="title">Secret Key：</div><div>{{ secret }}</div>
        </div>
        <div class="wechat-box">
          <div class="item" @click="popUpWXSubsIntegration">
            <img src="../../assets/images/wx_subscription.svg">
            <p class="desc">{{$t('robot_setting.wechat_subscription')}}</p>
            <p class="try">{{$t('robot_setting.try_now')}}</p>
          </div>
          <div class="item" @click="popUpWXEnterprise">
            <img src="../../assets/images/wx_enterprise.svg">
            <p class="desc">{{$t('robot_setting.wechat_enterprise')}}</p>
            <p class="try">{{$t('robot_setting.try_now')}}</p>
          </div>
          <div class="item" @click="popUpWXMiniprogram">
            <img src="../../assets/images/wx_miniprogram.svg">
            <p class="desc">{{$t('robot_setting.wechat_miniprogram')}}</p>
            <p class="try">{{$t('robot_setting.try_now')}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import NavBar from '@/components/NavigationBar';
import robotAPI from './_api/robot';
import WechatSubscription from './_components/WechatSubscription';
import WechatMiniprogram from './_components/WechatMiniprogram';
import WechatEnterprise from './_components/WechatEnterprise';

export default {
  path: 'integration',
  privCode: 'integration',
  displayNameKey: 'integration',
  icon: 'white_chat',
  name: 'integration',
  components: {
    NavBar,
  },
  api: robotAPI,
  computed: {
    ...mapGetters([
      'enterpriseID',
      'robotID',
    ]),
  },
  data() {
    return {
      pageMap: {
        basic: this.$t('integration.integration'),
      },
      wordsList: [],
      secret: '',
    };
  },
  mounted() {
    const that = this;
    that.$api.getRobotSecret(that.enterpriseID, that.robotID).then((data) => {
      that.secret = data;
    });
  },
  methods: {
    popUpWXSubsIntegration() {
      const options = {
        title: this.$t('robot_setting.wechat_subscription'),
        component: WechatSubscription,
        data: {
          readonly: true,
        },
        buttons: ['ok'],
        ok_msg: this.$t('general.close'),
        validate: false,
      };
      this.$pop(options);
    },
    popUpWXMiniprogram() {
      const options = {
        title: this.$t('robot_setting.wechat_miniprogram'),
        component: WechatMiniprogram,
        data: {
          readonly: true,
        },
        buttons: ['ok'],
        ok_msg: this.$t('general.close'),
        validate: false,
      };
      this.$pop(options);
    },
    popUpWXEnterprise() {
      const options = {
        title: this.$t('robot_setting.wechat_enterprise'),
        component: WechatEnterprise,
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
.content {
  padding: 20px;
  .line {
    @include font-14px();
    margin-bottom: 10px;
    padding: 4px 0;
    display: flex;
    .title {
      margin-right: 4px;
    }
  }
  .wechat-box{
    @include flex-row();
    box-shadow: inset 0 1px 0 0 $color-borderline-disabled;
    margin-top: 20px;
    padding-top: 20px;
    .item{
      width: 200px;
      min-width: 200px;
      height: 160px;
      margin-right: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border: 1px solid $color-borderline;
      border-radius: 4px;
      cursor: pointer;
      .desc{
        @include font-14px-line-height-28px();
      }
      .try{
        color: $color-font-mark;
      }
      &:hover{
        box-shadow: 0 5px 8px 0 rgba(228,228,228,0.50), 0 4px 9px 0 rgba(115,115,115,0.20);
      }
      img{
        width: 64px;
      }
    }
  }
}
</style>
