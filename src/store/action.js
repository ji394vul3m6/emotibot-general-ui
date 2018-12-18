import api from '@/api/system';
import * as types from '@/store/mutations_type';

export default {
  getEnv({ commit }, instance) {
    return api.getEnv.call(instance)
    .then((data) => {
      commit(types.SET_ENV, data);
    });
  },
};
