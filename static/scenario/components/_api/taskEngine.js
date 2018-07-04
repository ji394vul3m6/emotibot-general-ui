import axios from 'axios';
const QS = require('qs');

const BASE_URL='../../../../api/ApiKey/';
const TASK_ENGINE_APP_PATH = `${BASE_URL}task_engine_app.php`;
const TASK_ENGINE_SCENARIO_PATH = `${BASE_URL}task_engine_scenario.php`;
const NLU_TDE_REGISTER_PATH = `${BASE_URL}tde_register.php`;

export default {
  listScenarios(appId) {
    return axios({
      method: 'GET',
      url: `${TASK_ENGINE_APP_PATH}?appid=${appId}`
    }).then((resp) => {
      return resp.data;
    });
  },
  createScenario(appId, scenarioName) {
    const data = {
      'method': 'POST',
      'scenarioName': scenarioName,
      'template': '',
      'appid': appId,
    }
    return axios({
      method: 'POST',
      url: TASK_ENGINE_SCENARIO_PATH,
      data: QS.stringify(data),
      config: { headers: {'Content-Type': 'application/x-www-form-urlencoded' }}
    }).then((resp) => {
      return resp.data;
    });
  },
  deleteScenario(scenarioId) {
    const data = {
      'method': 'PUT',
      'scenarioid': scenarioId,
      'delete': 1,
    }
    return axios({
      method: 'POST',
      url: TASK_ENGINE_SCENARIO_PATH,
      data: QS.stringify(data),
      config: { headers: {'Content-Type': 'application/x-www-form-urlencoded' }}
    }).then((resp) => {
      return resp.data;
    });
  },
  loadScenario(scenarioId) {
    const data = {
      'method': 'GET',
      'scenarioid': scenarioId
    }
    return axios({
      method: 'POST',
      url: TASK_ENGINE_SCENARIO_PATH,
      data: QS.stringify(data),
      config: { headers: {'Content-Type': 'application/x-www-form-urlencoded' }}
    }).then((resp) => {
      return resp.data;
    });
  },
  saveScenario(appId, scenarioId, content, layout='{}') {
    const data = {
      'method': 'PUT',
      'appid': appId,
      'scenarioid': scenarioId,
      'content': content,
      'layout': layout
    }
    return axios({
      method: 'POST',
      url: TASK_ENGINE_SCENARIO_PATH,
      data: QS.stringify(data),
      config: { headers: {'Content-Type': 'application/x-www-form-urlencoded' }}
    }).then((resp) => {
      return resp.data;
    });
  },
  publishScenario(appId, scenarioId) {
    const data = {
      'method': 'PUT',
      'appid': appId,
      'scenarioid': scenarioId,
      'publish': 1
    }
    return axios({
      method: 'POST',
      url: TASK_ENGINE_SCENARIO_PATH,
      data: QS.stringify(data),
      config: { headers: {'Content-Type': 'application/x-www-form-urlencoded' }}
    }).then((resp) => {
      return resp.data;
    });
  },
  switchScenario(appId, scenarioId, enable){
    const data = {
      'method': 'POST',
      'appid': appId,
      'scenarioid': scenarioId,
      'enable': enable,
    }
    return axios({
      method: 'POST',
      url: TASK_ENGINE_APP_PATH,
      data: QS.stringify(data),
      config: { headers: {'Content-Type': 'application/x-www-form-urlencoded' }}
    }).then((resp) => {
      return resp.data;
    });
  },
  registerNluTdeScenario(data) {
    return axios({
      method: 'POST',
      url: NLU_TDE_REGISTER_PATH,
      data: data,
      config: { headers: {'Content-Type': 'application/json' }}
    }).then((resp) => {
      return resp.data;
    });
  },
};
