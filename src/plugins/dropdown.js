import DropdownMenu from '../components/basic/DropdownMenu';

const MyPlugin = {
  getPosition(el, alignLeft) {
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
  },
  addEventListeners(vm, el, alignLeft) {
    const resizeCallback = () => {
      vm.$emit('show', this.getPosition(el, alignLeft));
    };
    const hideCallback = (e) => {
      if (el && !el.contains(e.target)) {
        el.dispatchEvent(new Event('dropdownHidden'));
        vm.$emit('hide');
        this.removeEventListeners(window, hideCallback, resizeCallback);
      }
    };

    window.addEventListener('click', hideCallback);
    window.addEventListener('scroll', hideCallback, true);
    window.addEventListener('resize', resizeCallback);
  },
  removeEventListeners(target, hideCallback, resizeCallback) {
    target.removeEventListener('click', hideCallback);
    target.removeEventListener('scroll', hideCallback, true);
    target.removeEventListener('resize', resizeCallback);
  },
  install(Vue) {
    const that = this;
    Vue.directive('dropdown', {
      inserted(el, binding, vnode) {
        vnode.context.$nextTick(() => {
          const DropdownGenerator = Vue.extend(DropdownMenu);
          let vm = new DropdownGenerator({
            propsData: {
              x: that.getPosition(el, binding.value.alignLeft).x,
              y: that.getPosition(el, binding.value.alignLeft).y,
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
                x: that.getPosition(el, binding.value.alignLeft).x,
                y: that.getPosition(el, binding.value.alignLeft).y,
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
            vm.$emit('show', that.getPosition(el, binding.value.alignLeft));
          });
          el.addEventListener('dropdown-hide', () => {
            el.dispatchEvent(new Event('dropdownHidden'));
            vm.$emit('hide');
            that.removeEventListeners(vm, el, binding.value.alignLeft);
          });

          el.addEventListener('click', () => {
            vm.$emit('show', that.getPosition(el, binding.value.alignLeft));
            that.addEventListeners(vm, el, binding.value.alignLeft);
          });
        });
      },
    });
  },
};

export default MyPlugin;
