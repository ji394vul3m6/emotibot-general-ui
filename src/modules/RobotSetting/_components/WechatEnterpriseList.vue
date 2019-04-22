<template>
  <div class="bind-wechat-wrapper">
    <general-table
      :table-data="enterpriseList"
      :table-header="tableHeader"
      :action="action"
      auto-height
      show-empty>
    </general-table>
  </div>
</template>

<script>
import robotAPI from '../_api/robot';

export default {
  api: robotAPI,
  data() {
    return {
      tableHeader: [
        {
          key: 'enterpriseID',
          text: `${this.$t('robot_setting.enterprise')}ID`,
          width: '258px',
        },
        {
          key: 'agentID',
          text: 'AgentID',
          width: '248px',
        },
        {
          key: 'title',
          text: this.$t('robot_setting.title'),
          width: '248px',
        },
      ],
      enterpriseList: [],
      // tableData: [
      //   {
      //     enterpriseID: 'wwc1239e9d9',
      //     agentID: 'agentId',
      //     title: 'hahahah',
      //     action_enable: {
      //       delete: true,
      //     },
      //     // hightlight: true,
      //   },
      //   {
      //     enterpriseID: '123',
      //     agentID: 'xxxxx',
      //     title: 'xxxxxxxx',
      //     action_enable: {
      //       delete: true,
      //     },
      //     // hightlight: true,
      //   },
      // ],
      // action: [
      //   {
      //     key: 'delete',
      //     text: this.$t('robot_setting.unbind'),
      //     type: 'error',
      //     onclick: this.handleUnbindWechat,
      //   },
      // ],
    };
  },
  created() {
    this.getEnterpriseWechatList();
  },
  methods: {
    getEnterpriseWechatList() {
      this.$api.getEnterpriseWechatList().then((res) => {
        this.enterpriseList = res;
      });
    },
    handleUnbindWechat() {
      this.$api.handleUnbindWechat().then((res) => {
        console.log(res);
        this.getEnterpriseWechatList();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.bind-wechat-wrapper{
  width: 834px;
  height: 480px;
  min-height: 200px;
}
</style>