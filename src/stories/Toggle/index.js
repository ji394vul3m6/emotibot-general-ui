import { boolean } from '@storybook/addon-knobs';
import { withMarkdownNotes } from '@storybook/addon-notes';
import Toggle from '../../components/basic/Toggle';
import README from './README.md';

export default [{
  name: 'Toggle',
  func: withMarkdownNotes(README)(() => {
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
  }),
}];
