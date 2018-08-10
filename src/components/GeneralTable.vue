<template>
  <div class="general-table-container" :class="[showEmpty ? 'show-empty': '']">
    <div class="general-table-header">
    <table ref="tableHeader" class="general-table" :class="[autoHeight ? 'auto-height': '', fontClass]">
      <thead>
        <tr>
          <td v-if="checkbox" class="table-col-checkbox">
            <input type="checkbox" @click="checkAll" :checked="isAllChecked">
          </td>
          <td v-for="header in tableHeader" :key="header.key" 
            :style="{width: header.width}"
            :class="{'fixed': header.width}"
            class="table-header-item">
            {{ header.text }}
            <div v-if="header.info && header.info !== ''" :ref="`${header.key}-info`"
              class="table-header-icon"
              v-tooltip="headerInfoTooltip"
              @mouseover="updateHeaderInfoTooltip(header)"
              @mouseout="toggleIconStyle(header, 'info')">
              <icon :ref="`${header.key}-icon`" :icon-type="header.infoicon" :size=16></icon>
            </div>
          </td>
          <td v-if="hasAction" class="table-col-action" :class="{'multi-action': action.length > 1}"> {{ $t('general.actions') }} </td>
        </tr>
      </thead>
    </table>
    </div>
    <div class="general-table-body">
    <table class="general-table" :class="[autoHeight ? 'auto-height' : '', fontClass]" v-if="tableData && tableData.length > 0">
      <tbody :class="[onclickRow ? 'clickable-row' : '']">
        <tr v-for="(data, idx) in tableData" :key="idx">
          <td v-if="checkbox" class="table-col-checkbox">
            <input type="checkbox" @click="checkSelf(data, idx)" :checked="data.isChecked">
          </td>
          <td v-for="header in tableHeader" :key="uniqueId(header.key)"
            :style="{width: header.width}"
            :class="{'fixed': header.width}"
            @click="handleOnclickRow(onclickRow, data, idx)">
            <template v-if="header.type === 'tag'">
              <tag class="tags" v-for="(tag, tagIdx) in data[header.key]" :key="`${tagIdx}-${tag}`" :fontClass="fontClass">{{ tag }}</tag>
            </template>
            <!-- type toggle need to have a readonly mode -->
            <template v-else-if="header.type === 'toggle'">
              <toggle class="toggles"
                v-model="data[header.key].val"
                :disabled="data[header.key].disabled"
                @change="data[header.key].onclick(data, idx)"></toggle>
            </template>
            <template v-else>{{ data[header.key] }}</template>
          </td>
          <td v-if="hasAction" class="table-col-action" :class="{'multi-action': action.length > 1}">
            <span class="actions" v-for="act in action" 
              :key="act.text" :class="act.type"
              @click="act.onclick(data, idx)"
              v-if="data.action_enable === undefined || (data.action_enable && data.action_enable[act.key])"
            > {{ act.text }}</span>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
    <div class="empty-display" v-if="showEmpty && tableData.length <= 0">
      {{ $t('general.no_data') }}
    </div>
  </div>
</template>

<script>
import Tag from '@/components/basic/Tag';
import Toggle from '@/components/basic/Toggle';

export default {
  components: {
    Tag,
    Toggle,
  },
  props: {
    tableHeader: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
    tableData: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
    checkbox: {
      type: Boolean,
      required: false,
      default: false,
    },
    action: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    onclickRow: {
      type: Function,
      required: false,
      default: undefined,
    },
    autoHeight: {
      type: Boolean,
      required: false,
      default: false,
    },
    fontClass: {
      type: String,
      required: false,
      default: 'font-14',
    },
    showEmpty: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      isAllChecked: false,
      checkedData: [],
      headerInfoTooltip: {
        msg: '',
      },
    };
  },
  computed: {
    hasAction() {
      return this.action.length > 0;
    },
  },
  watch: {
    tableData() {
      if (this.checkbox) {
        this.tableData.forEach((data) => {
          data.isChecked = false;
        });
        this.isAllChecked = false;
        // this.setCheckedData();
        // this.$emit('checkedChange', this.checkedData);
      }
    },
    tableHeader() {
      this.tableHeader.forEach((header) => {
        if (header.info && header.info !== '') {
          header.infoicon = 'info';
        }
      });
    },
  },
  methods: {
    uniqueId(key) {
      const randInt = parseInt(Math.random() * 1000, 10);
      return `${randInt}-${key}`;
    },
    checkSelf(data) {
      data.isChecked = !data.isChecked;
      this.isAllChecked = this.isAllRowChecked();
      this.setCheckedData();
      this.$emit('checkedChange', this.checkedData);
    },
    checkAll() {
      if (this.isAllRowChecked()) {
        this.tableData.forEach((data) => {
          data.isChecked = false;
        });
      } else {
        this.tableData.forEach((data) => {
          data.isChecked = true;
        });
      }
      this.isAllChecked = this.isAllRowChecked();
      this.setCheckedData();
      this.$emit('checkedChange', this.checkedData);
    },
    isAllRowChecked() {
      const uncheckedNum = this.tableData.filter(data => data.isChecked === false).length;
      return uncheckedNum === 0;
    },
    setCheckedData() {
      this.checkedData = this.tableData.filter(data => data.isChecked === true);
    },
    handleOnclickRow(onclickRow, data, idx) {
      if (onclickRow !== undefined) {
        onclickRow(data, idx);
      }
    },
    updateHeaderInfoTooltip(header) {
      const tableHeaderDom = this.$refs.tableHeader;
      const infoIconBlockDom = this.$refs[`${header.key}-info`][0];
      const tableHeaderRightPos = tableHeaderDom.getBoundingClientRect().right;
      const infoIconRightPos = infoIconBlockDom.getBoundingClientRect().right;

      /** Change icon style on hover */
      this.toggleIconStyle(header, 'info_hover');

      /** Max-width of tooltip is 300px,
      /*  Let tooltip alignLeft if infoIcon is too close to righthand side of table */
      if (tableHeaderRightPos - infoIconRightPos < 350) {
        this.headerInfoTooltip.alignLeft = true;
      } else {
        this.headerInfoTooltip.alignLeft = false;
      }
      this.headerInfoTooltip.msg = header.info;
      infoIconBlockDom.dispatchEvent(new Event('tooltip-reload'));
    },
    toggleIconStyle(header, icon) {
      header.infoicon = icon;
      this.$forceUpdate();
    },
  },
  beforeMount() {
    this.tableHeader.forEach((header) => {
      if (header.info && header.info !== '') {
        header.infoicon = 'info';
      }
    });
  },
};
</script>

