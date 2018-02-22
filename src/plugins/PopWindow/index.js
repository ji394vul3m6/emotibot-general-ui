import PopWindows from './PopWindows';

function popWindow(option) {
  this.$root.$emit('pop-window', option);
}

const MyPlugin = {
  install(Vue) {
    Vue.component(PopWindows.name, PopWindows);

    Vue.prototype.$pop = popWindow;
  },
};

export default MyPlugin;
