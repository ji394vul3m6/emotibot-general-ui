/*
request.js wrapped the axios library
It will do extra operations for all request
ex: add auth token, log request, etc.
*/
import axios from 'axios';

function addAdditionalHeader(config) {
  // TODO: correct header should add here
  if (config.headers) {
    config.headers['X-Custom-Header'] = 'test';
  } else {
    config.headers = {
      'X-Custom-Header': 'test',
    };
  }
}

function get(url, config) {
  addAdditionalHeader(config);
  return axios.get(url, config);
}

function post(url, data, config) {
  addAdditionalHeader(config);
  return axios.post(url, data, config);
}

function all(requests) {
  return axios.all(requests);
}

function ajax(config) {
  addAdditionalHeader(config);
  return axios(config);
}

export default {
  get,
  post,
  all,
  ajax,
};
