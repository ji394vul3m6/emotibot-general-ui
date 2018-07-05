import { boolean } from '@storybook/addon-knobs';
import Toggle from '../../components/basic/Toggle';

export default [{
  name: 'Toggle',
  func: () => {
    const value = boolean('value', true);
    const big = boolean('big', false);
    const disabled = boolean('disabled', false);
    const template = '<toggle v-model="value" :big="big" :disabled="disabled"></toggle>';

    return {
      components: {
        Toggle,
      },
      data() {
        return {
          value,
          big,
          disabled,
        };
      },
      template,
    };
  },
}];
