// import * as types from './mutations-types'

export const LOGGEARSE = (state) => {
  state.loggeado = true
}


export const PERFIL_API_PETICION = (state, data) => {
  state.estudiante = data.estudiante
  state.lecciones = data.lecciones
}

// export default {
//   [types.PERFIL_API_PETICION](state) {
//     Vue.set(state, 'loggeado', true)
//   },
// }
