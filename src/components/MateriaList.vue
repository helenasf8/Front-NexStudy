<script setup>
import { onMounted } from 'vue';
import { useMateriasStore } from '../stores/Materias.js';

const store = useMateriasStore();

onMounted(() => {
  store.fetchMaterias();
});
</script>

<template>
  <div class="container-login">
    <div class="login">
      <button>Login</button>
      <button>Cadastro</button>
    </div>
    <form action="#">

      <div>
        <label for="email">Email</label>
        <input type="email" placeholder="Seu email">
      </div>

      <div>
        <label for="text">senha</label>
        <input type="text" placeholder="••••••••">
      </div>
    </form>

    <button class="enter">Entrar</button>
  </div>

  <h3>lista puxada do backend:</h3>
  <div v-for="materia in store.materias" :key="materia.id">
    <p>{{ materia.descricao }}</p>
  </div>
</template>