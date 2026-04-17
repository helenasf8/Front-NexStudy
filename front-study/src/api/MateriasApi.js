import apiClient from './config.js'

const MateriaApi = {
  getAll() {
    return apiClient.get('/api/materia/')
  }
}

export default MateriaApi
