import { createRouter, createWebHistory } from 'vue-router'

import Login from '../components/LoginComponent.vue'
import Home from '../views/HomeView.vue'
import Profile from '../views/ProfileView.vue'
import Register from '../components/RegisterComponent.vue'
import { useAuthStore } from '@/stores/auth.js'

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { requiresAuth: true },
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  // Usuário não logado tentando acessar uma página protegida
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  // Usuário logado tentando acessar a tela de login
  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'home' }
  }
})

export default router
