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
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import NavBar from '@/components/NavigationBar';

export default {
  path: 'integration',
  privCode: 'integration',
  displayNameKey: 'integration',
  icon: 'white_chat',
  name: 'integration',
  components: {
    NavBar,
  },
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
    };
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
