import apiClient from './config';

export default {
  login(email, password) {
    return apiClient.post('/token/', { email, password });
  },
  register(email, name, password) {
    return apiClient.post('/registro/', { email, name, password });
  },
};