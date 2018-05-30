// import Vue from 'vue';

import { storiesOf } from '@storybook/vue';
import { withKnobs } from '@storybook/addon-knobs';

import TextButtonStory from './TextButton';

let textButtonStory = storiesOf('Textbutton', module).addDecorator(withKnobs);
TextButtonStory.forEach((story) => {
  textButtonStory = textButtonStory.add(story.name, story.func);
});
