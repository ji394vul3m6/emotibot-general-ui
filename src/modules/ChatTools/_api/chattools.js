import qs from 'qs';

const UPLOAD_PATH = '/testing/testset';
const TEST_PATH = '/testing/result';
const DOWN_TEST_RESULT_PATH = '/testing/download/result';
const DOWN_TEST_HIS_RESULT_PATH = '/testing/result';

function uploadFile(file, appId) {
  if (!file) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('Empty file');
      }, 0);
    });
  }

  const data = new FormData();
  data.append('file', file);
  data.append('X-Appid', appId);
  data.append('X-Userid', this.$cookie.get('userid'));
  return this.$reqPost(UPLOAD_PATH, data);
}

function startTest(appId) {
  const parmas = {
    'X-Appid': appId,
    'X-Userid': this.$cookie.get('userid'),
  };
  return this.$reqPut(TEST_PATH, qs.stringify(parmas));
}

function getResult(appId) {
  return this.$reqGetBlob(`${DOWN_TEST_RESULT_PATH}?X-Userid=${this.$cookie.get('userid')}&X-Appid=${appId}`);
}

function getHisResult(appId) {
  return this.$reqGet(`${DOWN_TEST_HIS_RESULT_PATH}/${this.$cookie.get('userid')}/${appId}`);
}


export default {
  uploadFile,
  startTest,
  getResult,
  getHisResult,
};

