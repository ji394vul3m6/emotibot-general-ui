<template>
  <div id="audit-enterprise">
    <div class="card h-fill w-fill">
      <div id="audit-header">
        <nav-bar class="nav-bar" :options="pageOption" v-model="currentPage"></nav-bar>
        <div class="back-button">
          <text-button @click="goBack">{{ $t('management.go_back') }}</text-button>
        </div>
      </div>

      <div id="audit-filter">
        <div id="filter-block">
          <template v-if="isSystemAdmin">
            <div class="row">
              <div class="row-title">{{ $t  ('management.audit.filter_enterprise') }}</div>
              <div class="row-content">
                <dropdown-select
                  v-model="filterEnterprise"
                  :options="filterEnterpriseOptions"
                  :showCheckedIcon="false"
                  width="300px"
                />
              </div>
            </div>
          </template>
          <template v-if="!isSystemAdmin || expertMode">
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
          </template>
          <template v-if="expertMode">
            <div class="row">
              <div class="row-title">{{ $t('management.audit.filter_module') }}</div>
              <div class="row-content">
                <dropdown-select
                  v-model="filterModule"
                  :options="filterModuleOptions"
                  :showCheckedIcon="false"
                  width="160px"
                />
                <dropdown-select
                  v-model="filterActionType"
                  :options="filterActionTypeOptions"
                  :showCheckedIcon="false"
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
import DatetimePicker from '@/components/DateTimePicker';
import NavBar from '@/components/NavigationBar';
import datepickerMixin from './_mixin/datepicker';
import UserType from './_data/UserType';
import ModuleMap from './_data/ModuleMap';

const auditSystemPage = '/manage/audit-system';
const auditRobotPage = '/manage/audit-robot';
export default {
  path: 'audit-enterprise',
  name: 'audit-enterprise',
  privCode: 'statistic_audit',
  components: {
    NavBar,
    DatetimePicker,
  },
  mixins: [datepickerMixin],
  data() {
    return {
      userType: undefined,
      currentPage: 'auditEnterprise',
      pageOption: {},

      isSystemAdmin: false,
      expertMode: false,

      filterEnterprise: [],
      filterEnterpriseOptions: [],
      filterUserId: '',
      filterModule: [],
      filterModuleOptions: [],
      filterActionType: [],
      filterActionTypeOptions: [],

      totalLogCount: 0,
    };
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ]),
    canExport() {
      return this.$hasRight('export');
    },
  },
  watch: {
    currentPage(val) {
      if (val === 'auditSystem') {
        this.$router.push(auditSystemPage);
      } else if (val === 'auditRobot') {
        this.$router.push(auditRobotPage);
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
    setPageOption() {
      if (this.userType === UserType.SYSTEM_ADMIN) {
        this.pageOption = {
          auditSystem: this.$t('management.audit.system'),
          auditEnterprise: this.$t('management.audit.enterprise'),
          auditRobot: this.$t('management.audit.robot'),
        };
        return;
      }
      this.pageOption = {
        auditEnterprise: this.$t('management.audit.enterprise'),
        auditRobot: this.$t('management.audit.robot'),
      };
    },
  },
  beforeMount() {
    this.userType = this.userInfo.type;
    this.setPageOption();
    this.isSystemAdmin = this.userType === UserType.SYSTEM_ADMIN;
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
