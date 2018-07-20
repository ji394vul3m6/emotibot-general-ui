const GET_INTENT_URL = 'api/v1/intents';
const IMPORT_INTENT_URL = 'api/v1/intents/upload';
const TRAIN_URL = 'api/v1/intents/train';
const GET_TRAINING_STATUS_URL = 'api/v1/intents/status';

function getIntents() {
  return this.$reqGet(GET_INTENT_URL).then(rsp => rsp.data.result);
}

function importIntents(file) {
  const data = new FormData();
  data.append('file', file);
  return this.$reqPost(IMPORT_INTENT_URL, data).then(rsp => rsp.data.result);
}

function startTraining() {
  return this.$reqPost(TRAIN_URL);
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
  importIntents,
  startTraining,
  getTrainingStatus,
};
