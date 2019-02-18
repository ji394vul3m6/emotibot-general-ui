import DropdownMenu from '../components/basic/DropdownMenu';

const dropdownMap = {};

function randomID() {
  return parseInt(Math.random() * 100000, 10).toString();
}

const MyPlugin = {
  getPosition(el, alignLeft) {
    const boundedBox = el.getBoundingClientRect();
    const ret = {
      x: boundedBox.left, // align by left edge
      y: boundedBox.top + boundedBox.height + 3,
      anchorRect: boundedBox,
    };
    if (alignLeft) {
      ret.x = boundedBox.right;  // align by right edge
    }

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
          const position = that.getPosition(el, binding.value.alignLeft);
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

          const tempID = randomID();
          el.dataset.id = tempID;
          dropdownMap[tempID] = vm;

          const body = document.querySelector('body');
          body.appendChild(vm.$el);
          vm.$forceUpdate();


          el.addEventListener('dropdown-reload', ({ detail: value = binding.value }) => {
            const newPos = that.getPosition(el, value.alignLeft);
            body.removeChild(vm.$el);
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
            const id = el.dataset.id;
            dropdownMap[id] = vm;

            vm.$mount();
            body.appendChild(vm.$el);
            vm.$forceUpdate();
          });

          el.addEventListener('dropdown-show', () => {
            vm.$emit('show', that.getPosition(el, binding.value.alignLeft));
          });
          el.addEventListener('dropdown-hide', () => {
            el.dispatchEvent(new Event('dropdownHidden'));
            vm.$emit('hide');
          });

          el.addEventListener('click', () => {
            vm.$emit('show', that.getPosition(el, binding.value.alignLeft));
            that.addEventListeners(vm, el, binding.value.alignLeft);
          });
        });
      },
      unbind(el) {
        const id = el.dataset.id;
        const body = document.querySelector('body');
        body.removeChild(dropdownMap[id].$el);
        dropdownMap[id].$destroy();
        delete dropdownMap[id];
      },
    });
  },
};

export default MyPlugin;
