<script setup>
import { onMounted, ref } from 'vue'
import apiClient from '@/api/config'

const myGoals = ref([])

onMounted(async () => {
  console.log('todo: buscar as metas')
  const result = await apiClient.get('/metas')
  myGoals.value = result.data.results
})
</script>

<template>
  <h1>Minhas metas</h1>

  <div v-if="myGoals.length > 0">
    {{ myGoals }}
  </div>

  <div v-else>Você precisa definir as metas do dia</div>
</template>
