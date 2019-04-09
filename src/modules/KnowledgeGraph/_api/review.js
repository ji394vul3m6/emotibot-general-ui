import axios from 'axios';

const REVIEW_URL = '/review';

function getReview(reviewer, targetId, type) {
  return axios.get(`${REVIEW_URL}?reviewer=${reviewer}&target_id=${targetId}&type=${type}`);
}

function addReview(data) {
  return axios.post(REVIEW_URL, data);
}

function updateReview(id, comment) {
  return axios.put(`${REVIEW_URL}/${id}`, {
    comment,
  });
}
export default {
  getReview,
  addReview,
  updateReview,
};
