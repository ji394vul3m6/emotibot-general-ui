<template>
  <div id="app">
    <div :class="{blur: isPopOpen}">
      <div id="app-logo"></div>
      <page-header v-if="ready"></page-header>
      <!-- if robotID is not empty, show robot page -->
      <template v-if="robotID !== '' && ready">
      <page-menu></page-menu>
      <div id="app-page" v-if="ready" :class="{iframe: isIFrame}">
        <!-- <div class="app-header" v-if="!isIFrame">{{ pageName }}</div> -->
        <router-view class="app-body" :class="{iframe: isIFrame}" @startLoading="startLoading" @endLoading="endLoading"/>
        <div v-if="showLoading" class="loading">
          <div class='loader'></div>
          {{ loadingMsg || $t('general.loading') }}
        </div>
      </div>
      <transition name="slide-in">
      <div id="chat-test-pop" v-if="isChatOpen">
        <component :is="testComponent"></component>
      </div>
      </transition>
      </template>
      <!-- if robotID is empty, but enterpriseID not, show enterprise admin page -->
      <template v-else-if="robotID === '' && ready">
        <div id="app-page" class="manage">
          <router-view class="app-body" @startLoading="startLoading" @endLoading="endLoading"/>
          <div v-if="showLoading" class="loading">
            <div class='loader'></div>
            {{ loadingMsg || $t('general.loading') }}
          </div>
        </div>
      </template>
    </div>
    <pop-windows></pop-windows>
    <notification></notification>
    <context-menu></context-menu>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import modules from '@/modules';
import PageHeader from '@/components/layout/Header';
import PageMenu from '@/components/layout/Menu';
import QATest from '@/modules/SSM/QATestFloat';

const defaultPath = '/statistic-dash';

