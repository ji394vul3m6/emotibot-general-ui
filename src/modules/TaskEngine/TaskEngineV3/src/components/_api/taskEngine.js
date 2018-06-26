import axios from 'axios';

const QS = require('qs');

// const BASE_URL = '../../../../api/ApiKey/';
const BASE_URL = '/php/api/ApiKey/';
const TASK_ENGINE_APP_PATH = `${BASE_URL}task_engine_app.php`;
const TASK_ENGINE_SCENARIO_PATH = `${BASE_URL}task_engine_scenario.php`;
const NLU_TDE_REGISTER_PATH = `${BASE_URL}tde_register.php`;

export default {
  listScenarios(appId) {
    return axios({
      method: 'GET',
      url: `${TASK_ENGINE_APP_PATH}?appid=${appId}`,
    }).then(resp => resp.data);
  },
  createScenario(appId, scenarioName) {
    const data = {
      method: 'POST',
      scenarioName,
      template: '',
      appid: appId,
    };
    return axios({
      method: 'POST',
      url: TASK_ENGINE_SCENARIO_PATH,
      data: QS.stringify(data),
      config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    }).then(resp => resp.data);
  },
  deleteScenario(scenarioId) {
    const data = {
      method: 'PUT',
      scenarioid: scenarioId,
      delete: 1,
    };
    return axios({
      method: 'POST',
      url: TASK_ENGINE_SCENARIO_PATH,
      data: QS.stringify(data),
      config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    }).then(resp => resp.data);
  },
  loadScenario(scenarioId) {
    const data = {
      method: 'GET',
      scenarioid: scenarioId,
    };
    return axios({
      method: 'POST',
      url: TASK_ENGINE_SCENARIO_PATH,
      data: QS.stringify(data),
      config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    }).then(resp => resp.data);
  },
  saveScenario(appId, scenarioId, content, layout = '{}') {
    const data = {
      method: 'PUT',
      appid: appId,
      scenarioid: scenarioId,
      content,
      layout,
    };
    return axios({
      method: 'POST',
      url: TASK_ENGINE_SCENARIO_PATH,
      data: QS.stringify(data),
      config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    }).then(resp => resp.data);
  },
  publishScenario(appId, scenarioId) {
    const data = {
      method: 'PUT',
      appid: appId,
      scenarioid: scenarioId,
      publish: 1,
    };
    return axios({
      method: 'POST',
      url: TASK_ENGINE_SCENARIO_PATH,
      data: QS.stringify(data),
      config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    }).then(resp => resp.data);
  },
  switchScenario(appId, scenarioId, enable) {
    const data = {
      method: 'POST',
      appid: appId,
      scenarioid: scenarioId,
      enable,
    };
    return axios({
      method: 'POST',
      url: TASK_ENGINE_APP_PATH,
      data: QS.stringify(data),
      config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    }).then(resp => resp.data);
  },
  registerNluTdeScenario(data) {
    return axios({
      method: 'POST',
      url: NLU_TDE_REGISTER_PATH,
      data,
      config: { headers: { 'Content-Type': 'application/json' } },
    }).then(resp => resp.data);
  },
};
