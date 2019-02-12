<template>
  <div class="statistic-session">
    <div class="card h-fill w-fill session-card">
      <nav-bar :options="pageMap"/>
      <filter-field @search="doSearch(1)">
        <template slot="main-filter">
          <range-picker :name="$t('statistics.sessions_time')" ref="timeRange"/>
        </template>
        <template slot="filters">
          <!-- <search-input v-model="filterSession" :name="$t('statistics.session_id')" /> -->
          <search-input v-model="filterUser" :name="$t('statistics.user_id')" />
          <!-- <range-input :name="$t('statistics.feedback_score')" :min=0 :max=5 :step=1 @input="handleScoreRange"/> -->
          <dropdown-select :name="$t('statistics.feedback_reeason')" width="200px" ref="reasons"/>
          <dimension-select :name="$t('statistics.dimension')" ref="dimension"
            :options="tagInfo" @input="handleDimensionChange"/>
        </template>
      </filter-field>
      <template v-if="tableData !== undefined">
      <div class="action-bar">
        <text-button @click="doExport" v-if="recordNum > 0">{{ $t('general.export') }}</text-button>
        <text-button button-type="disable" v-else>{{ $t('general.export') }}</text-button>
        <div class="action-text">{{ $t('statistics.total_records', {num: recordNum }) }}</div>
      </div>
      <general-scroll-table class="table"
        :table-data="tableData"
        :table-header="tableHeader"
        :action="tableAction"
        allow-custom-header show-empty>
      </general-scroll-table>
      <div class="paginator">
        <v-pagination
          size="small"
          :pageIndex="nowPage"
          :pageSizeOption="constant.tableLimitOption"
          @page-change="doSearch"
          @page-size-change="setLimit"
          :total="recordNum"
          :page-size="nowLimit"
          :layout="constant.tableLayout">
        </v-pagination>
      </div>
      </template>
    </div>
  </div>
</template>

<script>
import FilterField from '@/components/layout/FilterField';
import RangePicker from '@/components/DatetimeRangePicker';
import DropdownSelect from '@/components/DropdownSelect';
import DimensionSelect from '@/components/dropdown/DimensionSelector';
import GeneralScrollTable from '@/components/GeneralScrollTable';
import SearchInput from '@/components/basic/SearchInput';
import RangeInput from '@/components/basic/RangeInput';
import constant from '@/utils/js/constant';
import auditAPI from '@/api/audit';
import tagAPI from '@/api/tagType';
import feedbackAPI from './_api/feedback';
import api from './_api/session';

const STATS_SESSION_EXPORT = '/api/v1/stats/sessions/export';

