const RECOMMEND_URL = '/sherlock/clusterRecommend';
const SEARCH_STD_Q_URL = '/sq/info';
const RECORD_URL = '/selfLearn/records';
const REPORT_URL = '/selfLearn/reports';

function getRecords(searchParam, page, limit, exp) {
  let queryUrl = `${RECORD_URL}/query?page=${page}`;
  queryUrl = limit ? `${queryUrl}&limit=${limit}` : queryUrl;
  queryUrl = exp ? `${queryUrl}&export=${exp}` : queryUrl;
  console.log(queryUrl);
  // return this.$reqPost(queryUrl, searchParam)
  // .then((response) => {
  //   console.log(response);
  // });

  const mockData = { data: [{ user_id: '4b21158a395311e88a710242ac110003', user_question: '我喜欢吃什么', score: 77, std_q: '我什么吃的都喜欢', answer: '哈哈，原来是个不挑食的人儿，这样更健康。', log_time: '2018-08-22 16:43:21', emotion: '疑惑', qtype: '聊天类' }, { user_id: '4b21158a395311e88a710242ac110003', user_question: '我喜欢吃橘子', score: 85, std_q: '我同学喜欢吃橘子。', answer: '橘子能补充维生素C。', log_time: '2018-08-22 16:43:10', emotion: '喜欢', qtype: '聊天类' }, { user_id: '4b21158a395311e88a710242ac110003', user_question: '我还没有女朋友呢，怎么办\n', score: 100, std_q: '我没有女朋友', answer: '这是种什么生物~我也只听过没见过~', log_time: '2018-08-22 16:42:04', emotion: '疑惑', qtype: '聊天类' }, { user_id: '4b21158a395311e88a710242ac110003', user_question: '睡过了', score: 94, std_q: '睡过了', answer: '是做了什么美梦不愿意醒来吗？', log_time: '2018-08-22 16:39:07', emotion: '中性', qtype: '聊天类' }, { user_id: '4b21158a395311e88a710242ac110003', user_question: '我失恋了', score: 98, std_q: '失恋了', answer: '一切都会过去', log_time: '2018-08-22 16:39:01', emotion: '伤心', qtype: '聊天类' }, { user_id: '4b21158a395311e88a710242ac110003', user_question: '还有郭富城', score: 75, std_q: '郭富城结婚', answer: '方媛爸爸很激动地对郭富城说：“我从小就听你的歌长大的，现在我把女儿交给你，希望你好好对待她”。', log_time: '2018-08-22 16:16:37', emotion: '中性', qtype: '聊天类' }, { user_id: '4b21158a395311e88a710242ac110003', user_question: '我喜欢张学友的歌', score: 90, std_q: '我喜欢唱张学友的歌。', answer: '你比较喜欢哪首呢？', log_time: '2018-08-22 16:16:30', emotion: '喜欢', qtype: '聊天类' }, { user_id: '4b21158a395311e88a710242ac110003', user_question: 'welcome_tag', score: 100, std_q: '', answer: '您好，很高兴为您服务', log_time: '2018-08-22 16:16:27', emotion: '', qtype: '其他类' }, { user_id: '4b21158a395311e88a710242ac110003', user_question: 'welcome_tag', score: 100, std_q: '', answer: '您好，很高兴为您服务', log_time: '2018-08-22 16:09:23', emotion: '', qtype: '其他类' }, { user_id: '4b21158a395311e88a710242ac110003', user_question: 'welcome_tag', score: 100, std_q: '', answer: '您好，很高兴为您服务', log_time: '2018-08-22 16:07:41', emotion: '', qtype: '其他类' }, { user_id: '4b21158a395311e88a710242ac110003', user_question: '办信用卡有什么优惠', score: 100, std_q: '办信用卡有什么优惠', answer: '办信用卡有什么优惠的回答', log_time: '2018-08-22 16:02:41', emotion: '疑惑', qtype: '业务类' }, { user_id: '4b21158a395311e88a710242ac110003', user_question: '有什么优惠', score: 80, std_q: '', answer: '近似问', log_time: '2018-08-22 16:02:37', emotion: '疑惑', qtype: '业务类' }, { user_id: '4b21158a395311e88a710242ac110003', user_question: '怎么办信用卡', score: 99, std_q: '信用卡业务', answer: '信用卡业务的回答', log_time: '2018-08-22 16:02:33', emotion: '疑惑', qtype: '业务类' }, { user_id: '4b21158a395311e88a710242ac110003', user_question: '怎么办信用卡', score: 79, std_q: '', answer: '近似问', log_time: '2018-08-22 16:01:58', emotion: '疑惑', qtype: '业务类' }, { user_id: '4b21158a395311e88a710242ac110003', user_question: '信用卡在哪里办理', score: 100, std_q: '信用卡在哪里办理', answer: '您好，信用卡办理在首页点击活动——热门活动，最下方点击平安车主金融卡，点击立即办卡即可申请。', log_time: '2018-08-22 15:57:48', emotion: '疑惑', qtype: '业务类' }, { user_id: '4b21158a395311e88a710242ac110003', user_question: '有什么优惠', score: 75, std_q: '', answer: '近似问', log_time: '2018-08-22 15:57:03', emotion: '疑惑', qtype: '业务类' }, { user_id: '4b21158a395311e88a710242ac110003', user_question: '怎么办信用卡', score: 79, std_q: '', answer: '近似问', log_time: '2018-08-22 15:56:54', emotion: '疑惑', qtype: '业务类' }, { user_id: '4b21158a395311e88a710242ac110003', user_question: '那他老婆呢', score: 94, std_q: '姚明老婆', answer: '父姚志源，母方凤娣，妻叶莉，女儿姚沁蕾', log_time: '2018-08-22 15:56:40', emotion: '中性', qtype: '聊天类' }, { user_id: '4b21158a395311e88a710242ac110003', user_question: '姚明有多高', score: 75, std_q: '姚明有多高呢？', answer: '他2.26米高呢。', log_time: '2018-08-22 15:56:35', emotion: '中性', qtype: '聊天类' }, { user_id: '4b21158a395311e88a710242ac110003', user_question: '姚明的老婆的先生有多高', score: 75, std_q: '巅峰时期的姚明有多强?', answer: '他最强的时候是球队轴心。', log_time: '2018-08-22 15:56:22', emotion: '中性', qtype: '聊天类' }], limit: 20, page: 1, table_header: [{ text: '用户ID', id: 'user_id' }, { text: '用户问题', id: 'user_question' }, { text: '匹配分数', id: 'score' }, { text: '标准问题', id: 'std_q' }, { text: '机器人回答', id: 'answer' }, { text: '访问时间', id: 'log_time' }, { text: '情感', id: 'emotion' }, { text: '问答类别', id: 'qtype' }], total_size: 202, marked_size: 40, ignored_size: 50, cur_page: page, size: limit };

  let id = 1;
  mockData.data.forEach((d) => {
    d.ignored = false;
    d.marked = false;
    d.record_id = id;
    id += 1;
  });
  mockData.data.splice(0, 0, {
    ignored: true,
    marked: true,
    user_id: 'hello',
    user_question: '這是user_question',
    emotion: '中性',
    qtype: '業務',
    std_q: '某個標準問',
    answer: '某個回答',
    log_time: 'time',
    score: 80,
    record_id: 0,
  });
  return Promise.resolve(mockData);
}

