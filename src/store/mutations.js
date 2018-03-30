import * as types from './mutations_type';

export const state = {
  appid: 'aaa',
  enterpriseID: 'eea',
  enterpriseList: {
    eea: {
      name: 'EnterpriseA',
      robots: {
        aaa: 'RobotAA',
        abb: 'RobotAB',
      },
    },
    eeb: {
      name: 'EnterpriseB',
      robots: {
        aaa: 'RobotBA',
        abb: 'RobotBB',
      },
    },
    eec: {
      name: 'EnterpriseC',
      robots: {
        aaa: 'RobotCA',
      },
    },
  },
  privilegeList: [],
  pageInfos: {},
};

export const mutations = {
  [types.SET_PRIVILEGED_ENTERPRISES]: (s, enterpriseList) => {
    s.enterpriseList = enterpriseList;
    const keys = Object.prototype.getOwnPropertyNames(enterpriseList);
    if (keys.length > 0) {
      s.enterpriseID = keys[0];
    }
  },
  [types.SET_ROBOT]: (s, appid) => {
    if (s.appid === appid) {
      return;
    }

    const currentEnterprise = s.enterpriseID;
    const currentRobotList = s.enterpriseList[currentEnterprise].robots;
    if (appid in currentRobotList) {
      s.appid = appid;
    } else {
      s.appid = '';
    }
  },
  [types.SET_ENTERPRISE]: (s, enterpriseID) => {
    if (s.enterpriseID === enterpriseID) {
      return;
    }

    if (enterpriseID in s.enterpriseList) {
      s.enterpriseID = enterpriseID;
    } else {
      s.enterpriseID = '';
    }
    const currentRobotList = Object.keys(s.enterpriseList[enterpriseID].robots);
    if (currentRobotList && currentRobotList.length > 0) {
      s.appid = currentRobotList[0];
    } else {
      s.appid = '';
    }
  },
  [types.SET_PRIVILEGE_LIST]: (s, privilegeList) => {
    s.privilegeList = privilegeList;
  },
  [types.SET_PAGES]: (s, pageInfos) => {
    s.pageInfos = pageInfos;
  },
};
