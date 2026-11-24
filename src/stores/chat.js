import { defineStore } from 'pinia'
import { ref } from 'vue'
import chatApi from '@/api/chatApi'

export const useChatStore = defineStore('chat', () => {

  const mensagens = ref([])
  const loading = ref(false)
  const error = ref('')

  async function enviarMensagem(texto) {

    if (!texto.trim() || loading.value) return

    error.value = ''

    mensagens.value.push({
      role: 'user',
      content: texto.trim()
    })

    loading.value = true

    try {

      const { data } = await chatApi.enviarMensagem(
        mensagens.value
      )

      mensagens.value.push({
        role: 'assistant',
        content: data.resposta
      })

    } catch (err) {

      error.value =
        err.response?.data?.detail ||
        'Não foi possível conectar com a IA.'

      console.error('Erro no chat:', err)

    } finally {

      loading.value = false

    }

  }

  function limparChat() {

    if (loading.value) return

    mensagens.value = []
    error.value = ''

  }

  return {
    mensagens,
    loading,
    error,
    enviarMensagem,
    limparChat
  }

})