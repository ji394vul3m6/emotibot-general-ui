<template>
  <div class="content card h-fill w-fill">
    <div v-if="isClustering" id="cluster-loading">
      <loading-line></loading-line>
      <div id="clustering-msg">{{ $t('statistics.clustering_msg', { num: clusteringCnt } ) }}</div>
    </div>
    <template v-else>
    <div class="page-header">
      {{ $t('pages.statistics.statistic_daily') }}
      <icon iconType="info" :size="16" enableHover v-tooltip="pageInfoTooltip"></icon>
    </div>
    <div class="header">
      <div class="filter-rows">
        <div class="row">
          <div class="row-title">{{ $t('statistics.time_range') }}</div>
          <div class="row-value">
            <label-switch class="switch" :options="timeOption" v-model="dayRange" @change="setUpTime"></label-switch>
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
        </div>
        <template v-if="expertMode">
        <div class="row">
          <div class="row-title">{{ $t('statistics.user_id') }}</div>
          <div class="row-value">
            <input class="single-input" v-model="userID">
          </div>
          <div class="row-title">{{ $t('statistics.emotions.title') }}</div>
          <div class="row-value">
            <dropdown-select class="single-input"
              :options="emotionOptions" multi v-model="emotionFilters"
              :placeholder="$t('general.please_choose')"/>
          </div>
        </div>
        <div class="row">
          <div class="row-title">{{ $t('statistics.qtypes.title') }}</div>
          <div class="row-value">
            <dropdown-select class="single-input"
              :options="qtypesOptions" v-model="qtypeFilters"/>
          </div>
          <div class="row-title">{{ $t('statistics.platform.title') }}</div>
          <div class="row-value">
            <dropdown-select class="single-input"
              :options="platformOptions" multi v-model="platformFilters"
              :placeholder="$t('general.please_choose')"/>
          </div>
        </div>
        <div class="row">
          <div class="row-title">{{ $t('statistics.sex.title') }}</div>
          <div class="row-value">
            <dropdown-select class="single-input"
              :options="genderOptions" v-model="genderFilters"/>
          </div>
          <div class="row-title">{{ $t('statistics.ignore.title') }}</div>
          <div class="row-value">
            <dropdown-select class="single-input"
              :options="ignoreOptions" v-model="ignoreFilters"/>
          </div>
        </div>
        <div class="row">
          <div class="row-title">{{ $t('statistics.mark.title') }}</div>
          <div class="row-value">
            <dropdown-select class="single-input"
              :options="markOptions" v-model="markFilters"/>
          </div>
          <div class="row-title">{{ $t('statistics.keyword_search') }}</div>
          <div class="row-value">
            <div class="input">
              <search-input v-model="keyword" fill/>
            </div>
          </div>
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
    <div class="button-container">
      <text-button v-if="canExport"
        v-on:click="doExport()"
        :disabled="!validFormInput"
        :button-type="totalCount > 0 ? 'default' : 'disable'">
        {{ $t('general.export') }}</text-button>
      <text-button
        :button-type="totalCount > 0 && hasCheckedDataRow ? 'primary' : 'disable'"
        @click="doIgnore(checkedDataRow)">
        {{ $t('statistics.ignore.batch_ignore') }}</text-button>
      <text-button
        :button-type="totalCount > 0 && hasCheckedDataRow ? 'primary' : 'disable'"
        @click="popSelfLearnMark(checkedDataRow)">
        {{ $t('statistics.mark.batch_mark') }}</text-button>
      <div id="clusterBtn" ref="clusterBtn" :class="{'disabled': totalCount <= 0}" v-dropdown="clusterDropdown">
        <text-button  
          icon-type="header_dropdown_white" :icon-size="8" icon-align="right"
          :button-type="totalCount > 0 ? 'primary' : 'disable'"
          >
          {{ $t('statistics.cluster.title') }}</text-button>
      </div>
      <icon iconType="info" :size="16" v-tooltip="clusterTooltip" enableHover></icon>
      <div v-if="totalCount > 0" class="total-show">
        {{ $t('statistics.total_records', {num: totalCount, count: checkedDataRowCount }) }}
      </div>
    </div>
    <template v-if="showTable">
      <div class="table-container">
        <general-table
          :tableHeader="headerInfo"
          :tableData="tableData"
          :showEmptyMsg="[$t('general.no_search_data')]"
          @checkedChange="handleCheckedChange"
          auto-height show-empty checkbox
        ></general-table>
      </div>
      <div class="paginator">
        <v-pagination v-if="showPagination"
          size="small"
          :pageIndex="pageIndex"
          :pageSizeOption="[25, 50, 100, 200, 500, 1000]"
          v-on:page-change="doSearch"
          @page-size-change="handlePageSizeChange" 
          :total="totalCount"
          :page-size="pageLimit"
          :layout="['prev', 'pager', 'next', 'sizer', 'jumper']">
        </v-pagination>
      </div>
    </template>

    </template>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import event from '@/utils/js/event';
