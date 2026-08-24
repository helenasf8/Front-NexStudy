import apiClient from './config';

export default {
  me() {
    return apiClient.get('/api/usuarios/me/');
  },
  updateMe(payload) {
    return apiClient.patch('/api/usuarios/me/', payload);
  },
};