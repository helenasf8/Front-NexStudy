import apiClient from './config'

export const GoalsApi = {

  async getAll() {

    const { data } = await apiClient.get(
      '/metas/diarias/'
    )

    return data
  },

  async generate() {

    const { data } = await apiClient.post(
      '/metas/diarias/'
    )

    return data
  },

  async answer(questaoId, alternativaId) {

    const { data } = await apiClient.post(
      `/metas/diarias/${questaoId}/responder/`,
      {
        alternativa: alternativaId
      }
    )

    return data
  }

}