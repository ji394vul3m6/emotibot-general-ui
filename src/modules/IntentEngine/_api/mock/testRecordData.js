import MockJS from 'mockjs';

const TOTAL = 20;
const testIntents = [];

// {
//   "status": 0,
//   "message": "success",
//   "result": {
//     "updated_time": 0,
//     "intents_count": 0,
//     "sentences_count": 0,
//     "true_positives": 0,
//     "false_positives": 0,
//     "true_negatives": 0,
//     "false_negatives": 0,
//     "name": "string",
//     "saved": true,
//     "ie_model_updated_time": 0,
//     "intents": [
//       {
//         "id": 0,
//         "name": "string",
//         "sentences_count": 0,
//         "positives_count": 0
//       }
//     ]
//   }
// }
for (let i = 0; i < TOTAL; i += 1) {
  const mockData = {
    id: MockJS.mock('@id'),
    name: MockJS.mock('@ctitle'),
    sentences_count: MockJS.mock('@integer(1, 1000)'),
    type: true,
  };
  testIntents.push(mockData);
}
testIntents.push({
  id: MockJS.mock('@id'),
  name: MockJS.mock('@ctitle'),
  sentences_count: MockJS.mock('@integer(1, 1000)'),
  type: false,
});

const testRecordResponse = {
  status: 0,
  message: '',
  result: {
    updated_time: MockJS.mock('@datetime("yyyy-MM-dd HH:mm")'),
    intents_count: 21,
    sentences_count: MockJS.mock('@integer(10000, 20000)'),
    true_positives: MockJS.mock('@integer(1, 500)'),
    false_positives: MockJS.mock('@integer(1, 500)'),
    true_negatives: MockJS.mock('@integer(1, 500)'),
    false_negatives: MockJS.mock('@integer(1, 500)'),
    name: MockJS.mock('@ctitle'),
    ie_model_updated_time: MockJS.mock('@datetime("yyyy-MM-dd HH:mm")'),
    saved: true,
    intents: testIntents,
  },
};


export default {
  testRecordResponse,
};