export default {
  name: 'app',
  components: {
    'page-header': PageHeader,
    'page-menu': PageMenu,
  },
  computed: {
    pageName() {
      return this.$t(this.currentPage.display);
    },
    isIFrame() {
      return this.currentPage.isIFrame;
    },
    ...mapGetters([
      'robotID',
      'userID',
      'userRole',
      'currentPage',
      'isChatOpen',
      'enterpriseID',
    ]),
  },
  data() {
    return {
      showLoading: false,
      loadingMsg: '',
      ready: false,
      userInfo: {},
      isPopOpen: false,
      testComponent: QATest,
    };
  },
  watch: {
    robotID(val) {
      if (val === '') {
        return;
      }
      this.$cookie.set('appid', val);
      this.$setReqAppid(val);

      const robotData = {
        appid: val,
      };
      const str = JSON.stringify(robotData);
      const expires = new Date();
      expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000));
      // no using context.$cookie because of it will encoded cookie value
      document.cookie = `robotDataJson=${str}; expires=${expires.toGMTString()};path=/`;
      this.setupPages();
    },
    userID() {
      this.$cookie.set('userid', this.userID);
    },
    $route() {
      this.checkPrivilege();
      this.endLoading();
    },
  },
  methods: {
    ...mapMutations([
      'setPrivilegeList',
      'setPageInfos',
      'setPrivilegedEnterprise',
      'setRobot',
      'setRobotList',
      'setUser',
      'setUserRoleMap',
      'setCurrentPage',
      'openChatTest',
      'closeChatTest',
      'setUserInfo',
    ]),
    checkPrivilege() {
      const that = this;

      if (that.$route.matched.length <= 0) {
        if (that.$route.fullPath === '/') {
          that.$router.push(defaultPath);
        } else {
          that.$router.push('error');
        }
        return;
      }
      if (that.robotID === '') {
        // when robotID is empty, path should in manage page only
        if (that.$route.matched[0].path !== '/manage') {
          that.$router.push('/manage/robot-manage');
          return;
        }
        return;
      }

      if (that.userInfo.type < 2) {
        // system admin and enterprise admin can use all module
        return;
      }
      // TODO: get user privilege of specific robot
      const privileges = that.userRole.privileges;

      const codes = Object.keys(privileges);
      // If user has no privileges, invalid user
      // TODO: if user has no privileges of this robot, return to list
      if (codes.length === 0) {
        window.location = '/login.html?invalid=1';
      }

      const route = that.$route.matched[0];
      if (!route.components.default) {
        return;
      }
      const component = route.components.default;
      if (codes.indexOf(component.privCode) < 0) {
        that.$router.push('error');
        return;
      }

      const commands = privileges[component.privCode];
      if (commands.indexOf('view') < 0 && commands.indexOf('edit') < 0) {
        that.$router.push('error');
      }
    },
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
      const privileges = that.userRole.privileges || {};
      const privKeys = Object.keys(privileges);
      Object.keys(modules).forEach((moduleName) => {
        let moduleExpand = false;
        const pageModule = modules[moduleName];
        const modulePages = [];
        if (pageModule.hidden) {
          return;
        }
        if (pageModule.pages) {
          Object.keys(pageModule.pages).forEach((pageName) => {
            const page = pageModule.pages[pageName];
            if (that.userInfo.type >= 2) {
              if (page.hidden) {
                return;
              } else if (privKeys.indexOf(page.privCode) < 0) {
              // Not in privilege list
                return;
              } else if (privileges[page.privCode].indexOf('view') < 0 && privileges[page.privCode].indexOf('edit') < 0) {
              // In list, but has no view privilege
                return;
              }
            }
            const newPage = {
              path: page.path,
              name: `${pageModule.displayNameKey}.${page.displayNameKey}`,
              display: `pages.${pageModule.displayNameKey}.${page.displayNameKey}`,
              privCode: page.privCode,
              icon: `${page.icon}`,
              isIFrame: page.isIFrame && true,
            };
            modulePages.push(newPage);
            if (that.$route.matched.length > 0 && `/${page.path}` === this.$route.matched[0].path) {
              that.setCurrentPage(newPage);
              moduleExpand = true;
            }
          });
        }
        if (modulePages.length <= 0 && (pageModule.path === undefined || pageModule.path === '')) {
          return;
        }
        const newPage = {
          path: pageModule.path,
          name: `${pageModule.displayNameKey}.module_name`,
          display: `pages.${pageModule.displayNameKey}.module_name`,
          pages: modulePages,
          icon: `${pageModule.icon}`,
          isIFrame: pageModule.isIFrame && true,
          expanded: moduleExpand,
        };
        pages.push(newPage);
        if (that.$route.matched.length > 0 && `/${newPage.path}` === this.$route.matched[0].path) {
          that.setCurrentPage(newPage);
        }
      });
      that.setPageInfos(pages);
    },
  },
  mounted() {
    const that = this;
    const token = that.$getToken();
    that.$setReqToken(token);
    that.$setIntoWithToken(token).then(() => {
      const robots = that.$getRobots();
      const enterpriseList = that.$getUserEnterprises();
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      that.userInfo = userInfo;

      const userRoleMap = JSON.parse(localStorage.getItem('roleMap'));
      that.setPrivilegedEnterprise(enterpriseList);
      that.setRobotList(robots);
      that.setUser(userInfo.id);
      that.setUserInfo(userInfo);
      that.setUserRoleMap(userRoleMap);
      that.setPrivilegeList(that.$getPrivModules());
      // that.setupPages();
      that.checkPrivilege();

      that.ready = true;
    }).catch((err) => {
      console.log(err);
      const fullPath = that.$route.fullPath;
      window.location = `/login.html?invalid=1&redirect=${encodeURIComponent(fullPath)}`;
    });

    that.$root.$on('pop-window', () => {
      that.isPopOpen = that.$isPopOpen();
    });
    that.$root.$on('close-window', () => {
      that.isPopOpen = that.$isPopOpen();
    });
    that.$root.$on('open-chat-test', () => {
      that.openChatTest();
    });
    that.$root.$on('close-chat-test', () => {
      that.closeChatTest();
    });
  },
};
</script>

<style lang="scss">
@import "styles/reset.scss";
@import "styles/variable";
@import "styles/main.scss";
@import "styles/editors.scss";

@import './assets/styles/lib/font-awesome.css';

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
#chat-test-pop {
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: 700px;
  background: #EEEEEE;
  box-shadow: 0 0 5px #CCCCCC;
  .page {
    height: 100%;
  }

  &.slide-in-enter-active, &.slide-in-leave-active {
    transition: all .5s ease-in-out;
  }
  &.slide-in-enter, &.slide-in-leave-to {
    right: -700px;
  }
  &.slide-in-enter-to, &.slide-in-leave {
    right: 0;
  }
}
</style>
