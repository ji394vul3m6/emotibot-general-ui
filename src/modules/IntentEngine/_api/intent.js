import qs from 'qs';

// TODO: change these to v2 !!!!!!!!!
const GET_INTENT_URL = 'api/v1/intents';
const IMPORT_INTENT_URL = 'api/v1/intents/upload';
const TRAIN_URL = 'api/v1/intents/train';
const GET_TRAINING_STATUS_URL = 'api/v1/intents/status';

const INTENT_ACTION_URL = 'api/v2/intents/intent';

function getIntents() {
  return this.$reqGet(GET_INTENT_URL).then(rsp => rsp.data.result);
}

function getIntentsDetail(keyword, version) {
  console.log(keyword);
  // const GET_INTENT_DETAIL_URL = version === undefined ? `${GET_INTENT_URL}/intents` : `${GET_INTENT_URL}/intents?version=${version}`;
  // return this.$reqGet(GET_INTENT_DETAIL_URL).then((rsp) => {
  //   return rsp.data.result.map((intent) => {
  //     intent.count = intent.positive_count + intent.negative_count;
  //     return intent;
  //   });
  // });
  const mockData = [
    {
      id: 1,
      name: '查收入',
      positive_count: 11,
      negative_count: 1,
    },
    {
      id: 2,
      name: '查支出',
      positive_count: 5,
      negative_count: 2,
    },
  ];
  return Promise.resolve(mockData).then((data) => {
    const parsedData = data.map((d) => {
      d.count = d.positive_count + d.negative_count;
      return d;
    });
    return parsedData;
  });
}

function importIntents(file) {
  const data = new FormData();
  data.append('file', file);
  return this.$reqPost(IMPORT_INTENT_URL, data).then(rsp => rsp.data.result);
}

function addIntent(param) {
  // console.log(param);
  // const body = {
  //   name: param.name,
  //   positive: JSON.stringify(param.pos),
  //   negative: JSON.stringify(param.neg),
  // };
  // return this.$reqPost(INTENT_ACTION_URL, qs.stringify(body), {
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //   },
  // }).then(rsp => rsp.data.result);

  return Promise.resolve();
}

function updateIntent(intent, updated, added, deleted) {
  const type = {
    pos: 0,
    neg: 1,
  };
  const intentId = intent.id;
  let updateObj = [];
  updateObj = updated.map((u) => {
    const returnObj = {
      id: u.id,
      content: u.text,
      type: type[u.type],
    };
    return returnObj;
  });
  updateObj = updateObj.concat(added.map(((a) => {
    const returnObj = {
      id: 0,
      content: a.text,
      type: type[a.type],
    };
    return returnObj;
  })));

  const param = {
    name: intent.name,
    update: JSON.stringify(updateObj),
    delete: JSON.stringify(deleted),
  };
  return this.$reqPatch(`${INTENT_ACTION_URL}/${intentId}/modify`, qs.stringify(param), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(rsp => rsp.data.result);
}

function deleteIntent(idToDel) {
  return this.$reqDelete(`${INTENT_ACTION_URL}/${idToDel}`);
}

function getCorpus(intentId, keyword) {
  // return this.$reqGet(`${INTENT_ACTION_URL}/${intentId}`).then(rsp => rsp.data.result);
  const mockData = {
    id: 1,
    name: '查收入',
    positive_count: 12,
    negative_count: 1,
    positive: [
      {
        id: 1,
        content: 'theres glitter on the floor after the party',
      },
      {
        id: 2,
        content: 'girls carrying their shoes down in the lobby',
      },
      {
        id: 3,
        content: 'candle wax and polaroid on the hardwood floor',
      },
      {
        id: 4,
        content: 'you and me from the night before but',
      },
      {
        id: 5,
        content: 'dont read the last page',
      },
      {
        id: 6,
        content: 'and I stay when youre lost and Im scared and youre turning away',
      },
      {
        id: 7,
        content: 'I want your midnight',
      },
      {
        id: 8,
        content: 'But Ill be cleaning up bottles with you on new years day',
      },
      {
        id: 9,
        content: 'Hold on to the memories they will hold on to you',
      },
      {
        id: 10,
        content: 'And I will hold on to you',
      },
      {
        id: 11,
        content: 'Please dont ever become a stranger whose laugh I could recognize anywhere',
      },
    ],
    negative: [
      {
        id: 12,
        content: 'I dont know why all the tree change in the fall',
      },
    ],
  };
  return Promise.resolve(mockData);
}

function startTraining() {
  // use only intent engine in v1.2
  return this.$reqPost(`${TRAIN_URL}?engine=intent_engine`);
}

function getTrainingStatus(version) {
  const GET_VERSION_TRAINING_STATUS_URL = version ? `${GET_TRAINING_STATUS_URL}?version=${version}` : GET_TRAINING_STATUS_URL;
  return this.$reqGet(GET_VERSION_TRAINING_STATUS_URL)
    .then((rsp) => {
      const result = rsp.data.result;
      const IE = result.ie_status;
      // const RE = result.re_status;
      let status = '';

      /** Use this if Training Button can train both IE and RE */
      // if (IE === 'TRAINING' || RE === 'TRAINING') {
      //   status = 'TRAINING';
      // } else if (IE === 'NOT_TRAINED' || RE === 'NOT_TRAINED') {
      //   status = 'NOT_TRAINED';
      // } else if (IE === 'TRAIN_FAILED' || RE === 'TRAIN_FAILED') {
      //   status = 'TRAIN_FAILED';
      // } else {
      //   status = 'TRAINED';
      // }

      if (IE === 'TRAINING') {
        status = 'TRAINING';
      } else if (IE === 'NOT_TRAINED') {
        status = 'NOT_TRAINED';
      } else if (IE === 'TRAIN_FAILED') {
        status = 'TRAIN_FAILED';
      } else {
        status = 'TRAINED';
      }
      return status;
    });
}

export default {
  getIntents,
  getIntentsDetail,
  importIntents,
  addIntent,
  updateIntent,
  deleteIntent,
  getCorpus,
  startTraining,
  getTrainingStatus,
};
