<template>
  <div id="audit-robot" class="audit-page">
    <div class="card h-fill w-fill">
      <div id="audit-header">
        <template v-if="isNormalUser">
          <nav-bar class="nav-bar" :options="pageOption"></nav-bar>
        </template>
        <template v-else>
          <nav-bar class="nav-bar" :options="pageOption" v-model="currentPage"></nav-bar>
        </template>
        <div class="back-button">
          <text-button @click="goBack">{{ $t('management.go_back') }}</text-button>
        </div>
      </div>


      <div id="audit-filter">
        <div id="filter-block">
          <div class="row">
            <div class="row-title">{{ $t  ('management.audit.filter_robot') }}</div>
            <div class="row-content">
              <dropdown-select
                v-if="!isSystemAdmin"
                v-model="filterRobot"
                :options="filterRobotOptions"
                :showCheckedIcon="false"
                :placeholder="$t('general.please_choose')"
                width="300px"
              />

              <dropdown-cascader
                v-else
                v-model="filterRobot"
                :options="filterRobotOptions"
                :placeholder="$t('general.please_choose')"
                width="300px"
              />
            </div>
          </div>
          <template v-if="expertMode">
            <div class="row">
              <div class="row-title">{{ $t('management.audit.filter_time') }}</div>
              <div class="row-content">
                <label-switch class="switch" v-model="dayRange"
                  :options="timeOption"
                  @change="setUpTime">
                </label-switch>
                <datetime-picker
                  :value="start"
                  :disableDate="startDisableDate"
                  @dateChanged="handleStartDateChanged"
                  @validityChange="value => {startValidity = value}"
                ></datetime-picker>
                <span>～</span>
                <datetime-picker
                  :value="end"
                  :disableDate="endDisableDate"
                  @dateChanged="handleEndDateChanged"
                  @validityChange="value => {endValidity = value}"
                ></datetime-picker>
              </div>
              <div class="row-title">{{ $t('management.audit.filter_userid') }}</div>
              <div class="row-content">
                <input type="text" v-model="filterUserId">
              </div>
            </div>
            <div class="row">
              <div class="row-title">{{ $t('management.audit.filter_module') }}</div>
              <div class="row-content">
                <dropdown-select
                  v-model="filterModule"
                  :options="filterModuleOptions"
                  :showCheckedIcon="false"
                  :placeholder="$t('general.please_choose')"
                  width="160px"
                  @input="setFilterActionType"
                />
                <dropdown-select
                  v-model="filterActionType"
                  :options="filterActionTypeOptions"
                  :showCheckedIcon="false"
                  :placeholder="$t('general.please_choose')"
                  width="160px"
                />
              </div>
            </div>
          </template>
        </div>
        <div id="filter-operation">
          <text-button button-type="primary" v-on:click="doSearch(1)"
          :disabled="!validFormInput">
            {{ $t('general.search') }}
          </text-button>
          <div @click="expertMode = !expertMode" class="show-more" :class="{more: expertMode}">
            <div class="text">
              {{ $t('statistics.export_mode') }}
            </div>
            <icon class="expand-icon" icon-type="expand" :size=12 />
          </div>
        </div>
      </div> <!-- ./#audit-filter -->
      <div id="audit-result">
        <div id="audit-toolbar">
          <text-button v-if="canExport"
            :button-type="totalLogCount > 0 ? 'default' : 'disable'">
            {{ $t('general.export') }}
          </text-button>
          <div id="audit-log-count">{{ $t('management.audit.total', { num: totalLogCount }) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
// import pickerUtil from '@/utils/vue/DatePickerUtil';
import DatetimePicker from '@/components/DateTimePicker';
import NavBar from '@/components/NavigationBar';
import DropdownCascader from '@/components/basic/DropdownCascader';
import datepickerMixin from './_mixin/datepicker';
import RobotModuleMap from './_mixin/RobotModuleMap';
import operationType from './_mixin/operationType';
import UserType from './_data/UserType';

const auditEnterprisePage = '/manage/audit-enterprise';
const auditSystemPage = '/manage/audit-system';
export default {
  path: 'audit-robot',
  name: 'audit-robot',
  privCode: 'statistic_audit',
  components: {
    NavBar,
    DatetimePicker,
    DropdownCascader,
  },
  mixins: [datepickerMixin, RobotModuleMap, operationType],
  data() {
    return {
      userType: undefined,
      currentPage: 'auditRobot',
      pageOption: {},
      isNormalUser: false,
      isSystemAdmin: false,

      expertMode: false,

      filterRobot: ['hello', 'hello-1'],
      filterRobotOptions: [
        {
          text: '第一層沒選項',
          value: 'first-no-data',
        },
        {
          text: '第一層',
          value: 'first-layer',
          options: [{
            text: '第二層',
            value: 'second-layer',
          }, {
            text: '第二層很長很長很長很長很長很長很長很長很長',
            value: 'seconde-layer-longer',
          }],
        },
        {
          text: '第一層很長很長很長很長很長很長很長很長很長',
          value: 'first-layer-longer',
          options: [{
            text: '第二層-2',
            value: 'second-layer-2',
          }, {
            text: '第二層-2很長很長很長很長很長很長很長很長很長',
            value: 'seconde-layer-longer2',
          }],
        },
        {
          text: '哈囉你好嗎',
          value: 'hello',
          options: [{
            text: '哈囉第一個',
            value: 'hello-1',
          }, {
            text: '哈囉第二個',
            value: 'hello-2',
          }, {
            text: '哈囉第三個',
            value: 'hello-3',
          }, {
            text: '哈囉第四個',
            value: 'hello-4',
          }, {
            text: '哈囉第五個很長很長很長很長很長',
            value: 'hello-5',
          }],
        },
        {
          text: '再來一組',
          value: 'onemore',
          options: [{
            text: '更多',
            value: 'more more',
          }],
        },
        {
          text: '超過scrollbar!!',
          value: 'scroll!',
          options: [{
            text: 'Scrolled?',
            value: 'scrolled',
          }],
        },
      ],
      filterUserId: '',
      filterModule: [],
      filterModuleOptions: [],
      filterActionType: [],
      filterActionTypeOptions: [],

      dayRange: 1,

      totalLogCount: 0,

      pageIdx: 1,
      pageLimit: 25,
    };
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'robotList',
      'robotID',
      'enterpriseList',
      'enterpriseID',
      'privilegeList',
      'privilegeMap',
    ]),
    canExport() {
      return this.$hasRight('export');
    },
  },
  watch: {
    currentPage(val) {
      if (val === 'auditEnterprise') {
        this.$router.push(auditEnterprisePage);
      } else if (val === 'auditSystem') {
        this.$router.push(auditSystemPage);
      }
    },
    expertMode(val) {
      if (val) {
        this.initDatetimePicker();
      }
    },
  },
  methods: {
    goBack() {
      this.$router.back(); // history forward 1 page
    },
    doSearch(page) {
      const that = this;
      that.pageIdx = page;
      const searchParams = that.getSearchParams();
      console.log({ searchParams });
    },
    getSearchParams() {
      const that = this;
      const params = {
        page: that.pageIdx,
        limit: that.pageLimit,
        start_time: that.start.getTimestamp(),
        end_time: that.end.getTimestamp(),
      };

      if (that.userType !== UserType.SYSTEM_ADMIN) {
        params.enterprise_id = that.enterpriseID;
        params.robot_id = that.filterRobot;
      } else {
        params.enterprsie_id = that.filterRobot[0];
        params.robot_id = that.filterRobot[1];
      }
      if (that.expertMode) {
        that.filterUserId = that.filterUserId.trim();
        if (that.filterUserId !== '') {
          params.user_id = that.filterUserId;
        }
        const targetModule = that.robotModuleList
          .find(robotModule => robotModule.id === that.filterModule[0]);
        params.operation = {
          module: targetModule.privCode,
          type: that.filterActionType[0] === 'all' ? '' : that.filterActionType[0],
        };
      }
      return params;
    },
    setPageOption() {
      if (this.userType === UserType.SYSTEM_ADMIN) {
        this.pageOption = {
          auditSystem: this.$t('management.audit.system'),
          auditEnterprise: this.$t('management.audit.enterprise'),
          auditRobot: this.$t('management.audit.robot'),
        };
        return;
      } else if (this.userType === UserType.ENTERPRISE_ADMIN) {
        this.pageOption = {
          auditEnterprise: this.$t('management.audit.enterprise'),
          auditRobot: this.$t('management.audit.robot'),
        };
        return;
      }
      this.pageOption = {
        auditRobot: this.$t('management.audit.robot'),
      };
    },
    setFilterOption() {
      /** filterRobot */
      if (this.userType !== UserType.SYSTEM_ADMIN) {
        this.filterRobotOptions = this.robotList.map(robot => ({
          text: robot.name,
          value: robot.id,
        }));
        if (this.robotID && this.robotID !== '') {
          this.filterRobot = [this.robotID];
        }
      } else {
        // TODO: else: system admin call api to get full enterprise and robot list
        console.log(this.enterpriseID, this.robotID);
        if (this.enterpriseID && this.enterpriseID !== '' &&
            this.robotID && this.robotID !== '') {
          this.filterRobot = [this.enterpriseID, this.robotID];
        }
      }

      /** filterModule & filterActionType */
      const moduleOptions = [];
      if (this.userType === UserType.SYSTEM_ADMIN) {
        this.robotModuleList.forEach((robotModule) => {
          moduleOptions.push({
            text: robotModule.name,
            value: robotModule.id,
          });
        });
      } else {
        const privCodes = this.privilegeList.map(priv => priv.code);
        this.robotModuleList.forEach((robotModule) => {
          // Only add option if the Enterprise have certain module
          const hasModule = privCodes
            .some(code => robotModule.privCode.indexOf(code) !== -1);
          if (hasModule || robotModule.id === 'all') {
            moduleOptions.push({
              text: robotModule.name,
              value: robotModule.id,
            });
          }
        });
      }
      this.filterModuleOptions = moduleOptions;
      this.filterModule = [moduleOptions[0].value];
      this.setFilterActionType();
    },
    setFilterActionType() {
      const currentModule = this.robotModuleList
        .find(robotModule => robotModule.id === this.filterModule[0]);
      const actionTypeOptions = currentModule.operation
        .map(op => ({
          text: this.operationType[op],
          value: op,
        }));
      this.filterActionTypeOptions = actionTypeOptions;
      this.filterActionType = [actionTypeOptions[0].value];
    },
  },
  beforeMount() {
    this.userType = this.userInfo.type;
    this.setPageOption();
    this.isNormalUser = this.userType === UserType.NORMAL_USER;
    this.isSystemAdmin = this.userType === UserType.SYSTEM_ADMIN;
    this.setFilterOption();
    this.initDatetimePicker();
  },
};

