import './mock/intentTest';

const GET_INTENT_TEST_URL = '/api/v1/intent_tests';
const GET_INTENT_TEST_DATA_URL = '/api/v1/intent_tests/intents';

function getTestRecords() {
  return this.$reqGet(GET_INTENT_TEST_URL).then(rsp => rsp.data.result);
}

function getTestData() {
  return this.$reqGet(GET_INTENT_TEST_DATA_URL).then(rsp => rsp.data.result);
}

export default {
  getTestRecords,
  getTestData,
};
