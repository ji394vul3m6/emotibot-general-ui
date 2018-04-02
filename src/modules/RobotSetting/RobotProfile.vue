<template>
<div id="robot-profile">
  <div class="content">
    <div class="row" v-if="canEdit">
      <text-button main v-on:click="rebuild()" icon-type="white_refresh">{{$t('robot_setting.model_rebuild')}}</text-button>
    </div>
    <div class="row auto-height">
      {{ $t('robot_setting.rebuild_msg') }}
    </div>
    <div class="table-container">
      <flex-table :data="tableData" :columns="tableHeader"></flex-table>
    </div>
  </div>
</div>
</template>

<script>
import GeneralTable from '@/components/GeneralTable';
import FlexTable from '@/components/FlexTable';
import api from './_api/robot';
import QAEditor from './_components/RobotQAEditForm';

export default {
  path: 'robot-profile',
  privCode: 'robot_profile',
  displayNameKey: 'robot_profile',
  icon: 'white_robot',
  components: {
    'general-table': GeneralTable,
    FlexTable,
  },
  data() {
    return {
      curPage: 0,
      tableData: [],
      tableHeader: [],
      dataCnt: 0,
      editButtonList: [],
    };
  },
  methods: {
    ...api,
    operationSuccess(data) {
      const res = data.data;
      if (res.status === 0) {
        this.showMessage(this.$t('error_msg.success'));
        this.initPage();
      } else {
        this.showError(this.$t('error_msg.request_fail'), res.message);
      }
      this.$emit('endLoading');
    },
    operationFail(err) {
      this.showError(this.$t('error_msg.request_fail'), err.message);
      this.$emit('endLoading');
    },
    showMessage(msg) {
      this.$notify({ text: msg });
      // pop.popErrorWindow(this, msg);
    },
    showError(err, info) {
      let text = err;
      if (info) {
        text = `${err}: ${info}`;
      }
      this.$notify({ text, type: 'fail' });
      // pop.popErrorWindow(this, err, info);
    },
    rebuild() {
      const that = this;
      that.$emit('startLoading');
      this.rebuildRobotQAModel().then((data) => {
        that.operationSuccess(data);
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
      that.$pop({
        title: this.$t('robot_setting.modify_qas'),
        data: qaData,
        component: QAEditor,
        validate: true,
        callback: {
          ok(retData) {
            qaData.answers = retData.filter(answer => true && answer);
            that.updateRobotQA(qaData).then((data) => {
              that.operationSuccess(data);
            }, () => {
              // TODO
              // general.handleAPIError(that, err).catch(() => {
              //   that.operationFail(err);
              // });
            });
          },
        },
      });
    },
    setUpMsg() {
      const that = this;
      that.tableHeader = [
        {
          key: 'main_question',
          text: that.$t('general.question'),
          type: 'text',
          width: 1,
        },
        {
          key: 'show_answer',
          text: that.$t('general.answer'),
          type: 'text',
          width: 2,
        },
      ];
      if (that.canEdit) {
        that.tableHeader.push({
          text: '',
          btn_text: that.$t('general.edit'),
          type: 'icon-button',
          icon: 'edit',
          iconCallback: that.editQA,
          width: '70px',
          fixed: true,
        });
      } else {
        that.editButtonList = [];
      }
    },
    initPage() {
      const that = this;
      // this.showLoading = true;
      that.$emit('startLoading');
      this.getRobotQAList(this.curPage, 0).then((data) => {
        this.tableData = that.convertAPIData(data.qa_infos);
        this.dataCnt = data.count;
        that.$emit('endLoading');
      }).catch(() => {
        // general.handleAPIError(that, err).catch((value) => {
        //   that.showError(this.$t('error_msg.save_fail', value.errMsg));
        // });
        that.$emit('endLoading');
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
@import 'styles/variable.scss';

.content {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 10px;
  box-sizing: border-box;
  line-height: $default-line-height;

  display: flex;
  flex-direction: column;
  .table-container {
    flex: 1;
  }
}
</style>
