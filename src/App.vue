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
      <div id="chat-test-pop" :class="{show: isChatOpen}">
        <component :is="testComponent"></component>
      </div>
      </transition>
      </template>
      <!-- if robotID is empty, but enterpriseID not, show enterprise admin page -->
      <template v-else-if="robotID === '' && ready">
        <div id="app-page" class="manage">
          <router-view class="app-body" @startLoading="startLoading" @endLoading="endLoading"/>
          <div v-if="showLoading" class="loading manage">
            <div class='loader'></div>
            {{ loadingMsg || $t('general.loading') }}
          </div>
        </div>
      </template>
      <template v-if="showUserInfoPage && ready">
        <user-preference/>
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
import constant from '@/utils/js/constant';
import UserPreference from '@/manage-modules/UserPreference';

const defaultPath = '/statistic-dash';

const debugCodeArr = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let debugCodeIdx = 0;
let debugTimer;

export default {
  name: 'app',
  components: {
    'page-header': PageHeader,
    'page-menu': PageMenu,
    'user-preference': UserPreference,
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
      'userPrivilege',
      'showUserInfoPage',
      'showLanguage',
      'privilegeList',
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
      checkCookieMs: 5000,
      checkCookieLoop: undefined,
    };
  },
  watch: {
    enterpriseID() {
      console.log('here');
      this.setPrivilegeList(this.$getPrivModules());
    },
    robotID(val) {
      if (val === '') {
        return;
      }
      this.$cookie.set('appid', val, { expires: constant.cookieTimeout });
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
      this.$cookie.set('userid', this.userID, { expires: constant.cookieTimeout });
    },
    $route() {
      this.checkPrivilege();
      this.endLoading();
    },
    showLanguage(val) {
      this.$i18n.locale = val;
      this.$root.$forceUpdate();
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
      if (that.enterpriseID === '') {
        if (that.userInfo.type >= 1) {
          that.$router.push('error');
          return;
        }
        // when renterprise is empty, path should only in enterprise list or system user list
        const validURL = [
          '/manage/enterprise-manage',
          '/manage/system-admin-list',
        ];
        const valid = that.$route.matched.reduce((val, match) =>
          val || validURL.indexOf(match.path) >= 0, false);
        if (!valid) {
          that.$router.push('/manage/enterprise-manage');
          return;
        }
      }
      if (that.robotID === '') {
        // when robotID or enterprise is empty, path should in manage page only
        if (that.$route.matched.length <= 0 || that.$route.matched[0].path !== '/manage') {
          that.$router.push('/manage/robot-manage');
          return;
        }
        return;
      }

      const route = that.$route.matched[0];
      if (!route.components.default) {
        return;
      }
      const component = route.components.default;
      if (that.userInfo.type < 2) {
        // system admin and enterprise admin can use all module active in enterprise
        if (that.privilegeList.findIndex(l => l.code === component.privCode) < 0) {
          that.$router.push('error');
          return;
        }
        return;
      }
      // TODO: get user privilege of specific robot
      const privileges = that.userPrivilege;
      console.log(privileges);

      const codes = Object.keys(privileges);
      // If user has no privileges, invalid user
      // TODO: if user has no privileges of this robot, return to list
      if (codes.length === 0) {
        that.$router.push('/manage/robot-manage');
        return;
      }

      if (that.$route.matched.length <= 0) {
        if (that.$route.fullPath === '/') {
          that.$router.push(defaultPath);
        } else {
          that.$router.push('error');
        }
        return;
      }
      const commands = privileges[component.privCode];
      if (codes.indexOf(component.privCode) < 0 ||
        (commands.indexOf('view') < 0 && commands.indexOf('edit') < 0)) {
        let foundPage = false;
        Object.keys(modules).forEach((moduleName) => {
          if (foundPage) {
            return;
          }
          const pageModule = modules[moduleName];
          if (!pageModule.pages) {
            return;
          }
          Object.keys(pageModule.pages).forEach((pageName) => {
            const page = pageModule.pages[pageName];
            if (!foundPage && codes.indexOf(page.privCode) >= 0) {
              const codeCommands = privileges[page.privCode];
              if (codeCommands.indexOf('view') >= 0 || codeCommands.indexOf('edit') >= 0) {
                that.goPage(pageModule, page);
                foundPage = true;
              }
            }
          });
        });
        if (!foundPage) {
          that.$router.push('error');
        }
      }
    },
    goPage(pageModule, page) {
      const that = this;
      const newPage = {
        path: page.path,
        name: `${pageModule.displayNameKey}.${page.displayNameKey}`,
        display: `pages.${pageModule.displayNameKey}.${page.displayNameKey}`,
        privCode: page.privCode,
        icon: `${page.icon}`,
        isIFrame: page.isIFrame && true,
      };
      that.$router.push(`/${page.path}`);
      that.setCurrentPage(newPage);
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
      const privileges = that.userPrivilege || {};
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
            // check if module is available in the enterprise
            if (that.privilegeList.findIndex(p => p.code === page.privCode) < 0) {
              return;
            }

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
    checkCookie() {
      const that = this;
      that.checkCookieLoop = undefined;
      if (!that.$cookie.get('verify')) {
        that.$logout();
        that.goLoginPage();
      } else if (that.checkCookieLoop === undefined) {
        that.checkCookieLoop = setTimeout(() => {
          that.checkCookie();
        }, that.checkCookieMs);
      }
    },
    goLoginPage(notification) {
      const that = this;
      const fullPath = that.$route.fullPath;
      if (notification) {
        window.location = `/login.html?invalid=1&redirect=${encodeURIComponent(fullPath)}`;
      } else {
        window.location = `/login.html?redirect=${encodeURIComponent(fullPath)}`;
      }
    },
    debugListener(e) {
      if (debugTimer) {
        clearTimeout(debugTimer);
        debugTimer = undefined;
      }

      const code = e.code;
      if (code === debugCodeArr[debugCodeIdx]) {
        debugCodeIdx += 1;
      } else if (code === debugCodeArr[0]) {
        debugCodeIdx = 1;
      }

      if (debugCodeIdx === debugCodeArr.length) {
        window.open('/version.html');
        debugCodeIdx = 0;
      } else if (debugCodeIdx !== 0) {
        debugTimer = setTimeout(() => {
          debugCodeIdx = 0;
        }, 500);
      }
    },
  },
  mounted() {
    const that = this;
    const token = that.$getToken();

    if (!token) {
      that.goLoginPage(false);
    }

    that.checkCookie();
    that.$setReqToken(token);
    that.$setIntoWithToken(token).then(() => {
      const enterpriseList = that.$getUserEnterprises();
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      that.userInfo = userInfo;
      that.setUser(userInfo.id);
      that.setUserInfo(userInfo);
      that.setPrivilegedEnterprise(enterpriseList);
      if (userInfo.type !== 0) {
        const robots = that.$getRobots();
        const userRoleMap = JSON.parse(localStorage.getItem('roleMap'));
        that.setRobotList(robots);
        that.setUserRoleMap(userRoleMap);
        that.setPrivilegeList(that.$getPrivModules());
        // that.setupPages();
      }
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

    window.addEventListener('keydown', that.debugListener);
  },
};
</script>

<style lang="scss">
@import "styles/reset.scss";
@import "styles/main.scss";
@import "styles/editors.scss";

@import './assets/styles/lib/font-awesome.css';

#app-page > div.loading {
  @media screen and (max-width: $break-small) {
    left: 0;
    top: $page-header-height;
    width: 100vw
  }
  &.manage {
    width: 100vw;
    left: 0;
  }
  position: fixed;
  top: $page-header-height;
  left: $page-menu-width;
  height: 100%;
  width: calc(100vw - #{$page-menu-width});
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
  right: -700px;
  top: 0;
  height: 100vh;
  width: 700px;
  background: #EEEEEE;
  box-shadow: 0 0 5px #CCCCCC;
  transition: right 1s;
  &.show {
    right: 0px;
  }
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
