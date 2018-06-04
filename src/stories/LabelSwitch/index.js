import { object, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import LabelSwitch from '../../components/basic/LabelSwitch';

export default [{
  name: 'props',
  func: () => {
    const items = [
      {
        text: '1天',
        val: '1',
      },
      {
        text: '7天',
        val: '7',
      },
      {
        text: '30天',
        val: '30',
      },
    ];
    const value = text('value', '1');
    const labelItems = object('options', items);
    const template = '<label-switch v-model="value" :options="labelItems" @change="chooseLabel"></label-switch>';

    return {
      components: {
        LabelSwitch,
      },
      data() {
        return {
          labelItems,
          value,
        };
      },
      methods: {
        chooseLabel(val) {
          action('chage')(val);
        },
      },
      template,
    };
  },
}];
