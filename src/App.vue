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
  methods: {
    ...mapMutations([
      'setPrivilegeList',
      'setPageInfos',
    ]),
    setupPages() {
      const pages = [];
      Object.keys(modules).forEach((moduleName) => {
        const pageModule = modules[moduleName];
        const modulePages = [];
        Object.keys(pageModule.pages).forEach((pageName) => {
          const page = pageModule.pages[pageName];
          modulePages.push({
            path: page.path,
            name: page.name,
            display: `pages.${pageModule.displayNameKey}.${page.displayNameKey}`,
            privCode: page.privCode,
            icon: `${page.icon}Icon`,
          });
        });
        pages.push({
          path: pageModule.path,
          name: moduleName,
          display: `pages.${pageModule.displayNameKey}.module_name`,
          pages: modulePages,
          icon: `${pageModule.icon}Icon`,
        });
      });
      this.setPageInfos(pages);
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
