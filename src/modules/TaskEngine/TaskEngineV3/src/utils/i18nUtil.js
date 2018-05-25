export default {
  getLocaleMsgs(vueI18n) {
    if (vueI18n) {
      return vueI18n.messages['zh-cn'];
    }
    return {};
  },
};
