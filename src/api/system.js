const VERSION_URL = '/api/v1/ui/versions';
const ENV_PATH = '/api/v1/ui/envs';
const CAPTCHA_PATH = '/auth/v1/captcha';

function getVersionInfo() {
  return this.$reqGet(VERSION_URL).then(rsp => rsp.data.result);
}
function getEnv() {
  return this.$reqGet(ENV_PATH).then(rsp => rsp.data.result);
}

function getCaptcha() {
  return this.$reqGet(CAPTCHA_PATH).then(rsp => rsp.data);
}

export default {
  getVersionInfo,
  getEnv,
  getCaptcha,
};
