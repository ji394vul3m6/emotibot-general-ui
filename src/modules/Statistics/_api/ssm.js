const SSM_CATEGORY_URL = '/api/v1/bf/ssm/categories';
const SSM_LABEL_URL = '/api/v1/bf/ssm/labels';

function getSSMCategories() {
  return this.$reqGet(SSM_CATEGORY_URL).then(res => res.data.result);
}

function getSSMLabels() {
  return this.$reqGet(SSM_LABEL_URL).then(res => res.data.result);
}

export default {
  getSSMCategories,
  getSSMLabels,
};
