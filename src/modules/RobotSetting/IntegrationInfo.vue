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
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import NavBar from '@/components/NavigationBar';
import robotAPI from './_api/robot';

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
};
</script>

<style lang="scss" scoped>
.content {
  padding: 20px;
  padding-bottom: 0;
  .line {
    @include font-14px();
    margin-bottom: 10px;
    padding: 4px 0;

    display: flex;
    .title {
      margin-right: 4px;
    }
  }
}
</style>
