<script setup>

import { ref, nextTick } from 'vue'
import { useChatStore } from '@/stores/chat'

const chatStore = useChatStore()

const mensagem = ref('')
const finalChat = ref(null)

async function rolarChat() {

  await nextTick()

  finalChat.value?.scrollIntoView({
    behavior: 'smooth'
  })

}

async function enviar() {

  if (!mensagem.value.trim() || chatStore.loading) {
    return
  }

  const texto = mensagem.value

  mensagem.value = ''

  const envio = chatStore.enviarMensagem(texto)

  await rolarChat()

  await envio

  await rolarChat()

}

function novaConversa() {

  chatStore.limparChat()
  mensagem.value = ''

}

</script>

<template>

  <main>

    <h1>IA Assistente</h1>

    <p>
      Tire suas dúvidas e aprenda com a inteligência
      artificial do NexStudy.
    </p>

    <button
      @click="novaConversa"
      :disabled="chatStore.loading"
    >
      Nova conversa
    </button>

    <hr>

    <section>

      <div v-if="chatStore.mensagens.length === 0">

        <h2>Como posso te ajudar hoje?</h2>

        <p>
          Envie uma pergunta sobre qualquer matéria.
        </p>

      </div>

      <div
        v-for="(item, index) in chatStore.mensagens"
        :key="index"
      >

        <strong>
          {{ item.role === 'user' ? 'Você' : 'NexStudy IA' }}
        </strong>

        <p>{{ item.content }}</p>

        <hr>

      </div>

      <p v-if="chatStore.loading">
        A IA está pensando...
      </p>

      <p v-if="chatStore.error">
        {{ chatStore.error }}
      </p>

      <div ref="finalChat"></div>

    </section>

    <form @submit.prevent="enviar">

      <textarea
        v-model="mensagem"
        placeholder="Digite sua pergunta..."
        rows="3"
        maxlength="5000"
        :disabled="chatStore.loading"
        @keydown.enter.exact.prevent="enviar"
      ></textarea>

      <button
        type="submit"
        :disabled="
          chatStore.loading || !mensagem.trim()
        "
      >

        {{ chatStore.loading ? 'Aguarde...' : 'Enviar' }}

      </button>

    </form>

  </main>

</template>

<style scoped>
main {
  margin: 0 10vw;
  padding: 40px 24px;
  color: #0a0a0a;
  font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* Cabeçalho */
main > h1 {
  margin: 0 0 6px;
  font-size: 1.9rem;
  font-weight: 700;
  letter-spacing: -0.03em;
}

main > p {
  margin: 0 0 20px;
  font-size: 0.95rem;
  color: #666;
}

main > hr {
  margin: 20px 0;
  border: none;
  border-top: 1px solid #e5e5e5;
}

/* Área do chat */
section {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 320px;
  max-height: 55vh;
  overflow-y: auto;
  padding: 4px 6px 4px 0;
  scrollbar-width: thin;
  scrollbar-color: #bbb transparent;
}

section::-webkit-scrollbar {
  width: 6px;
}

section::-webkit-scrollbar-thumb {
  background: #bbb;
  border-radius: 999px;
}

/* Tela vazia */
section > div:has(> h2) {
  margin: auto;
  padding: 40px 20px;
  text-align: center;
}

section h2 {
  margin: 0 0 8px;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

section > div:has(> h2) > p {
  margin: 0;
  color: #666;
}

/* Mensagens */
section > div:has(> strong) {
  max-width: 85%;
  padding: 14px 18px;
  border: 1px solid #e0e0e0;
  border-radius: 20px 20px 20px 6px;
}

/* Mensagens do usuário (1ª, 3ª, 5ª...) alinhadas à direita */
section > div:has(> strong):nth-child(odd) {
  align-self: flex-end;
  border-color: #0a0a0a;
  border-radius: 20px 20px 6px 20px;
}

section strong {
  display: block;
  margin-bottom: 4px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #888;
}

section > div:has(> strong) > p {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

section > div:has(> strong) > hr {
  display: none;
}

/* Status: carregando / erro */
section > p {
  align-self: flex-start;
  margin: 0;
  padding: 8px 16px;
  border: 1px dashed #bbb;
  border-radius: 999px;
  font-size: 0.85rem;
  color: #666;
}

/* Formulário */
form {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #d4d4d4;
  border-radius: 24px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

form:focus-within {
  border-color: #0a0a0a;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.06);
}

textarea {
  flex: 1;
  padding: 8px 10px;
  border: none;
  border-radius: 12px;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  color: #0a0a0a;
  resize: none;
  outline: none;
}

textarea::placeholder {
  color: #999;
}

/* Botões */
button {
  padding: 10px 22px;
  border: 1px solid #0a0a0a;
  border-radius: 999px;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  color: #0a0a0a;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease, color 0.15s ease;
}

button:hover:not(:disabled) {
  background: #0a0a0a;
  color: #fff;
}

button:active:not(:disabled) {
  transform: scale(0.97);
}

/* Botão Enviar em destaque */
form button {
  background: #0a0a0a;
  color: #fff;
}

form button:hover:not(:disabled) {
  background: #333;
  border-color: #333;
}

button:disabled,
textarea:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Responsivo */
@media (max-width: 600px) {
  main {
    padding: 24px 16px;
  }

  section > div:has(> strong) {
    max-width: 95%;
  }
}
</style>