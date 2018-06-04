/*
request.js wrapped the axios library
It will do extra operations for all request
ex: add auth token, log request, etc.
After ajax finish, check error code automatically
*/
import axios from 'axios';

let appid = '';
let token = '';

function addCustomHeader(config) {
  let option = Object.assign({}, config);
  if (!config) {
    option = {};
  }
  // TODO: correct header should add here
  if (!option.headers) {
    option.headers = {};
  }
  option.headers['X-Appid'] = appid;
  option.headers.Authorization = `Bearer ${token}`;
  option.headers.Access_token = this.$cookie.get('access_token');
  return option;
}

function handleUnAuthenticated() {
  this.$logout();
}

function checkAjaxError(context, error) {
  let status;
  if (error.response) {
    status = error.response.status;
  }

  if (status === 401) {
    handleUnAuthenticated.bind(this)();
  }

  // handle only 500 series status code in plugin
  // 400 series may has different meanings for different modules
  if (status >= 500) {
    context.$notify({
      text: `${context.$t('general.error_code')} ${status}`,
      type: 'fail',
    });
  }
  throw error;
}

function ajax(config) {
  const that = this;
  const getConfigWithCustomHeader = addCustomHeader.bind(that);
  return axios(getConfigWithCustomHeader(config)).catch((err) => {
    checkAjaxError.bind(this)(that, err);
  });
}

function customType(url, type, data, config) {
  let option = Object.assign({}, config);
  if (!config) {
    option = {};
  }
  option.data = data;
  option.method = type;
  option.url = url;
  return this.$reqAjax(option);
}

function get(url, config) {
  let option = Object.assign({}, config);
  if (!config) {
    option = {};
  }
  option.method = 'get';
  option.url = url;
  return this.$reqAjax(option);
}

function put(url, data, config) {
  return this.$reqCustom(url, 'put', data, config);
}

function post(url, data, config) {
  return this.$reqCustom(url, 'post', data, config);
}

function patch(url, data, config) {
  return this.$reqCustom(url, 'patch', data, config);
}

function deleteReq(url, config) {
  return this.$reqCustom(url, 'delete', {}, config);
}

const MyPlugin = {
  install(Vue) {
    Vue.prototype.$reqGet = get;
    Vue.prototype.$reqCustom = customType;
    Vue.prototype.$reqPost = post;
    Vue.prototype.$reqPut = put;
    Vue.prototype.$reqDelete = deleteReq;
    Vue.prototype.$reqPatch = patch;
    Vue.prototype.$reqAjax = ajax;

    Vue.prototype.$setReqToken = function setUpToken(t) {
      token = t;
    };
    Vue.prototype.$setReqAppid = function setupRobot(id) {
      appid = id;
    };
  },
};

export default MyPlugin;
