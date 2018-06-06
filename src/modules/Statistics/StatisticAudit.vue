<template>
  <div class="statistic-audit">
    <div class="card w-fill h-fill">
      <div class="header">
        <div class="filter">
          <div class="row">
            <div class="row-title">{{ $t('statistics.time_range') }}</div>
            <datetime-picker
              :value="start"
              :disableDate="startDisableDate"
              @dateChanged="handleStartDateChanged"
              @validityChange="value => {startValidity = value}"
            ></datetime-picker>
            ～
            <datetime-picker
              :value="end"
              :disableDate="endDisableDate"
              @dateChanged="handleEndDateChanged"
              @validityChange="value => {endValidity = value}"
            ></datetime-picker>
            <div class="row-title inline">{{ $t('statistics.user_id') }}</div>
            <input v-model="userNick">
          </div>
          <template v-if="expertMode">
          <div class="row">
            <div class="row-title">{{ $t('statistics.audit.op_module') }}</div>
            <label-switch :options="listToOptions(moduleList)" v-model="selectModule"/>
          </div>
          <div class="row">
            <div class="row-title">{{ $t('statistics.audit.op_type') }}</div>
            <label-switch :options="listToOptions(actionList)" v-model="selectAction"/>
          </div>
          </template>
        </div>
        <div class="operation">
          <text-button button-type="primary" v-on:click="doSearch(1)" :disabled="!validFormInput">
            {{ $t('general.search') }}
          </text-button>
          <div @click="expertMode = !expertMode" class="show-more" :class="{more: expertMode}">
            <div class="text">
              {{ $t('statistics.export_mode') }}
            </div>
            <icon class="expand-icon" icon-type="expand" :size=12 />
          </div>
        </div>
      </div>
      <!-- <div class="row" v-if="!validTimeRange">
        <label class="error_msg">{{ $t('error_msg.time_range_error') }}</label>
      </div> -->
      <div class="button-container row">
        <text-button v-if="canExport"
          v-on:click="doExport()"
          :disabled="!validFormInput"
          :button-type="totalCount > 0 ? 'normal' : 'disable'">{{ $t('general.export') }}</text-button>
        <div v-if="totalCount > 0" class="total-show">
          {{ $t('statistics.total_records', {num: totalCount}) }}
        </div>
      </div>
      <div class="table-container">
        <general-table auto-height v-if="showTable" :tableData="tableData" :tableHeader="headerInfo" font-class="font-12"></general-table>
      </div>
      <div class="row paginator">
        <v-pagination v-if="showPagination" :pageIndex="pageIndex" v-on:page-change="doSearch" :total="totalCount" :page-size="20" :layout="['prev', 'pager', 'next', 'jumper']"></v-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import DatetimePicker from '@/components/DateTimePicker';
import GeneralTable from '@/components/GeneralTable';
import LabelSwitch from '@/components/basic/LabelSwitch';
import pickerUtil from '@/utils/vue/DatePickerUtil';
import csvUtil from '@/utils/js/csv';
import miscUtil from '@/utils/js/misc';
import auditAPI from '@/api/audit';

import api from './_api/statistic';
// import auth from '@/auth';

const timeFormatWithoutSecond = 'YYYY-MM-DD hh:mm';
const timeFormatFull = 'YYYY-MM-DD hh:mm:ss';

