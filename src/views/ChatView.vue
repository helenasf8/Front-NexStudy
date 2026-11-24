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