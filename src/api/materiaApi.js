import apiClient from './config';

export default {
  list() {
    return apiClient.get('/materia/');
  },
  create(descricao) {
    return apiClient.post('/materia/', { descricao });
  },
};