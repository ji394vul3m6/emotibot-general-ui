// import * as cookie from 'tiny-cookie';
// import ErrorAlert from '../components/ErrorAlert';


export default {
  getAppId() {
    // const robotDataJson = JSON.parse(cookie.getRaw('robotDataJson'));
    // return robotDataJson.appid;
  },
  popErrorWindow(context, msg, err) {
    context.$root.$popError(msg, err);
  },
  // popErrorWindow(context, msg, err, width = '30%', height = '30%') {
  //   context.$root.$emit('showWindow', {
  //     component: ErrorAlert,
  //     data: {
  //       msg,
  //       info: err,
  //     },
  //     buttons: ['ok'],
  //     customPopContentStyle: {
  //       width,
  //       height,
  //     },
  //   });
  // },
  getLocalDateTimeIsoString() {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
  },
  composeV2Path(childPath) {
    const PAGE_PATH = '/task-engine-scenario-v2';
    return `${PAGE_PATH}/${childPath}`;
  },
  composeV3Path(childPath) {
    const PAGE_PATH = '/task-engine-scenario-v3';
    return `${PAGE_PATH}/${childPath}`;
  },
  JSONStringifyReplacer(key, value) {
    return ((value instanceof Object) && !(value instanceof Array)) ?
      Object.keys(value).sort().reduce((sorted, k) => {
        sorted[k] = value[k];
        return sorted;
      }, {}) : value;
  },
  suffixIndexToNodeName(newNodeName, nodeNames) {
    // suffix _${index} to newNodeName if there are other nodeNames are start with newNodeName
    let nodeNameList = nodeNames;
    if (!nodeNameList) {
      nodeNameList = window.moduleData.ui_data.nodes.map(node => node.nodeName);
    }
    const sameNameList = nodeNameList.filter(nodeName => nodeName.startsWith(newNodeName));
    if (sameNameList.length === 0) {
      return newNodeName;
    }
    let index = 1;
    sameNameList.forEach((name) => {
      const matches = name.match(`^${newNodeName}_(\\d+)(_copy)*$`);
      if (!matches) return;
      const oldIndex = parseInt(matches[1], 10) || -1;
      if (oldIndex >= index) {
        index = oldIndex + 1;
      }
    });
    return `${newNodeName}_${index}`;
  },
};
