<template>
  <div class="statistic-daily">
    <div class="content">
      <div class="row">
        <div class="row-title">{{ $t('statistics.keyword_search') }}</div>
        <label-switch v-model="keywordType" :options="keywordOption"/>
        <input v-model="keyword">
      </div>
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
        <input v-model="userID">
      </div>
      <div class="filter-btn-container row">
        {{ $t('statistics.filter') }}：
        <text-button v-on:click="popCategorySelect(category)" v-for="category in categoryList" :key="category.text">{{category.text}}</text-button>
      </div>
      <div class="filter-list row">
        <template v-for="category in categoryList">
        <template v-for="categoryType in category.categories" v-if="!categoryType.allChecked">
          <div class="filter-item" v-for="value in categoryType.values" v-if="value.checked" :key="value.text">
            <span class="filter-item-text">
              {{value.text}}
              <span v-on:click="cancelFilter(categoryType, value)" class="filter-item-cancel">
                x
              </span>
            </span>
          </div>
        </template>
        </template>
        <span v-on:click="cancelAllFilter()" class="clear-all" v-if="!noDimensionSelected">{{ $t('qatest.clear_all') }}</span>
      </div>
      <div class="row" v-if="!validTimeRange">
        <label class="error_msg">{{ $t('error_msg.time_range_error') }}</label>
      </div>
      <div class="button-container row">
        <text-button v-on:click="doSearch(1)" :disabled="!validFormInput" main>{{ $t('general.search') }}</text-button>
        <text-button v-if="canExport"
          v-on:click="doExport()"
          :disabled="!validFormInput">{{ $t('general.export') }}</text-button>
      </div>
      <div>
        <general-table v-if="showTable" :contents="tableData" :headerInfo="headerInfo"></general-table>
        <v-pagination v-if="showPagination" :pageIndex="pageIndex" v-on:page-change="doSearch" :total="totalCount" :page-size="20" :layout="['total', 'prev', 'pager', 'next', 'jumper']">
        </v-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import 'vue-easytable/libs/themes-base/index.css';
import { VTable, VPagination } from 'vue-easytable';
import GeneralTable from '@/components/GeneralTable';
import DatetimePicker from '@/components/DateTimePicker';
import LabelSwitch from '@/components/basic/LabelSwitch';
import pickerUtil from '@/utils/vue/DatePickerUtil';

import DimensionSelector from '@/components/DimensionSelector';

// import i18nUtil from '@/utils/i18nUtil';
// import general from '@/utils/general';
// import auth from '@/auth';
import misc from '@/utils/js/misc';
import tagAPI from '@/api/tagType';
import auditAPI from '@/api/audit';
import CategoryList from '../SSM/_data/categoryList';
import api from './_api/statistic';
import ChatRecordPop from './_components/ChatRecordPop';

