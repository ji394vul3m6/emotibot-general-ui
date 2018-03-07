const META_PATH = '/api/v1/dictionary/download-meta';
const CHECK_PATH = '/api/v1/dictionary/full-check';
const UPLOAD_PATH = '/api/v1/dictionary/upload';

function getWordbanks() {
  const mockData = [{
    type: 'directory',
    name: 'dir1',
    children: [{
      type: 'directory',
      name: 'dir1-1',
      children: [{
        type: 'dict',
        name: 'dict1-1-1',
        text: ['123', '456', '789'],
      }],
    }],
  }, {
    type: 'directory',
    name: 'dir2',
    children: [{
      type: 'directory',
      name: 'dir2-1',
      children: [{
        type: 'dict',
        name: 'dict1-1-1',
        text: ['123', '456', '789'],
      }],
    }, {
      type: 'dict',
      name: 'dict2-2',
      text: ['123', '456', '789'],
    }, {
      type: 'directory',
      name: 'dir2-3 no children',
    }],
  }];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, 500);
  });
}

function upload(file) {
  if (!file) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('Empty file');
      }, 0);
    });
  } else if (file.size <= 0 || file.size > 2 * 1024 * 1024) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('File size need more than 0, less than 2MB');
      }, 0);
    });
  }

  const data = new FormData();
  data.append('file', file);

  return this.$reqPost(UPLOAD_PATH, data);
}
  // word_bank_down.php
function getDownloadMeta() {
  return this.$reqGet(META_PATH);
}
  // word_bank_check.php
function getLastResult() {
  return this.$reqGet(CHECK_PATH);
}

export default {
  getWordbanks,
  upload,
  getDownloadMeta,
  getLastResult,
};