</script>
<style lang="scss" scoped>
.audit-page {
  display: flex;
  flex-direction: column;
}
#audit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .nav-bar {
    flex: 1;
  }
  .back-button {
    padding-right: 20px;
    height: 60px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $color-borderline;
  }
}

#audit-filter {
  padding: 16px 20px;
  display: flex;
  border-bottom: 1px solid $color-borderline;
  #filter-block {
    flex: 1;
    .row {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      &:not(:first-child) {
        margin-top: 10px;
      }

      .row-title {
        @include font-14px();
        color: $color-font-normal;
        flex: 0 0 100px;

      }
      .row-content {
        display: flex;
        align-items: center;
        margin-left: 12px;
        margin-right: 100px;

        >:not(:last-child) {
          margin-right: 10px;
        }
      }
    }
  }
  #filter-operation {
    flex: 0 0 auto;
    display: flex;
    align-items: flex-end;
    .show-more {
      @include click-button();
      display: flex;
      align-items: center;
      height: 28px;
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
#audit-result {
  #audit-toolbar {
    padding: 20px;
    display: flex;
    align-items: center;
    >:not(:first-child) {
      margin-left: 10px;
    }
    .text-button {
      &.disabled {
        pointer-events: none;
      }
    }
    #audit-log-count {
      height: 28px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
