const META_PATH = '/api/v1/dictionary/download-meta';
const CHECK_PATH = '/api/v1/dictionary/full-check';
const UPLOAD_PATH = '/api/v1/dictionary/upload';
const WORDBANK_PATH = '/api/v1/dictionary/wordbanks';

function getWordbanks() {
  // const mockData = [{
  //   type: 0,
  //   name: 'dir1',
  //   children: [{
  //     type: 0,
  //     name: 'dir1-1',
  //     children: [{
  //       type: 1,
  //       name: 'dict1-1-1',
  //       text: ['123', '456', '789'],
  //     }],
  //   }],
  // }, {
  //   type: 0,
  //   name: 'dir2',
  //   children: [{
  //     type: 0,
  //     name: 'dir2-1',
  //     children: [{
  //       type: 1,
  //       name: 'dict1-1-1',
  //       text: ['123', '456', '789'],
  //     }],
  //   }, {
  //     type: 1,
  //     name: 'dict2-2',
  //     text: ['123', '456', '789'],
  //   }, {
  //     type: 0,
  //     name: 'dir2-3 no children',
  //   }],
  // }];

  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(mockData);
  //   }, 500);
  // });
  function convertData(wordbank) {
    if (wordbank.similar_words) {
      wordbank.text = wordbank.similar_words.split(',');
    }
    if (wordbank.children && wordbank.children.length > 0) {
      wordbank.children.forEach((child) => {
        convertData(child);
      });
    }
  }
  return this.$reqGet(WORDBANK_PATH).then((rsp) => {
    if (rsp.data && rsp.data.length > 0) {
      rsp.data.forEach((wordbank) => {
        convertData(wordbank);
      });
    }
    return rsp.data;
  });
}

function uploadFile(file) {
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
  uploadFile,
  getDownloadMeta,
  getLastResult,
};
