<template>
  <div class="general-table-container" :class="[showEmpty ? 'show-empty': '']">
    <div class="general-table-header">
    <table class="general-table" :class="[autoHeight ? 'auto-height': '', fontClass]">
      <thead>
        <tr>
          <td v-if="checkbox" class="table-col-checkbox">
            <input type="checkbox" @click="checkAll" :checked="isAllChecked">
          </td>
          <td v-for="header in tableHeader" :key="header.key" 
            :style="{width: header.width}"
            :class="{'fixed': header.width}">
            {{ header.text }}
          </td>
          <td v-if="hasAction" class="table-col-action" :class="{'multi-action': action.length > 1}"> {{ $t('general.actions') }} </td>
        </tr>
      </thead>
    </table>
    </div>
    <div class="general-table-body">
    <table class="general-table" :class="[autoHeight ? 'auto-height': '', fontClass]" v-if="tableData && tableData.length > 0">
      <tbody>
        <tr v-for="(data, idx) in tableData" :key="idx">
          <td v-if="checkbox" class="table-col-checkbox">
            <input type="checkbox" @click="checkSelf(data, idx)" :checked="data.isChecked">
          </td>
          <td v-for="header in tableHeader" :key="uniqueId(header.key)"
            :style="{width: header.width}"
            :class="{'fixed': header.width}">
            <template v-if="header.type === 'tag'">
              <tag class="tags" v-for="(tag, tagIdx) in data[header.key]" :key="`${tagIdx}-${tag}`" :fontClass="fontClass">{{ tag }}</tag>
            </template>
            <!-- type toggle need to have a readonly mode -->
            <template v-else-if="header.type === 'toggle'">
              <toggle class="toggles"
                v-model="data[header.key].val"
                @change="data[header.key].onclick(data, idx)"></toggle>
            </template>
            <template v-else>{{ data[header.key] }}</template>
          </td>
          <td v-if="hasAction" class="table-col-action" :class="{'multi-action': action.length > 1}">
            <span class="actions" v-for="act in action" 
              :key="act.text" :class="act.type"
              @click="act.onclick(data, idx)"> {{ act.text }}</span>
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
  }
  .general-table-body {
    @include auto-overflow-Y();
    overflow-x: hidden;
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

      .table-col-checkbox {
        flex: 0 0 50px;
      }
      .table-col-action {
        flex: 0 0 60px;
        &.multi-action {
          flex: 0 0 140px;
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
      .table-col-checkbox {
        flex: 0 0 50px;
      }
      .table-col-action {
        flex: 0 0 60px;
        &.multi-action {
          flex: 0 0 140px;
        }
        .actions {
          margin: 0 10px;
          &.primary {
            color: $color-primary;
          }
          &.error {
            color: $color-error;
          }
          &:first-child {
            margin-left: 0px;
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
