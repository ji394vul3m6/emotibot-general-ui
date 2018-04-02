const GET_FUNCTIONS_INFO_PATH = '/api/v1/robot/functions';
const SET_FUNCTION_INFO_PATH = '/api/v1/robot/function';
const SET_ALL_FUNCTIONS_INFO_PATH = '/api/v1/robot/functions';
const GET_QA_LIST_PATH = '/api/v1/robot/qas';
const QA_OPERATION_PATH = '/api/v1/robot/qa';
const REBUILD_QA_PATH = '/api/v1/robot/qabuild';

function getFunctionsStatus() {
  return this.$reqGet(GET_FUNCTIONS_INFO_PATH);
}

function setFunctionStatus(functionKey, status) {
  const param = {
    status,
  };

  return this.$reqPost(`${SET_FUNCTION_INFO_PATH}/${functionKey}`, param);
}

function setFunctionInfos(infos) {
  const param = {};
  infos.forEach((info) => {
    param[`function_${info.id}module`] = {
      status: info.checked,
    };
  });
  return this.$reqPost(SET_ALL_FUNCTIONS_INFO_PATH, param);
}

function getRobotQAList(page, perPage) {
  const params = {};

  // input validation
  const pageInt = parseInt(page, 10);
  if (pageInt !== undefined) {
    params.page = pageInt;
  }
  const perPageInt = parseInt(perPage, 10);
  if (perPageInt !== undefined) {
    params.per_page = perPageInt;
  }
  return this.$reqGet(GET_QA_LIST_PATH, { params })
    .then(data => data.data.result);
}

function rebuildRobotQAModel() {
  return this.$reqPost(REBUILD_QA_PATH);
}

function updateRobotQA(info) {
  return this.$reqPost(`${QA_OPERATION_PATH}/${info.id}`, info);
}

export default {
  getFunctionsStatus,

  setFunctionStatus,
  setFunctionInfos,
  getRobotQAList,
  rebuildRobotQAModel,
  updateRobotQA,
};
