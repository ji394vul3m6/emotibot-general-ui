import event from '@/utils/js/event';
import Tooltip from '../components/basic/Tooltip';

function getPosition(el, absolute = false) {
  if (absolute) {
    const parentRight = el.parentElement.getBoundingClientRect().right;
    const right = el.getBoundingClientRect().right;
    const parentTop = el.parentElement.getBoundingClientRect().top;
    const top = el.getBoundingClientRect().top;
    return {
      x: parentRight - right,
      y: top - parentTop,
    };
  }
  const boundedBox = el.getBoundingClientRect();
  return {
    x: boundedBox.right,
    y: boundedBox.top,
  };
}
const MyPlugin = {
  install(Vue) {
    Vue.directive('tooltip', {
      inserted(el, binding, vnode) {
        const parent = el.parentElement;
        if (binding.value.absolute && !parent.style.position) { parent.style.position = 'relative'; }

        let scrollParent;
        let boundedBox = el.getBoundingClientRect();
        vnode.context.$nextTick(() => {
          const TooltipGenerator = Vue.extend(Tooltip);
          let vm = new TooltipGenerator({
            propsData: {
              x: boundedBox.right,
              y: boundedBox.top,
              msg: binding.value.msg,
              msgs: binding.value.msgs || [],
              leftOffset: binding.value.left || 0,
              topOffset: binding.value.top || 0,
              buttons: binding.value.buttons || [],
              data: binding.value.data,
              tooltipType: binding.value.errorType ? 'error' : 'default',
              alignLeft: binding.value.alignLeft || false,
              absolute: binding.value.absolute,
            },
          });
          vm.$mount();
          parent.insertBefore(vm.$el, el.nextSibling);
          vm.$forceUpdate();

          for (let temp = parent; temp != null; temp = temp.parentElement) {
            if (temp.scrollHeight !== temp.clientHeight) {
              scrollParent = temp;
              break;
            }
          }
          if (scrollParent) {
            scrollParent.addEventListener('scroll', () => {
              const parentPos = scrollParent.getBoundingClientRect();
              const pos = el.getBoundingClientRect();
              const inRange = parentPos.top <= pos.top && parentPos.bottom >= pos.bottom;
              if (!inRange && vm.show) {
                el.dispatchEvent(event.createEvent('tooltip-hide'));
                vm.hideWithScroll = true;
              } else if (inRange && (vm.show || vm.hideWithScroll)) {
                el.dispatchEvent(event.createEvent('tooltip-show'));
                vm.hideWithScroll = false;
              }
            });
          }

          el.addEventListener('tooltip-reload', () => {
            vm.$el.parentNode.removeChild(vm.$el); // IE 11 do not support Element.remove()
            vm.$destroy();
            boundedBox = el.getBoundingClientRect();
            vm = new TooltipGenerator({
              propsData: {
                x: boundedBox.right,
                y: boundedBox.top,
                msg: binding.value.msg,
                msgs: binding.value.msgs || [],
                leftOffset: binding.value.left || 0,
                topOffset: binding.value.top || 0,
                buttons: binding.value.buttons || [],
                data: binding.value.data,
                tooltipType: binding.value.errorType ? 'error' : 'default',
                alignLeft: binding.value.alignLeft || false,
                absolute: binding.value.absolute,
              },
            });
            vm.$mount();
            parent.insertBefore(vm.$el, el.nextSibling);
            vm.$forceUpdate();
          });
          el.addEventListener('tooltip-show', (e) => {
            if (e.target !== el) {
              return;
            }
            if (scrollParent) {
              const parentPos = scrollParent.getBoundingClientRect();
              const pos = el.getBoundingClientRect();
              const inRange = parentPos.top <= pos.top && parentPos.bottom >= pos.bottom;
              if (!inRange) {
                vm.hideWithScroll = true;
                return;
              }
            }
            vm.$emit('show', getPosition(el, binding.value.absolute));
          });
          el.addEventListener('tooltip-hide', () => {
            vm.$emit('hide');
          });

          if (binding.value.clickShow) {
            const tooltip = vm.$el;
            el.addEventListener('click', (clickEvent) => {
              vm.$emit('show', getPosition(el, binding.value.absolute));
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
              vm.$emit('show', getPosition(el, binding.value.absolute));
            });
            el.addEventListener('mouseout', () => {
              vm.$emit('hide');
            });
          }
        });
      },
      unbind(el) {
        if (el.nextSibling) {
          el.removeChild(el.nextSibling);  // IE 11 do not support Element.remove()
        }
      },
    });
  },
};

export default MyPlugin;
