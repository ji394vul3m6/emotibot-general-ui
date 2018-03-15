<template>
  <div id="statistic-dash" class="page">
    <div class="content">
      <div class="statistic-chart" v-for="(chartInfo, index) in chartInfos" :key="chartInfo.name" :class="{'col-2': chartInfo.cols === 2}">
        <div class="statistic-title">{{ chartInfo.name }}</div>
        <div class="statistic-select">
          {{ $t('statistics.selection') }}
          <select :disabled="!chartInfo.finish" v-on:change="selectChange(chartInfo, index)">
            <optgroup v-for="filterType in chartInfo.types" :key="filterType.key" :label="filterType.msg">
              <option v-for="val in [1,7,30]" :key="val" :data-days="val" :data-category="filterType.key">
                {{ filterType.msg }}（{{ val }}{{$t('statistics.day')}}）
              </option>
            </optgroup>
          </select>
        </div>
        <div class="statistic-content">
          <stats-chart v-on:finish="chartInfo.finish=true" v-model="chartInfos[index]"></stats-chart>
        </div>
      </div>
      <div class="statistic-chart" v-for="(tableInfo, index) in tableInfos" :key="tableInfo.name">
        <div class="statistic-title">{{ tableInfo.name }}</div>
        <div class="statistic-select">
          {{ $t('statistics.selection') }}
          <select :disabled="!tableInfo.finish" v-on:change="tableSelectChange(tableInfo, index)">
            <optgroup v-for="filterType in tableInfo.types" :key="filterType.key" :label="filterType.msg">
              <option v-for="val in [1,7,30]" :key="val" :data-days="val" :data-type="filterType.key">
                {{ filterType.msg }}（{{ val }}{{$t('statistics.day')}}）
              </option>
            </optgroup>
          </select>
        </div>
        <div class="statistic-content">
          <stats-table v-on:finish="tableInfo.finish=true" v-model="tableInfos[index]"></stats-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import VueC3 from 'vue-c3';
import format from '@/utils/js/format';

import StatsChart from './_components/StatsChart';
import StatsTable from './_components/StatsTable';
import API from './_api/statistic';

function getTimeRange(days) {
  const now = new Date();
  const endDate = new Date();
  const startDate = new Date();
  endDate.setDate(now.getDate() - 1);
  startDate.setDate(now.getDate() - days);
  return [startDate, endDate];
}