export default {
  path: 'statistic-audit',
  privCode: 'statistic_audit',
  displayNameKey: 'statistic_audit',
  icon: 'white_audit',
  name: 'statistic-audit',
  api: [api, auditAPI],
  components: {
    DatetimePicker,
    GeneralTable,
    LabelSwitch,
  },
  methods: {
    listToOptions(actions) {
      const keys = Object.keys(actions);
      keys.sort();
      const options = keys.map(key => ({
        text: actions[key],
        val: key,
      }));
      return options;
    },
    handleStartDateChanged(d) {
      this.start.dateObj = d;
      pickerUtil.initTimeObj(this.start);
      this.endDisableDate = {
        to: this.start.dateObj,
      };
    },
    handleEndDateChanged(d) {
      this.end.dateObj = d;
      pickerUtil.initTimeObj(this.end);
    },
    doExport() {
      const that = this;
      const module = 'statistic-audit';
      const startTimeString = moment(that.start.getTimestamp()).format(timeFormatWithoutSecond);
      const endTimeString = moment(that.end.getTimestamp()).format(timeFormatWithoutSecond);
      const filename = `${that.$t('statistics.audit_record_filename')}_${startTimeString}_${endTimeString}.csv`;

      const params = {
        start_time: that.start.getTimestamp(),
        end_time: that.end.getTimestamp(),
        filters: {
          module: '-1',
          operation: '-1',
        },
        export: true,
      };
      // only in export mode, filter with module and action
      if (that.expertMode) {
        params.filters = {
          module: that.selectModule,
          operation: that.selectAction,
        };
      }
      if (that.userNick) {
        params.filters.uid = that.userNick;
      }
      that.$emit('startLoading');

      that.$api.auditExportLog({
        module,
        filename,
      }).then(() => that.$api.getAuditLog(params)).then((data) => {
        let recordArray = data.data.result.data;
        recordArray = that.convertAPIDataToTable(recordArray);
        recordArray = that.mapCodeToString(recordArray);
        const csvData = csvUtil.convertToCSV(recordArray, this.headerInfo);
        const blobData = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvData], { type: 'text/csv' });
        miscUtil.downloadRawFile(blobData, filename);
        that.$emit('endLoading');
      }, () => {
        that.$emit('endLoading');
      });
    },
    doSearch(page) {
      this.pageIndex = page;
      const that = this;
      const params = {
        start_time: that.start.getTimestamp(),
        end_time: that.end.getTimestamp(),
        filters: {
          module: '-1',
          operation: '-1',
        },
        page,
      };
      // only in export mode, filter with module and action
      if (that.expertMode) {
        params.filters = {
          module: that.selectModule,
          operation: that.selectAction,
        };
      }
      if (that.userNick) {
        params.filters.uid = that.userNick;
      }

      that.$emit('startLoading');
      that.$api.getAuditLog(params).then((data) => {
        const res = data.data;
        if (res.status === 0) {
          that.showTable = true;
          that.tableData = that.convertAPIDataToTable(res.result.data);
          that.totalCount = res.result.total;
        } else {
          that.$popError(that.$t('error_msg.get_stats_error'), res.message);
        }
        that.$emit('endLoading');
      }, () => {
        that.$emit('endLoading');
      });
    },
    convertAPIDataToTable(datas) {
      const that = this;
      datas.forEach((data) => {
        data.create_time = moment(data.create_time).format(timeFormatFull);
        data.result = data.result === 0 ? that.$t('general.fail') : that.$t('general.success');
        data.module = that.moduleList[data.module];
        data.operation = this.actionList[data.operation];
      });
      return datas;
    },
    mapCodeToString(datas) {
      const that = this;
      datas.forEach((data) => {
        data.result = data.result === 0 ? that.$t('general.fail') : that.$t('general.success');
        data.module = this.moduleList[data.module];
        data.operation = this.actionList[data.operation];
      });
      return datas;
    },
  },
  data() {
    return {
      start: pickerUtil.createDateObj(),
      end: pickerUtil.createDateObj(),
      userNick: '',
      expertMode: false,
      actionList: {
        '-1': '全部',
        0: '新增',
        1: '修改',
        2: '删除',
        3: '导入',
        4: '导出',
      },
      selectAction: '-1',
      moduleList: {
        '-1': '全部',
        0: '话术设置',
        1: '技能设置',
        2: '问答库',
        3: '形象设置',
        4: '开关管理',
        5: '词库管理',
        6: '数据管理',
        7: '用户管理',
        8: '角色管理',
      },
      selectModule: '-1',
      tableData: [],
      headerInfo: [
        {
          text: this.$t('statistics.audit.user_id'),
          key: 'user_id',
          type: 'text',
          wrap: true,
          width: '10%',
        },
        {
          text: this.$t('statistics.audit.op_module'),
          key: 'module',
          type: 'map-text',
          map: this.moduleList,
          width: '10%',
        },
        {
          text: this.$t('statistics.audit.op_type'),
          key: 'operation',
          type: 'map-text',
          map: this.actionList,
          width: '10%',
        },
        {
          text: this.$t('statistics.audit.content'),
          key: 'content',
          type: 'raw-text',
          wrap: true,
          width: '40%',
        },
        {
          text: this.$t('statistics.audit.result'),
          key: 'result',
          type: 'map-text',
          map: {
            0: this.$t('general.fail'),
            1: this.$t('general.success'),
          },
          width: '10%',
        },
        {
          text: this.$t('statistics.audit.create_time'),
          key: 'create_time',
          type: 'text',
          width: '10%',
        },
        {
          text: this.$t('statistics.audit.ip_source'),
          key: 'user_ip',
          type: 'text',
          width: '10%',
        },
      ],
      showTable: false,
      totalCount: 0,
      startValidity: true,
      endValidity: true,
      pageIndex: 1,
      startDisableDate: undefined,
      endDisableDate: undefined,

    };
  },
  computed: {
    canExport() {
      // return auth.checkPrivilege('statistic-audit', 'export');
      return true;
    },
    validTimeRange() {
      return this.end.dateObj > this.start.dateObj;
    },
    validInputString() {
      return this.startValidity && this.endValidity;
    },
    validFormInput() {
      return this.validTimeRange && this.validInputString;
    },
    showPagination() {
      return this.showTable && this.totalCount > 0;
    },
  },
  beforeMount() {
    pickerUtil.initTime(this);
    this.startDisableDate = {
      from: this.end.dateObj,
    };
    this.endDisableDate = {
      to: this.start.dateObj,
    };
  },
  activated() {
    pickerUtil.initTime(this);
    this.userNick = '';
    this.selectAction = '-1';
    this.selectModule = '-1';
    this.showTable = false;
    this.totalCount = 0;
  },
};
/*
*/
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

$main-color: black;
$row-height: $default-line-height;
$title-color: #666666;

.card {
  padding: 10px 0 0 0;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 0 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: flex-end;
  .filter {
    flex: 1;
  }
  .operation {
    flex: 0 0 auto;
    display: flex;
    .show-more {
      @include click-button();
      display: flex;
      align-items: center;
      margin-left: 12px;
      .text {
        margin-right: 5px;
      }
      &:not(.more) {
        .expand-icon {
          transform: rotate(180deg);
        }
      }
    }
  }
}

.statistic-audit {
  .row {
    flex: 0 0 auto;
    margin-top: 10px;
    line-height: $row-height;
    display: flex;
    align-items: center;

    .row-title {
      width: 48px;
      margin-right: 20px;
      color: $title-color;
      &.inline {
        margin-left: 20px;
      }
    }
    &.button-container {
      margin-top: 0;
      padding: 10px 20px;
      .total-show {
        margin-left: 10px;
      }
      box-shadow: inset 0 1px 0 0 #e9e9e9, inset 0 0 0 1px #e9e9e9;;
    }
    &.paginator {
      box-shadow: inset 0 1px 0 0 #e9e9e9;
      margin-top: 0;
      padding: 20px;
    }
  }

  .table-container {
    width: 100%;
    flex: 1;
    @include auto-overflow();
  }
}
</style>
