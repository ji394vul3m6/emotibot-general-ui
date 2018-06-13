import qs from 'qs';

const USER_URL = '/admin/v1/user';
const USERS_URL = '/admin/v1/users';
const USER_REGISTER_URL = '/admin/v1/user/register';

const BF2_USER_URL = '/api/v1/bf/user';

// const V2_PREFIX = '/auth/v2';
const V3_PREFIX = '/auth/v3';

function getUsersURL(enterprise) {
  return `${V3_PREFIX}/enterprise/${enterprise}/users`;
}
function getUserURL(enterprise) {
  return `${V3_PREFIX}/enterprise/${enterprise}/user`;
}

function getEnterpriseUsers(enterprise) {
  const usersURL = getUsersURL(enterprise);
  return this.$reqGet(usersURL).then(rsp => rsp.data.result);
}
function getEnterpriseUser(enterprise, id) {
  const userURL = getUserURL(enterprise);
  return this.$reqGet(`${userURL}/${id}`).then(rsp => rsp.data.result);
}
function updateEnterpriseUser(enterprise, id, user) {
  const userURL = getUserURL(enterprise);
  return this.$reqPut(`${userURL}/${id}`, qs.stringify(user), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then((data) => {
    if (user.password && user.password !== '') {
      user.enterprise = enterprise;
      return this.$reqPut(`${BF2_USER_URL}/${id}`, qs.stringify(user), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    }
    return new Promise((r) => {
      r(data);
    });
  });
}
function addEnterpriseUser(enterprise, user) {
  const userURL = getUserURL(enterprise);
  let userID = '';
  return this.$reqPost(userURL, qs.stringify(user), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then((rsp) => {
    userID = rsp.data.result.id;
    user.id = userID;
    user.account = user.username;
    user.enterprise = enterprise;
    return this.$reqPost(BF2_USER_URL, qs.stringify(user), {
      'Content-Type': 'application/x-www-form-urlencoded',
    });
  });
}
function deleteEnterpriseUser(enterprise, id) {
  const userURL = getUserURL(enterprise);
  return this.$reqDelete(`${BF2_USER_URL}/${id}`)
    .then(() => this.$reqDelete(`${userURL}/${id}`))
    .then(rsp => rsp.data.result);
}

function getUsers() {
  return this.$reqGet(USERS_URL).then(rsp => rsp.data.result);
}
function getUser(id) {
  return this.$reqGet(`${USER_URL}/${id}`).then(rsp => rsp.data.result);
}
function addUser(user) {
  user.type = 1;
  user.username = user.name;
  return this.$reqPost(USER_REGISTER_URL, qs.stringify(user), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
function updateUser(id, user) {
  return this.$reqPatch(`${USER_URL}/${id}`, qs.stringify(user), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
function deleteUser(id) {
  return this.$reqDelete(`${USER_URL}/${id}`);
}

export default {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,

  getEnterpriseUsers,
  getEnterpriseUser,
  updateEnterpriseUser,
  addEnterpriseUser,
  deleteEnterpriseUser,
};
