import qs from 'qs';

const ACTIVITIES_URL = '/api/v1/faq/activities';
const ACTIVITY_URL = '/api/v1/faq/activity';

function loadActivities() {
  return this.$reqGet(ACTIVITIES_URL).then(rsp => rsp.data.result);
}

function addActivity(activity) {
  const params = {
    name: activity.name,
    content: activity.content,
    start_time: activity.start_time.toISOString(),
    end_time: activity.end_time.toISOString(),
    tag: activity.tag,
    publish_status: false,
  };
  return this.$reqPut(ACTIVITY_URL, qs.stringify(params)).then(rsp => rsp.data.result);
}

function updateActivity(id, activity) {
  const params = {
    name: activity.name,
    content: activity.content,
    start_time: activity.start_time,
    end_time: activity.end_time,
    tag: activity.tag,
    publish_status: activity.publish_status,
  };
  return this.$reqPost(`${ACTIVITY_URL}/${id}`, qs.stringify(params));
}

function deleteActivity(id) {
  return this.$reqDelete(`${ACTIVITY_URL}/${id}`);
}

function setActivityStatus(id, status) {
  const params = {
    publish_status: status,
  };
  return this.$reqPost(`${ACTIVITY_URL}/${id}/publish`, qs.stringify(params)).then(rsp => rsp.data);
}

export default {
  loadActivities,
  addActivity,
  updateActivity,
  deleteActivity,
  setActivityStatus,
};
