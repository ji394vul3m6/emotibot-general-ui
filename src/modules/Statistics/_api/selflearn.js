const RECOMMEND_URL = '/sherlock/clusterRecommend';
const SEARCH_STD_Q_URL = '/sq/info';
const RECORD_URL = '/api/v1/stats/records';
const REPORT_URL = '/api/v1/clustering/reports';

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
};
