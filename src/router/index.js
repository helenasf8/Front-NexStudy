import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/LoginView.vue'
import Home from '../views/HomeView.vue'
import Planner from '../views/PlannerView.vue'
import Kanban from '../views/KanbanView.vue'
import Profile from '../views/ProfileView.vue'
import EditProfile from '../views/EditProfileView.vue'
import GoalView from '@/views/GoalView.vue'
import { useAuthStore } from '@/stores/auth.js'
import ChatView from '@/views/ChatView.vue'

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
    meta: { requiresAuth: true },
  },
  {
    path: '/goal',
    name: 'goal',
    component: GoalView,
    meta: { requiresAuth: true },
  },
  {
    path: '/kanban',
    name: 'kanban',
    component: Kanban,
    meta: { requiresAuth: true },
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
  {
  path: '/chat',
  name: 'chat',
  component: ChatView,
  meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'home' }
  }
})

export default router