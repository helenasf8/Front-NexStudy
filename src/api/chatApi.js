import api from './config'

export default {

  enviarMensagem(mensagens) {

    return api.post(
      '/chat/',
      { mensagens },
      { timeout: 310000 }
    )

  }

}