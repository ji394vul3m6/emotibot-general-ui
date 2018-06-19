<template>
  <div class="dropdown-select" :style="styleObj">
    <div class="input-bar" ref="input" @click="showSelection">
      <div class="input-block">
        <template v-if="multi">
        <tag class="input-tag" v-for="value in checkedValues" :key="value.value" font-class="font-12">
          {{ value.text }}
          <icon icon-type="close" :size="8" class="close-icon" @click.stop="removeOption(value)"/>
        </tag>
        </template>
        <template v-else-if="checkedValues.length > 0">
          <div class="input-text">{{checkedValues[0].text}}</div>
        </template>
      </div>
      <div class="icon-block">
        <icon icon-type="drop_down" :size=10></icon>
      </div>
    </div>
    <div ref="list" v-if="show" class="select-list" :style="listStyle">
      <template v-for="(option, idx) in localOptions">
      <div class="select-item item" :key="idx" v-if="!option.isGroup"
        :class="{checked: option.checked, 'in-group': option.inGroup}"
        @click="selectOption(idx)">
        <div class="select-text"> {{option.text}} </div>
        <div class="select-icon" v-if="showCheck && option.checked">
          <icon icon-type="checked" :size=12></icon>
        </div>
      </div>
      <div class="select-item group" v-if="option.isGroup" :key="idx">
        <div class="select-text"> {{option.text}} </div>
      </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dropdown-select',
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    options: {
      type: Array,
      validator: input => input.reduce((ret, value) =>
        ret && (value.text !== undefined) && (value.value !== undefined || value.isGroup), true),
    },
    showCheck: {
      type: Boolean,
      default: true,
    },
    multi: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: 'auto',
    },
    flex: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    styleObj() {
      if (this.flex) {
        return {
          flex: `0 0 ${this.width}`,
        };
      }
      return {
        width: this.width,
      };
    },
  },
  data() {
    return {
      show: false,
      localOptions: [],
      listStyle: {},
      checkedValues: [],
      detectClickListener: undefined,
    };
  },
  methods: {
    removeOption(opt) {
      opt.checked = false;
      this.updateValue();
    },
    selectOption(idx) {
      const that = this;
      if (that.multi) {
        that.localOptions[idx].checked = !that.localOptions[idx].checked;
      } else {
        that.localOptions.forEach((option) => {
          option.checked = false;
        });
        that.localOptions[idx].checked = true;
        that.show = false;
        window.removeEventListener('click', that.detectClickListener);
      }
      that.updateValue();
    },
    updateValue() {
      this.checkedValues = this.localOptions.filter(opt => opt.checked);
      this.$emit('input', this.checkedValues.map(opt => opt.value));
    },
    showSelection() {
      const that = this;
      if (that.show) {
        that.show = false;
        return;
      }
      that.show = true;

      const inputBox = that.$refs.input.getBoundingClientRect();
      that.listStyle = {
        position: 'fixed',
        top: `${inputBox.top + inputBox.height + 3}px`,
        left: `${inputBox.left}px`,
        width: that.width,
      };

      that.detectClickListener = (e) => {
        const clickDom = e.target;
        const listDom = that.$refs.list;
        if (listDom && !listDom.contains(clickDom)) {
          that.show = false;
          if (that.detectClickListener) {
            window.removeEventListener('click', that.detectClickListener);
          }
        }
      };
      window.addEventListener('click', that.detectClickListener);
    },
    selectValue(value) {
      if (value === undefined) {
        return;
      }
      const that = this;
      if (!that.multi) {
        that.localOptions.forEach((option) => {
          option.checked = false;
        });
      }
      that.localOptions.forEach((opt) => {
        if (opt.value === value) {
          opt.checked = true;
        }
      });
    },
  },
  mounted() {
    const that = this;
    that.options.forEach((opt) => {
      let initCheck = false;
      if (that.value.length > 0) {
        initCheck = that.value.indexOf(opt.value) >= 0;
      }
      that.localOptions.push({
        ...opt,
        checked: initCheck,
      });
    });

    that.checkedValues = this.localOptions.filter(opt => opt.checked);
    that.$on('select', that.selectValue);
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

$border-color: #e9e9e9;

.input-bar {
  display: flex;
  height: 28px;
  border: 1px solid $border-color;
  @include click-button();
  .input-block {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border: none;
    border-right: 1px solid $border-color;
    display: flex;
    align-items: center;
    .input-tag {
      margin-left: 5px;
      .close-icon {
        @include click-button();
      }
    }
    .input-text {
      margin-left: 5px;
      color: #666666;
    }
  }
  .icon-block {
    flex: 0 0 28px;

    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.select-list {
  box-sizing: border-box;
  width: 150px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  border: 1px solid $color-borderline;
  background: white;
  max-height: calc(6 * 32px);
  @include auto-overflow();
  @include customScrollbar();

  display: flex;
  flex-direction: column;
  .select-item {
    flex: 0 0 32px;

    &.item {
      @include click-button();
      &.checked {
        background: #9393a2;
        color: white;
      }
      &:not(.checked):hover {
        background: #f0f0f3;
      }
      &.in-group {
        .select-text {
          padding-left: 24px;
        }
      }
    }
    &.group {
      font-weight: bold;
    }
    display: flex;
    align-items: center;
    .select-text {
      flex: 1;
      padding-left: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .select-icon {
      flex: 0 0 32px;
    }
  }
}
</style>
