const VERSION_URL = '/api/v1/ui/versions';
const ENV_PATH = '/api/v1/ui/envs';

function getVersionInfo() {
  return this.$reqGet(VERSION_URL).then(rsp => rsp.data.result);
}
function getEnv() {
  return this.$reqGet(ENV_PATH).then(rsp => rsp.data.result);
}

export default {
  getVersionInfo,
  getEnv,
};
