<template>
  <div id="statistic-dash" class="page">
    <div class="content">
      <div class="statistic-chart" v-for="(chartInfo, index) in chartInfos" :key="chartInfo.name" :class="{'col-2': chartInfo.cols === 2}">
        <div class="statistic-title">{{ chartInfo.name }}</div>
        <div class="statistic-select">
          <div>
            <!-- Used for dimension select -->
            <label-switch
              v-if="chartInfo.types !== undefined"
              :options="typesToOption(chartInfo.types)"
              @change="typeSelectChange(chartInfo, $event)"/>
            <!-- Used for time select -->
            <label-switch
              :options="daysToOptions([1, 7, 30])"
              @change="selectChange(chartInfo, $event)"/>
          </div>
        </div>
        <div class="statistic-content">
          <stats-chart v-on:finish="chartInfo.finish=true" v-model="chartInfos[index]"></stats-chart>
        </div>
      </div>
      <div class="statistic-chart" v-for="(tableInfo, index) in tableInfos" :key="tableInfo.name">
        <div class="statistic-title">{{ tableInfo.name }}</div>
        <div class="statistic-select">
          <label-switch
            :options="daysToOptions([1, 7, 30])"
            @change="selectChange(tableInfo, $event)"/>
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
import LabelSwitch from '@/components/basic/LabelSwitch';
import tagAPI from '@/api/tagType';

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
  api: [tagAPI, API],
  components: {
    VueC3,
    StatsChart,
    StatsTable,
    LabelSwitch,
  },
  methods: {
    typesToOption(types) {
      return types.map(type => ({
        text: type.msg,
        val: type.key,
      }));
    },
    daysToOptions(days) {
      const that = this;
      return days.map(day => ({
        text: `${day} ${that.$t('statistics.day')}`,
        val: day,
      }));
    },
    typeSelectChange(chartInfo, val) {
      chartInfo.param.category = val;
      chartInfo.finish = false;
      chartInfo.handler.$emit('redraw');
    },
    selectChange(chartInfo, val) {
      chartInfo.param.days = val;
      const range = getTimeRange(val);
      const startDate = range[0];
      const endDate = range[1];
      chartInfo.param.t1 = format.dateToString(startDate);
      chartInfo.param.t2 = format.dateToString(endDate);
      chartInfo.finish = false;
      if (chartInfo.handler) {
        chartInfo.handler.$emit('redraw');
      }
      if (chartInfo.tableHandler) {
        chartInfo.tableHandler.$emit('redraw');
      }
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
          getData: that.$api.getVisitStats2,
          keyMaps: {
            total_asks: that.$t('statistics.total_asks_num'),
            conversations: that.$t('statistics.session_num'),
            unique_users: that.$t('statistics.unique_user'),
          },
          nameKey: 'time_txt',
          customData(datas) {
            return datas.quantities;
          },
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
          getData: that.$api.getVisitStats2,
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
          types: that.tagTypes,
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
          getData: that.$api.getVisitStats2,
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
          getData: that.$api.getTopQuestions2,
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
        },
        {
          tableHandler: new Vue(),
          finish: false,
          name: `${that.$t('statistics.failed_question')} Top 20`,
          param: {
            days: 1,
            type: 'unused',
          },
          getData: that.$api.getTopQuestions2,
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
      tagTypes: [],
    };
  },
  deactivated() {
    this.chartInfos = [];
    this.tableInfos = [];
  },
  mounted() {
    const that = this;
    that.$emit('startLoading');
    that.$api.getTagTypes().then((data) => {
      that.tagTypes = data.map(d => ({
        key: d.type,
        msg: d.text,
      }));
      that.setUpMsgs();
    }, (err) => {
      console.log(err);
    })
    .finally(() => {
      that.$emit('endLoading');
    });
    that.chartInfos.forEach((chartInfo) => {
      chartInfo.handler.$emit('redraw');
    });
    that.tableInfos.forEach((tableInfo) => {
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
        text-align: left;
        padding-left: 20px;
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
