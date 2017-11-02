import axios from 'axios'
import * as types from './mutations-types'

export const increment = ({ commit }) => commit(types.INCREMENT)
export const decrement = ({ commit }) => commit(types.DECREMENT)

export const incrementIfOdd = ({ commit, state }) => {
  if ((state.count + 1) % 2 === 0) {
    commit(types.INCREMENT)
  }
}

export const obtenerPerfilDatos = ({ commit }) => {
  axios.get('/api/estudiantes/perfil_datos').then((res) => {
    commit(types.PERFIL_API_PETICION, res.data)
  })
}

export const obtenerDatosEstudiante = ({ commit }) => {
  axios.get('/api/session/usuario_conectado').then((res) => {
    commit(types.PERFIL_API_PETICION, res.data.datos)
  })
}
