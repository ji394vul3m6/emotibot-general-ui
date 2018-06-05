<template>
  <div class='datetimepicker'>
    <div class='picker' id="date-picker">
      <date-picker
        v-model="datetime.dateObj"
        :readonly="false"
        :disabled="disableDate"
        format="yyyy/MM/dd"
        language="zh"
        @selected="onDateSelected"
        @validityChange="value => {dateValidity = value}"
      ></date-picker>
    </div>
    <div class='picker' id="time-picker">
      <time-picker
        hide-clear-button
        v-model="datetime.timeObj"
        :readonly="false"
        :currentDate="datetime.dateObj"
        :disabled="disableDate"
        format="HH:mm"
        :minute-interval="5"
        @change="onTimeSelected"
        @validityChange="value => {timeValidity = value}"
      ></time-picker>
    </div>
  </div>
</template>

<script>
import datePickerUtil from '@/utils/vue/DatePickerUtil';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';

export default {
  props: {
    value: {
      type: Object,
      required: true,
    },
    disableDate: {
      type: Object,
      required: false,
    },
  },
  computed: {
    datetime() {
      const timeString = datePickerUtil.toTimeString(this.value);
      const d = datePickerUtil.createPickerByTimeStr(timeString);
      return d;
    },
    validity() {
      return this.dateValidity && this.timeValidity;
    },
  },
  watch: {
    value() {
      this.updateTime();
      this.value.dateObj.setHours = parseInt(this.value.timeObj.HH, 10);
      this.value.dataObj.setMinutes = parseInt(this.value.timeObj.mm, 10);
    },
    validity() {
      this.$emit('validityChange', this.validity);
    },
  },
  methods: {
    // updateDate() {
    //   // this.value = this.dateObj;
    // },
    // updateTime() {
    //   const hour = this.value.getHours();
    //   this.timeObj.HH = hour > 10 ? hour.toString() : `0${hour}`;

    //   const min = this.value.getMinutes();
    //   this.timeObj.mm = min > 10 ? min.toString() : `0${min}`;
    //   this.dateObj = this.value;
    // },
    onDateSelected(d) {
      this.datetime.dateObj = d;
      const syncedDate = new Date(this.datetime.getTimestamp() * 1000);
      this.$emit('dateChanged', syncedDate);
      this.$emit('input', syncedDate);
    },
    onTimeSelected(t) {
      const obj = {};
      Object.keys(this.datetime.timeObj).forEach((key) => {
        obj[key] = t.data[key];
      });
      this.datetime.timeObj = obj;
      const syncedDate = new Date(this.datetime.getTimestamp() * 1000);
      this.$emit('dateChanged', syncedDate);
      this.$emit('input', syncedDate);
    },
  },
  components: {
    DatePicker,
    TimePicker,
  },
  data() {
    return {
      // dateObj: new Date(),
      // timeObj: {
      //   HH: 0,
      //   mm: 0,
      //   ss: 0,
      // },
      dateValidity: true,
      timeValidity: true,
    };
  },
  mounted() {
    // this.updateTime();
  },
};
</script>
<style lang="scss">
@import "styles/variable.scss";
$row-height: 30px;
$light-main: $page-header-color;

.datetimepicker {
  display: inline-block;
  position: relative;
  @mixin pickerinput {
    border: 1px solid #e9e9e9;
    border-radius: 2px;
    height: 28px;
    padding: 8px 8px;
    text-align: center;
    font-size: 1em;
  }
  input {
    cursor: pointer;
  }

  .time-picker input.invalid-timepicker-input {
    background-color: pink;
  }

  .vdp-datepicker input.invalid-datepicker-input {
    background-color: pink;
  }

  .picker {
    display: inline-block;
  }
  #date-picker {
    vertical-align: middle;
    input {
      @include pickerinput();
      width: 7em;
    }
  }
  #time-picker {
    .time-picker {
      width: auto;
      input {
        @include pickerinput();
        width: 4.5em;
      }
    }
  }
}

.tooltip-container {
  position: relative;
  &.hover:hover {
    .tooltip {
      visibility: visible;
    }
  }

  .tooltip {
    z-index: 1;
    $tool-tip-color: #d7dde4;
    visibility: hidden;
    padding: 5px;
    line-height: 1em;
    background-color: $tool-tip-color; // #d7dde4;
    color: #000;
    text-align: center;
    border-radius: 5px;
    padding: 5px;
    position: absolute;
    min-width: 50px;
    bottom: calc(100% + 10px);
    box-shadow: 1px 1px 5px black;
  
    &.visible {
      visibility: visible;
    }
    &.nowrap {
      white-space: nowrap;
    }
    &.left {
      left: 0;
    }
    &.right {
      right: 0;
    }

    &.text-left-align {
      text-align: left;
    }
  
    &.rightside {
      top: calc(50% - 0.5em - 5px);
      bottom: auto;
      left: calc(100% + 10px);
    }
    &.downside {
      top: calc(100% + 5px);
      bottom: auto;
    }
  
    &.downside::after {
      top: auto;
      bottom: 100%;
      border-color: transparent transparent $tool-tip-color transparent;
    }
    &.rightside::after {
      top: calc(50% - 5px);
      bottom: auto;
      left: -5px;
      border-color: transparent $tool-tip-color transparent transparent;
    }
  
  
    &.tri-right::after {
      left: 75%;
    }
    &.tri-left::after {
      left: 25%;
    }
    &::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: $tool-tip-color transparent transparent transparent;
  
    }
  }
}
</style>
 