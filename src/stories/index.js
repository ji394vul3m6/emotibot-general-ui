// import Vue from 'vue';

import { storiesOf } from '@storybook/vue';
import { withKnobs } from '@storybook/addon-knobs';

import TextButtonStory from './TextButton';
import LabelSwitchStory from './LabelSwitch';
import GeneralTableStory from './GeneralTable';

let textButtonStory = storiesOf('Textbutton', module).addDecorator(withKnobs);
TextButtonStory.forEach((story) => {
  textButtonStory = textButtonStory.add(story.name, story.func);
});

let labelStory = storiesOf('LabelSwitch', module).addDecorator(withKnobs);
LabelSwitchStory.forEach((story) => {
  labelStory = labelStory.add(story.name, story.func);
});

const generalTableStory = storiesOf('GeneralTable', module).addDecorator(withKnobs);
GeneralTableStory.forEach((story) => {
  generalTableStory.add(story.name, story.func);
});
