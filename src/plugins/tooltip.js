import Tooltip from '../components/basic/Tooltip';

function getPosition(el) {
  const boundedBox = el.getBoundingClientRect();
  return {
    x: boundedBox.left,
    y: boundedBox.top,
  };
}

const MyPlugin = {
  install(Vue) {
    Vue.directive('tooltip', {
      inserted(el, binding, vnode) {
        const parent = el.parentElement;
        const boundedBox = el.getBoundingClientRect();
        vnode.context.$nextTick(() => {
          const TooltipGenerator = Vue.extend(Tooltip);
          let vm = new TooltipGenerator({
            propsData: {
              x: boundedBox.left,
              y: boundedBox.top,
              msg: binding.value.msg,
              leftOffset: binding.value.left || 0,
              topOffset: binding.value.top || 0,
              buttons: binding.value.buttons || [],
              data: binding.value.data,
              tooltipType: binding.value.errorType ? 'error' : 'default',
            },
          });
          vm.$mount();
          parent.appendChild(vm.$el);
          vm.$forceUpdate();

          el.addEventListener('tooltip-reload', () => {
            parent.removeChild(vm.$el);
            vm.$destroy();
            vm = new TooltipGenerator({
              propsData: {
                x: boundedBox.left,
                y: boundedBox.top,
                msg: binding.value.msg,
                leftOffset: binding.value.left || 0,
                topOffset: binding.value.top || 0,
                buttons: binding.value.buttons || [],
                data: binding.value.data,
                tooltipType: binding.value.errorType ? 'error' : 'default',
              },
            });
            vm.$mount();
            parent.appendChild(vm.$el);
            vm.$forceUpdate();
          });
          el.addEventListener('tooltip-show', () => {
            vm.$emit('show', getPosition(el));
          });
          el.addEventListener('tooltip-hide', () => {
            vm.$emit('hide');
          });

          if (binding.value.clickShow) {
            const tooltip = vm.$el;
            el.addEventListener('click', (clickEvent) => {
              vm.$emit('show', getPosition(el));
              const detectClickListener = (e) => {
                const clickDom = e.target;
                if (clickDom && !tooltip.contains(clickDom)) {
                  vm.$emit('hide');
                  window.removeEventListener('click', detectClickListener);
                }
              };
              window.addEventListener('click', detectClickListener);
              clickEvent.stopPropagation();
            });
          } else if (binding.value.animateShow) {
            el.addEventListener('tooltip-show', () => {
              setTimeout(() => {
                vm.$emit('hide');
              }, binding.value.animateTime || 3000);
            });
          } else if (!binding.value.eventOnly) {
            el.addEventListener('mouseover', () => {
              vm.$emit('show', getPosition(el));
            });
            el.addEventListener('mouseout', () => {
              vm.$emit('hide');
            });
          }
        });
      },
    });
  },
};

export default MyPlugin;
