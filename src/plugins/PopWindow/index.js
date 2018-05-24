
import ErrorForm from '@/components/pop/ErrorAlert';
import CheckPop from '@/components/pop/CheckPop';
import PopWindows from './PopWindows';

function popWindow(option) {
  this.$root.$emit('pop-window', option);
}

function popCheck(option) {
  const that = this;
  option.component = CheckPop;
  that.$root.$emit('pop-window', option);
}

function popError(msg, info) {
  const that = this;
  return new Promise((resolve) => {
    const option = {
      title: that.$t('general.error'),
      component: ErrorForm,
      data: {
        msg,
        info,
      },
      callback: {
        ok: () => {
          resolve();
        },
        cancel: () => {
          resolve();
        },
      },
      buttons: ['ok'],
    };
    this.$root.$emit('pop-window', option);
  });
}


const MyPlugin = {
  install(Vue) {
    Vue.component(PopWindows.name, PopWindows);
    let popCount = 0;

    Vue.prototype.$pop = popWindow;
    Vue.prototype.$popError = popError;
    Vue.prototype.$popCheck = popCheck;
    Vue.prototype.$isPopOpen = () => popCount > 0;
    Vue.prototype.$setPopCount = (c) => { popCount = c; };
  },
};

export default MyPlugin;
