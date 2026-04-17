import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import MateriasApi from '../api/MateriasApi.js'

export const useMateriasStore = defineStore('materias', () => {
  const materias = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchMaterias() {
    loading.value = true
    error.value = null
    try {
      const response = await MateriasApi.getAll()
      materias.value = response.data.results
    } catch (err) {
      error.value = 'Erro ao carregar tarefas.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  return {
    materias,
    loading,
    error,
    fetchMaterias,
  }
})
