<script setup>
import { onMounted } from 'vue';
import { useMateriasStore } from '../stores/Materias.js';

const store = useMateriasStore();

onMounted(() => {
  store.fetchMaterias();
});
</script>

<template>
  <h3>lista puxada do backend:</h3>
  <div v-for="materia in store.materias" :key="materia.id">
    <p>{{ materia.descricao }}</p>
  </div>
</template>