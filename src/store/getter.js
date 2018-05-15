export const robotID = s => s.appid;
export const robotName = (s) => {
  const currentEnterprise = s.enterpriseID;
  const currentRobotList = s.enterpriseList[currentEnterprise].robots;
  const appid = s.appid;
  return appid in currentRobotList ? currentRobotList[appid] : '';
};

export const enterpriseID = s => s.enterpriseID;
export const enterpriseName = (s) => {
  const eID = s.enterpriseID;
  return eID in s.enterpriseList ? s.enterpriseList[eID].name : '';
};

export const robotList = (s) => {
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
};

export const enterpriseList = (s) => {
  const ret = [];
  Object.keys(s.enterpriseList).forEach((key) => {
    ret.push({
      enterpriseID: key,
      name: s.enterpriseList[key].name,
    });
  });
  return ret;
};

export const privilegeList = s => s.privilegeList;
export const menuPages = s => s.pageInfos;
export const privilegeMap = (s) => {
  const map = {};
  s.privilegeList.forEach((priv) => {
    map[priv.privilege_name] = priv;
  });
  return map;
};

export const userID = s => s.userID;
export const userRole = s => s.userRole;
export const currentPage = s => s.curPage;
export const isChatOpen = s => s.chatTest;
