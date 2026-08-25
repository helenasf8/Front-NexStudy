import { ref } from 'vue';
import { defineStore } from 'pinia';
import userApi from '../api/userApi';
import uploaderApi from '../api/uploaderApi';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const loading = ref(false);

  async function fetchMe() {
    loading.value = true;
    try {
      const { data } = await userApi.me();
      user.value = data;
    } finally {
      loading.value = false;
    }
  }

  async function updateMe(payload) {
    const { data } = await userApi.updateMe(payload);
    user.value = data;
    return data;
  }

  async function uploadFotoFile(file) {
    const { data } = await uploaderApi.uploadImage(file, 'Foto de perfil');
    return data.attachment_key;
  }

  return { user, loading, fetchMe, updateMe, uploadFotoFile };
});