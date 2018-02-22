<template>
  <div id="app">
    <div id="app-logo"></div>
    <page-header></page-header>
    <page-menu></page-menu>
    <div id="app-page">
      <div class="app-header">{{$t(`pages.${pageName}`)}}</div>
      <router-view class="app-body"/>
    </div>
    <pop-windows></pop-windows>
    <notification></notification>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import modules from '@/modules';
import PageHeader from '@/components/layout/Header';
import PageMenu from '@/components/layout/Menu';
import privilegeAPI from '@/api/privileges';

export default {
  name: 'app',
  components: {
    'page-header': PageHeader,
    'page-menu': PageMenu,
  },
  computed: {
    pageName() {
      return this.$route.name;
    },
  },
  methods: {
    ...mapMutations([
      'setPrivilegeList',
      'setPageInfos',
    ]),
    setupPages() {
      const that = this;
      const pages = [];
      Object.keys(modules).forEach((moduleName) => {
        const pageModule = modules[moduleName];
        const modulePages = [];
        Object.keys(pageModule.pages).forEach((pageName) => {
          const page = pageModule.pages[pageName];
          modulePages.push({
            path: page.path,
            name: page.displayNameKey,
            display: `pages.${pageModule.displayNameKey}.${page.displayNameKey}`,
            privCode: page.privCode,
            icon: `${page.icon}_icon`,
          });
        });
        pages.push({
          path: pageModule.path,
          name: moduleName,
          display: `pages.${pageModule.displayNameKey}.module_name`,
          pages: modulePages,
          icon: `${pageModule.icon}_icon`,
        });
      });
      that.setPageInfos(pages);
    },
  },
  mounted() {
    privilegeAPI.getPrivileges().then((privileges) => {
      this.setPrivilegeList(privileges);
    });
    this.setupPages();
  },
};
</script>

<style lang="scss">
@import "styles/reset.scss";
@import "styles/variable";
@import "styles/main.scss";
</style>
