const MODULES_URL = '/auth/v3/modules';

function getModules() {
  return this.$reqGet(MODULES_URL).then(rsp => rsp.data.result);
}

export default {
  getModules,
};
