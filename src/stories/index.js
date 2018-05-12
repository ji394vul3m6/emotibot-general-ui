// import Vue from 'vue';

import { storiesOf } from '@storybook/vue';

import TextButton from '../components/basic/TextButton';

storiesOf('TextButton', module)
  .add('Normal', () => ({
    components: { TextButton },
    template: '<text-button :rounded="true">TextButton</text-button>',
  }));
