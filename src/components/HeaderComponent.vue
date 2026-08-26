<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

function logout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <header>
    <h1>NexStudy</h1>
    <nav>
      <ul>
        <li>
          <RouterLink to="/home">Home</RouterLink>
        </li>
        <li>
          <RouterLink to="/goal">Metas diárias</RouterLink>
        </li>
        <li>
          <RouterLink to="/planner">Planilha</RouterLink>
        </li>
        <li>
          <RouterLink to="/kanban">Notas</RouterLink>
        </li>
        <li>
          <RouterLink to="#">IA Assistente</RouterLink>
        </li>
        <li>
          <RouterLink to="/profile">Perfil</RouterLink>
        </li>
        <li>
          <button @click="logout" class="logout-button">Sair</button>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1vw 4vw;
  border-bottom: 1px solid rgb(92, 92, 92);
  border-color: rgb(214, 218, 218);
}

ul {
  list-style: none;
  display: flex;
  gap: 3vw;
  align-items: center;
}

ul li a {
  text-decoration: none;
  color: rgb(92, 92, 92);
  font-weight: 500;
  font-size: 1.3em;
  padding: 8px 15px;
  border-radius: 10px;
  transition: background-color 0.2s ease;
}

ul li a:hover {
  background-color: rgb(23, 24, 24, 0.9);
  color: #edf1fe;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  font-size: 0.95em;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.logout-button:hover {
  background: #fee2e2;
}
</style>
