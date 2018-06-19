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
            },
          });
          vm.$mount();
          parent.appendChild(vm.$el);
          vm.$forceUpdate();

          el.addEventListener('tooltip-reload', () => {
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

        /*
        tooltip.innerText = binding.value.msg;

        const boundedBox = el.getBoundingClientRect();

        const styleText = `
          position: fixed;
          word-break: break-all;

          max-width: 172px;
          border-radius: 4px;
          background-color: #ffffff;
          box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
          padding: 8px 16px;
        `;

        tooltip.style.cssText = styleText;
        tooltip.style.visibility = 'hidden';

        vnode.context.$nextTick(() => {
          tooltip.style.top = `${boundedBox.top - tooltip.clientHeight - 8}px`;
          tooltip.style.left = `${boundedBox.left}px`;
        });

        if (binding.value.clickShow) {
          el.addEventListener('click', (clickEvent) => {
            tooltip.style.visibility = 'visible';
            const detectClickListener = (e) => {
              const clickDom = e.target;
              if (clickDom && !tooltip.contains(clickDom)) {
                tooltip.style.visibility = 'hidden';
                window.removeEventListener('click', detectClickListener);
              }
            };
            window.addEventListener('click', detectClickListener);
            clickEvent.stopPropagation();
          });
        } else {
          el.addEventListener('mouseover', () => {
            tooltip.style.visibility = 'visible';
          });
          el.addEventListener('mouseout', () => {
            tooltip.style.visibility = 'hidden';
          });
        }
        */
      },
    });
  },
};

export default MyPlugin;