<style lang="scss" scoped>
@import "styles/variable";

$table-header-background: $color-disabled;
$table-data-background: $color-white;
$table-color-borderline: $color-borderline;
$table-row-height: 50px;

.general-table-container {
  &.show-empty {
    flex: 1;
  }
  display: flex;
  flex-direction: column;
  width: inherit;
  .general-table-header {
    flex: 0 0 auto;
    .table-header-item {
      display: flex;
      align-items: center;
      .table-header-icon {
        display: flex;
        align-items: center;
        margin-left: 5px;
        cursor: pointer;
      }
    }
  }
  .general-table-body {
    @include auto-overflow-Y();
    @include customScrollbar();
    overflow-x: hidden;
    tr {
      &:hover{
      background-color: #F6F9FF;
      }
    }
    .clickable-row {
      tr {
        cursor: pointer;
        .table-col-action, .table-col-checkbox {
          cursor: default;
        }
      }
    }
  }
  .empty-display {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
table {
  &.font-16 {
    @include font-16px();
  }
  &.font-14 {
    @include font-14px();
  }
  &.font-12 {
    @include font-12px();
  }
  width: 100%;
  table-layout: fixed;
  border-spacing: 0px;
  overflow-x: hidden;
  color: $color-font-normal;
  thead {
    background: $table-header-background;
    tr {
      height: $table-row-height;
      display: flex;
      border-bottom: 1px solid $table-color-borderline;
      td {
        flex: 1 0 0;
        box-sizing: border-box;
        padding: 15px 10px;
        &.fixed {
          flex: 0 0 auto;
        }
      }
      td:first-child {
        padding-left: 20px;
      }
      td:last-child.table-col-action {
        padding-right: 20px;
      }
      .table-col-checkbox {
        flex: 0 0 50px;
      }
      .table-col-action {
        flex: 0 0 60px;
        &.multi-action {
          flex: 0 0 110px;
        }
      }
    }
  }

  tbody {
    background: $table-data-background;
    tr {
      height: $table-row-height;
      display: flex;
      width: inherit;
      overflow: hidden;
      border-bottom: 1px solid $table-color-borderline;
      td {
        flex: 1 0 0;
        // min-width: 100px;
        box-sizing: border-box;
        padding: 15px 10px;
        &.fixed {
          flex: 0 0 auto;
        }
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      td:first-child {
        padding-left: 20px;
      }
      td:last-child.table-col-action {
        padding-right: 20px;
      }
      .table-col-checkbox {
        flex: 0 0 50px;
      }
      .table-col-action {
        flex: 0 0 60px;
        max-width: 60px;  // IE11 Hack: Apply max-width on flex children so box-sizing would work
        &.multi-action {
          flex: 0 0 110px;
          max-width: 110px;  // IE11 Hack: Apply max-width on flex children so box-sizing would work
          display: flex;
          justify-content: space-between;
        }
        .actions {
          &.primary {
            color: $color-primary;
          }
          &.error {
            color: $color-error;
          }
          &:hover {
            cursor:pointer;
          }
        }
      }
    }
  }

  &.auto-height {
    thead {
      tr {
        height: auto;
      }
    }
    tbody {
      tr {
        height: auto;
        td {
          text-overflow: unset;
          overflow: unset;
          white-space: unset;
          word-break: break-all;
        }
      }
    }
  }
}

.tags {
  &.tag {
    margin: 0 5px;
    &:first-child {
      margin-left: 0px;
    }
  }
}
input[type=checkbox]{
  @include general-checkbox();
}
</style>
