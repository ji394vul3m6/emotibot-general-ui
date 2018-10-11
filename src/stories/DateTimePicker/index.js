// import { text, select, number } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { withMarkdownNotes } from '@storybook/addon-notes';
import pickerUtil from '@/utils/vue/DatePickerUtil';
import DatePicker from '../../components/DateTimePicker/DatePicker';
import TimePicker from '../../components/DateTimePicker/TimePicker';
import DatetimePicker from '../../components/DateTimePicker';

import README from './README.md';

export default [
  {
    name: 'DatePicker',
    func: withMarkdownNotes(README)((i18n) => {
      const latestDate = new Date();
      const earliestDate = new Date();
      latestDate.setDate(latestDate.getDate());
      earliestDate.setDate(earliestDate.getDate() - 7);

      const startDate = new Date(latestDate);
      const startDateObj = pickerUtil.createDateObj();
      const template = `
      <div style="height: 800px;"><div>
        <div :style="divBlockStyle">
          <div style="font-size: 18px">DatePicker</div>
            <div :style="tipBlockStyle">
              <date-picker
                v-model="startDate"
                :readonly="false"
                :disabled="{to: earliestDate}"
                format="yyyy/MM/dd"
                language="zh"
                @selected="handleSelectDate"
              ></date-picker>
            </div>
          </div>
        </div>
        <div :style="divBlockStyle">  
          <div style="font-size: 18px">DatetimePicker</div>
            <div :style="tipBlockStyle">
              <datetime-picker
                :value="startDateObj"
                :disableDate="{to: earliestDate}"
                @dateChanged="handleDateChanged"
                @validityChange="handleDateValidityChanged"
              ></datetime-picker>
            </div>
          </div>
        </div>
      </div></div>
        `;

      return {
        components: {
          DatePicker,
          TimePicker,
          DatetimePicker,
        },
        data() {
          return {
            startDate,
            startDateObj,
            earliestDate,
            tipBlockStyle: {
              margin: '20px 0px 0px 50px',
            },
            divBlockStyle: {
              backgroundColor: '#eeeeee',
              borderRadius: '4px',
              padding: '10px',
              margin: '20px 0px',
            },
          };
        },
        methods: {
          handleSelectDate(date) {
            action('select date', date);
          },
          handleDateValidityChanged(date) {
            action('validity change', date);
          },
        },
        template: `<div>
        ${template}
        </div>`,
        i18n,
      };
    }),
  },
];