function setIgnore(records) {
  // TODO: set ignore or un ignore
  const url = `${RECORD_URL}/ignore`;
  const params = {
    records,
  };
  return this.$reqPost(url, params).then((response) => {
    console.log(response);
  });
}

function setMark(question, records) {
  const url = `${RECORD_URL}/mark`;
  const params = {
    content: question,
    records,
  };
  return this.$reqPost(url, params).then((response) => {
    console.log(response);
  });
}

function getMarkedQuestion(recordId) {
  const url = `${RECORD_URL}/${recordId}/mark`;
  console.log('url', url);
  // return this.$reqGet(url).then((response) => {
  //   console.log(response);
  //   return response.data.marked_content;
  // });

  return Promise.resolve('標註的句子');
}

function startCluster(params) {
  const url = REPORT_URL;
  console.log(params);
  // return this.$reqPost(url, params).then((response) => {
  //   console.log(response);
  //   return response.data.report_id;
  // });
  return Promise.resolve('reportid');
}

let counter = 0;
function pollClusterReport(reportId) {
  const url = `${REPORT_URL}/${reportId}`;
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
        isIgnored: false,
        isMarked: true,
      },
      results: {
        clusters: [
          {
            id: 'cid1',
            center_questions: ['某關鍵字', '某關鍵字二'],
            tags: ['某標籤', '某標籤二'],
            records: [
              {
                id: '111',
                value: '句子1',
              },
              {
                id: '222',
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
                id: '333',
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
  console.log(appid, questions);
  const url = RECOMMEND_URL;
  const params = {
    appId: appid,
    userInput: JSON.stringify(questions),
    maxTopN: 5,
  };
  return this.$reqGet(url, { params }).then((response) => {
    console.log(response);
  });
}

function searchStdQuestion(appid, keyword) {
  console.log(appid, keyword);
  const url = SEARCH_STD_Q_URL;
  const params = {
    appid,
    keyword,
  };
  return this.$reqPost(url, params).then((response) => {
    console.log(response);
  });
}

export default {
  getRecords,
  setIgnore,
  setMark,
  getMarkedQuestion,
  startCluster,
  pollClusterReport,
  getRecommend,
  searchStdQuestion,
};
