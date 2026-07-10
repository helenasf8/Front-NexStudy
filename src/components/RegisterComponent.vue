<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const name = ref('');
const password = ref('');
const password2 = ref(''); // só validação local, não vai pro backend
const error = ref('');
const authStore = useAuthStore();
const router = useRouter();

async function handleRegister() {
  error.value = '';

  if (password.value !== password2.value) {
    error.value = 'As senhas não coincidem.';
    return;
  }

  try {
    await authStore.register(email.value, name.value, password.value);
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.email?.[0]
      || err.response?.data?.password?.[0]
      || err.response?.data?.name?.[0]
      || 'Erro ao cadastrar. Tente novamente.';
  }
}
</script>

<template>
  <form @submit.prevent="handleRegister">
    <input v-model="name" type="text" placeholder="Nome" required />
    <input v-model="email" type="email" placeholder="E-mail" required />
    <input v-model="password" type="password" placeholder="Senha" />
    <input v-model="password2" type="password" placeholder="Confirme a senha" required />
    <button type="submit">Cadastrar</button>
    <p v-if="error">{{ error }}</p>
  </form>
</template>