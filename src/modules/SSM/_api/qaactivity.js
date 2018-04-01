const activities = [
  {
    id: 1,
    name: '活動1',
    content: '這是一個跟ＸＸＸ有關的活動',
    start_time: new Date('2018-03-01'),
    end_time: new Date('2018-04-15'),
    tag: 1,
    publish_status: false,
  },
  {
    id: 2,
    name: '活動2',
    content: 'YYY有關的活動',
    start_time: null,
    end_time: null,
    tag: 1,
    publish_status: true,
  },
  {
    id: 3,
    name: '活動3',
    content: '這是一個很長很長很長很長很長很長很長很長很長很長很長的活動',
    start_time: new Date('2018-03-01'),
    end_time: new Date('2018-03-15'),
    tag: null,
    publish_status: false,
  },
];
let maxID = 1;

function loadActivities() {
  return new Promise((s) => {
    setTimeout(() => {
      s(activities);
    }, 500);
  });
}

function addActivity(activity) {
  maxID += 1;
  activities.push({
    id: maxID,
    name: activity.name,
    content: activity.content,
    start_time: activity.start_time,
    end_time: activity.end_time,
    tag: activity.tag,
    publish_status: false,
  });
  return new Promise((s) => {
    setTimeout(() => {
      s();
    });
  });
}

function updateActivity(id, activity) {
  const updatedIdx = activities.findIndex(act => act.id === id);
  return new Promise((s, r) => {
    if (updatedIdx >= 0) {
      activities[updatedIdx] = {
        id,
        name: activity.name,
        content: activity.content,
        start_time: activity.start_time,
        end_time: activity.end_time,
        tag: activity.tag,
        publish_status: activity.publish_status,
      };
      setTimeout(() => {
        s();
      }, 500);
    } else {
      setTimeout(() => {
        r('404');
      }, 500);
    }
  });
}

function deleteActivity(id) {
  const deleteIdx = activities.findIndex(act => act.id === id);
  return new Promise((s, r) => {
    if (deleteIdx >= 0) {
      activities.splice(deleteIdx, 1);
      setTimeout(() => {
        s();
      }, 500);
    } else {
      setTimeout(() => {
        r('404');
      }, 500);
    }
  });
}

function setActivityStatus(id, status) {
  const updatedIdx = activities.findIndex(act => act.id === id);
  return new Promise((s, r) => {
    if (updatedIdx >= 0) {
      activities[updatedIdx].publish_status = status;
      setTimeout(() => {
        s();
      }, 500);
    } else {
      setTimeout(() => {
        r('404');
      }, 500);
    }
  });
}

export default {
  loadActivities,
  addActivity,
  updateActivity,
  deleteActivity,
  setActivityStatus,
};