export default {
  path: 'statistic-daily',
  privCode: 'statistic_daily',
  displayNameKey: 'statistic_daily',
  icon: 'white_daily',
  name: 'statistic-daily',
  components: {
    LabelSwitch,
    DatetimePicker,
    GeneralTable,
    'v-table': VTable,
    'v-pagination': VPagination,
  },
  api: [tagAPI, api, auditAPI],
  data() {
    return {
      start: pickerUtil.createDateObj(),
      end: pickerUtil.createDateObj(),
      categoryList: [],
      headerInfo: [],
      showTable: false,
      totalCount: 0,
      keywordType: 'all',
      keyword: '',
      userID: '',
      startValidity: true,
      endValidity: true,
      pageIndex: 1,
      startDisableDate: undefined,
      endDisableDate: undefined,
      keywordOption: [
        { val: 'all', text: this.$t('general.all') },
        { val: 'question', text: this.$t('general.question') },
        { val: 'answer', text: this.$t('general.answer') },
      ],

    };
  },
  methods: {
    cancelFilter(categoryType, value) {
      value.checked = false;
      const allChecked = categoryType.values.reduce((ret, val) => val.checked && ret, true);
      const allNotChecked = categoryType.values.reduce((ret, val) => !val.checked && ret, true);
      categoryType.allChecked = allChecked || allNotChecked;
    },
    getSearchParam() {
      const params = {
        start_time: this.start.getTimestamp(),
        end_time: this.end.getTimestamp(),
        filter: {},
      };
      const that = this;

      if (that.trimmedKeyword) {
        params.filter.contains = {
          type: that.keywordType,
          text: that.trimmedKeyword,
        };
      }

      if (that.trimmedUserID) {
        params.filter.uid = that.trimmedUserID;
      }

      this.categoryList.forEach((dimension) => {
        dimension.categories.forEach((category) => {
          if (!category.allChecked) {
            const filter = category.values.reduce((ret, value) => {
              if (value.checked) {
                ret.push({
                  id: value.id,
                  text: value.text,
                });
              }
              return ret;
            }, []);
            if (!params.filter[dimension.key]) {
              params.filter[dimension.key] = [];
            }

            const filterObj = {
              group: filter,
              type: category.type,
            };

            params.filter[dimension.key].push(filterObj);
          }
        });
      });
      return params;
    },
    doExport() {
      const params = this.getSearchParam();
      const that = this;
      const filename = 'record.csv';
      const module = 'statistic-daily';

      params.export = true;
      that.$emit('startLoading');
      that.auditExportLog({
        module,
        filename,
      }).then(() => that.$api.getRecords(params)).then((data) => {
        const csvData = data.data;
        const blobData = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvData], { type: 'text/csv' });
        misc.downloadRawFile(blobData, filename);
        that.$emit('endLoading');
      }, () => {
        that.$emit('endLoading');
      });
    },
    doSearch(page) {
      this.pageIndex = page;
      const params = this.getSearchParam();
      const that = this;

      params.page = page;
      that.$emit('startLoading');
      that.$api.getRecords(params).then((data) => {
        const res = data.data;
        that.tableData = that.receiveAPIData(res.data);
        that.headerInfo = that.receiveAPIHeader(res.table_header);
        that.totalCount = res.total_size;
        that.$emit('endLoading');
        that.showTable = true;
      }, () => {
        that.$emit('endLoading');
      });
    },
    popCategorySelect(category) {
      const origCategory = JSON.parse(JSON.stringify(category.categories));
      this.$pop({
        component: DimensionSelector,
        data: category.categories,
        callback: {
          cancel() {
            category.categories = origCategory;
          },
        },
      });
    },
    receiveAPIData(datas) {
      return datas;
    },
    receiveAPIHeader(headerData) {
      // TODO bfb output format with appid
      const showCols = ['user_id', 'user_q', 'std_q', 'created_time', 'score', 'emotion', 'qtype'];
      const nowrapCols = ['user_q', 'created_time', 'platform', 'qtype', 'brand', 'sex', 'age', 'hobbies'];
      const that = this;
      const showHeaders = [];
      headerData.forEach((header) => {
        header.key = header.id;

        if (header.key === 'user_q') {
          header.type = 'clickable-text';
          header.callback = that.showContinueRecords;
        } else {
          header.type = 'text';
        }

        if (header.key === 'brand') {
          header.text = that.$t('statistics.brand');
        }

        if (nowrapCols.indexOf(header.key) >= 0) {
          header.wrap = false;
        } else {
          header.wrap = true;
        }

        if (showCols.indexOf(header.key) >= 0) {
          showHeaders.push(header);
        }
      });
      return showHeaders;
    },
    showContinueRecords(record) {
      const param = {
        unique_id: record.unique_id,
        user_id: record.user_id,
      };
      const that = this;
      that.$emit('startLoading');
      that.$api.getContinueRecords(param).then((data) => {
        that.$emit('endLoading');
        that.$pop({
          data: data.data,
          component: ChatRecordPop,
          buttons: ['ok'],
        });
      }, (err) => {
        that.$popError(that.$t('error_msg.get_stats_error'), err.message);
        that.$emit('endLoading');
      });
    },
    cancelAllFilter() {
      this.categoryList.forEach((subCategory) => {
        subCategory.categories.forEach((category) => {
          category.allChecked = true;
          category.values.forEach((value) => {
            value.checked = false;
          });
        });
      });
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
  },
  computed: {
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
    noDimensionSelected() {
      if (this.categoryList.length > 0) {
        return this.categoryList.reduce((ret2, val2) => {
          if (!ret2) {
            return false;
          }
          if (val2.categories) {
            return ret2 && val2.categories.reduce((ret, val) => ret && val.allChecked, true);
          }
          return false;
        }, true);
      }
      return true;
    },
    canExport() {
      // return auth.checkPrivilege('statistic-daily', 'export');
      return true;
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
  },
  mounted() {
    const that = this;
    that.$emit('startLoading');
    const msg = this.$i18n.messages[this.$i18n.locale];
    that.categoryList = CategoryList.getLocaleData(msg);
    that.$api.getTagTypes().then((data) => {
      that.categoryList[0].categories = data;
    }, (err) => {
      console.log(err);
    }).finally(() => {
      that.$emit('endLoading');
    });
  },
  activated() {
    this.cancelAllFilter();
    pickerUtil.initTime(this);
    this.showTable = false;
    this.totalCount = 0;
    this.$emit('endLoading');
    this.keywordType = 'all';
    this.keyword = '';
    this.userID = '';
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

$main-color: black;
$row-height: $default-line-height;

.statistic-daily {
  .clear-all {
    display: inline-block;
    color: blue;
    text-decoration: underline;
    font-size: 0.8em;
    user-select: none;
    cursor: pointer;
  }
  .filter-list {
    // overwrite the height property of row
    &.row {
      height: auto;
    }
    div {
      display: inline-block;
    }

    .filter-item {
      .filter-item-text {
        padding: 2px 5px;
        margin: 0px 5px;
        border: 1px solid $main-color;
        border-radius: 0.5em;
        background: $main-color;
        color: white;
        cursor: default;
      }
      .filter-item-cancel {
        color: white;
        margin: 0px 5px;
        user-select: none;
        cursor: pointer;
      }
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

    input {
      padding: 5px;
    }
  }
}
</style>
