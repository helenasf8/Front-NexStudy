import { defineStore } from 'pinia'
import { GoalsApi } from '@/api/goals'

export const useGoalsStore = defineStore('goals', {

  state: () => ({

    questoes: [],
    total: 0,
    realizadas: 0,
    concluidas: false,
    loading: false,
    respondendo: false,
    error: '',
    feedback: null

  }),

  getters: {

    progresso: (state) => {

      if (!state.total) return 0

      return Math.round(
        (state.realizadas / state.total) * 100
      )

    }

  },

  actions: {

    atualizarDados(data) {

      this.questoes = data.questoes
      this.total = data.total
      this.realizadas = data.realizadas
      this.concluidas = data.concluidas

    },

    async fetchGoals() {

      if (this.loading) return

      this.loading = true
      this.error = ''
      this.feedback = null
      this.questoes = []
      this.total = 0
      this.realizadas = 0
      this.concluidas = false

      try {

        let data = await GoalsApi.getAll()

        if (data.total === 0) {

          data = await GoalsApi.generate()

        }

        this.atualizarDados(data)

      } catch (error) {

        console.error(error)

        this.error =
          error.response?.data?.detail ||
          'Não foi possível carregar as metas.'

      } finally {

        this.loading = false

      }

    },

    async responder(questaoId, alternativaId) {

      if (this.respondendo) return false

      this.respondendo = true
      this.error = ''

      try {

        const data = await GoalsApi.answer(
          questaoId,
          alternativaId
        )

        this.feedback = data

        this.questoes = this.questoes.filter(
          questao => questao.id !== questaoId
        )

        this.realizadas += 1

        this.concluidas = data.concluidas

        return true

      } catch (error) {

        console.error(error)

        this.error =
          error.response?.data?.detail ||
          'Não foi possível enviar a resposta.'

        return false

      } finally {

        this.respondendo = false

      }

    }

  }

})