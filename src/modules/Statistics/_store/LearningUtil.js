import LearningAPI from '../_api/learning';

export default {
  checkRecords(records) {
    records.forEach((record) => {
      record.resolved = false;
      if (record.stdQuestion && record.stdQuestion !== '') {
        record.resolved = true;
      }
    });
    return records;
  },
  queryRecords(collectionId, clusterId, page, num) {
    return LearningAPI.queryRecords(collectionId, clusterId, page, num)
    .then((records) => {
      const checkedRecords = this.checkRecords(records);
      return checkedRecords;
    });
  },
};
