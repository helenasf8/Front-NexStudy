import apiClient from './config.js'

const MateriaApi = {
  getAll() {
    return apiClient.get('/materia/')
  }
}

export default MateriaApi
