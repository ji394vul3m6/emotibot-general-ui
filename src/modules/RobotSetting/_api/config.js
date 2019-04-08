const CONFIG_GET_URL = '/api/v1/robot/configs';
const CONFIG_UPDATE_URL = '/api/v1/robot/config';
const IMPORT_CUSTOM_CHAT_QUESTION_URL = '/api/v1/customchat/import/question';
const IMPORT_CUSTOM_CHAT_EXTEND_URL = '/api/v1/customchat/import/extend';
const EXPORT_CUSTOM_CHAT_URL = '/api/v1/customchat/export/question';

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

function importCustomChat(type, file) {
  let ret = '';
  const data = new FormData();
  data.append('file', file);
  if (type === 0) {
    ret = this.$reqPost(IMPORT_CUSTOM_CHAT_QUESTION_URL, data).then(rsp => rsp.data.result);
  } else {
    ret = this.$reqPost(IMPORT_CUSTOM_CHAT_EXTEND_URL, data).then(rsp => rsp.data.result);
  }
  return ret;
}

function exportCustomChat() {
  // let ret = '';
  // ret = this.$reqGet(EXPORT_CUSTOM_CHAT_URL).then(rsp => rsp.data.result);
  // return ret;
  window.open(EXPORT_CUSTOM_CHAT_URL);
}

export default {
  getConfigs,
  setConfig,
  importCustomChat,
  exportCustomChat,
};
