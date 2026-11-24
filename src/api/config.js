import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  'http://localhost:8001/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

let refreshPromise = null;

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');

  if (token && !config.url?.includes('/token/')) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original.url?.includes('/token/') &&
      !original.url?.includes('/registro/')
    ) {
      original._retry = true;

      const refreshToken =
        localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          if (!refreshPromise) {
            refreshPromise = axios
              .post(
                `${BASE_URL.replace(/\/$/, '')}/token/refresh/`,
                { refresh: refreshToken }
              )
              .then(({ data }) => {
                const authStore = useAuthStore();

                authStore.accessToken = data.access;

                localStorage.setItem(
                  'access_token',
                  data.access
                );

                if (data.refresh) {
                  authStore.refreshToken = data.refresh;

                  localStorage.setItem(
                    'refresh_token',
                    data.refresh
                  );
                }

                return data.access;
              })
              .finally(() => {
                refreshPromise = null;
              });
          }

          const newToken = await refreshPromise;

          original.headers.Authorization =
            `Bearer ${newToken}`;

          return apiClient(original);
        } catch (err) {
          console.error('Erro ao renovar sessão:', err);
        }
      }

      const authStore = useAuthStore();

      authStore.logout();

      window.location.href = import.meta.env.BASE_URL;
    }

    return Promise.reject(error);
  }
);

export default apiClient;