import * as types from './mutations-types'
import axios from 'axios'
console.log(types);
export const increment = ({ commit }) => commit(types.INCREMENT)
export const decrement = ({ commit }) => commit(types.DECREMENT)

export const incrementIfOdd = ({ commit, state }) => {
  if ((state.count + 1) % 2 === 0) {
    commit(types.INCREMENT)
  }
}

export const incrementAsync = ({ commit }) => {
  setTimeout(() => {
    commit(types.INCREMENT)
  }, 5000)
}

export const getEstudiante = ({commit}) => {
  axios.get('/api/session/usuario_conectado').then(res => {
    commit(types.CARGAR_ESTUDIANTE, res.data.datos)
  })
}

export const obtenerDatosEstudiante = ({commit}) => {
  axios.get('/api/session/usuario_conectado').then(res => {
    commit(types.CARGAR_ESTUDIANTE, res.data.datos)
  })
}
