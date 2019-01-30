import testRecordsData from './testRecordsData';


function startMock(mock) {
  mock.onGet('/api/v1/intent_tests')
  .reply(200, testRecordsData.testRecordsResponse);
}

export default {
  startMock,
};
