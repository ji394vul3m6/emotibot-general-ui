const META_PATH = '/api/v1/dictionary/download-meta';
const CHECK_PATH = '/api/v1/dictionary/full-check';
const UPLOAD_PATH = '/api/v1/dictionary/upload';
const WORDBANKS_PATH = '/api/v1/dictionary/wordbanks';
const WORDBANK_PATH = '/api/v1/dictionary/wordbank';

const CHATS_INFO_PATH = '/api/v1/robot/chat';

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

function getWordbank(id) {
  return this.$reqGet(`${WORDBANK_PATH}/${id}`).then((rsp) => {
    if (rsp.data) {
      convertData(rsp.data);
    }
    return rsp.data;
  });
}

function getWordbanks() {
  return this.$reqGet(WORDBANKS_PATH).then((rsp) => {
    if (rsp.data && rsp.data.length > 0) {
      rsp.data.forEach((wordbank) => {
        convertData(wordbank);
      });
    }
    return rsp.data;
  });
}

function getDefaultSensitiveAnswer() {
  return this.$reqGet(`${CHATS_INFO_PATH}/12`).then(res => res.data.result.contents);
}

function updateWordbank(data) {
  return this.$reqPost(WORDBANK_PATH, data);
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
  getWordbank,
  getWordbanks,
  uploadFile,
  getDownloadMeta,
  getLastResult,
  getDefaultSensitiveAnswer,
  updateWordbank,
};
