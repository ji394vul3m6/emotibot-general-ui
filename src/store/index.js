import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
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
  },
};

const mutations = {
  setPrivilegedEnterprise: (s, enterpriseList) => {
    s.enterpriseList = enterpriseList;
    const keys = Object.prototype.getOwnPropertyNames(enterpriseList);
    if (keys.length > 0) {
      s.enterpriseID = keys[0];
    }
  },
  setRobot: (s, appid) => {
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
  setEnterprise: (s, enterpriseID) => {
    if (s.enterpriseID === enterpriseID) {
      return;
    }

    if (enterpriseID in s.enterpriseList) {
      s.enterpriseID = enterpriseID;
    } else {
      s.enterpriseID = '';
    }
    s.appid = '';
  },
};

const actions = {
};

// getters are functions
const getters = {
  robotID: s => s.appid,
  robotName: (s) => {
    const currentEnterprise = s.enterpriseID;
    const currentRobotList = s.enterpriseList[currentEnterprise].robots;
    const appid = s.appid;
    return appid in currentRobotList ? currentRobotList[appid] : '';
  },
  enterpriseID: s => s.enterpriseID,
  enterpriseName: (s) => {
    const enterpriseID = s.enterpriseID;
    return enterpriseID in s.enterpriseList ? s.enterpriseList[enterpriseID].name : '';
  },
  robotList: (s) => {
    const ret = [];
    const currentEnterprise = s.enterpriseID;
    const currentRobotList = s.enterpriseList[currentEnterprise].robots;
    Object.keys(currentRobotList).forEach((key) => {
      ret.push({
        appid: key,
        name: currentRobotList[key],
      });
    });
    return ret;
  },
  enterpriseList: (s) => {
    const ret = [];
    Object.keys(s.enterpriseList).forEach((key) => {
      ret.push({
        enterpriseID: key,
        name: s.enterpriseList[key].name,
      });
    });
    return ret;
  },
};

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});
