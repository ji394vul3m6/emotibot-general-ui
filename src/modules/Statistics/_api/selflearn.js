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
  console.log({ url, params });
  // return this.$reqPost(url, params).then((response) => {
  //   console.log(response);
  //   return response.data.report_id;
  // });
  return Promise.resolve('reportid');
}

let counter = 0;
function pollClusterReport(reportId) {
  // const url = `${REPORT_URL}/${reportId}`;
  // return this.$reqGet(url).then((response) => {
  //   console.log(response);
  // });
  let mockData;
  if (counter < 2) {
    mockData = {
      status: 0,
    };
  } else {
    mockData = {
      id: reportId,
      start_time: 1534909860,
      end_time: 1534996260,
      status: 1,
      total_size: 202,
      ignored_size: 50,
      marked_size: 40,
      search_query: {
        start_time: 1534909860,
        end_time: 1534996260,
        keyword: 'HELLo',
        uid: 'HELLO',
        emotions: [
          'not_satisfied',
          'satisfied',
        ],
        question_types: [
          'chat',
        ],
        platforms: [
          'app',
          'ios',
        ],
        genders: [
          '1',
        ],
        is_ignored: false,
        is_marked: true,
      },
      results: {
        clusters: [
          {
            id: 'cid1',
            center_questions: ['某關鍵字', '某關鍵字二'],
            tags: ['某標籤', '某標籤二'],
            records: [
              {
                id: '20180828100538348860681',
                value: '句子1',
              },
              {
                id: '32245d86b9094480831e8d7c21132645',
                value: '句子2',
              },
            ],
          },
          {
            id: 'cid2',
            center_questions: ['第二類', '某關鍵字二'],
            tags: ['某標籤', '某標籤二'],
            records: [
              {
                id: '20180827183358642723754',
                value: '句子3',
              },
              {
                id: '444',
                value: '句子4',
              },
            ],
          },
        ],
        filtered: [
          {
            id: '123',
            value: '沒被分到類',
          },
          {
            id: '456',
            value: '沒被分到類二',
          },
        ],
      },
    };
  }
  counter += 1;
  return Promise.resolve(mockData);
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
