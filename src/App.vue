<script setup>
import Header from './components/HeaderComponent.vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <Header v-if="authStore.isAuthenticated" />
  <RouterView />
</template>