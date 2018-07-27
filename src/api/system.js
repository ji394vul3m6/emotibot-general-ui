const VERSION_URL = '/api/v1/ui/versions';

function getVersionInfo() {
  return this.$reqGet(VERSION_URL).then(rsp => rsp.data.result);
}

export default {
  getVersionInfo,
};
