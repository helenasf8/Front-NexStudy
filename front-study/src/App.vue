<script setup>
</script>

<template>
  <main>
    <div class="container">
      <h1>Bem-vindo</h1>
      <input type="email" placeholder="Email">
      <input type="password" placeholder="Senha">
      <button>Entrar</button>
    </div>
  </main>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

body {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #111;
  color: #fff;
}

.container {
  background: #1c1c1c;
  padding: 40px;
  border-radius: 12px;
  width: 300px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

h1 {
  margin-bottom: 25px;
  font-size: 22px;
  color: #fff;
}

input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: none;
  border-radius: 10px;
  background: #2a2a2a;
  color: #fff;
  outline: none;
  transition: 0.3s;
}

input::placeholder {
  color: #aaa;
}

input:focus {
  background: #333;
  box-shadow: 0 0 0 2px #555;
}

button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: #fff;
  color: #111;
  font-weight: bold;
  cursor: pointer;
}
</style>
