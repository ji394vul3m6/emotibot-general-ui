import qs from 'qs';

const V3_PREFIX = '/auth/v3';

function getRolesURL(enterpriseID) {
  return `${V3_PREFIX}/enterprise/${enterpriseID}/roles`;
}
function getRoleURL(enterpriseID) {
  return `${V3_PREFIX}/enterprise/${enterpriseID}/role`;
}

function getEnterpriseRoles(enterprise) {
  const rolesURL = getRolesURL(enterprise);
  return this.$reqGet(rolesURL).then(rsp => rsp.data.result);
}
function getEnterpriseRole(enterprise, id) {
  const roleURL = getRoleURL(enterprise);
  return this.$reqGet(`${roleURL}/${id}`).then(rsp => rsp.data.result);
}
function updateEnterpriseRole(enterprise, id, role) {
  const roleURL = getRoleURL(enterprise);
  const options = {
    name: role.name,
    privilege: JSON.stringify(role.privileges),
  };

  return this.$reqPut(`${roleURL}/${id}`, qs.stringify(options), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
function addEnterpriseRole(enterprise, role) {
  const roleURL = getRoleURL(enterprise);
  const options = {
    name: role.name,
    privilege: JSON.stringify(role.privileges),
  };

  return this.$reqPost(`${roleURL}`, qs.stringify(options), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
function deleteEnterpriseRole(enterprise, id) {
  const roleURL = getRoleURL(enterprise);
  return this.$reqDelete(`${roleURL}/${id}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export default {
  getEnterpriseRoles,
  getEnterpriseRole,
  updateEnterpriseRole,
  addEnterpriseRole,
  deleteEnterpriseRole,
};
