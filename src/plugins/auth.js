import md5 from 'js-md5';
import qs from 'qs';
import { mapGetters } from 'vuex';
import 'babel-polyfill';

const LOGIN_PATH = '/auth/v3/login';
const ENTERPRISE_PATH = '/auth/v3/enterprise';
const TOKEN_PATH = '/auth/v2/token';

const ENV_PATH = '/api/v1/ui/envs';

const BF_LOGIN = '/BF_login';

function failPromise(msg) {
  return new Promise((resolve, reject) => {
    reject(msg);
  });
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}

function getRobots(userInfo) {
  const that = this;
  if (userInfo.type < 2) {
    return that.$reqGet(`${ENTERPRISE_PATH}/${userInfo.enterprise}/apps`)
      .then(rsp => rsp.data.result);
  }
  const groups = userInfo.roles.groups;
  const apps = userInfo.roles.apps;
  let promise;

  const robots = [];
  robots.push(...apps);
  groups.forEach((group) => {
    if (promise) {
      promise = promise.then(() => that.$reqGet(`${ENTERPRISE_PATH}/${userInfo.enterprise}/group/${group.id}`));
    } else {
      promise = that.$reqGet(`${ENTERPRISE_PATH}/${userInfo.enterprise}/group/${group.id}`);
    }
    promise = promise.then((rsp) => {
      const data = rsp.data;
      if (data.result) {
        data.result.apps.forEach((app) => {
          app.role = group.role;
        });
        robots.push(...data.result.apps);
      }
    });
  });
  if (promise) {
    return promise.then(() => robots);
  }
  return new Promise(r => r(robots));
}

function setInfoWithToken(token) {
  const that = this;
  if (token === undefined || token === '' || token === null) {
    return new Promise((r, j) => { j('Invalid token'); });
  }
  const jwt = parseJwt(token);
  const userInfo = jwt.custom;
  const enterprise = userInfo.enterprise;
  let enterpriseInfos = [];
  let modules = [];
  const userRoleMap = {};
  let robots = [];

  that.$setReqToken(token);
  return that.$reqGet(`${TOKEN_PATH}`)
  .then(() => {
    if (userInfo.type === 0) {
      return that.$reqGet(`${ENTERPRISE_PATH}s`);
    }
    return that.$reqGet(`${ENTERPRISE_PATH}/${enterprise}`);
  })
  .then((rsp) => {
    const data = rsp.data;
    if (userInfo.type === 0) {
      enterpriseInfos = data.result;
    } else {
      enterpriseInfos = [data.result];
    }
  })
  .then(() => getRobots.bind(that)(userInfo))
  .then((result) => {
    robots = result;
    robots.forEach((robot) => {
      userRoleMap[robot.id] = robot.role;
    });
  })
  .then(() => that.$reqGet(`${ENTERPRISE_PATH}/${enterprise}/modules`))
  .then((rsp) => {
    const data = rsp.data;
    modules = data.result;
  })
  .then(() => new Promise((r) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    localStorage.setItem('enterprise', JSON.stringify(enterprise));
    localStorage.setItem('token', token);
    localStorage.setItem('enterpriseInfo', JSON.stringify(enterpriseInfos));
    localStorage.setItem('modules', JSON.stringify(modules));
    localStorage.setItem('robots', JSON.stringify(robots));
    localStorage.setItem('roleMap', JSON.stringify(userRoleMap));
    r(userInfo);
  }));
}

function login(input) {
  const that = this;
  const params = {
    account: input.account,
    passwd: md5(input.password),
  };

  let token;
  return that.$reqGet(ENV_PATH).then((envRsp) => {
    let authTypes = ['all'];
    const res = envRsp.data;
    if (res.result.AUTH_TYPE) {
      authTypes = res.result.AUTH_TYPE.split(',');
    }

    const promiseMap = {};
    if (authTypes.indexOf('all') >= 0 || authTypes.indexOf('authV2') >= 0) {
      promiseMap.authV2 = that.$reqPost(LOGIN_PATH, qs.stringify(params), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((rsp) => {
        const data = rsp.data;
        token = data.result.token;
        localStorage.setItem('token', token);
        return token;
      });
    }
    if (authTypes.indexOf('all') >= 0 || authTypes.indexOf('authBF') >= 0) {
      promiseMap.authBF = that.$reqPost(BF_LOGIN, {
        email: input.account,
        password: md5(input.password),
      })
      .then((rsp) => {
        const data = rsp.data;
        if (data.error_code !== 0) {
          return failPromise('bf logging fail');
        }
        const accessToken = data.data.access_token;
        that.$cookie.set('access_token', accessToken);
        return accessToken;
      });
    }
    const keys = Object.keys(promiseMap);
    if (keys.length <= 0) {
      return failPromise('no valid auth set');
    }
    return Promise.all(keys.map(key => promiseMap[key])).then((args) => {
      const ret = {};
      args.forEach((val, idx) => {
        ret[keys[idx]] = val;
      });
      return ret;
    });
  });
}

function checkToken(token) {
  return this.$reqGet(`${TOKEN_PATH}/${token}`);
}

function checkPrivilege(moduleCode, cmd) {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const isAdmin = userInfo.type <= 1;

  if (isAdmin) {
    return true;
  }

  const roleInfo = JSON.parse(localStorage.getItem('role'));
  const privilege = roleInfo.privileges;

  if (Object.keys(privilege).indexOf(moduleCode) !== -1) {
    return privilege[moduleCode].indexOf(cmd) !== -1;
  }
  return false;
}

function clearAuth() {
  this.$cookie.delete('appid');
  this.$cookie.delete('user_id');
  localStorage.removeItem('userInfo');
  localStorage.removeItem('token');
  localStorage.removeItem('enterpriseInfo');
  localStorage.removeItem('enterprise');
  localStorage.removeItem('modules');
  localStorage.removeItem('role');
}

function logout() {
  clearAuth.bind(this)();
  window.location = '/login.html';
}

function getToken() {
  return localStorage.getItem('token');
}

function getUserEnterprises() {
  try {
    return JSON.parse(localStorage.getItem('enterpriseInfo'));
  } catch (e) {
    logout();
    return {};
  }
}

function getPrivModules() {
  return JSON.parse(localStorage.getItem('modules'));
}

function getRobotsFromStorage() {
  return JSON.parse(localStorage.getItem('robots'));
}

function hasRight(cmd) {
  if (this.$options.privCode) {
    return this.$store.getters.hasPrivilege(this.$options.privCode, cmd);
  }
  return false;
}

const MyPlugin = {
  install(Vue) {
    Vue.prototype.$checkPrivilege = checkPrivilege;

    Vue.prototype.$login = login;
    Vue.prototype.$checkToken = checkToken;
    Vue.prototype.$getToken = getToken;
    Vue.prototype.$logout = logout;
    Vue.prototype.$setIntoWithToken = setInfoWithToken;
    Vue.prototype.$getUserEnterprises = getUserEnterprises;
    Vue.prototype.$getPrivModules = getPrivModules;
    Vue.prototype.$loadRobotOfUser = getRobots;
    Vue.prototype.$getRobots = getRobotsFromStorage;
    Vue.prototype.$hasRight = hasRight;
  },
};

export default MyPlugin;
