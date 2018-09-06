import DropdownMenu from '../components/basic/DropdownMenu';

function getPosition(el) {
  const boundedBox = el.getBoundingClientRect();
  return {
    x: boundedBox.width,
    y: boundedBox.height,
  };
}

const MyPlugin = {
  install(Vue) {
    Vue.directive('dropdown', {
      inserted(el, binding, vnode) {
        const boundedBox = el.getBoundingClientRect();
        vnode.context.$nextTick(() => {
          const DropdownGenerator = Vue.extend(DropdownMenu);
          let vm = new DropdownGenerator({
            propsData: {
              x: boundedBox.width,
              y: boundedBox.height,
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
                x: boundedBox.width,
                y: boundedBox.height,
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
            vm.$emit('show', getPosition(el));
          });
          el.addEventListener('dropdown-hide', () => {
            el.dispatchEvent(new Event('dropdownHidden'));
            vm.$emit('hide');
          });

          const dropdown = vm.$el;
          el.addEventListener('click', (clickEvent) => {
            vm.$emit('show', getPosition(el));
            const detectClickListener = (e) => {
              const clickDom = e.target;
              if (clickDom && !dropdown.contains(clickDom)) {
                el.dispatchEvent(new Event('dropdownHidden'));
                vm.$emit('hide');
                window.removeEventListener('click', detectClickListener);
              }
            };
            window.addEventListener('click', detectClickListener);
            clickEvent.stopPropagation();
          });
        });
      },
    });
  },
};

export default MyPlugin;
