<template>
  <div id="app">
    <div id="app-logo"></div>
    <page-header></page-header>
    <page-menu></page-menu>
    <div id="app-page">
      <router-view/>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/layout/Header';
import PageMenu from '@/components/layout/Menu';

export default {
  name: 'app',
  components: {
    'page-header': PageHeader,
    'page-menu': PageMenu,
  },
  methods: {
    // hideFloatMenu(e) {
    //   console.log(e.eventPhase);
    //   const floats = document.querySelectorAll('.float-menu');
    //   floats.forEach((floatMenu) => {
    //     if (!e.target || !floatMenu.contains(e.target)) {
    //       console.log(floatMenu);
    //       floatMenu.classList.remove('show');
    //     }
    //   });
    // },
  },
  mounted() {
    // window.addEventListener('click', this.hideFloatMenu);
  },
};
</script>

<style lang="scss">
@import "./assets/styles/main.scss";
@import "./assets/styles/reset.scss";
</style>
