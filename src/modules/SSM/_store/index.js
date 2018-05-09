import QAListUtil from './QAListUtil';
import LearningState from '../_data/learningState';
import LearningType from '../_data/learningType';
import LearningUtil from './LearningUtil';

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  qaQueryOptions: QAListUtil.genDefaultQueryOptions(),
  qalist: {
    doQuery: false,
  },
  learning: {
    state: LearningState.COLLECTIONS,
    type: LearningType.UNMATCHED,
    selectedCollection: {
      id: undefined,
      title: '',
      clusters: [],
      totalRecords: 0,
    },
    selectedCluster: {
      id: undefined,
      label: [],
      records: [],
      totalRecords: 0,
    },
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
  setLearningState(_, newState) {
    state.learning.state = newState;
  },
  setSelectedType(_, newType) {
    state.learning.type = newType;
  },
  resetLearning() {
    state.learning = {
      state: LearningState.COLLECTIONS,
      type: LearningType.UNMATCHED,
      selectedCollection: {
        id: undefined,
        title: '',
        clusters: [],
        totalRecords: 0,
      },
      selectedCluster: {
        id: undefined,
        label: [],
        records: [],
        totalRecords: 0,
      },
    };
  },
};

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
  changeLearningRecordPage: ({ commit }, page) => {
    const collection = state.learning.selectedCollection;
    const cluster = state.learning.selectedCluster;

    LearningUtil.queryRecords(collection.id, cluster.id, page, 10)
    .then((records) => {
      const fullCluster = {
        id: cluster.id,
        label: cluster.label,
        records,
        totalRecords: cluster.totalRecords,
      };
      commit('setSelectedCluster', fullCluster);
    });
  },
};

// getters are functions
const getters = {
  doQueryState: s => s.qalist.doQuery,
  searchCategoryID: s => s.qaQueryOptions.category_id,
  curPage: s => s.qaQueryOptions.cur_page,
  qaQueryOptions: s => s.qaQueryOptions,
  qaQueryDimension: s => s.qaQueryOptions.dimension,
  learningState: s => s.learning.state,
  learningType: s => s.learning.type,
  learningCollectionName: s => s.learning.selectedCollection.title,
  learningSelectedCollection: s => s.learning.selectedCollection,
  learningSelectedCluster: s => s.learning.selectedCluster,
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
