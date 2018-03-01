/*
request.js wrapped the axios library
It will do extra operations for all request
ex: add auth token, log request, etc.
*/
import axios from 'axios';

function getCustomHeader(config) {
  let ret = config;
  if (!config) {
    ret = {};
  }
  // TODO: correct header should add here
  if (ret.headers) {
    ret.headers['X-Custom-Header'] = 'test';
  } else {
    ret.headers = {
      'X-Custom-Header': 'test',
    };
  }
  return ret;
}

function get(url, config) {
  return axios.get(url, getCustomHeader(config));
}

function post(url, data, config) {
  return axios.post(url, data, getCustomHeader(config));
}

function all(requests) {
  return axios.all(requests);
}

function ajax(config) {
  return axios(getCustomHeader(config));
}

export default {
  get,
  post,
  all,
  ajax,
};
