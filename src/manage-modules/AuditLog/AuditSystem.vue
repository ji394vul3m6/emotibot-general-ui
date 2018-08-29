<template>
  <div id="audit-system">
    <div class="card h-fill w-fill">
      <div id="audit-header">
        <nav-bar class="nav-bar" :options="pageOption" v-model="currentPage"></nav-bar>
        <div class="back-button">
          <text-button @click="goBack">{{ $t('management.go_back') }}</text-button>
        </div>
      </div>
      audit system
    </div>
  </div>
</template>
<script>
import NavBar from '@/components/NavigationBar';

const auditEnterprisePage = '/manage/audit-enterprise';
const auditRobotPage = '/manage/audit-robot';
export default {
  path: 'audit-system',
  name: 'audit-system',
  components: {
    NavBar,
  },
  data() {
    return {
      currentPage: 'auditSystem',
      pageOption: {
        auditSystem: this.$t('management.audit.system'),
        auditEnterprise: this.$t('management.audit.enterprise'),
        auditRobot: this.$t('management.audit.robot'),
      },
    };
  },
  watch: {
    currentPage(val) {
      if (val === 'auditEnterprise') {
        this.$router.push(auditEnterprisePage);
      } else if (val === 'auditRobot') {
        this.$router.push(auditRobotPage);
      }
    },
  },
  methods: {
    goBack() {
      this.$router.back(); // history forward 1 page
    },
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
