import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import { useAuthStore } from '../stores/auth';
import MateriaList from '@/components/MateriaList.vue';

const routes = [
    {
    path: '/',
    name: 'materia',
    component: MateriaList,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' };
  }
});

export default router;