<template>
  <div class="statistic-daily">
    <div class="content card h-fill w-fill">
      <div class="header">
        <div class="filter-rows">
          <div class="row">
            <div class="row-title">{{ $t('statistics.keyword_search') }}</div>
            <div class="row-value">
              <!-- <label-switch v-model="keywordType" :options="keywordOption"/> -->
              <div class="input">
                <search-input v-model="keyword" fill/>
              </div>
            </div>
            <div class="row-title">{{ $t('statistics.time_range') }}</div>
            <div class="row-value">
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
          <div class="row">
            <div class="row-title">{{ $t('statistics.user_id') }}</div>
            <div class="row-value">
              <input class="single-input" v-model="userID">
            </div>
          </div>
          <template v-if="expertMode">
          <div class="row">
            <div class="row-title">{{ $t('statistics.emotions.title') }}</div>
            <div class="row-value">
              <dropdown-select class="single-input"
                :options="emotionOptions" multi v-model="emotionFilters"/>
            </div>
            <div class="row-title">{{ $t('statistics.qtypes.title') }}</div>
            <div class="row-value">
              <dropdown-select class="single-input"
                :options="qtypesOptions" multi v-model="qtypeFilters"/>
            </div>
          </div>
          <div class="row dimension">
            <text-button @click="selectDimension">{{ $t('statistics.filter') }}</text-button>
            <div class="tag-types">
              <div class="tag-type" v-for="tagType in tagTypes" :key="tagType.type"
                v-if="!tagType.allChecked && tagType.values.length > 0">
                <div class="tag-name">{{ tagType.text }}</div>
                <div class="tag" v-for="value in tagType.values" :key="value.id"
                  v-if="value.checked">
                  {{ value.text }} 
                </div>
                <div @click="cancelFilter(tagType)" class='cancel-icon'>
                  <icon icon-type="close" :size=10 />
                </div>
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
      <div class="button-container" v-if="canExport || totalCount > 0">
        <text-button v-if="canExport"
          v-on:click="doExport()"
          :disabled="!validFormInput"
          :button-type="totalCount > 0 ? 'normal' : 'disable'">
          {{ $t('general.export') }}</text-button>
        <div v-if="totalCount > 0" class="total-show">
          {{ $t('statistics.total_records', {num: totalCount}) }}
        </div>
      </div>
      <template v-if="showTable">
      <div class="table-container">
        <general-table auto-height show-empty
          :tableData="tableData" :tableHeader="headerInfo"
          font-class="font-12"></general-table>
      </div>
      <div class="paginator">
        <v-pagination v-if="showPagination"
          :pageIndex="pageIndex"
          v-on:page-change="doSearch"
          :total="totalCount"
          :page-size="20"
          :layout="['total', 'prev', 'pager', 'next', 'jumper']">
        </v-pagination>
      </div>
      </template>
    </div>
  </div>
</template>

<script>
import GeneralTable from '@/components/GeneralTable';
import DatetimePicker from '@/components/DateTimePicker';
import DropdownSelect from '@/components/DropdownSelect';
import pickerUtil from '@/utils/vue/DatePickerUtil';

import DimensionSelector from '@/components/DimensionSelector';

