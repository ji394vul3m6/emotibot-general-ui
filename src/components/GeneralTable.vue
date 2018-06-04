<template>
  <table class="general-table" :class="[autoHeight ? 'auto-height': '', fontClass]">
    <thead>
      <tr>
        <td v-if="checkbox" class="table-col-checkbox">
          <input type="checkbox">
        </td>
        <td v-for="header in tableHeader" :key="header.key" 
          :style="{width: header.width}"
          :class="{'fixed': header.width}">
          {{ header.text }}
        </td>
        <td v-if="hasAction" class="table-col-action" :class="{'multi-action': action.length > 1}"> 操作 </td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(data, idx) in tableData" :key="idx">
        <td v-if="checkbox" class="table-col-checkbox">
          <input type="checkbox">
        </td>
        <td v-for="header in tableHeader" :key="header.key"
          :style="{width: header.width}"
          :class="{'fixed': header.width}">
          <template v-if="header.type === 'tag'">
            <tag class="tags" v-for="tag in data[header.key]" :key="tag" :fontClass="fontClass">{{ tag }}</tag>
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
</template>

<script>
import Tag from '@/components/basic/Tag';

export default {
  components: {
    Tag,
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
  },
  computed: {
    hasAction() {
      return this.action.length > 0;
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

  thead {
    background: $table-header-background;
    tr {
      height: $table-row-height;
      display: flex;
      td {
        flex: 1 0 100px;
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
      border-top: 1px solid $table-color-borderline;
      border-bottom: 1px solid $table-color-borderline;
      td {
        flex: 1 0 100px;
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
  margin: 0 5px;
  &:first-child {
    margin-left: 0px;
  }
}
input[type=checkbox]{
  @include general-checkbox();
}
</style>
