import { configure } from '@storybook/vue';

import Vue from 'vue';
import Vuex from 'vuex'; // Vue plugins

// Import your custom components.
import Icon from '../src/components/basic/Icon';
import Tag from '../src/components/basic/Tag';

// Install Vue plugins.
Vue.use(Vuex);
Vue.component('icon', Icon);
Vue.component('tag', Tag);

// Register custom components.
// Vue.component('my-button', Mybutton);

function loadStories() {
  // You can require as many stories as you need.
  require('../src/stories');
}

configure(loadStories, module);