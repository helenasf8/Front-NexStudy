import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/LoginView.vue'
import Home from '../views/HomeView.vue'
import Planner from '../views/PlannerView.vue'
import Kanban from '../views/KanbanView.vue'
import Profile from '../views/ProfileView.vue'
import EditProfile from '../views/EditProfileView.vue'
import { useAuthStore } from '@/stores/auth.js'
import GoalView from '@/views/GoalView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/planner',
    name: 'planner',
    component: Planner,
  },
  {
    path: '/goal',
    name: 'goal',
    component: GoalView,
  },
  {
    path: '/kanban',
    name: 'kanban',
    component: Kanban,
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/edit-profile',
    name: 'edit-profile',
    component: EditProfile,
    meta: { requiresAuth: true },
  },
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
