const TAG_TYPE_URL = '/api/v1/faq/tag-types';

function getTagTypes() {
  // Transform data from api to old format
  return this.$reqGet(TAG_TYPE_URL).then((rsp) => {
    const ret = rsp.data.result.map(category => ({
      id: category.id,
      text: category.name,
      allChecked: true,
      type: category.code,
      values: category.values.map(value => ({
        tagId: value.id,
        id: value.code,
        text: value.value,
        checked: false,
      })),
    }));
    // sort by type id
    ret.sort((a, b) => (a.id - b.id));
    return ret;
  });
}

export default {
  getTagTypes,
};
