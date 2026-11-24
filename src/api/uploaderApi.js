import apiClient from './config';

export default {
  uploadImage(file, description = '') {
    const formData = new FormData();
    formData.append('file', file);
    if (description) formData.append('description', description);

    return apiClient.postForm('/media/images/', formData);
  },
};
