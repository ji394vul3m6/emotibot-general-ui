// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueCookie from 'vue-cookie';
import VueI18n from 'vue-i18n';
import 'es6-promise/auto';

import Login from './LoginPage';
import messages from './i18n';
import PopWindow from './plugins/PopWindow';
import request from './plugins/request';
import auth from './plugins/auth';
import './plugins/Polyfill';

Vue.use(VueCookie);
Vue.use(VueI18n);
Vue.use(PopWindow);
Vue.use(request);
Vue.use(auth);

const i18n = new VueI18n({
  locale: 'zh-cn',
  messages,
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<login/>',
  i18n,
  components: { Login },
});
