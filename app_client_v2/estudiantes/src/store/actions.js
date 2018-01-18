import axios from 'axios'
import * as types from './mutations-types'

export const LOGGEARSE = ({ commit }) => {
  commit(types.LOGGEARSE)
}

export const PERFIL_API_PETICION = ({ commit }) => {
  // const est = { estudiante: { nombres: 'Joel Eduardo', apellidos: '
  // Rodriguez Llamuca', correo: 'joelerll@mgail.com' }, lecciones: [] }
  axios.get('/api/v2/estudiantes/perfil').then((res) => {
    console.log(res.data)
    commit(types.PERFIL_API_PETICION, res.data.datos)
  })
  // commit(types.PERFIL_API_PETICION, est)
}

