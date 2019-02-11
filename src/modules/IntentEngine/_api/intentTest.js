import qs from 'qs';
import './mock/intentTest';

const GET_INTENT_TEST_URL = '/api/v1/intent_tests';
const GET_INTENT_TEST_DATA_URL = '/api/v1/intent_tests/intents';

function getTestRecord(intentTestId) {
  return this.$reqGet(`${GET_INTENT_TEST_URL}/${intentTestId}`).then(rsp => rsp.data.result);
}

function getTestRecords() {
  return this.$reqGet(GET_INTENT_TEST_URL).then(rsp => rsp.data.result);
}

function getTestIntents() {
  return this.$reqGet(GET_INTENT_TEST_DATA_URL).then(rsp => rsp.data.result);
}

function getIntentTestCorpus(intentId) {
  return this.$reqGet(`${GET_INTENT_TEST_DATA_URL}/${intentId}`).then(rsp => rsp.data.result);
}

function patchIntentTestCorpus(intentId, update, del) {
  const body = {
    update,
    delete: del,
  };
  return this.$reqPatch(
    `${GET_INTENT_TEST_DATA_URL}/${intentId}`,
    qs.stringify(body),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  ).then(rsp => rsp.data.result);
}

export default {
  getTestRecord,
  getTestRecords,
  getTestIntents,
  getIntentTestCorpus,
  patchIntentTestCorpus,
};