// import i18nUtil from '@/utils/i18nUtil';
// import general from '@/utils/general';
// import auth from '@/auth';
import misc from '@/utils/js/misc';
import tagAPI from '@/api/tagType';
import auditAPI from '@/api/audit';
import CategoryList from '../FAQ/_data/categoryList';
import api from './_api/statistic';
import ChatRecordPop from './_components/ChatRecordPop';

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
  data() {
    return {
      expertMode: false,
      tagTypes: [],
      start: pickerUtil.createDateObj(),
      end: pickerUtil.createDateObj(),
      categoryList: [],
      headerInfo: [],
      showTable: false,
      totalCount: 0,
      keywordType: 'question',
      keyword: '',
      userID: '',
      startValidity: true,
      endValidity: true,
      pageIndex: 1,
      startDisableDate: undefined,
      endDisableDate: undefined,
      // keywordOption: [
      //   { val: 'all', text: this.$t('general.all') },
      //   { val: 'question', text: this.$t('general.question') },
      //   { val: 'answer', text: this.$t('general.answer') },
      // ],
      emotionOptions: [
        { value: 'angry', text: this.$t('statistics.emotions.angry') },
        { value: 'not_satisfied', text: this.$t('statistics.emotions.not_satisfied') },
        { value: 'satisfied', text: this.$t('statistics.emotions.satisfied') },
        { value: 'neutral', text: this.$t('statistics.emotions.neutral') },
      ],
      qtypesOptions: [
        { value: 'business', text: this.$t('statistics.qtypes.business') },
        { value: 'chat', text: this.$t('statistics.qtypes.chat') },
        { value: 'other', text: this.$t('statistics.qtypes.other') },
      ],
      emotionFilters: [],
      qtypeFilters: [],
    };
  },
  methods: {
    escapeRegExp(str) {
      return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
    },
    selectDimension() {
      const that = this;
      const tagTypes = JSON.parse(JSON.stringify(this.tagTypes));
      that.$pop({
        title: that.$t('qatest.filter_dimension'),
        component: DimensionSelector,
        data: tagTypes,
        callback: {
          ok() {
            tagTypes.forEach((tagType, idx) => {
              that.tagTypes[idx].allChecked = tagType.allChecked;
              tagType.values.forEach((value, valueIdx) => {
                that.tagTypes[idx].values[valueIdx].checked = value.checked;
              });
            });
          },
        },
      });
    },
    cancelFilter(categoryType) {
      categoryType.allChecked = true;
      categoryType.values.forEach((value) => {
        value.checked = false;
      });
    },
    getSearchParam() {
      const params = {
        start_time: this.start.getTimestamp(),
        end_time: this.end.getTimestamp(),
        filter: {},
      };
      const that = this;

      if (that.trimmedKeyword) {
        const escapedKeyword = that.escapeRegExp(that.trimmedKeyword);
        params.filter.contains = {
          type: that.keywordType,
          text: escapedKeyword,
        };
      }

      if (that.trimmedUserID) {
        params.filter.uid = that.trimmedUserID;
      }

      if (that.expertMode) {
        // only in export mode, filter with dimension, emotion and qtype
        this.tagTypes.forEach((tagType) => {
          if (!tagType.allChecked) {
            const filter = tagType.values.reduce((ret, value) => {
              if (value.checked) {
                ret.push({
                  id: value.id,
                  text: value.text,
                });
              }
              return ret;
            }, []);
            if (!params.filter.categories) {
              params.filter.categories = [];
            }

            const filterObj = {
              group: filter,
              type: tagType.type,
            };
            params.filter.categories.push(filterObj);
          }
        });

        // is emotion filter is set
        if (that.emotionFilters.length > 0) {
          const group = [];
          that.emotionOptions.forEach((opt) => {
            if (that.emotionFilters.indexOf(opt.value) >= 0) {
              group.push({
                id: opt.value,
                text: opt.text,
              });
            }
          });
          params.filter.emotions = [{
            type: 'emotion',
            group,
          }];
        }

        // is qtype filter is set
        if (that.qtypeFilters.length > 0) {
          const group = [];
          that.qtypesOptions.forEach((opt) => {
            if (that.qtypeFilters.indexOf(opt.value) >= 0) {
              group.push({
                id: opt.value,
                text: opt.text,
              });
            }
          });
          params.filter.qtypes = [{
            type: 'qtype',
            group,
          }];
        }
      }
      return params;
    },
    doExport() {
      const params = this.getSearchParam();
      const that = this;
      const filename = 'record.csv';
      const module = 'statistic-daily';

      if (that.totalCount <= 0) {
        return;
      }

      params.export = true;
      that.$emit('startLoading');
      that.$api.auditExportLog({
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
      const that = this;
      const origCategory = JSON.parse(JSON.stringify(category.categories));
      that.$pop({
        title: that.$t('qatest.filter_dimension'),
        component: DimensionSelector,
        data: category.categories,
        callback: {
          cancel() {
            category.categories = origCategory;
          },
        },
        custom_button: [{
          msg: that.$t('general.reset'),
          event: 'reset',
        }],
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
      this.startDisableDate = {
        from: this.end.dateObj,
      };
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
  },
  mounted() {
    const that = this;
    that.$emit('startLoading');
    const msg = this.$i18n.messages[this.$i18n.locale];
    that.categoryList = CategoryList.getLocaleData(msg);
    that.$api.getTagTypes().then((data) => {
      that.categoryList[0].categories = data;
      that.tagTypes = data;
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

@mixin daily-dimension() {
  padding: 0 20px;
  padding-top: 10px;
  .tag-types {
    padding-left: 10px;
    display: flex;
  }
  .tag-type {
    border: solid 1px #e9e9e9;
    color: #666666;
    display: flex;
    padding: 8px;
    margin-left: 10px;
    .tag-name {
      &:after {
        content: ":";
        padding-right: 5px;
      }
    }
    .tag {
      &:not(:last-child) {
        padding-right: 5px;
      }
    }
    .cancel-icon {
      @include click-button();
    }
  }
}

.statistic-daily {
  .content {
    padding-top: 20px;
    display: flex;
    flex-direction: column;
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
      flex: 0 0 60px;
      margin-right: 10px;
      margin-left: 20px;
    }
    .row-value {
      flex: 0 0 350px;
      display: flex;
      align-items: center;
      .label-switch {
        flex: 0 0 auto;
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

    &.dimension {
      @include daily-dimension();
    }

    input {
      padding: 5px;
    }
  }

  .button-container {
    flex: 0 0 auto;

    line-height: $default-line-height;
    display: flex;
    align-items: center;
    padding: 10px 20px;
    box-shadow: inset 0 -1px 0 0 #e9e9e9;
    .total-show:not(:first-child) {
      margin-left: 10px;
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
    padding:20px 15px;

    display: flex;
    justify-content: flex-end;
    flex: 0 0 auto;
  }
}
</style>
