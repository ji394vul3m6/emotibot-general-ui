<template>
  <div>
    <pop-window v-for="popWindow in popWindows" ref="pops" :key="popWindow.name"></pop-window>
  </div>
</template>

<script>
import Vue from 'vue';
import PopWindow from '@/components/layout/PopWindow';

export default {
  name: 'pop-windows',
  components: {
    PopWindow,
  },
  data() {
    return {
      popWindows: [],
    };
  },
  methods: {
    showPopWindow(option) {
      if (this.popWindows.length > 0) {
        const lastOption = this.popWindows[this.popWindows.length - 1];
        if (option.component === lastOption.component) {
          this.popWindows.pop();
        }
      }
      this.popWindows.push(option);

      const idx = this.popWindows.length - 1;
      const that = this;
      Vue.nextTick(() => {
        that.$refs.pops[idx].showWindow(option);
      });
    },
    hidePopWindowCheck(e) {
      const event = e || window.event;

      // Close pop up window if press exit
      if (event.keyCode === 27 && this.popWindows.length > 0) {
        const idx = this.popWindows.length - 1;
        this.$refs.pops[idx].hideWindow();

        e.stopPropagation();
        e.preventDefault();
      }
    },
  },
  mounted() {
    this.$root.$on('pop-window', this.showPopWindow);
  },
};
</script>

<style lang="scss" scoped>

</style>
