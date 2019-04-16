<template>
  <div class="bind-wechat-wrapper">
    <general-table
      :table-data="tableData"
      :table-header="tableHeader"
      :action="action"
      auto-height
      show-empty>
    </general-table>
  </div>
</template>

<script>
export default {
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
      tableData: [
        {
          enterpriseID: 'wwc1239e9d9',
          agentID: 'agentId',
          title: 'hahahah',
          action_enable: {
            delete: true,
          },
          // hightlight: true,
        },
        {
          enterpriseID: '123',
          agentID: 'xxxxx',
          title: 'xxxxxxxx',
          action_enable: {
            delete: true,
          },
          // hightlight: true,
        },
      ],
      action: [
        {
          key: 'delete',
          text: this.$t('robot_setting.unbind'),
          type: 'error',
          onclick: this.handleUnbindWechat,
        },
      ],
    };
  },
  methods: {
    handleUnbindWechat() {
      console.log('handleEdit');
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