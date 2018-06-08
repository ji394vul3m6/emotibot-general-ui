// import Vue from 'vue';

import { storiesOf } from '@storybook/vue';
import { withKnobs } from '@storybook/addon-knobs';

import TextButtonStory from './TextButton';
import LabelSwitchStory from './LabelSwitch';
import GeneralTableStory from './GeneralTable';
import NavBarStory from './NavigationBar';
import DropdownSelectStory from './DropdownSelect';

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

const NavigationBarStory = storiesOf('NavigationBar', module).addDecorator(withKnobs);
NavBarStory.forEach((story) => {
  NavigationBarStory.add(story.name, story.func);
});

const dropdownSelectStory = storiesOf('DropdownSelect', module).addDecorator(withKnobs);
DropdownSelectStory.forEach((story) => {
  dropdownSelectStory.add(story.name, story.func);
});
