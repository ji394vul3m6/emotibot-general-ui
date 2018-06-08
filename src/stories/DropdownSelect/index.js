import { object, boolean, array, text } from '@storybook/addon-knobs';
// import { action } from '@storybook/addon-actions';
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
    const option = object('options', options);
    const multiChoice = boolean('multiChoice', multiChoiceDft);
    const checkValues = array('value', []);
    const width = text('width', '150px');

    const template = `
      <dropdown-select
        :options=option
        :multi=multiChoice
        :width=width
        v-model="checkValues"
      />`;

    return {
      components: {
        DropdownSelect,
      },
      data() {
        return {
          option,
          multiChoice,
          checkValues,
          width,
        };
      },
      methods: {
      },
      template,
    };
  },
}];
