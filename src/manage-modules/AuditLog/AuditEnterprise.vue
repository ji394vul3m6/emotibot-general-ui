<template>
  <div id="audit-enterprise">
    <div class="card h-fill w-fill">
      <div id="audit-header">
        <nav-bar class="nav-bar" :options="pageOption" v-model="currentPage"></nav-bar>
        <div class="back-button">
          <text-button @click="goBack">{{ $t('management.go_back') }}</text-button>
        </div>
      </div>
    audit enterprise
    </div>
  </div>
</template>
<script>
import NavBar from '@/components/NavigationBar';
import UserType from './_data/UserType';

const auditSystemPage = '/manage/audit-system';
const auditRobotPage = '/manage/audit-robot';
export default {
  path: 'audit-enterprise',
  name: 'audit-enterprise',
  components: {
    NavBar,
  },
  data() {
    return {
      currentPage: 'auditEnterprise',
      pageOption: {},
    };
  },
  watch: {
    currentPage(val) {
      if (val === 'auditSystem') {
        this.$router.push(auditSystemPage);
      } else if (val === 'auditRobot') {
        this.$router.push(auditRobotPage);
      }
    },
  },
  methods: {
    goBack() {
      this.$router.back(); // history forward 1 page
    },
    setPageOption() {
      if (this.userType === UserType.SYSTEM_ADMIN) {
        this.pageOption = {
          auditSystem: this.$t('management.audit.system'),
          auditEnterprise: this.$t('management.audit.enterprise'),
          auditRobot: this.$t('management.audit.robot'),
        };
        return;
      }
      this.pageOption = {
        auditEnterprise: this.$t('management.audit.enterprise'),
        auditRobot: this.$t('management.audit.robot'),
      };
    },
  },
  beforeMount() {
    this.userType = JSON.parse(localStorage.getItem('userInfo')).type;
    this.setPageOption();
  },
};

</script>
<style lang="scss" scoped>
#audit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .nav-bar {
    flex: 1;
  }
  .back-button {
    padding-right: 20px;
    height: 60px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $color-borderline;
  }
}
</style>
