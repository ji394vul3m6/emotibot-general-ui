<template>
<div id="robot-profile">
  <div class="content">
    <div class="row" v-if="canEdit">
      <text-button main v-on:click="rebuild()">{{$t('robot_setting.model_rebuild')}}</text-button>
    </div>
    <div class="row auto-height">
      {{ $t('robot_setting.rebuild_msg') }}
    </div>
    <!-- <general-table :contents="tableData" :headerInfo="tableHeader"></general-table> -->
    <div class="table-container">
      <flex-table :data="tableData" :columns="tableHeader"></flex-table>
    </div>
  </div>
</div>
</template>

<script>
import GeneralTable from '@/components/GeneralTable';
import FlexTable from '@/components/FlexTable';
import pop from '@/utils/pop';
import api from './_api/robot';
import QAEditor from './_components/RobotQAEditForm';

export default {
  path: 'robot-profile',
  privCode: 'robot_profile',
  displayNameKey: 'robot_profile',
  icon: 'robot',
  components: {
    'general-table': GeneralTable,
    FlexTable,
  },
  data() {
    return {
      curPage: 1,
      tableData: [],
      tableHeader: [],
      dataCnt: 0,
      i18n: {},
      editButtonList: [],
    };
  },
  methods: {
    operationSuccess(data) {
      const res = data.data;
      if (res.status === 0) {
        this.showMessage(this.$t('error_msg.success'));
        this.initPage();
      } else {
        this.showError(this.$t('error_msg.save_fail', res.message));
      }
      this.showLoading = false;
    },
    operationFail(err) {
      this.showError(this.$t('error_msg.save_fail', err.message));
      this.showLoading = false;
    },
    showMessage(msg) {
      pop.popErrorWindow(this, msg);
    },
    showError(err, info) {
      pop.popErrorWindow(this, err, info);
    },
    rebuild() {
      const that = this;
      this.showLoading = true;
      api.rebuildRobotQAModel().then((data) => {
        that.operationSuccess(data);
      }, (err) => {
        general.handleAPIError(that, err).catch(() => {
          that.operationFail(err);
        });
      });
    },
    convertAPIData(datas) {
      return datas.map((data) => {
        if (!data.answers || data.answers.length === 0) {
          data.show_answer = '';
        } else {
          data.show_answer = data.answers[0];
        }

        data.buttons = this.editButtonList;
        return data;
      });
    },
    editQA(idx) {
      const that = this;
      const qaData = this.tableData[idx];
      that.$root.$emit('showWindow', {
        title: this.$t('robot.modify_qas'),
        data: qaData,
        component: QAEditor,
        validate: true,
        callback: {
          ok(retData) {
            qaData.answers = retData.filter(answer => true && answer);
            api.updateRobotQA(qaData).then((data) => {
              that.operationSuccess(data);
            }, (err) => {
              general.handleAPIError(that, err).catch(() => {
                that.operationFail(err);
              });
            });
          },
        },
      });
    },
    setUpMsg() {
      // const that = this;
      this.tableHeader = [
        {
          key: 'main_question',
          text: this.$t('general.question'),
          type: 'text',
          width: 1,
        },
        {
          key: 'show_answer',
          text: this.$t('general.answer'),
          type: 'text',
          width: 2,
        },
      ];
      if (this.canEdit) {
        this.tableHeader.push({
          text: '',
          type: 'icon-button',
          icon: 'edit',
          iconCallback: this.editQA,
          width: '30px',
          fixed: true,
        });
      } else {
        this.editButtonList = [];
      }
    },
    initPage() {
      const that = this;
      this.showLoading = true;
      api.getRobotQAList(this.curPage).then((data) => {
        this.tableData = that.convertAPIData(data.qa_infos);
        this.dataCnt = data.count;
      }).catch(() => {
        // general.handleAPIError(that, err).catch((value) => {
        //   that.showError(this.$t('error_msg.save_fail', value.errMsg));
        // });
      }).finally(() => {
        that.showLoading = false;
      });
    },
  },
  activated() {
    this.initPage();
  },
  mounted() {
    this.setUpMsg();
    this.initPage();
  },
  computed: {
    canEdit() {
      return true;
      // return auth.checkPrivilege('robot-profile', 'edit');
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  .table-container {
    flex: 1;
  }
}
</style>
