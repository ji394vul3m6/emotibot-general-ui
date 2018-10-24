import DropdownMenu from '../components/basic/DropdownMenu';

const MyPlugin = {
  getPosition(el, alignLeft, optionLength) {  // eslint-disable-line
    const boundedBox = el.getBoundingClientRect();
    const ret = {
      x: boundedBox.left, // align by left edge
      y: boundedBox.top + boundedBox.height + 3,
    };
    if (alignLeft) {
      ret.x = boundedBox.right;  // align by right edge
    }

    // const dropdownHeight = (optionLength || 0) * 32;
    // if (ret.y + dropdownHeight > window.innerHeight) {
    //   ret.y = window.innerHeight - dropdownHeight;
    // }
    return ret;
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
          const position = that.getPosition(el, binding.value.alignLeft,
            binding.value.options.length);
          let vm = new DropdownGenerator({
            propsData: {
              x: position.x,
              y: position.y,
              options: binding.value.options,
              width: binding.value.width,
              alignLeft: binding.value.alignLeft,
            },
          });
          vm.$mount();
          el.appendChild(vm.$el);
          vm.$forceUpdate();


          el.addEventListener('dropdown-reload', ({ detail: value }) => {
            const newPos = that.getPosition(el, value.alignLeft,
              value.options.length);
            el.removeChild(vm.$el);
            vm.$destroy();
            vm = new DropdownGenerator({
              propsData: {
                x: newPos.x,
                y: newPos.y,
                options: value.options,
                width: value.width,
                alignLeft: value.alignLeft,
              },
            });
            vm.$mount();
            el.appendChild(vm.$el);
            vm.$forceUpdate();
          });

          el.addEventListener('dropdown-show', () => {
            vm.$emit('show', that.getPosition(el, binding.value.alignLeft, binding.value.options.length));
          });
          el.addEventListener('dropdown-hide', () => {
            el.dispatchEvent(new Event('dropdownHidden'));
            vm.$emit('hide');
            that.removeEventListeners(vm, el, binding.value.alignLeft);
          });

          el.addEventListener('click', () => {
            vm.$emit('show', that.getPosition(el, binding.value.alignLeft, binding.value.options.length));
            that.addEventListeners(vm, el, binding.value.alignLeft);
          });
        });
      },
    });
  },
};

export default MyPlugin;
