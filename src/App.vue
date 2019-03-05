<template>
  <div id="app">
    <div :class="{blur: isBackgroundBlur}">
      <div id="app-logo" :class="$i18n.locale" ref="logo"></div>
      <page-header v-if="ready"></page-header>
      <!-- if not Manage Module, show robot page -->
      <template v-if="!isManageModule && ready">
      <page-menu></page-menu>
      <div id="app-page" v-if="ready" :class="{iframe: isIFrame}">
        <!-- <div class="app-header" v-if="!isIFrame">{{ pageName }}</div> -->
        <div v-if="showLoading" class="app-body">
          <div class="loading card h-fill w-fill">
            <loading-dot></loading-dot>
            <div class="loading-msg"> {{ loadingMsg || $t('general.loading') }}</div>
          </div>
        </div>
        <router-view class="app-body" :class="{iframe: isIFrame}" @startLoading="startLoading" @endLoading="endLoading"/>
      </div>
      <transition name="slide-in">
      <div id="chat-test-pop" :class="{show: isChatOpen}">
        <component :is="testComponent"></component>
      </div>
      </transition>
      </template>
      <!-- if isManageModule, show enterprise admin page -->
      <template v-else-if="isManageModule && ready">
        <div id="app-page" class="manage">
          <div v-if="showLoading" class="app-body">
            <div class="loading card h-fill w-fill">
              <loading-dot></loading-dot>
              <div class="loading-msg"> {{ loadingMsg || $t('general.loading') }}</div>
            </div>
          </div>
          <router-view class="app-body" @startLoading="startLoading" @endLoading="endLoading"/>
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
import { mapMutations, mapGetters, mapActions } from 'vuex';
import modules from '@/modules';
import PageHeader from '@/components/layout/Header';
import PageMenu from '@/components/layout/Menu';
import QATest from '@/modules/SSM/QATestFloat';
import constant from '@/utils/js/constant';
import UserPreference from '@/manage-modules/UserPreference';
import userAPI from '@/manage-modules/_api/user';
import adminAPI from '@/manage-modules/SystemManage/_api/system';
import systemAPI from '@/api/system';
import misc from '@/utils/js/misc';

const defaultPath = '/statistic-dash';

const debugCodeArr = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let debugCodeIdx = 0;
let debugTimer;

function forceUpdate(vueObj) {
  vueObj.$children.forEach((child) => {
    forceUpdate(child);
  });
  vueObj.$forceUpdate();
}