import GeneralTable from '@/components/GeneralTable';
import DatetimePicker from '@/components/DateTimePicker';
import DropdownSelect from '@/components/DropdownSelect';
import pickerUtil from '@/utils/vue/DatePickerUtil';

import misc from '@/utils/js/misc';
import tagAPI from '@/api/tagType';
import auditAPI from '@/api/audit';
import api from './_api/selflearn';
import VIEW from './_data/dailyView';
import dailyMixin from './_store/dailyMixin';

export default {
  path: 'statistic-daily',
  privCode: 'statistic_daily',
  displayNameKey: 'statistic_daily',
  icon: 'white_daily',
  name: 'statistic-daily',
  components: {
    DatetimePicker,
    GeneralTable,
    DropdownSelect,
  },
  api: [tagAPI, api, auditAPI],
  mixins: [dailyMixin],
  data() {
    return {
      isMount: false, // use to prevent trigger doSearch in activated hook

      isClustering: false,
      clusteringCnt: 0,
      clusterTimer: undefined,

      expertMode: false,
      start: pickerUtil.createDateObj(),
      end: pickerUtil.createDateObj(),

      headerInfo: [],
      tableData: [],
      tableAction: [],
      actionInfo: this.$t('statistics.action_info'),
      checkedDataRow: [],

      showTable: false,
      totalCount: 0,
      markedCount: 0,
      ignoredCount: 0,
      enableClusterSize: 100, // const, only allow cluster if data is more than this num

      searchParams: undefined,
      keyword: '',
      userID: '',
      startValidity: true,
      endValidity: true,
      pageIndex: 1,
      pageLimit: 25,
      startDisableDate: undefined,
      endDisableDate: undefined,
      emotionOptions: [
        { value: 'angry', text: this.$t('statistics.emotions.angry') },
        { value: 'not_satisfied', text: this.$t('statistics.emotions.not_satisfied') },
        { value: 'satisfied', text: this.$t('statistics.emotions.satisfied') },
        { value: 'neutral', text: this.$t('statistics.emotions.neutral') },
      ],
      qtypesOptions: [
        { value: '', text: this.$t('statistics.qtypes.all') },
        { value: 'business', text: this.$t('statistics.qtypes.business') },
        { value: 'chat', text: this.$t('statistics.qtypes.chat') },
        { value: 'other', text: this.$t('statistics.qtypes.other') },
      ],
      platformOptions: [
        { value: 'weixin', text: this.$t('statistics.platform.wechat') },
        { value: 'app', text: this.$t('statistics.platform.app') },
        { value: 'web', text: this.$t('statistics.platform.web') },
        { value: 'ios', text: this.$t('statistics.platform.ios') },
      ],
      genderOptions: [
        { value: '', text: this.$t('statistics.sex.all') },
        { value: '0', text: this.$t('statistics.sex.male') },
        { value: '1', text: this.$t('statistics.sex.female') },
      ],
      ignoreOptions: [
        { value: '', text: this.$t('statistics.ignore.all') },
        { value: 'ignore', text: this.$t('statistics.ignore.ignore') },
        { value: 'not_ignore', text: this.$t('statistics.ignore.not_ignore') },
      ],
      markOptions: [
        { value: '', text: this.$t('statistics.mark.all') },
        { value: 'marked', text: this.$t('statistics.mark.marked') },
        { value: 'not_marked', text: this.$t('statistics.mark.not_marked') },
      ],
      emotionFilters: [],
      qtypeFilters: [''],
      platformFilters: [],
      genderFilters: [''],
      ignoreFilters: [''],
      markFilters: [''],
      timeOption: [
        {
          text: `1${this.$t('statistics.day')}`,
          val: 1,
        },
        {
          text: `7${this.$t('statistics.day')}`,
          val: 7,
        },
        {
          text: `${this.$t('general.custom')}`,
          val: -1,
        },
      ],
      dayRange: 1,
      pageInfoTooltip: {
        msg: this.$t('statistics.tooltip'),
      },
      clusterTooltip: {
        msg: this.$t('statistics.cluster_info'),
      },
      clusterDropdown: {
        width: '330px',
        options: [
          {
            text: this.$t('statistics.cluster_dropdown.by_search', { num: this.totalCount }),
            onclick: this.runCluster,
          },
          {
            text: this.$t('statistics.cluster_dropdown.by_checked'),
            disabled: true,
          },
        ],
      },
    };
  },
  watch: {
    checkedDataRow() {
      const that = this;
      that.reloadClusterDropdown();
    },
  },
  methods: {
    ...mapMutations([
      'setDailyCurrentView',
      'setClusterReport',
    ]),
    escapeRegExp(str) {
      return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
    },
    handlePageSizeChange(pageSize) {
      const that = this;
      that.pageLimit = pageSize;
      that.doSearch(1);
    },
    handleCheckedChange(checked) {
      this.checkedDataRow = checked;
    },
    reloadClusterDropdown() {
      const that = this;
      that.clusterDropdown.options = [];
      if (that.totalCount < that.enableClusterSize) {
        that.clusterDropdown.options.push({
          text: that.$t('statistics.cluster_dropdown.by_search_more', { num: that.totalCount, size: that.enableClusterSize }),
          disabled: true,
        });
      } else {
        that.clusterDropdown.options.push({
          text: that.$t('statistics.cluster_dropdown.by_search', { num: that.totalCount }),
          onclick: that.doClusterBySearch,
        });
      }
      if (that.checkedDataRowCount < that.enableClusterSize) {
        that.clusterDropdown.options.push({
          text: that.$t('statistics.cluster_dropdown.by_checked_more', { num: that.checkedDataRowCount, size: that.enableClusterSize }),
          disabled: true,
        });
      } else {
        that.clusterDropdown.options.push({
          text: that.$t('statistics.cluster_dropdown.by_checked', { num: that.checkedDataRowCount }),
          onclick: that.doClusterByChecked,
        });
      }
      that.$refs.clusterBtn.dispatchEvent(event.createEvent('dropdown-reload'));
    },
    doClusterBySearch() {
      const that = this;
      that.clusteringCnt = that.totalCount;
      that.runCluster(that.searchParams);
    },
    doClusterByChecked() {
      const that = this;
      that.clusteingCnt = that.checkedDataRowCount;
      const param = {
        records: that.checkedDataRow.map(row => row.id),
      };
      that.runCluster(param);
    },
    runCluster(params) {
      const that = this;
      that.$api.startCluster(params)
      .then((reportId) => {
        // Show loading and keep polling till cluster done, and go to cluster page
        that.isClustering = true;
        that.clusterTimer = setInterval(() => {
          that.pollClusterReport(reportId);
        }, 5000);
      })
      .catch((err) => {
        console.log(err);
        const option = {
          data: {
            msg: that.$t('statistics.error.try_cluster_later'),
          },
          buttons: ['ok'],
          ok_msg: that.$t('statistics.error.got_it'),
        };
        that.$popWarn(option);
      });
    },
    pollClusterReport(reportId) {
      console.log('poll cluster report');
      const that = this;
      that.$api.pollClusterReport(reportId)
      .then((report) => {
        console.log({ report });
        if (report.status === -1) { // cluster fail
          that.clearClusterTimer();
          that.$notifyFail(that.$t('statistics.error.cluster_fail'));
        } else if (report.status === 1) { // cluster success
          that.$notify({ text: that.$t('statistics.success.cluster_ok') });
          that.clearClusterTimer();
          that.setDailyCurrentView(VIEW.DAILY_CLUSTER);
          that.setClusterReport(report);
        } // else cluster in progress, do nothing
      })
      .catch(() => {
        that.clearClusterTimer();
        that.$notifyFail(that.$t('statistics.error.cluster_fail'));
      });
    },
    clearClusterTimer() {
      const that = this;
      that.isClustering = false;
      clearInterval(that.clusterTimer);
      that.clusterTimer = undefined;
    },
    setMark(markedQuestion, record, tomark) {
      const that = this;
      that.apiSetMark(that.tableData, markedQuestion, record, tomark)
      .then((table) => {
        that.tableData = table;
      });
    },
    setIgnore(records, ignore) {
      const that = this;
      that.apiSetIgnore(that.tableData, records, ignore)
      .then((table) => {
        that.tableData = table;
      });
    },
    getSearchParam() {
      const params = {
        start_time: this.start.getTimestamp(),
        end_time: this.end.getTimestamp(),
      };
      const that = this;

      // only in expert mode, also use other filter besides time
      if (that.expertMode) {
        // keyword
        if (that.trimmedKeyword) {
          const escapedKeyword = that.escapeRegExp(that.trimmedKeyword);
          params.keyword = escapedKeyword;
        }
        // id
        if (that.trimmedUserID) {
          params.uid = that.trimmedUserID;
        }
        if (that.emotionFilters.length > 0) {
          const group = that.getFilterValue(that.emotionOptions, that.emotionFilters);
          params.emotions = group;
        }
        if (that.qtypeFilters.length > 0) {
          const group = that.getFilterValue(that.qtypesOptions, that.qtypeFilters);
          if (group.length > 0) {
            params.question_types = group;
          }
        }
        if (that.platformFilters.length > 0) {
          const group = that.getFilterValue(that.platformOptions, that.platformFilters);
          params.platforms = group;
        }
        if (that.genderFilters.length > 0) {
          const group = that.getFilterValue(that.genderOptions, that.genderFilters);
          if (group.length > 0) {
            params.genders = group;
          }
        }
        if (that.ignoreFilters.length > 0) {
          const group = that.getFilterValue(that.ignoreOptions, that.ignoreFilters);
          if (group.length > 0) {
            params.is_ignored = group.indexOf('ignore') !== -1;
          }
        }
        if (that.markFilters.length > 0) {
          const group = that.getFilterValue(that.markOptions, that.markFilters);
          if (group.length > 0) {
            params.is_marked = group.indexOf('marked') !== -1;
          }
        }
      }
      return params;
    },
    getFilterValue(option, filter) {
      const group = [];
      option.forEach((opt) => {
        if (filter.indexOf(opt.value) >= 0) {
          if (opt.value === '') { // all
            return;
          }
          group.push(opt.value);
        }
      });
      return group;
    },
    doExport() {
      const that = this;
      const filename = 'record.csv';
      const module = 'statistic-daily';

      if (that.totalCount <= 0) {
        return;
      }

      that.$emit('startLoading');
      that.$api.auditExportLog({
        module,
        filename,
      })
      .then(() => that.$api.exportRecords(that.searchParams))
      .then((data) => {
        const csvData = data;
        const blobData = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvData], { type: 'text/csv' });
        misc.downloadRawFile(blobData, filename);
        that.$emit('endLoading');
      }, () => {
        that.$emit('endLoading');
      });
    },
    doSearch(page) {
      const that = this;
      that.pageIndex = page;
      that.searchParams = this.getSearchParam();
      that.$emit('startLoading');
      that.$api.getRecords(that.searchParams, page, this.pageLimit)
      .then((data) => {
        const res = data;
        that.tableData = that.appendTableDataAction(res.data);
        that.headerInfo = that.receiveAPIHeader(res.table_header);
        that.totalCount = res.total_size;
        that.markedCount = res.marked_size;
        that.ignoredCount = res.ignored_size;
        that.checkedDataRow = []; // clear all checked
        that.reloadClusterDropdown();
        that.$emit('endLoading');
        that.showTable = true;
      })
      .catch((err) => {
        console.log({ err });
        that.$notifyFail(that.$t('statistics.error.search_fail'));
        that.$emit('endLoading');
      });
    },
    receiveAPIHeader(headerData) {
      const that = this;
      headerData.forEach((header) => {
        header.key = header.id;
      });
      headerData.push({
        key: 'action',
        text: that.$t('statistics.action'),
        type: 'action',
        info: that.$t('statistics.action_info'),
      });
      return headerData;
    },
    setUpTime(day) {
      const that = this;
      if (day === -1) {
        return;
      }
      const now = new Date();
      const endDate = new Date();
      const startDate = new Date();
      endDate.setDate(now.getDate());
      startDate.setDate(now.getDate() - day);
      const startDateObj = that.setStartDateObj(startDate);
      const endDateObj = that.setEndDateObj(endDate);
      that.start = startDateObj;
      that.end = endDateObj;
      that.endDisableDate = {
        to: that.start.dateObj,
      };
      that.startDisableDate = {
        from: that.end.dateObj,
      };
      that.$nextTick(() => {
        that.dayRange = day;  // update lable switch after datepicker is updated
      });
    },
    setStartDateObj(d) {
      const startDateObj = pickerUtil.createDateObj();
      startDateObj.dateObj = d;
      pickerUtil.initTimeObj(startDateObj);
      return startDateObj;
    },
    setEndDateObj(d) {
      const endDateObj = pickerUtil.createDateObj();
      endDateObj.dateObj = d;
      pickerUtil.initTimeObj(endDateObj);
      return endDateObj;
    },
    handleStartDateChanged(d) {
      this.dayRange = -1;
      this.start.dateObj = d;
      pickerUtil.initTimeObj(this.start);
      this.endDisableDate = {
        to: this.start.dateObj,
      };
    },
    handleEndDateChanged(d) {
      this.dayRange = -1;
      this.end.dateObj = d;
      pickerUtil.initTimeObj(this.end);
      this.startDisableDate = {
        from: this.end.dateObj,
      };
    },
  },
  computed: {
    ...mapGetters([
      'dailyCurrentView',
    ]),
    hasCheckedDataRow() {
      return this.checkedDataRow.length > 0;
    },
    checkedDataRowCount() {
      return this.checkedDataRow.length;
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
    canExport() {
      return this.$hasRight('export');
    },
    trimmedUserID() {
      return this.userID.trim();
    },
    trimmedKeyword() {
      return this.keyword.trim();
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
    this.$nextTick(() => {
      this.dayRange = 1;  // update lable switch after datepicker is updated
    });
  },
  activated() {
    if (this.isMount) { // activated by mount
      this.isMount = false;
    } else {            // activated by click goback button
      this.showTable = false;
      // Refill keyword
      const lastKeyword = this.keyword;
      this.keyword = '';
      this.$nextTick(() => {
        this.keyword = lastKeyword;
      });
      this.doSearch(1);
    }
  },
  mounted() {
    this.isMount = true;
  },
};
</script>

<style lang="scss" scoped>

#cluster-loading {
  background-color: $color-white;
  @include font-14px();
  color: $color-font-mark;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  #clustering-msg {
    margin-top: 18px;
  }
}
.content {
  display: flex;
  flex-direction: column;
}

