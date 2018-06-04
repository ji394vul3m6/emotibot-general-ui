import qs from 'qs';

// const TAGS_URL = '/api/v1/faq/labels';
// const TAG_URL = '/api/v1/faq/label';

const TAGS_URL = '/tag/get/list';
const TAG_ADD_URL = '/tag/add';
const TAG_UPDATE_URL = '/tag/update';
const TAG_DELETE_URL = '/tag/delete';

function loadLabels(id) {
  const params = {
    appid: id,
  };
  return this.$reqPost(TAGS_URL, qs.stringify(params)).then(rsp => rsp.data);
}

function addLabel(params) {
  return this.$reqPost(TAG_ADD_URL, qs.stringify(params)).then(rsp => rsp.data);
}
function updateLabel(params) {
  return this.$reqPost(TAG_UPDATE_URL, qs.stringify(params)).then(rsp => rsp.data);
}
function deleteLabel(params) {
  return this.$reqPost(TAG_DELETE_URL, qs.stringify(params)).then(rsp => rsp.data);
}


export default {
  loadLabels,
  addLabel,
  deleteLabel,
  updateLabel,
};
