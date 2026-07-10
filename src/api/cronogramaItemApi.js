import apiClient from './config';

export default {
  list() {
    return apiClient.get('/cronograma-item/');
  },
  create(item) {
    return apiClient.post('/cronograma-item/', item);
  },
  update(id, item) {
    return apiClient.patch(`/cronograma-item/${id}/`, item);
  },
  delete(id) {
    return apiClient.delete(`/cronograma-item/${id}/`);
  },
};