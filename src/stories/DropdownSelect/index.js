import { object, boolean, array, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import DropdownSelect from '../../components/DropdownSelect';

export default [{
  name: 'DropdownSelect',
  func: () => {
    const options = [{
      value: 'opt1',
      text: '選項1',
    }, {
      value: 'opt2',
      text: '選項2',
    }];
    const multiChoiceDft = false;
    const checkValues = array('value', []);
    const multiChoice = boolean('multiChoice', multiChoiceDft);
    const showCheck = boolean('showCheck', true);
    const width = text('width', '150px');
    const option = object('options', options);
    const fixedListWidth = boolean('fixedListWidth', true);

    const template = `
      <dropdown-select
        :options=option
        :multi=multiChoice
        :showCheck=showCheck
        :width=width
        :fixedListWidth="fixedListWidth"
        v-model="checkValues"
        @input="input"
      />`;

    return {
      components: {
        DropdownSelect,
      },
      data() {
        return {
          option,
          showCheck,
          multiChoice,
          checkValues,
          width,
          fixedListWidth,
        };
      },
      methods: {
        input(val) {
          action('input')(val);
        },
      },
      template,
    };
  },
}];