export default {
  path: 'statistic-session',
  privCode: 'statistic_daily',
  displayNameKey: 'statistic_session',
  name: 'statistic-session',
  api: [api, auditAPI, tagAPI, feedbackAPI],
  components: {
    FilterField,
    RangePicker,
    DropdownSelect,
    SearchInput,
    RangeInput,
    GeneralScrollTable,
    DimensionSelect,
  },
  data() {
    return {
      pageMap: {
        sessions: this.$t('pages.statistics.statistic_session'),
      },
      scoreMin: 1,
      scoreMax: 5,
      scoreOption: [
        { text: 1, value: 1 },
        { text: 2, value: 2 },
        { text: 3, value: 3 },
        { text: 4, value: 4 },
        { text: 5, value: 5 },
      ],

      filterSession: '',
      filterUser: '',

      tableData: undefined,
      tableHeader: undefined,
      tableAction: [
        {
          key: 'view',
          text: this.$t('general.view'),
          type: 'primary',
          onclick: this.showSessionDetail,
          width: '100px',
        },
      ],

      recordNum: 0,
      nowPage: 1,
      nowLimit: 25,
      constant,

      leftColumn: ['session_id'],
      dftShowColumn: ['start_time', 'user_id', 'rating', 'feedback'],
      columnWidth: {
        session_id: '120px',
        start_time: '180px',
        end_time: '180px',
        user_id: '120px',
        rating: '60px',
        feedback: '240px',
      },

      tagInfo: [],
      dimension: {},
      reasons: [],
    };
  },
  methods: {
    setLimit(limit) {
      this.nowLimit = limit;
      this.nowPage = 1;
      this.doSearch(1);
    },
    fixHeaderFormat(headers) {
      const that = this;
      const headerMap = {};
      headers.forEach((header) => {
        headerMap[header.key] = header;
        header.default = false;
        header.width = that.columnWidth[header.key] || '180px';
      });
      that.leftColumn.forEach((col) => {
        headerMap[col].lockedLeft = true;
      });
      that.dftShowColumn.forEach((col) => {
        headerMap[col].default = true;
      });
      return headers;
    },
    getSearchParam() {
      const that = this;
      const range = that.$refs.timeRange.getCurrentValue();
      const filter = {
        start_time: parseInt(range.start.getTime() / 1000, 10),
        end_time: parseInt(range.end.getTime() / 1000, 10),
        // rating_max: that.scoreMax,
        // rating_min: that.scoreMin,
        ...that.dimension,
      };


      if (that.filterUser.trim() !== '') {
        filter.uid = that.filterUser;
      }
      return filter;
    },
    doSearch(page) {
      const that = this;
      that.nowPage = page === undefined ? 1 : page;
      const filter = that.getSearchParam();
      this.$api.getSessionList(that.nowPage, that.nowLimit, filter).then((rsp) => {
        that.tableData = rsp.data;
        that.tableHeader = that.fixHeaderFormat(rsp.table_header);
        that.recordNum = rsp.total_size;
      });
    },
    doExport() {
      const that = this;
      const filename = 'record.csv';
      const module = 'statistic-analysis';
      const filter = that.getSearchParam();

      if (that.recordNum <= 0) {
        return;
      }

      that.$emit('startLoading');
      that.$api.auditExportLog({
        module,
        filename,
      })
      .then(() => that.$api.getSessionExportID(filter).then(data => data.export_id))
      .then((exportID) => {
        const checkStatus = () => {
          that.$api.getExportStatus(exportID).then((data) => {
            if (data.status === 'RUNNING') {
              setTimeout(() => { checkStatus(); }, 1000);
              return;
            }
            if (data.status === 'COMPLETED') {
              const token = window.localStorage.getItem('token');
              window.open(`${STATS_SESSION_EXPORT}/${exportID}?token=Bearer%20${token}`);
            } else {
              that.$notifyFail(`${that.$t('general.export')}${that.$t('general.fail')}`);
            }
          });
        };
        checkStatus();
      })
      .catch((err) => {
        that.$notifyFail(`${that.$t('general.export')}${that.$t('general.fail')}`);
        console.log(err);
      })
      .finally(() => {
        that.$emit('endLoading');
      });
    },
    setupDimension() {
      const that = this;
      that.$api.getTagTypes().then((data) => {
        that.tagInfo = data.map(d => ({
          key: d.type,
          text: d.text,
          values: d.values.map(v => ({
            key: v.id,
            text: v.text,
          })),
        }));
        that.$refs.dimension.$emit('set-option', that.tagInfo);
      });
    },
    showSessionDetail(session) {
      console.log(JSON.stringify(session));
    },
    handleScoreRange(value) {
      this.scoreMin = value.start;
      this.scoreMax = value.end;
    },
    handleDimensionChange(value) {
      this.dimension = value;
    },
    setupFeedbackReason() {
      const that = this;
      that.$api.getFeedbackReasons().then((data) => {
        that.reasons = data.result;
        that.$refs.reasons.$emit('set-option', that.reasons);
      });
    },
  },
  mounted() {
    this.setupDimension();
    this.setupFeedbackReason();
  },
};
</script>

<style lang="scss" scoped>
.session-card {
  display: flex;
  flex-direction: column;

  .action-bar {
    flex: 0 0 50px;
    padding: 20px;

    display: flex;
    align-items: center;
    .action-text {
      margin-left: 20px;
    }
  }
  .table {
    flex: 1;
  }
  .paginator {
    flex: 0 0 50px;

    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