.page-header {
  flex: 0 0 60px;
  padding: 0 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid $color-borderline;
  @include font-16px();
  color: $color-font-active;
  display: flex;
  align-items: center;
  .icon {
    margin-left: 6px;
  }
}

.header {
  flex: 0 0 auto;
  display: flex;
  align-items: flex-end;
  padding-right: 20px;
  padding-bottom: 10px;
  box-shadow: inset 0 -1px 0 0 #e9e9e9;
  .filter-rows {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .operation {
    flex: 0 0 auto;
    display: flex;
    margin-bottom: 10px;
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

.row {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  .row-title {
    @include font-14px();
    flex: 0 0 70px;
    margin-right: 10px;
    margin-left: 20px;
  }
  .row-value {
    flex: 0 0 300px;
    display: flex;
    align-items: center;
    .label-switch {
      flex: 0 0 auto;
      margin-right: 5px;
    }
    .datetimepicker{
      margin: 0 5px;
    }
    .input {
      // padding-left: 10px;
      flex: 1;
      display: flex;
    }
    .single-input {
      display: block;
      flex: 1;
    }
  }
}

.button-container {
  flex: 0 0 auto;
  line-height: $default-line-height;
  display: flex;
  align-items: center;
  padding: 20px;
  .total-show:not(:first-child) {
    margin-left: 10px;
    @include font-14px();
  }
  .text-button {
    &:not(:first-child) {
      margin-left: 10px;
    }
    &.disabled {
      pointer-events: none;
    }
  }
  #clusterBtn {
    margin-left: 10px;
    position: relative;
    &.disabled {
      pointer-events: none;
    }
  }
  .icon {
    margin-left: 7px;
  }
}

.table-container {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  @include auto-overflow();
}
.paginator {
  box-shadow: inset 0 1px 0 0 #e9e9e9;
  padding-right: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 0 0 50px;
}

</style>
