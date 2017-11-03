import axios from 'axios'
import * as types from './mutations-types'

export const LOGGEARSE = ({ commit }) => {
  commit(types.LOGGEARSE)
}

export const PERFIL_API_PETICION = ({ commit }) => {
  axios.get('/api/estudiantes/perfil').then((res) => {
    commit(types.PERFIL_API_PETICION, res.data.datos)
  })
}

