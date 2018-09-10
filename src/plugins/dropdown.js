import DropdownMenu from '../components/basic/DropdownMenu';

function getPosition(el, alignLeft) {
  const boundedBox = el.getBoundingClientRect();
  if (alignLeft) {
    return {
      x: boundedBox.right, // align by right edge
      y: boundedBox.top + boundedBox.height + 3,
    };
  }
  return {
    x: boundedBox.left, // align by left edge
    y: boundedBox.top + boundedBox.height + 3,
  };
}

const MyPlugin = {
  install(Vue) {
    Vue.directive('dropdown', {
      inserted(el, binding, vnode) {
        vnode.context.$nextTick(() => {
          const DropdownGenerator = Vue.extend(DropdownMenu);
          let vm = new DropdownGenerator({
            propsData: {
              x: getPosition(el, binding.value.alignLeft).x,
              y: getPosition(el, binding.value.alignLeft).y,
              options: binding.value.options,
              width: binding.value.width,
              alignLeft: binding.value.alignLeft,
            },
          });
          vm.$mount();
          el.appendChild(vm.$el);
          vm.$forceUpdate();


          el.addEventListener('dropdown-reload', () => {
            el.removeChild(vm.$el);
            vm.$destroy();
            vm = new DropdownGenerator({
              propsData: {
                x: getPosition(el, binding.value.alignLeft).x,
                y: getPosition(el, binding.value.alignLeft).y,
                options: binding.value.options,
                width: binding.value.width,
                alignLeft: binding.value.alignLeft,
              },
            });
            vm.$mount();
            el.appendChild(vm.$el);
            vm.$forceUpdate();
          });

          el.addEventListener('dropdown-show', () => {
            vm.$emit('show', getPosition(el, binding.value.alignLeft));
          });
          el.addEventListener('dropdown-hide', () => {
            el.dispatchEvent(new Event('dropdownHidden'));
            vm.$emit('hide');
          });

          const dropdown = vm.$el;
          el.addEventListener('click', (clickEvent) => {
            vm.$emit('show', getPosition(el, binding.value.alignLeft));
            const detectClickListener = (e) => {
              const clickDom = e.target;
              if (clickDom && !dropdown.contains(clickDom)) {
                el.dispatchEvent(new Event('dropdownHidden'));
                vm.$emit('hide');
                window.removeEventListener('click', detectClickListener);
              }
            };
            window.addEventListener('click', detectClickListener);
            const detectScrollListener = (e) => {
              const clickDom = e.target;
              if (clickDom && !dropdown.contains(clickDom)) {
                el.dispatchEvent(new Event('dropdownHidden'));
                vm.$emit('hide');
                window.removeEventListener('scroll', detectScrollListener, true);
              }
            };
            window.addEventListener('scroll', detectScrollListener, true);
            clickEvent.stopPropagation();
          });
        });
      },
    });
  },
};

export default MyPlugin;
