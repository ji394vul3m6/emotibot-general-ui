const SSM_CATEGORY_URL = '/api/v1/bf/ssm/categories';
const SSM_LABEL_URL = '/api/v1/bf/ssm/labels';

function getSSMCategories() {
  return this.$reqGet(SSM_CATEGORY_URL).then(res => res.data.result);
}

function getSSMLabels() {
  return this.$reqGet(SSM_LABEL_URL).then(res => res.data.result);
}

const INSERT_STD_Q_URL = '/dal/operation/insert/sq';
const INSERT_STD_A_URL = '/dal/operation/insert/answer';
function addStdQuestion(appid, question, answer) {
  return getSSMCategories.bind(this)()
  .then((category) => {
    const stdQParam = {
      appid,
      userRecordId: 0,
      data: {
        subop: 'defaultSubop',
        entities: [
          { content: question,
            answers: [answer],
            labels: [category.cat_id],
          }],
      },
    };
    return this.$reqPost(INSERT_STD_Q_URL, stdQParam);
  })
  .then((rsp) => {
    const qID = rsp.data.data.actualResults[0];
    const stdAParam = {
      appid,
      userRecordId: 0,
      data: {
        subop: 'defaultSubop',
        entities: [
          { content: answer,
            parentRecordId: qID },
        ],
      },
    };
    return this.$reqPost(INSERT_STD_A_URL, stdAParam);
  })
  .then(rsp => rsp.data);
}

export default {
  getSSMCategories,
  getSSMLabels,
  addStdQuestion,
};
