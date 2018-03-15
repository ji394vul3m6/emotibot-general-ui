<template>
  <div class='stats-chart'>
    <div v-if="errMsg" class="err-msg">
      <!-- <div class="err-title">{{ $t('error_msg.get_stats_error') }}</div> -->
      <div class="err-detail">{{ errMsg }} </div>
    </div>
    <div v-if="!showLoading && errMsg === ''" class="table">
      <table style="table-layout: fixed">
        <tr>
          <td v-for="key in Object.keys(value.tableColumns)" :key="key" :style="{maxWidth: value.tableColumns[key].width, minWidth: value.tableColumns[key].width}">
            {{ value.tableColumns[key].text || value.tableColumns[key] }}
          </td>
        </tr>
        <tr v-for="data in this.data" :key="data.rank">
          <td v-for="key in Object.keys(value.tableColumns)" :key="key" :style="{maxWidth: value.tableColumns[key].width, minWidth: value.tableColumns[key].width}" :class="{wrap: value.tableColumns[key].wrap}">
            {{ data[key] }}
          </td>
        </tr>
        <tr v-if="this.data.length <= 0">
          <td :colspan="Object.keys(value.tableColumns).length" class="table-content-empty-row">
            {{ $t('error_msg.empty_data') }}
          </td>
        </tr>
      </table>
    </div>
    <div v-if="showLoading" class="loading">
      {{ $t('general.loading') }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      data: [],
      errMsg: '',
    };
  },
  methods: {
    updateChart() {
    },
    getAjaxData() {
      this.errMsg = '';
      this.value.getData(this.value.param).then((res) => {
        if (res) {
          this.data = this.value.customData ? this.value.customData(res.data) : res.data;
          this.updateChart();
        } else {
          this.errMsg = this.$t('error_msg.data_not_ready');
        }
        this.$emit('finish');
      }, (err) => {
        this.errMsg = err.message;
        this.$emit('finish');
      });
    },
    getCsvData() {
      const that = this;
      const keys = Object.keys(that.value.tableColumns);
      let output = '';
      output += `${keys.map(key => that.value.tableColumns[key].text || that.value.tableColumns[key]).join(',')}\n`;

      that.data.forEach((row) => {
        output += `"${keys.map((key) => {
          if (typeof row[key] === 'string') {
            return row[key].replace(/"/g, '""');
          }
          return row[key];
        }).join('","')}"\n`;
      });
      return output;
    },
  },
  computed: {
    showLoading() {
      return this.errMsg === '' && !this.data;
    },
  },
  mounted() {
    this.getAjaxData();
    this.value.tableHandler.$on('redraw', () => {
      this.data = undefined;
      this.getAjaxData();
    });
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';
$row-height: $default-line-height;
$stat-card-height: 300px;

.stats-chart {
  overflow-x: hidden;
  height: 100%;
  position: relative;
  .loading {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .err-msg {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .err-title {
      font-size: 2em;
    }
  }
  .hide {
    display: none;
  }
  .table {
    text-align: center;
    min-width: 95%;
    max-width: 95%;
    margin: 0 auto;
    table {
      border-collapse: collapse;
      margin: 0 auto;
      tr {
        td {
          word-break: break-all;
          border: 1px solid $page-header-color;
          padding: 5px 10px;
        }

        &:first-child {
          background: $page-header-color;
          color: white;
        }
      }
    }
  }
}
</style>
