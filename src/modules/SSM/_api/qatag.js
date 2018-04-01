const tags = [
  {
    id: 1,
    tag_name: '标签1',
    activity_count: 0,
  },
  {
    id: 2,
    tag_name: '标签2',
    activity_count: 1,
  },
  {
    id: 3,
    tag_name: '标签3',
    activity_count: 5,
  },
];
let maxID = 3;

function loadTags() {
  const copy = JSON.parse(JSON.stringify(tags));
  return new Promise((s) => {
    setTimeout(() => {
      s(copy);
    }, 500);
  });
}

function addTag(name) {
  maxID += 1;
  tags.push({
    id: maxID,
    tag_name: name,
    activity_count: 0,
  });
  return new Promise((s) => {
    setTimeout(() => {
      s();
    }, 500);
  });
}
function deleteTag(id) {
  const deleteIdx = tags.findIndex(tag => tag.id === id);
  if (tags[deleteIdx].activity_count > 0) {
    return new Promise((s, r) => {
      setTimeout(() => {
        r('activity count not zero');
      }, 500);
    });
  }
  tags.splice(deleteIdx, 1);
  return new Promise((s) => {
    setTimeout(() => {
      s();
    }, 500);
  });
}
function updateTag(id, name) {
  const idx = tags.findIndex(t => t.id === id);
  tags[idx].tag_name = name;
  return new Promise((s) => {
    setTimeout(() => {
      s();
    }, 500);
  });
}

export default {
  loadTags,
  addTag,
  deleteTag,
  updateTag,
}
;
