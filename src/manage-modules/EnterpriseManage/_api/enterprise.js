const ENTERPRISES_URL = '/auth/v3/enterprises';

function getEnterprises() {
  return this.$reqGet(ENTERPRISES_URL).then(rsp => rsp.data.result);
}

export default {
  getEnterprises,
};
