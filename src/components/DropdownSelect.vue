<template>
  <div class="dropdown-select" :style="styleObj">
    <div class="input-bar" :class="{'is-focus': show}" :style="inputBarStyle" ref="input" @click="showSelection">
      <div class="input-block">
        <span v-if="!checkedValues.length" class="placeholder">{{ placeholder }}</span>
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
      <div class="select-item search" v-if="showSearchBar">
        <input class="search-input" v-model="searchKeyWord" placeholder="Search">
      </div>
      <template v-if="filteredLocalOptions.length === 0">
        <div class="select-item item">
          <div class="select-text not-selectable" :style="selectTextStyle">
            {{ $t('general.no_option') }}
          </div>
        </div>
      </template>
      <template v-else v-for="(option, idx) in filteredLocalOptions">
      <div class="select-item item" :key="idx" v-if="!option.isGroup"
        :class="{
          checked: option.checked && showCheckedIcon,
          'in-group': option.inGroup,
          'is-button': option.isButton
        }"
        @click="selectOption(idx)"
        @mouseover="toggleHover(option, true)" @mouseout="toggleHover(option, false)">
        <div class="select-text" :style="selectTextStyle"> {{option.text}} </div>
        <div class=select-icon-container v-if="showCheckedIcon">
          <div class="select-icon" v-if="!option.checked && !option.isButton">
            <icon icon-type="checked" :size=16></icon>
          </div>
          <div class="select-icon" v-if="option.checked">
            <icon v-if="option.hovered" icon-type="checked" :size=16></icon>
            <icon v-else icon-type="check" :size=16></icon>
          </div>
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
    fixedListWidth: {
      type: Boolean,
      default: true,
    },
    showCheckedIcon: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    inputBarStyle: {
      type: Object,
      default() {
        return {};
      },
    },
    showSearchBar: {
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
    filteredLocalOptions() {
      if (this.searchKeyWord === '') {
        return this.localOptions;
      }
      return this.localOptions.filter(option => option.text.indexOf(this.searchKeyWord) !== -1);
    },
  },
  data() {
    return {
      show: false,
      localOptions: [],
      listStyle: {},
      selectTextStyle: {},
      checkedValues: [],
      detectClickListener: undefined,
      searchKeyWord: '',
    };
  },
  watch: {
    options(options) {
      this.initOptions(options);
    },
    value(val) {
      this.selectValue = val;
    },
  },
  methods: {
    removeOption(opt) {
      opt.checked = false;
      this.updateValue();
    },
    selectOption(idx) {
      const value = this.filteredLocalOptions[idx].value;
      const that = this;
      if (that.multi) {
        const option = that.localOptions.find(o => o.value === value);
        option.checked = !option.checked;
        that.toggleHover(option, false);
      } else {
        that.localOptions.forEach((option) => {
          option.checked = false;
        });
        const option = that.localOptions.find(o => o.value === value);
        option.checked = true;
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
        width: `${inputBox.width}px`,
      };

      if (!this.fixedListWidth) {
        that.listStyle.width = 'auto';
        that.listStyle['min-width'] = `${inputBox.width}px`;
        that.selectTextStyle['flex-grow'] = 0;
        that.selectTextStyle['flex-shrink'] = 0;
        that.selectTextStyle['flex-basis'] = 'auto';
      }

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
      that.detectScrollListener = (e) => { // auto close option list when scroll outside
        const clickDom = e.target;
        const listDom = that.$refs.list;
        if (listDom && !listDom.contains(clickDom)) {
          that.show = false;
          if (that.detectScrollListener) {
            window.removeEventListener('scroll', that.detectScrollListener, true);
          }
        }
      };
      window.addEventListener('click', that.detectClickListener);
      window.addEventListener('scroll', that.detectScrollListener, true);
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
      that.checkedValues = this.localOptions.filter(opt => opt.checked);
      that.updateValue();
    },
    toggleHover(option, bool) {
      option.hovered = bool;
    },
    initOptions(options) {
      const that = this;
      that.localOptions = [];
      options.forEach((opt) => {
        let initCheck = false;
        if (that.value.length > 0) {
          initCheck = that.value.indexOf(opt.value) >= 0;
        }
        that.localOptions.push({
          ...opt,
          checked: initCheck,
          hovered: false,
        });
      });
      that.checkedValues = this.localOptions.filter(opt => opt.checked);
    },
  },
  mounted() {
    const that = this;
    that.initOptions(that.options);
    that.$on('select', that.selectValue);
    that.$on('updateOptions', that.initOptions);
  },
};
</script>

<style lang="scss" scoped>
@import 'styles/variable.scss';

$border-color: $color-borderline;
.input-bar {
  display: flex;
  height: 28px;
  border: 1px solid $border-color;
  border-radius: 2px;
  @include click-button();

  .placeholder {
    @include font-14px();
    color: $color-font-disabled;
  }

  &:hover {
    border-color: $color-borderline-hover;
  }
  &.is-focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(75, 75, 100, 0.2);
    border-color: $color-borderline-hover;
  }

  .input-block {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border: none;
    display: flex;
    align-items: center;
    padding: 5px 8px;

    .input-tag {
      margin-left: 5px;
      .close-icon {
        @include click-button();
      }
    }
    .input-text {
      @include font-14px();
      color: $color-font-normal;
    }
  }
  .icon-block {
    flex: 0 0 28px;

    display: flex;
    align-items: center;
    justify-content: center;
    margin: 3px 0;
    border-left: 1px solid $border-color;
  }
}
.select-list {
  position: absolute;
  top: 35px; // input height + 5px padding
  left: 0;
  @include font-14px();
  z-index: 10;
  box-sizing: border-box;
  width: 150px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  border: 1px solid $color-borderline;
  color: $color-font-normal;
  background: $color-white;
  max-height: calc(4 * 32px);
  @include auto-overflow();
  @include customScrollbar();

  display: flex;
  flex-direction: column;
  .select-item {
    flex: 0 0 32px;
    &.item {
      @include click-button();
      &.checked {
        background: $color-select;
      }
      &:hover {
        background: $color-select-hover;
        color: $color-white;
      }
      &.in-group {
        .select-text {
          padding-left: 24px;
        }
      }
      &.is-button {
        color: $color-primary;
        &:hover {
          color: $color-white;
        }
      }
    }
    &.group {
      font-weight: bold;
    }
    display: flex;
    align-items: center;
    justify-content: space-between;
    .select-text {
      flex: 1;
      padding-left: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .select-icon-container{
      .select-icon {
        margin-right:16px;
        flex: 0 0 16px;
        display: flex;
        align-items: center;
      }
    }
    .search-input{
      margin-left: 10px;
    }
  }
}
</style>
