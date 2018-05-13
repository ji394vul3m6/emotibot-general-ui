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
  curPage: {},
  userID: '',
  userRole: {},
};

export const mutations = {
  [types.SET_PRIVILEGED_ENTERPRISES]: (s, enterpriseList) => {
    const keys = Object.getOwnPropertyNames(enterpriseList);
    if (keys.length > 0) {
      s.enterpriseID = keys[0];
    }
    s.enterpriseList = enterpriseList;
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
  [types.SET_USER]: (s, userID) => {
    s.userID = userID;
  },
  [types.SET_USER_ROLE]: (s, role) => {
    s.userRole = role;
  },
  [types.SET_CUR_PAGE]: (s, curPage) => {
    s.curPage = curPage;
  },
  [types.TOGGLE_PAGE_CATEGORY]: (s, name) => {
    const idx = s.pageInfos.findIndex(page => page.name === name);
    if (idx < 0) {
      return;
    }
    s.pageInfos[idx].expanded = !s.pageInfos[idx].expanded;
  },
};
