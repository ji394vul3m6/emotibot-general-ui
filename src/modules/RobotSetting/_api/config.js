const CONFIG_GET_URL = '/api/v1/robot/configs';
const CONFIG_UPDATE_URL = '/api/v1/robot/config';

function getConfigs() {
  return this.$reqGet(CONFIG_GET_URL).then(rsp => rsp.data.result);
}

function setConfig(key, mod, value) {
  const params = {
    configName: key,
    module: mod,
    value,
  };
  return this.$reqPutForm(CONFIG_UPDATE_URL, params).then(rsp => rsp.data.result);
}

export default {
  getConfigs,
  setConfig,
};
