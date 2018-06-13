import qs from 'qs';

const baseURL = '/auth/v3/enterprise';
const BF2_ROBOT_URL = '/api/v1/bf/app';

function getRobots(enterpriseID) {
  return this.$reqGet(`${baseURL}/${enterpriseID}/apps`).then(rsp => rsp.data.result);
}

function getRobot(enterpriseID, appID) {
  return this.$reqGet(`${baseURL}/${enterpriseID}/app/${appID}`).then(rsp => rsp.data);
}

function addRobot(enterpriseID, app, user) {
  return this.$reqPost(`${baseURL}/${enterpriseID}/app`, qs.stringify(app), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
  .then((rsp) => {
    const option = {
      appid: rsp.data.result.id,
      userid: user,
      name: app.name,
    };
    return this.$reqPost(BF2_ROBOT_URL, qs.stringify(option), {
      'Content-Type': 'application/x-www-form-urlencoded',
    });
  });
}
function updateRobot(enterpriseID, appID, app) {
  return this.$reqPut(`${baseURL}/${enterpriseID}/app/${appID}`, qs.stringify(app), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(rsp => rsp.data);
}
function deleteRobot(enterpriseID, appID) {
  return this.$reqDelete(`${baseURL}/${enterpriseID}/app/${appID}`).then(rsp => rsp.data);
}

export default {
  getRobots,
  getRobot,
  addRobot,
  updateRobot,
  deleteRobot,
};
