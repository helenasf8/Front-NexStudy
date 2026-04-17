<script setup>
import { onMounted } from 'vue';
import { useMateriasStore } from '../stores/Materias.js';

const store = useMateriasStore();

onMounted(() => {
  store.fetchMaterias();
});
</script>


<template>
<div v-for="materia in store.materias" :key="materia.id">
  <p>{{ materia.descricao }}</p>
</div>
</template>