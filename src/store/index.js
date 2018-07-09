import Vue from 'vue';
import Vuex from 'vuex';

import qalist from '@/modules/FAQ/_store';
import wordbank from '@/modules/Wordbank/_store';

import * as getters from './getter';
import * as actions from './action';
import { state, mutations } from './mutations';


Vue.use(Vuex);

const modules = {};
modules[`${qalist.name}-module`] = qalist;
modules[`${wordbank.name}-module`] = wordbank;

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules,
});
