import axios from 'axios';

const QS = require('qs');

// const BASE_URL='../../../../api/ApiKey/';
const BASE_URL = '/php/api/ApiKey/';
const INTENT_ENGINE_PATH = `${BASE_URL}get_intent.php`;

export default {
  getIntent(data) {
    return axios({
      method: 'POST',
      url: INTENT_ENGINE_PATH,
      data: QS.stringify(data),
      config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    }).then(resp => resp.data);
  },
  checkIntent(appId, intentName) {
    const data = {
      type: 'check',
      app_id: appId,
      intent_name: intentName,
    };
    return this.getIntent(data);
  },
  listIntents(appId) {
    const data = {
      type: 'search',
      app_id: appId,
    };
    return this.getIntent(data);
  },
  updateIntent(appId, data) {
    const params = {
      type: 'update',
      app_id: appId,
      data,
    };
    return this.getIntent(params);
  },
  deleteIntent(appId, intentName) {
    const data = {
      type: 'delete',
      app_id: appId,
      intent_name: intentName,
    };
    return this.getIntent(data);
  },
};
