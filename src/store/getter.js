export const robotID = s => s.appid;
export const robotList = (s) => {
  const ret = [];
  Object.keys(s.robotList).forEach((key) => {
    ret.push({
      id: key,
      name: s.robotList[key].name || '',
      description: s.robotList[key].description || '',
    });
  });
  return ret;
};
export const robotName = (s) => {
  const appid = s.appid;
  return appid in s.robotList ? s.robotList[appid].name : '';
};

export const enterpriseID = s => s.enterpriseID;
export const enterpriseName = (s) => {
  const eID = s.enterpriseID;
  return eID in s.enterpriseList ? s.enterpriseList[eID].name : '';
};
export const enterpriseList = (s) => {
  const ret = [];
  Object.keys(s.enterpriseList).forEach((key) => {
    ret.push({
      enterpriseID: key,
      name: s.enterpriseList[key].name,
      discription: s.enterpriseList[key].discription || '',
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
export const userRoleMap = s => s.userRoleMap;
export const currentPage = s => s.curPage;
export const isChatOpen = s => s.chatTest;
export const userInfo = s => s.userInfo;

export const userPrivilege = (s) => {
  const privileges = {};
  s.userRole.forEach((role) => {
    const localPrivilege = role.privileges;
    const keys = Object.keys(localPrivilege);
    keys.forEach((key) => {
      let cmds = privileges[key];
      if (!cmds) {
        cmds = [];
        privileges[key] = cmds;
      }
      cmds.push(...localPrivilege[key].filter(cmd => cmds.indexOf(cmd) < 0));
    });
  });
  return privileges;
};

export const hasPrivilege = s => (mod, cmd) => {
  if (s.userInfo.type < 2) {
    return true;
  }
  const nowPriv = this.userPrivilege(s)[mod] || {};
  if (!nowPriv) {
    return false;
  }
  return nowPriv.indexOf(cmd) >= 0;
};

export const showUserInfoPage = s => s.showUserInfo;