export default {
  name: 'app',
  components: {
    'page-header': PageHeader,
    'page-menu': PageMenu,
    'user-preference': UserPreference,
  },
  api: [userAPI, adminAPI, systemAPI],
  computed: {
    pageName() {
      return this.$t(this.currentPage.display);
    },
    isIFrame() {
      return this.currentPage.isIFrame;
    },
    isManageModule() {
      const manageModule = /^\/manage(.*)?/;
      return manageModule.test(this.$route.path);
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
      'environment',
      'UIModules',
    ]),
  },
  data() {
    return {
      showLoading: false,
      loadingMsg: '',
      ready: false,
      userInfo: {},
      isBackgroundBlur: false,
      testComponent: QATest,
      checkCookieMs: 5000,
      checkCookieLoop: undefined,
    };
  },
  watch: {
    enterpriseID(val) {
      this.setPrivilegeList(this.$getPrivModules());
      this.$cookie.set('enterprise', val, { expires: constant.cookieTimeout });
      this.loadLogo();
    },
    robotID(val) {
      if (val === '') {
        return;
      }
      this.$cookie.set('appid', val, { expires: constant.cookieTimeout });
      this.$setReqAppid(val);
      this.getUIModule.call(null, this);

      const robotData = {
        appid: val,
      };
      const str = JSON.stringify(robotData);
      const expires = new Date();
      expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000));
      // no using context.$cookie because of it will encoded cookie value
      document.cookie = `robotDataJson=${str}; expires=${expires.toGMTString()};path=/`;
      this.setupPages();
      this.closeChatTest();
    },
    userID() {
      this.$cookie.set('userid', this.userID, { expires: constant.cookieTimeout });
    },
    $route() {
      if (!this.ready) {
        return;
      }
      this.checkPrivilege();
      this.endLoading();
    },
    showLanguage(val) {
      this.$i18n.locale = val;
      forceUpdate(this.$root);
    },
  },
  methods: {
    ...mapActions(['getEnv', 'getUIModule']),
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
      'setRobot',
      'setEnterprise',
      'setLanguage',
    ]),
    checkAuditRoute() {
      const that = this;
      const auditURL = [
        '/manage/audit-system',     // 0
        '/manage/audit-enterprise', // 1
        '/manage/audit-robot',      // 2
      ];
      const isAuditURL = that.$route.matched.reduce((val, match) =>
        val || auditURL.indexOf(match.path) !== -1, false);
      if (!isAuditURL) return false;

      // Users can only go to audit page according to it's previledge
      if (that.userInfo.type >= 2) {  // normal user
        if (auditURL.splice(that.userInfo.type).indexOf(that.$route.path) === -1) {
          that.$router.push('/manage/audit-robot');
        }
      } else if (that.userInfo.type === 1) {  // enterprise admin
        if (auditURL.splice(that.userInfo.type).indexOf(that.$route.path) === -1) {
          that.$router.push('/manage/audit-enterprise');
        }
      } // else system admin, can go wherever he/she wants
      return true;
    },
    checkPrivilege() {
      const that = this;

      const isAuditRoute = this.checkAuditRoute();
      if (isAuditRoute) {
        return;
      }

      if (that.enterpriseID === '') {
        if (that.userInfo.type >= 1) {
          that.$router.push('error');
          return;
        }
        // when enterprise is empty, path should only in enterprise list or system user list
        const validURL = [
          '/manage/enterprise-manage',
          '/manage/system-admin-list',
          '/manage/audit-system',
          '/manage/system-setting',
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

      // check if user use 'last page' to go management page, not use button on page
      that.$route.matched.forEach((route) => {
        if (route.path === '/manage') {
          if (that.robotID !== '') {
            that.setRobot('');
            that.$router.push('/manage/robot-manage');
          } else if (that.enterpriseID !== '') {
            that.setEnterprise('');
            that.$router.push('/manage/enterprise-manage');
          }
        }
      });

      const route = that.$route.matched[0];
      if (!route.components.default) {
        return;
      }
      const component = route.components.default;
      if (that.userInfo.type < 2) {
        // system admin and enterprise admin can use all module active in enterprise
        if (that.privilegeList.findIndex(l => l.code === component.privCode) < 0) {
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
              if (!foundPage && that.privilegeList.findIndex(l => l.code === page.privCode) >= 0) {
                that.goPage(pageModule, page);
                foundPage = true;
              }
            });
          });
          if (!foundPage) {
            that.$router.push('error');
          }
          return;
        }
        return;
      }
      // TODO: get user privilege of specific robot
      const privileges = that.userPrivilege;

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
          that.$router.push('/error');
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
        that.$logout(true);
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

      const ssoLoginPath = that.environment.SSO_LOGIN_URL;
      if (ssoLoginPath) {
        window.location = `${ssoLoginPath}?redirect=${window.location}`;
        return;
      }
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
    loadLogo() {
      const that = this;

      // load logo of enterprise, if fail, try to load system's logo
      this.$api.getIcon('app', that.enterpriseID).then(() => {
        that.$refs.logo.style.backgroundImage = `url("${that.$api.getIconURL('app', that.enterpriseID)}")`;
      }, () => this.$api.getIcon('app', '').then(() => {
        that.$refs.logo.style.backgroundImage = `url("${that.$api.getIconURL('app', '')}")`;
      }))
      .catch(() => {
        that.$refs.logo.classList.add('default');
        that.$refs.logo.style.backgroundImage = '';
      });

      that.$api.getIcon('favicon', that.enterpriseID).then(() => {
        misc.changeFavicon(that.$api.getIconURL('favicon', that.enterpriseID));
      }, () => that.$api.getIcon('favicon', '').then(() => {
        misc.changeFavicon(that.$api.getIconURL('favicon', ''));
      }))
      .catch(() => {
        misc.changeFavicon('/static/favicon.png');
      });
    },
    setup() {
      const that = this;
      const token = that.$getToken();
      // that.checkCookie();
      that.$setReqToken(token);
      this.getEnv.call(null, this)
      .then(() => this.getUIModule.call(null, this))
      .then(() => {}, () => {
        console.log('Get UI modules Fail');
      })
      .then(() => that.$setIntoWithToken(token))
      .then(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        let getUserInfoPromise;
        if (userInfo.type === 0) {
          getUserInfoPromise = that.$api.getAdmin(userInfo.id);
        } else {
          getUserInfoPromise = that.$api.getEnterpriseUser(userInfo.enterprise, userInfo.id);
        }
        return getUserInfoPromise;
      })
      .then((data) => {
        const enterpriseList = that.$getUserEnterprises();
        that.userInfo = data;
        that.setUser(data.id);
        that.setUserInfo(data);
        that.setPrivilegedEnterprise(enterpriseList);
        if (data.type !== 0) {
          const robots = that.$getRobots();
          const userRoleMap = JSON.parse(localStorage.getItem('roleMap'));
          that.setRobotList(robots);
          that.setUserRoleMap(userRoleMap);
          that.setPrivilegeList(that.$getPrivModules());
          // that.setupPages();
        }
        that.checkPrivilege();
        that.ready = true;
      })
      .then(() => {
        that.loadLogo();
      })
      .catch((err) => {
        console.log(err);
        that.goLoginPage();
      });

      that.$root.$on('pop-window', () => {
        that.$nextTick(() => {
          that.isBackgroundBlur = that.$isBackgroundBlur();
        });
      });
      that.$root.$on('close-window', () => {
        that.$nextTick(() => {
          that.isBackgroundBlur = that.$isBackgroundBlur();
        });
      });
      that.$root.$on('open-chat-test', () => {
        that.openChatTest();
      });
      that.$root.$on('close-chat-test', () => {
        that.closeChatTest();
      });

      that.$root.$on('reload-logo', () => {
        that.loadLogo();
      });

      window.addEventListener('keydown', that.debugListener);
    },
  },
  mounted() {
    this.setup();
  },
};
</script>

<style lang="scss">
@import "styles/reset.scss";
@import "styles/main.scss";
@import "styles/editors.scss";

@import './assets/styles/lib/font-awesome.css';

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @include font-14px();
  color: $color-font-mark;
  .loading-msg {
    margin-top: 20px;
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
#app-page {
  z-index: 0;
}
</style>
