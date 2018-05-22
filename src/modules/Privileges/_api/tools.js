const ENCRYPT_URL = '/api/v1/ui/encrypt';

function encryptText(text) {
  return this.$reqGet(`${ENCRYPT_URL}?text=${text}`).then(rsp => rsp.data);
}

export default {
  encryptText,
};
