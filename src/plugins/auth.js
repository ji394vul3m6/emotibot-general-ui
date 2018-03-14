import md5 from 'js-md5';
import axios from 'axios';
import object from '@/utils/js/object';
import 'babel-polyfill';

const LOGIN_PATH = '/auth/v1/user/login';
const LIST_PRIV_PATH = '/admin/v1/privileges';
// const LIST_PRIV_PATH = '/cauth/v1/cauth/privileges';
// const USER_PRIV_PATH = '/cauth/v1/cauth/user';
const USER_PRIV_PATH = '/auth/v1/user';

function apiPrivConverter(apiPriv, privileges) {
  const newPriv = {};
  if (apiPriv) {
    const privMap = {};
    privileges.forEach((priv) => {
      privMap[priv.privilege_id] = priv.privilege_name;
    });

    const privKeys = Object.keys(apiPriv);
    privKeys.forEach((id) => {
      newPriv[privMap[id]] = apiPriv[id];
    });
  }
  return newPriv;
}

function getUserPrivilege(context) {
  const userID = context.$cookie.get('userid');
  const getURL = `${USER_PRIV_PATH}/${userID}`;
  return axios.get(getURL).then(res => res.data);
}

function checkPrivilegeChange(context) {
  return getUserPrivilege(context).then((data) => {
    const privilegeList = JSON.parse(localStorage.getItem('privileges'));
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const origPriv = JSON.parse(userInfo.privilege);

    const apiNowPriv = JSON.parse(data.status === 0 ? data.result.privileges : '{}');
    const nowPriv = apiPrivConverter(apiNowPriv, privilegeList);
    return object.jsonEqual(origPriv, nowPriv);
  });
}

function getPrivilegeListFromLocal() {
  return JSON.parse(localStorage.getItem('privileges'));
}
function getPrivilegeList() {
  const that = this;
  const appid = that.$cookie.get('appid');

  return that.$reqGet(`${LIST_PRIV_PATH}a`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: appid,
    },
  }).then((res) => {
    const data = res.data;
    if (data.status !== 0) {
      return data;
    }

    const privList = data.result;
    privList.forEach((priv) => {
      if (priv.id) {
        priv.privilege_id = priv.id;
        delete priv.id;
      }

      if (priv.name) {
        priv.privilege_name = priv.name;
        delete priv.name;
      }

      if (priv.cmdlist) {
        priv.cmd_list = priv.cmdlist;
        delete priv.cmdlist;
      }
    });
    return data;
  });
}

function login(input) {
  const that = this;
  const params = new URLSearchParams();
  params.append('user_name', input.account);
  params.append('password', md5(input.password));
  params.append('raw_password', input.password);

  let tempUserInfo;

  return axios.post(LOGIN_PATH, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then((data) => {
    const ret = data.data;
    if (ret.status === 0) {
      tempUserInfo = ret.result;
      that.$cookie.set('appid', ret.result.appid || '', 1);
      that.$cookie.set('userid', ret.result.user_id || '', 1);
      const robotData = {
        appid: ret.result.appid,
      };
      const str = JSON.stringify(robotData);
      const expires = new Date();
      expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000));
      // no using that.$cookie because of it will encoded cookie value
      document.cookie = `robotDataJson=${str}; expires=${expires.toGMTString()};path=/`;
      // that.$cookie.set('robotDataJson', str);

      that.$cookie.set('locale', 'zh-cn');
    }
  })
  .then(() => getPrivilegeList.bind(that)())
  .then(ret => new Promise((resolve, reject) => {
    if (ret.status !== 0) {
      setTimeout(() => {
        reject(ret.message);
      }, 0);
    }

    const userPriv = JSON.parse(tempUserInfo.privilege);
    const newPriv = {};
    if (userPriv) {
      const privMap = {};
      ret.result.forEach((priv) => {
        privMap[priv.privilege_id] = priv.privilege_name;
      });

      const privKeys = Object.keys(userPriv);
      privKeys.forEach((id) => {
        newPriv[privMap[id]] = userPriv[id];
      });
      tempUserInfo.privilege = JSON.stringify(newPriv);
    }

    localStorage.setItem('privileges', JSON.stringify(ret.result));
    localStorage.setItem('userInfo', JSON.stringify(tempUserInfo));
    resolve(ret);
  }));
}

function checkAuth(context) {
  const userInfoStr = localStorage.getItem('userInfo');
  const session = context.$cookie.get('appid');
  if (session && userInfoStr) {
    context.$store.commit('setUserInfo', JSON.parse(userInfoStr));
  } else {
    this.clearAuth(context);
  }
  return context.$store.getters.isLogin;
}

function checkPrivilege(moduleCode, cmd) {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const privilege = JSON.parse(userInfo.privilege);
  const isAdmin = userInfo.user_type === 0;

  if (isAdmin) {
    return true;
  }

  if (Object.keys(privilege).indexOf(moduleCode) !== -1) {
    if (privilege[moduleCode].length === 0) {
      return true;
    }
    return privilege[moduleCode].indexOf(cmd) !== -1 || (privilege && privilege.length === 0);
  }
  return false;
}

function clearAuth() {
  this.$cookie.delete('appid');
  this.$cookie.delete('user_id');
  localStorage.removeItem('userInfo');
}

function logout() {
  clearAuth.bind(this)();
  window.location = '/login.html';
}


const MyPlugin = {
  install(Vue) {
    Vue.prototype.$login = login;
    Vue.prototype.$logout = logout;
    Vue.prototype.$getPrivilegeList = getPrivilegeList;
    Vue.prototype.$getPrivilegeListFromLocal = getPrivilegeListFromLocal;
    Vue.prototype.$checkPrivilege = checkPrivilege;
    Vue.prototype.$checkAuth = checkAuth;
    Vue.prototype.$checkPrivilegeChange = checkPrivilegeChange;
  },
};

export default MyPlugin;
