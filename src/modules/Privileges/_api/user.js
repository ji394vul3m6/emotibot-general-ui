import qs from 'qs';

const USER_URL = '/admin/v1/user';
const USERS_URL = '/admin/v1/users';
const USER_REGISTER_URL = '/admin/v1/user/register';

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
};
