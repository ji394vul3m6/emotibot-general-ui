import axios from 'axios';
import config from '@/modules/TaskEngine/_utils/config';

const QS = require('qs');

// const BASE_URL = '../../../../api/ApiKey/';
const BASE_URL = '/php/api/ApiKey/';
const TASK_ENGINE_APP_PATH = `${BASE_URL}task_engine_app.php`;
const TASK_ENGINE_SCENARIO_PATH = `${BASE_URL}task_engine_scenario.php`;
const NLU_TDE_REGISTER_PATH = `${BASE_URL}tde_register.php`;
const UPLOAD_SPREADSHEET_PATH = `${BASE_URL}spreadsheet.php`;
const UPLOAD_SCENARIO_JSON_PATH = `${BASE_URL}scenario_json_upload.php`;
const TASK_CONFIG = '/api/v1/task/config';
const TASK_ENGINE_SCENARIO_INTENT = '/api/v1/task/scenario/intents';

export default {
  taskConfig() {
    return axios({
      method: 'GET',
      url: TASK_CONFIG,
    }).then(resp => resp.data);
  },
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
  createScenarioWithTemplate(appId, scenarioName, templateId) {
    const data = {
      method: 'POST',
      scenarioName,
      template: templateId,
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
  loadTemplateScenario() {
    const data = {
      method: 'GET',
      scenarioid: 'all',
      public: 1,
    };
    return axios({
      method: 'POST',
      url: TASK_ENGINE_SCENARIO_PATH,
      data: QS.stringify(data),
      config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    }).then(resp => resp.data);
  },
  exportAllScenarios(appId) {
    const that = this;
    that.listScenarios(appId).then(((data) => {
      const scenarioList = data.msg.filter(scenario => scenario.version !== '2.0');
      const scenarioRequestList = [];
      scenarioList.forEach((scenario) => {
        scenarioRequestList.push(that.loadScenario(scenario.scenarioID));
      });
      axios.all(scenarioRequestList).then((allScenarioJSONs) => {
        const result = [];
        allScenarioJSONs.forEach((scenarioJSON) => {
          result.push(this.collectScenario(scenarioJSON));
        });
        const jsonString = JSON.stringify(result, null, 4);
        const blobdata = new Blob([jsonString], { type: 'text/json' });
        if (navigator.appVersion.toString().indexOf('.NET') > 0) { // for IE browser
          window.navigator.msSaveBlob(blobdata, 'all_scenarios.json');
        } else {
          const link = document.createElement('a');
          link.setAttribute('href', window.URL.createObjectURL(blobdata));
          link.setAttribute('download', 'all_scenarios.json');
          document.body.appendChild(link);
          link.click();
        }
      });
    }));
  },
  collectScenario(scenarioObj) {
    return {
      taskScenario: JSON.parse(scenarioObj.result.editingContent),
      taskLayouts: JSON.parse(scenarioObj.result.editingLayout),
    };
  },
  exportScenario(scenarioId) {
    this.loadScenario(scenarioId).then((scenarioObj) => {
      const scenario = this.collectScenario(scenarioObj);
      const scenarioName = scenario.taskScenario.metadata.scenario_name;
      const jsonString = JSON.stringify(scenario, null, 4);
      const blobdata = new Blob([jsonString], { type: 'text/json' });
      if (navigator.appVersion.toString().indexOf('.NET') > 0) { // for IE browser
        window.navigator.msSaveBlob(blobdata, `${scenarioName}.json`);
      } else {
        const link = document.createElement('a');
        link.setAttribute('href', window.URL.createObjectURL(blobdata));
        link.setAttribute('download', `${scenarioName}.json`);
        document.body.appendChild(link);
        link.click();
      }
    });
  },
  saveTaskEngineIntents(appId, scenarioId, triggerIntents) {
    const triggerIntentsString = JSON.stringify(triggerIntents);
    const data = {
      app_id: appId,
      scenario_id: scenarioId,
      trigger_intents: triggerIntentsString,
    };
    return axios({
      method: 'PUT',
      url: TASK_ENGINE_SCENARIO_INTENT,
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
  uploadSpreadsheet(appId, scenarioId, scenario, file) {
    if (!file) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject('Empty file');
        }, 0);
      });
    } else if (file.size <= 0 || file.size > config.MaximumFileSize) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject('File size need more than 0, less than 2MB');
        }, 0);
      });
    }

    const data = new FormData();
    data.append('appId', appId);
    data.append('scenarioId', scenarioId);
    data.append('scenario', scenario);
    data.append('spreadsheet', file);

    return axios.post(UPLOAD_SPREADSHEET_PATH, data).then(resp => resp.data);
  },
  uploadScenarioJSON(appId, file) {
    if (!file) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject('Empty file');
        }, 0);
      });
    } else if (file.size <= 0 || file.size > config.MaximumFileSize) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject('File size need more than 0, less than 2MB');
        }, 0);
      });
    }

    const data = new FormData();
    data.append('useNewId', true);
    data.append('appid', appId);
    data.append('scenario_json', file);

    return axios.post(UPLOAD_SCENARIO_JSON_PATH, data).then(resp => resp.data);
  },
};