export default {
  path: 'statistic-dash',
  privCode: 'statistic_dash',
  displayNameKey: 'statistic_dash',
  icon: 'white_dashboard',
  components: {
    VueC3,
    StatsChart,
    StatsTable,
  },
  methods: {
    ...API,
    selectChange(chartInfo) {
      const selectedOpt = window.event.currentTarget.querySelector(':checked');
      chartInfo.param.days = selectedOpt.dataset.days;
      if (selectedOpt.dataset.category) {
        chartInfo.param.category = selectedOpt.dataset.category;
      }
      const range = getTimeRange(selectedOpt.dataset.days);
      const startDate = range[0];
      const endDate = range[1];
      chartInfo.param.t1 = format.dateToString(startDate);
      chartInfo.param.t2 = format.dateToString(endDate);
      chartInfo.finish = false;
      chartInfo.handler.$emit('redraw');
    },
    tableSelectChange(tableInfo) {
      const selectedOpt = window.event.currentTarget.querySelector(':checked');
      tableInfo.param.days = selectedOpt.dataset.days;
      tableInfo.finish = false;
      const range = getTimeRange(selectedOpt.dataset.days);
      const startDate = range[0];
      const endDate = range[1];
      tableInfo.param.t1 = format.dateToString(startDate);
      tableInfo.param.t2 = format.dateToString(endDate);
      tableInfo.tableHandler.$emit('redraw');
    },
    setUpMsgs() {
      const that = this;
      this.chartInfos = [
        {
          handler: new Vue(),
          finish: false,
          name: `${that.$t('statistics.visit_record')}(${that.$t('statistics.time')})`,
          type: 'line',
          param: {
            days: 1,
            type: 'time',
          },
          cols: 2,
          getData: that.getVisitStats2,
          keyMaps: {
            total_asks: that.$t('statistics.total_asks_num'),
            conversations: that.$t('statistics.session_num'),
            unique_users: that.$t('statistics.unique_user'),
          },
          nameKey: 'time_txt',
          customData(datas) {
            return datas.quantities;
          },
          types: [
            {
              msg: that.$t('statistics.time'),
            },
          ],
        },
        {
          handler: new Vue(),
          finish: false,
          name: `${that.$t('statistics.visit_record')}(${that.$t('statistics.dimension')})`,
          type: 'bar',
          param: {
            days: 1,
            type: 'barchart',
            filter: 'category',
            category: 'platform',
          },
          getData: that.getVisitStats2,
          keyMaps: {
            total_asks: that.$t('statistics.total_asks_num'),
          },
          nameKey: 'name',
          wrapWidth: 20,
          customData(datas) {
            datas.forEach((data) => {
              data.total_asks = data.q.total_asks;
            });
            return datas;
          },
          types: [
            {
              key: 'platform',
              msg: that.$t('statistics.platform'),
            },
            {
              key: 'brand',
              msg: that.$t('statistics.brand'),
            },
            {
              key: 'sex',
              msg: that.$t('statistics.sex'),
            },
            {
              key: 'age',
              msg: that.$t('statistics.age'),
            },
            {
              key: 'hobbies',
              msg: that.$t('statistics.hobbies'),
            },
          ],
        },
        {
          handler: new Vue(),
          finish: false,
          name: `${that.$t('statistics.qa_record')}`,
          type: 'bar',
          param: {
            days: 1,
            type: 'barchart',
            filter: 'qtype',
          },
          getData: that.getVisitStats2,
          keyMaps: {
            total_asks: that.$t('statistics.total_asks_num'),
          },
          customData(datas) {
            datas.forEach((data) => {
              data.total_asks = data.q.total_asks;
            });
            return datas;
          },
          nameKey: 'name',
          types: [
            {
              msg: that.$t('statistics.time'),
            },
          ],
        },
      ];
      this.tableInfos = [
        {
          tableHandler: new Vue(),
          finish: false,
          name: `${that.$t('statistics.hot_question')} Top 20`,
          param: {
            days: 1,
            type: 'top',
          },
          getData: that.getTopQuestions2,
          tableColumns: {
            question: {
              text: that.$t('statistics.user_question'),
              width: '240px',
            },
            q: {
              text: that.$t('statistics.count'),
              width: '60px',
            },
          },
          types: [
            {
              msg: that.$t('statistics.time'),
            },
          ],
        },
        {
          tableHandler: new Vue(),
          finish: false,
          name: `${that.$t('statistics.failed_question')} Top 20`,
          param: {
            days: 1,
            type: 'unused',
          },
          getData: that.getTopQuestions2,
          tableColumns: {
            question: {
              text: that.$t('statistics.user_question'),
              width: '240px',
            },
            q: {
              text: that.$t('statistics.count'),
              width: '60px',
            },
          },
          types: [
            {
              msg: that.$t('statistics.time'),
            },
          ],
        },
      ];
      this.chartInfos.forEach((info) => {
        const range = getTimeRange(1);
        info.param.t1 = format.dateToString(range[0]);
        info.param.t2 = format.dateToString(range[1]);
        info.height = 240;
      });
      this.tableInfos.forEach((info) => {
        const range = getTimeRange(1);
        info.param.t1 = format.dateToString(range[0]);
        info.param.t2 = format.dateToString(range[1]);
      });
    },
  },
  data() {
    return {
      chartInfos: [],
      tableInfos: [],
    };
  },
  deactivated() {
    this.chartInfos = [];
    this.tableInfos = [];
  },
  activated() {
  },
  mounted() {
    this.setUpMsgs();
    this.chartInfos.forEach((chartInfo) => {
      chartInfo.handler.$emit('redraw');
    });
    this.tableInfos.forEach((tableInfo) => {
      tableInfo.tableHandler.$emit('redraw');
    });
  },
};
</script>
<style lang="scss" scoped>
@import 'styles/variable.scss';
$row-height: $default-line-height;
$stat-card-height: 300px;

#statistic-dash {
  .content {
    .statistic-chart {
      width: calc(50% - 20px);
      height: $stat-card-height;
      border: 1px solid $page-header-color;
      float: left;
      margin-right: 20px;
      margin-bottom: 20px;
      overflow:hidden;
      background: $chart-bg;
      &.col-2 {
        width: calc(100% - 20px);
      }

      .statistic-title {
        width: 100%;
        line-height: $row-height;
        text-align: left;
        padding: 0 10px;
        background: $table-header-background;
        border-bottom: 1px solid black;
      }
      .statistic-select {
        line-height: $row-height;
        text-align: center;
        select {
          width: 200px;
        }
      }
      .statistic-content {
        height: calc(#{$stat-card-height} - 2 * #{$row-height});
        overflow: auto;
      }
    }
  }
}
</style>
