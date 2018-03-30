import qs from 'qs';

const ROLE_URL = '/admin/v1/role';
const ROLES_URL = '/admin/v1/roles';
const ROLE_REGISTER_URL = '/admin/v1/role/register';

function deleteRole(id) {
  return this.$reqDelete(`${ROLE_URL}/${id}`).then(rsp => rsp.data);
}

function getRole(id) {
  return this.$reqGet(`${ROLE_URL}/${id}`).then((rsp) => {
    const role = rsp.data.result;
    return {
      role_name: role.role_name,
      role_id: role.role_id,
      privileges: JSON.parse(role.privilege),
    };
  });
}

function updateRole(id, role) {
  const options = {
    role_name: role.name,
    privilege: JSON.stringify(role.privileges),
  };

  return this.$reqPatch(`${ROLE_URL}/${id}`, qs.stringify(options), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

function getRoles() {
  return this.$reqGet(ROLES_URL).then((rsp) => {
    const ret = [];
    rsp.data.result.forEach((role) => {
      ret.push({
        role_name: role.role_name,
        role_id: role.role_id,
        privileges: JSON.parse(role.privilege),
      });
    });
    return ret;
  });
}

function addRole(name, privileges) {
  const options = {
    role_name: name,
    privilege: JSON.stringify(privileges),
  };

  return this.$reqPost(ROLE_REGISTER_URL, qs.stringify(options), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export default {
  getRoles,
  getRole,
  addRole,
  updateRole,
  deleteRole,
};
