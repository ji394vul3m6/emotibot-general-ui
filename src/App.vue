<template>
  <div id="app">
    <div id="app-logo"></div>
    <page-header></page-header>
    <page-menu></page-menu>
    <div id="app-page">
      <div class="app-header">{{$t(`pages.${pageName}`)}}</div>
      <router-view class="app-body" @startLoading="startLoading" @endLoading="endLoading"/>
      <div v-if="showLoading" class="loading">
        <div class='loader'></div>
        {{ loadingMsg || $t('general.loading') }}
      </div>
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
  data() {
    return {
      showLoading: false,
      loadingMsg: '',
    };
  },
  methods: {
    ...mapMutations([
      'setPrivilegeList',
      'setPageInfos',
    ]),
    startLoading(msg) {
      this.showLoading = true;
      this.loadingMsg = msg;
    },
    endLoading() {
      this.showLoading = false;
    },
    setupPages() {
      const that = this;
      const pages = [];
      Object.keys(modules).forEach((moduleName) => {
        const pageModule = modules[moduleName];
        const modulePages = [];
        if (pageModule.hidden) {
          return;
        }
        Object.keys(pageModule.pages).forEach((pageName) => {
          const page = pageModule.pages[pageName];
          if (page.hidden) {
            return;
          }
          modulePages.push({
            path: page.path,
            name: page.displayNameKey,
            display: `pages.${pageModule.displayNameKey}.${page.displayNameKey}`,
            privCode: page.privCode,
            icon: `${page.icon}`,
          });
        });
        pages.push({
          path: pageModule.path,
          name: moduleName,
          display: `pages.${pageModule.displayNameKey}.module_name`,
          pages: modulePages,
          icon: `${pageModule.icon}`,
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
#app-page > div.loading {
  @media screen and (max-width: $break-small) {
    left: 0;
    top: $page-header-height;
    width: 100vw
  }
  position: fixed;
  top: $page-header-height;
  left: $page-menu-width;
  height: 100%;
  width: calc(100% - #{$page-menu-width});
  background: rgba(0%, 0%, 0%, 0.6);
  color: white;
  font-size: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    25% { transform: rotate(192deg); }
    50% { transform: rotate(278deg); }
    75% { transform: rotate(336deg); }
    100% { transform: rotate(360deg); }
  }
  .loader {
    margin-right: 10px;
    border: 8px solid #f3f3f3; /* Light grey */
    border-top: 8px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 2s linear infinite;
  }
}
</style>
