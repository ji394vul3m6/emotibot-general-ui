import api from '../_api/selflearn';
import SelfLearnMarkPop from '../_components/SelfLearnMarkPop';

function popSelfLearnMark(datarows) {
  // Datarows is an..
  //    object, when click mark button on general-table
  //    array, when click batch mark button
  // only send array to SelfLearnMarkPop
  const propData = Array.isArray(datarows) ? datarows : [datarows];
  const that = this;
  const options = {
    title: that.$t('statistics.mark.mark'),
    component: SelfLearnMarkPop,
    data: {
      qa: propData,
      markedQuestion: '', // receive marked question
    },
    callback: {
      ok: (data) => {
        const markedQuestion = data.markedQuestion;
        const record = propData.map(prop => prop.id);
        const tomark = markedQuestion !== '';
        that.setMark(markedQuestion, record, tomark);
      },
    },
    validate: true,
  };
  that.$pop(options);
}

function doIgnore(datarows) {
  const that = this;
  const rows = Array.isArray(datarows) ? datarows : [datarows];
  const toIgnore = rows.map(r => r.id);
  that.setIgnore(toIgnore, true);
}

function doCancelIgnore(datarow) {
  const that = this;
  const toCancelIgnore = [datarow.id];
  that.setIgnore(toCancelIgnore, false);
}

function appendTableDataAction(datas) {
  // check status of marked and ignored, give different action
  const that = this;
  datas.forEach((data) => {
    data.action = [];
    data.action.push({
      text: data.ignored ? that.$t('statistics.ignore.cancel_ignore') : that.$t('statistics.ignore.ignore'),
      type: 'primary',
      onclick: data.ignored ? that.doCancelIgnore : that.doIgnore,
    });
    data.action.push({
      text: data.marked ? that.$t('statistics.mark.re_marked') : that.$t('statistics.mark.mark'),
      type: 'primary',
      onclick: that.popSelfLearnMark,
    });
  });
  return datas;
}

function updateMarkedTableData(tableData, markedRecord, marked) {
  const that = this;
  tableData.forEach((data) => {
    if (markedRecord.indexOf(data.id) !== -1) {
      data.marked = marked;
    }
  });
  return appendTableDataAction.call(that, tableData);
}

function apiSetMark(tableData, markedQuestion, record, tomark) {
  const that = this;
  return api.setMark(markedQuestion, record, tomark)
  .then(() => {
    that.$notify({ text: that.$t('statistics.success.mark_ok') });
    return updateMarkedTableData.call(that, tableData, record, tomark);
  })
  .catch((err) => {
    const markedRecord = err.response.data;
    that.$notifyFail(that.$t('statistics.error.mark_fail'));
    return updateMarkedTableData.call(that, tableData, markedRecord, tomark);
  });
}

function updateIgnoredTableData(tableData, ignoredRecord, ignored) {
  const that = this;
  tableData.forEach((data) => {
    if (ignoredRecord.indexOf(data.id) !== -1) {
      data.ignored = ignored;
    }
  });
  return appendTableDataAction.call(that, tableData);
}

function apiSetIgnore(tableData, records, ignore) {
  const that = this;
  return api.setIgnore(records, ignore)
  .then(() => {
    that.$notify({ text: that.$t('statistics.success.ignore_ok') });
    return updateIgnoredTableData.call(that, tableData, records, ignore);
  })
  .catch((err) => {
    const ignoredRecord = err.response.data;
    that.$notifyFail(that.$t('statistics.error.ignore_fail'));
    return updateIgnoredTableData.call(that, tableData, ignoredRecord, ignore);
  });
}

export default {
  methods: {
    apiSetMark,
    apiSetIgnore,
    appendTableDataAction,
    popSelfLearnMark,
    doIgnore,
    doCancelIgnore,
  },
};
