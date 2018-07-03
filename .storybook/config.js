import { configure } from '@storybook/vue';

import Vue from 'vue';
import Vuex from 'vuex'; // Vue plugins

// Import your custom components.
import Icon from '../src/components/basic/Icon';
import Tag from '../src/components/basic/Tag';
import Textbutton from '../src/components/basic/TextButton';

// Import self plugins.
import tooltip from '../src/plugins/tooltip';

// Install Vue plugins.
Vue.use(Vuex);
Vue.use(tooltip);

// Install self component
Vue.component('icon', Icon);
Vue.component('tag', Tag);
Vue.component('text-button', Textbutton);

function loadStories() {
  // You can require as many stories as you need.
  require('../src/stories');
}

/** Have to comment out "background: url('...')"" in main.scss 
 *  for storybook to work for now */
require('../src/assets/styles/reset.scss');
require('../src/assets/styles/main.scss'); 

configure(loadStories, module);