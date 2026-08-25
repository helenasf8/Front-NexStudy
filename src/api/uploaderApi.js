import apiClient from './config';

export default {
  uploadImage(file, description = '') {
    const formData = new FormData();
    formData.append('file', file);
    if (description) formData.append('description', description);

    return apiClient.post('/media/images/', formData, {
      // undefined remove o 'application/json' padrão do apiClient,
      // deixando o navegador definir o Content-Type correto (multipart + boundary)
      headers: { 'Content-Type': undefined },
    });
  },
};