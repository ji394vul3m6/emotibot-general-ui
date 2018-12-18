import Vue from 'vue';
import Vuex from 'vuex';

import qalist from '@/modules/FAQ/_store';
import wordbank from '@/modules/Wordbank/_store';
import statistics from '@/modules/Statistics/_store';

import * as getters from './getter';
import actions from './action';
import { state, mutations } from './mutations';


Vue.use(Vuex);

const modules = {};
modules[`${qalist.name}-module`] = qalist;
modules[`${wordbank.name}-module`] = wordbank;
modules[`${statistics.name}-module`] = statistics;

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules,
});
