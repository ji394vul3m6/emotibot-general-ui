const VERSION_URL = '/api/v1/ui/versions';
const ENV_PATH = '/api/v1/ui/envs';
const CAPTCHA_PATH = '/auth/v1/captcha';
const LOGO_PATH = '/api/v1/ui/logo';

function getVersionInfo() {
  return this.$reqGet(VERSION_URL).then(rsp => rsp.data.result);
}
function getEnv() {
  return this.$reqGet(ENV_PATH).then(rsp => rsp.data.result);
}

function getCaptcha() {
  return this.$reqGet(CAPTCHA_PATH).then(rsp => rsp.data);
}

function getIconURL(iconType, enterprise) {
  return `${LOGO_PATH}?type=${iconType}${enterprise ? `&enterprise=${enterprise}` : ''}`;
}
function getIcon(iconType, enterprise) {
  return this.$reqGet(getIconURL(iconType, enterprise)).then(rsp => rsp.data);
}

export default {
  getVersionInfo,
  getEnv,
  getCaptcha,

  getIconURL,
  getIcon,
};
