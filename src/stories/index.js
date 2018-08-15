// import Vue from 'vue';

import { storiesOf } from '@storybook/vue';
import { withKnobs } from '@storybook/addon-knobs';

import Vue from 'vue';
import VueI18n from 'vue-i18n';
import messages from '@/i18n';

import WelcomeStory from './Welcome';
import TextButtonStory from './TextButton';
import LabelSwitchStory from './LabelSwitch';
import GeneralTableStory from './GeneralTable';
import NavBarStory from './NavigationBar';
import DropdownSelectStory from './DropdownSelect';
import TooltipStory from './Tooltip';
import TagInputStory from './TagInput';
import InputStory from './Input';
import ToggleStory from './Toggle';
import DropdownMenuStory from './DropdownMenu';
import LoadingStory from './Loading';

import './storybook.scss';

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'zh-cn',
  messages,
});

/** Basic Components */
const welcomeStory = storiesOf('Welcome', module).addDecorator(withKnobs);
WelcomeStory.forEach((story) => {
  welcomeStory.add(story.name, story.func);
});

let textButtonStory = storiesOf('Basic|TextButton', module).addDecorator(withKnobs);
TextButtonStory.forEach((story) => {
  textButtonStory = textButtonStory.add(story.name, story.func);
});

const toggleStory = storiesOf('Basic|Toggle', module).addDecorator(withKnobs);
ToggleStory.forEach((story) => {
  toggleStory.add(story.name, story.func);
});

const loadingStory = storiesOf('Basic|Loading', module).addDecorator(withKnobs);
LoadingStory.forEach((story) => {
  loadingStory.add(story.name, story.func);
});

const inputStory = storiesOf('Basic|Input', module).addDecorator(withKnobs);
InputStory.forEach((story) => {
  inputStory.add(story.name, story.func.bind(null, i18n));
});

const tagInputStory = storiesOf('Basic|TagInput', module).addDecorator(withKnobs);
TagInputStory.forEach((story) => {
  tagInputStory.add(story.name, story.func);
});

const dropdownSelectStory = storiesOf('Basic|DropdownSelect', module).addDecorator(withKnobs);
DropdownSelectStory.forEach((story) => {
  dropdownSelectStory.add(story.name, story.func);
});

let labelStory = storiesOf('Basic|LabelSwitch', module).addDecorator(withKnobs);
LabelSwitchStory.forEach((story) => {
  labelStory = labelStory.add(story.name, story.func);
});

const NavigationBarStory = storiesOf('Basic|NavigationBar', module).addDecorator(withKnobs);
NavBarStory.forEach((story) => {
  NavigationBarStory.add(story.name, story.func);
});

const generalTableStory = storiesOf('Basic|GeneralTable', module).addDecorator(withKnobs);
GeneralTableStory.forEach((story) => {
  generalTableStory.add(story.name, story.func.bind(null, i18n));
});


/** Plugins */
const tooltipStory = storiesOf('Plugin|Tooltip', module).addDecorator(withKnobs);
TooltipStory.forEach((story) => {
  tooltipStory.add(story.name, story.func);
});

const dropdownMenuStory = storiesOf('Plugin|DropdownMenu', module).addDecorator(withKnobs);
DropdownMenuStory.forEach((story) => {
  dropdownMenuStory.add(story.name, story.func);
});
