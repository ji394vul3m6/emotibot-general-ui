import CustomNotification from '@/components/layout/CustomNotification';

let globalOption = {};

function popNotification(option) {
  const localOption = {};
  Object.assign(localOption, option);
  Object.keys(globalOption).forEach((k) => {
    if (option[k] === undefined) {
      localOption[k] = globalOption[k];
    }
  });
  this.$root.$emit('notification', localOption);
}

const MyPlugin = {
  install(Vue, option) {
    // user can use notifications as tag to use notification in web
    Vue.component(CustomNotification.name, CustomNotification);

    // setup global option
    globalOption = option;
    Vue.prototype.$notificationSetting = option;
    Vue.prototype.$setNotificationSetting = (opt) => {
      Vue.$notificationSetting = opt;
      globalOption = opt;
    };

    // user can use vue.$notify to use notification
    Vue.prototype.$notify = popNotification;
  },
};

export default MyPlugin;