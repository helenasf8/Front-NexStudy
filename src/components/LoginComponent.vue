<template>
  <div class="welcome">
    <h1>{{ mode === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta' }}</h1>
    <p>{{ mode === 'login' ? 'Continue sua jornada de aprendizado.' : 'Comece sua jornada de aprendizado.' }}</p>
  </div>

  <div class="login-container">
    <!-- FORMULÁRIO DE LOGIN -->
    <form v-if="mode === 'login'" class="login-form" @submit.prevent="handleLogin">
      <div v-if="loginError" class="error-message">{{ loginError }}</div>

      <div class="field">
        <label for="email">E-mail</label>
        <input id="email" v-model="loginEmail" type="email" placeholder="seu@email.com" required
          autocomplete="email" />
      </div>

      <div class="field">
        <label for="password">Senha</label>
        <input id="password" v-model="loginPassword" type="password" placeholder="••••••••" required
          autocomplete="current-password" />
      </div>

      <button type="submit" :disabled="loginLoading">
        {{ loginLoading ? 'Entrando...' : 'Entrar' }}
      </button>

      <p>
        Não tem uma conta?
        <a href="#" @click.prevent="mode = 'register'">Criar conta</a>
      </p>
    </form>

    <!-- FORMULÁRIO DE REGISTRO -->
    <form v-else class="login-form" @submit.prevent="handleRegister">
      <div v-if="registerError" class="error-message">{{ registerError }}</div>

      <div class="field">
        <label for="name">Nome</label>
        <input id="name" v-model="registerName" type="text" placeholder="Seu nome" required />
      </div>

      <div class="field">
        <label for="register-email">E-mail</label>
        <input id="register-email" v-model="registerEmail" type="email" placeholder="seu@email.com" required
          autocomplete="email" />
      </div>

      <div class="field">
        <label for="register-password">Senha</label>
        <input id="register-password" v-model="registerPassword" type="password" placeholder="••••••••" required
          autocomplete="new-password" />
      </div>

      <button type="submit" :disabled="registerLoading">
        {{ registerLoading ? 'Cadastrando...' : 'Cadastrar' }}
      </button>

      <p>
        Já tem uma conta?
        <a href="#" @click.prevent="mode = 'login'">Entrar</a>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// controla qual formulário aparece: 'login' ou 'register'
const mode = ref('login');

// --- LOGIN ---
const loginEmail = ref('');
const loginPassword = ref('');
const loginLoading = ref(false);
const loginError = ref('');

async function handleLogin() {
  loginLoading.value = true;
  loginError.value = '';
  try {
    await authStore.login(loginEmail.value, loginPassword.value);
    router.push('/home');
  } catch (err) {
    loginError.value =
      err.response?.data?.detail ??
      'Erro ao entrar. Verifique suas credenciais.';
  } finally {
    loginLoading.value = false;
  }
}

// --- REGISTRO ---
const registerName = ref('');
const registerEmail = ref('');
const registerPassword = ref('');
const registerLoading = ref(false);
const registerError = ref('');

async function handleRegister() {
  registerError.value = '';
  registerLoading.value = true;
  try {
    await authStore.register(registerEmail.value, registerName.value, registerPassword.value);
    router.push('/home');
  } catch (err) {
    registerError.value = err.response?.data?.email?.[0]
      || err.response?.data?.password?.[0]
      || err.response?.data?.name?.[0]
      || 'Erro ao cadastrar. Tente novamente.';
  } finally {
    registerLoading.value = false;
  }
}
</script>

<style scoped>
.welcome {
  text-align: center;
  margin-bottom: 2.5vw;
}

.welcome p {
  font-size: 1.2rem;
  color: rgb(87, 92, 87);
}

.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form {
  width: 100%;
  max-width: 400px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 1.5vw;
  font-size: 1.1em;
}

.field input {
  padding: 0.7rem 0.8rem;
  border: 1px solid rgb(204, 204, 204, 0.2);
  border-radius: 10px;
  background-color: #f1f1ed;
  font-size: 1em;
  outline: none;
}

.error-message {
  background-color: #fef2f2;
  color: #dc2626;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.9em;
  margin-bottom: 1rem;
  border: 1px solid #fecaca;
}

button {
  width: 100%;
  padding: 0.7rem 0.8rem;
  border: none;
  border-radius: 13px;
  background: linear-gradient(90deg, #3a3cc4, #9149e4);
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.3);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

form p {
  color: rgb(87, 92, 87);
  margin: 2vw 0 1vw 0;
  padding-top: 1.5vw;
  font-size: 1.1rem;
  text-align: center;
  border-top: 2px solid rgb(29, 28, 28, 0.2);
}

form p a {
  color: #813ac4;
  text-decoration: none;
  font-weight: 600;
}
</style>