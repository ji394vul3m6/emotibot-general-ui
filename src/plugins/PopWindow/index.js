
import ErrorForm from '@/components/pop/ErrorAlert';
import PopWindows from './PopWindows';

function popWindow(option) {
  this.$root.$emit('pop-window', option);
}

function popError(msg, info) {
  const that = this;
  const option = {
    title: that.$t('general.error'),
    component: ErrorForm,
    data: {
      msg,
      info,
    },
    buttons: ['ok'],
  };
  this.$root.$emit('pop-window', option);
}

const MyPlugin = {
  install(Vue) {
    Vue.component(PopWindows.name, PopWindows);

    Vue.prototype.$pop = popWindow;
    Vue.prototype.$popError = popError;
  },
};

export default MyPlugin;
