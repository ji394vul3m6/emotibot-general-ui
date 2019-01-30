import './mock/intentTest';

const GET_INTENT_TEST_URL = '/api/v1/intent_tests';

function getTestRecords() {
  return this.$reqGet(GET_INTENT_TEST_URL).then(rsp => rsp.data);
}


export default {
  getTestRecords,
};
