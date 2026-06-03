import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/LoginComponent.vue';
import { useAuthStore } from '../stores/auth';
import MateriaList from '@/components/MateriaList.vue';
import Teste from '@/components/Teste.vue';
const routes = [
    {
    path: '/materia',
    name: 'materia',
    component: MateriaList,
    //meta: { requiresAuth: true },
    //meta: { isAuthenticated: true },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/teste',
    name: 'teste',
    component: Teste,
    //meta: { requiresAuth: true },
    //meta: { isAuthenticated: true },
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