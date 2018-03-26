<template>
  <div class="statistic-audit">
    <div class="content">
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
      </div>
      <div class="row">
        <div class="row-title">{{ $t('statistics.user_id') }}</div>
        <input v-model="userNick">
      </div>
      <div class="row">
        <div class="row-title">{{ $t('statistics.audit.op_module') }}</div>
        <label-switch :options="listToOptions(moduleList)" v-model="selectModule"/>
        <!-- <select v-model="selectModule">
          <option v-for="(mod, key) in moduleList" :value="key" :key="key">{{mod}}</option>
        </select> -->
      </div>
      <div class="row">
        <div class="row-title">{{ $t('statistics.audit.op_type') }}</div>
        <label-switch :options="listToOptions(actionList)" v-model="selectAction"/>
        <!-- <select v-model="selectAction">
          <option v-for="(action, key) in actionList" :value="key" :key="key">{{action}}</option>
        </select> -->
      </div>
      <div class="row" v-if="!validTimeRange">
        <label class="error_msg">{{ $t('error_msg.time_range_error') }}</label>
      </div>
      <div class="button-container row">
        <text-button v-on:click="doSearch(1)" :disabled="!validFormInput" main>{{ $t('general.search') }}</text-button>
        <!-- <div v-on:click="doSearch(1)" class="text-button primary" :class="{disabled: !validFormInput}">
          {{ $t('general.search') }}
        </div> -->
        <text-button v-if="canExport"
          v-on:click="doExport()"
          :disabled="!validFormInput">{{ $t('general.export') }}</text-button>
        <!-- <div v-on:click="doExport()" class="text-button" v-if="canExport" :class="{disabled: !validFormInput}">
          {{ $t('general.export') }}
        </div> -->
      </div>
      <div class="table-container">
        <general-table v-if="showTable" :contents="tableData" :headerInfo="headerInfo"></general-table>
      </div>
      <div class="row">
        <v-pagination v-if="showPagination" :pageIndex="pageIndex" v-on:page-change="doSearch" :total="totalCount" :page-size="20" :layout="['total', 'prev', 'pager', 'next', 'jumper']"></v-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { VTable, VPagination } from 'vue-easytable';
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
  components: {
    DatetimePicker,
    GeneralTable,
    LabelSwitch,
    'v-table': VTable,
    'v-pagination': VPagination,
  },
  methods: {
    ...api,
    ...auditAPI,
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
          module: that.selectModule,
          operation: that.selectAction,
        },
        export: true,
      };
      if (that.userNick) {
        params.filters.uid = that.userNick;
      }
      that.$emit('startLoading');

      that.auditExportLog({
        module,
        filename,
      }).then(() => that.getAuditLog(params)).then((data) => {
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
          module: that.selectModule,
          operation: that.selectAction,
        },
        page,
      };
      if (that.userNick) {
        params.filters.uid = that.userNick;
      }

      that.$emit('startLoading');
      that.getAuditLog(params).then((data) => {
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
      datas.forEach((data) => {
        data.create_time = moment(data.create_time).format(timeFormatFull);
      });
      return datas;
    },
    mapCodeToString(datas) {
      const resultMap = this.headerInfo.find(obj => obj.key === 'result').map;
      datas.forEach((data) => {
        data.result = resultMap[data.result];
        data.module = this.moduleList[data.module];
        data.operation = this.actionList[data.operation];
      });
      return datas;
    },
    setUpMsg() {
      const that = this;
      that.headerInfo = [
        {
          text: that.$t('statistics.audit.user_id'),
          key: 'user_id',
          type: 'text',
          wrap: true,
          width: '10%',
        },
        {
          text: that.$t('statistics.audit.op_module'),
          key: 'module',
          type: 'map-text',
          map: this.moduleList,
          width: '10%',
        },
        {
          text: that.$t('statistics.audit.op_type'),
          key: 'operation',
          type: 'map-text',
          map: this.actionList,
          width: '10%',
        },
        {
          text: that.$t('statistics.audit.content'),
          key: 'content',
          type: 'raw-text',
          wrap: true,
          width: '40%',
        },
        {
          text: that.$t('statistics.audit.result'),
          key: 'result',
          type: 'map-text',
          map: {
            0: that.$t('general.fail'),
            1: that.$t('general.success'),
          },
          width: '10%',
        },
        {
          text: that.$t('statistics.audit.create_time'),
          key: 'create_time',
          type: 'text',
          width: '10%',
        },
        {
          text: that.$t('statistics.audit.ip_source'),
          key: 'user_ip',
          type: 'text',
          width: '10%',
        },
      ];
    },
  },
  data() {
    return {
      start: pickerUtil.createDateObj(),
      end: pickerUtil.createDateObj(),
      userNick: '',
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
      headerInfo: [],
      showTable: false,
      i18n: undefined,
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
  mounted() {
    this.setUpMsg();
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

.statistic-audit {
  select {
    height: $row-height;
    font-size: 1em;
    min-width: 6em;
  }

  input {
    height: $row-height;
    font-size: 1em;
  }

  .filter-btn-container {
    .text-button {
      width: auto;
      margin-right: 20px;
    }
  }

  .row {
    margin: 5px 0;
    line-height: $row-height;
    display: flex;
    align-items: center;

    .row-title {
      display: inline-block;
      margin-right: 20px;
    }
  }
}

.table-container {
  width: 100%;
}
</style>
