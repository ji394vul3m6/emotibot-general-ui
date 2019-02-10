import testRecordData from './testRecordData';
import testRecordsData from './testRecordsData';
import testIntentsData from './testIntentsData';
import intentTestCorpusData from './intentTestCorpusData';

function startMock(mock) {
  mock.onGet('/api/v1/intent_tests')
  .reply(200, testRecordsData.testRecordsResponse);
  mock.onGet('/api/v1/intent_tests/intents')
  .reply(200, testIntentsData.testIntentsResponse);
  mock.onGet(/\/api\/v1\/intent_tests\/\d+/)
  .reply(200, testRecordData.testRecordResponse);
  mock.onGet(/\/api\/v1\/intent_tests\/intents\/\d+/)
  .reply(200, intentTestCorpusData.intentTestCorpusResponse);
}

export default {
  startMock,
};
