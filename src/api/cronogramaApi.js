import apiClient from './config';

export default {
  list() {
    return apiClient.get('/cronograma/');
  },
};