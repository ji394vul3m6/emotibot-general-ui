const RECOMMEND_URL = '/sherlock/clusterRecommend';
const SEARCH_STD_Q_URL = '/sq/info';
const RECORD_URL = '/api/v1/stats/records';
const REPORT_URL = '/api/v1/clustering/reports';
const RECORT_URL_V2 = '/api/v2/stats/records';
const STATS_RECORD_EXPORT = '/api/v1/stats/records/export';
const STATS_RECORD_EXPORT_V2 = '/api/v2/stats/records/export';

// getRecordsV2 use page and limit as parameter is for compatibility with v1
function getRecordsV2(searchParam, page, limit) {
  const queryUrl = `${RECORT_URL_V2}/query`;
  return this.$reqPost(queryUrl, {
    ...searchParam,
    limit,
    page,
  })
  .then(response => response.data);
}

function getRecords(searchParam, page, limit) {
  let queryUrl = `${RECORD_URL}/query?page=${page}`;
  queryUrl = limit ? `${queryUrl}&limit=${limit}` : queryUrl;
  return this.$reqPost(queryUrl, searchParam)
  .then(response => response.data);
}

function exportRecords(searchParam) {
  const queryUrl = `${RECORD_URL}/download`;
  return this.$reqPost(queryUrl, searchParam)
  .then(response => response.data);
}

function setIgnore(records, ignore) {
  const url = `${RECORD_URL}/ignore`;
  const params = {
    ignore,
    records,
  };
  return this.$reqPost(url, params);
}

function setMark(question, records, mark) {
  const url = `${RECORD_URL}/mark`;
  const params = {
    mark,
    content: question,
    records,
  };
  return this.$reqPost(url, params);
}

function getMarkedQuestion(recordId) {
  const url = `${RECORD_URL}/${recordId}/marked`;
  return this.$reqGet(url).then(response => response.data.marked_content);
}

function startCluster(params) {
  const url = REPORT_URL;
  return this.$reqPut(url, params).then(response => response.data.report_id);
}

function pollClusterReport(reportId) {
  const url = `${REPORT_URL}/${reportId}`;
  return this.$reqGet(url).then(response => response.data);
}

function getRecommend(appid, questions) {
  const url = RECOMMEND_URL;
  const params = {
    appId: appid,
    userInput: JSON.stringify(questions),
    maxTopN: 5,
  };
  return this.$reqGet(url, { params }).then(response => response.data.data);
}

function searchStdQuestion(appid, keyword) {
  const url = SEARCH_STD_Q_URL;
  const params = {
    appid,
    keyword,
  };
  return this.$reqPost(url, params).then(response => response.data.data);
}

function getExportID(params) {
  return this.$reqPost(STATS_RECORD_EXPORT, params).then(rsp => rsp.data);
}
function getExportStatus(id) {
  return this.$reqGet(`${STATS_RECORD_EXPORT}/${id}/status`).then(rsp => rsp.data);
}

function getExportIDV2(params) {
  return this.$reqPost(STATS_RECORD_EXPORT_V2, params).then(rsp => rsp.data);
}
function getExportStatusV2(id) {
  return this.$reqGet(`${STATS_RECORD_EXPORT_V2}/${id}/status`).then(rsp => rsp.data);
}

export default {
  getRecords,
  exportRecords,
  setIgnore,
  setMark,
  getMarkedQuestion,
  startCluster,
  pollClusterReport,
  getRecommend,
  searchStdQuestion,
  getExportID,
  getExportStatus,

  getRecordsV2,
  getExportIDV2,
  getExportStatusV2,
};
