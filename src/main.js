// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueCookie from 'vue-cookie';
import VueI18n from 'vue-i18n';
import 'es6-promise/auto';

import TextButton from '@/components/basic/TextButton';
import SearchInput from '@/components/basic/SearchInput';

import App from './App';
import router from './router';
import store from './store';
import messages from './i18n';
import PopWindow from './plugins/PopWindow';
import CustomNotification from './plugins/CustomNotification';
import request from './plugins/request';
import './plugins/Polyfill';

Vue.config.productionTip = false;
Vue.use(VueCookie);
Vue.use(VueI18n);
Vue.use(PopWindow);
Vue.use(CustomNotification, {
  delay: 4000,
});
Vue.use(request);

Vue.component('text-button', TextButton);
Vue.component('search-input', SearchInput);

const i18n = new VueI18n({
  locale: 'zh-cn',
  messages,
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  i18n,
  components: { App },
});
