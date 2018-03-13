import QAListUtil from './QAListUtil';

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  qaQueryOptions: QAListUtil.genDefaultQueryOptions(),
  qalist: {
    doQuery: false,
  },
};

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  setQAQueryOptions(_, newOptions) {
    state.qaQueryOptions = Object.assign(state.qaQueryOptions, newOptions);
  },
  doQuery(_, toDqQuery) {
    state.qalist.doQuery = toDqQuery;
  },
};

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
  setQAKeyword: ({ commit }) => commit('setQAKeyword'),
};

// getters are functions
const getters = {
  doQueryState: s => s.qalist.doQuery,
  searchCategoryID: s => s.qaQueryOptions.category_id,
  curPage: s => s.qaQueryOptions.cur_page,
};

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default {
  name: 'qalist',
  state,
  getters,
  actions,
  mutations,
};
