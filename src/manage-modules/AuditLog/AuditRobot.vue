<template>
  <div id="audit-robot">
    <div class="card h-fill w-fill">
      <div id="audit-header">
        <template v-if="isNormalUser">
          <nav-bar class="nav-bar" :options="pageOption"></nav-bar>
        </template>
        <template v-else>
          <nav-bar class="nav-bar" :options="pageOption" v-model="currentPage"></nav-bar>
        </template>
        <div class="back-button">
          <text-button @click="goBack">{{ $t('management.go_back') }}</text-button>
        </div>
      </div>
      audit robot
    </div>
  </div>
</template>
<script>
import NavBar from '@/components/NavigationBar';
import UserType from './_data/UserType';

const auditEnterprisePage = '/manage/audit-enterprise';
const auditSystemPage = '/manage/audit-system';
export default {
  path: 'audit-robot',
  name: 'audit-robot',
  components: {
    NavBar,
  },
  data() {
    return {
      userType: undefined,
      currentPage: 'auditRobot',
      pageOption: {
        auditSystem: this.$t('management.audit.system'),
        auditEnterprise: this.$t('management.audit.enterprise'),
        auditRobot: this.$t('management.audit.robot'),
      },
      isNormalUser: true,
    };
  },
  watch: {
    currentPage(val) {
      if (val === 'auditEnterprise') {
        this.$router.push(auditEnterprisePage);
      } else if (val === 'auditSystem') {
        this.$router.push(auditSystemPage);
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
      } else if (this.userType === UserType.ENTERPRISE_ADMIN) {
        this.pageOption = {
          auditEnterprise: this.$t('management.audit.enterprise'),
          auditRobot: this.$t('management.audit.robot'),
        };
        return;
      }
      this.pageOption = {
        auditRobot: this.$t('management.audit.robot'),
      };
    },
  },
  beforeMount() {
    this.userType = JSON.parse(localStorage.getItem('userInfo')).type;
    this.setPageOption();
    this.isNormalUser = this.userType === UserType.NORMAL_USER;
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
