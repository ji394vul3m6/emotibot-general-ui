// import Vue from 'vue';

import { storiesOf } from '@storybook/vue';
import { withKnobs } from '@storybook/addon-knobs';

import Vue from 'vue';
import VueI18n from 'vue-i18n';
import messages from '@/i18n';

import TextButtonStory from './TextButton';
import LabelSwitchStory from './LabelSwitch';
import GeneralTableStory from './GeneralTable';
import NavBarStory from './NavigationBar';
import DropdownSelectStory from './DropdownSelect';
import TooltipStory from './Tooltip';
import TagInputStory from './TagInput';

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'zh-cn',
  messages,
});

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
  generalTableStory.add(story.name, story.func.bind(null, i18n));
});

const NavigationBarStory = storiesOf('NavigationBar', module).addDecorator(withKnobs);
NavBarStory.forEach((story) => {
  NavigationBarStory.add(story.name, story.func);
});

const dropdownSelectStory = storiesOf('DropdownSelect', module).addDecorator(withKnobs);
DropdownSelectStory.forEach((story) => {
  dropdownSelectStory.add(story.name, story.func);
});

const tooltipStory = storiesOf('Tooltip', module).addDecorator(withKnobs);
TooltipStory.forEach((story) => {
  tooltipStory.add(story.name, story.func);
});

const tagInputStory = storiesOf('TagInput', module).addDecorator(withKnobs);
TagInputStory.forEach((story) => {
  tagInputStory.add(story.name, story.func);
});
