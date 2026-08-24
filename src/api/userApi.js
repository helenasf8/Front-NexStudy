import apiClient from './config';

export default {
  me() {
    return apiClient.get('/usuarios/me/'); 
  },
  updateMe(payload) {
    return apiClient.patch('/usuarios/me/', payload); 
  },
};