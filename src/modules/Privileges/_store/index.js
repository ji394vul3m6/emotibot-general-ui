import * as type from './mutations_type';

const state = {
  roles: [],
};

const getters = {
  roles: s => s.roles,
};

const actions = {};

const mutations = {
  [type.SET_ROLES](s, roles) {
    s.roles = roles;
  },
};

export default {
  name: 'privileges',
  state,
  getters,
  actions,
  mutations,
};
