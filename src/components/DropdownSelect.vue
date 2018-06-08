<template>
  <div class="dropdown-select" :style="styleObj">
    <div class="input-bar" ref="input" @click="showSelection">
      <div class="input-block">
        <tag class="input-tag" v-for="value in checkedValues" :key="value.value" font-class="font-12">
          {{ value.text }}
          <icon icon-type="close" :size="8" class="close-icon" @click="removeOption(value)"/>
        </tag>
      </div>
      <div class="icon-block">
        <icon icon-type="drop_down" :size=10></icon>
      </div>
    </div>
    <div ref="list" v-if="show" class="select-list" :style="listStyle">
      <div class="select-item"
        v-for="(option, idx) in localOptions" :key="idx"
        :class="{checked: option.checked}"
        @click="selectOption(idx)">
        <div class="select-text"> {{option.text}} </div>
        <div class="select-icon">
          <icon :icon-type="option.checked ? 'checked' : 'check' " :size=12></icon>
        </div>
      </div>
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
        ret && (value.text !== undefined) && (value.value !== undefined), true),
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
      console.log(inputBox);
      that.listStyle = {
        position: 'fixed',
        top: `${inputBox.top + inputBox.height + 3}px`,
        left: `${inputBox.left}px`,
      };

      const listener = (e) => {
        const clickDom = e.target;
        const listDom = that.$refs.list;
        if (listDom && !listDom.contains(clickDom)) {
          that.show = false;
          window.removeEventListener('click', listener);
        }
      };
      window.addEventListener('click', listener);
    },
  },
  mounted() {
    const that = this;
    that.options.forEach((opt) => {
      that.localOptions.push({
        ...opt,
        checked: false,
      });
    });
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
  }
  .icon-block {
    flex: 0 0 28px;

    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.select-list {
  width: 150px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
  background: white;

  display: flex;
  flex-direction: column;
  .select-item {
    flex: 0 0 32px;
    @include click-button();

    &.checked {
      background: #9393a2;
    }
    &:not(.checked):hover {
      background: #f0f0f3;
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
