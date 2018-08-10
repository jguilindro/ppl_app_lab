import { ObtenerLeccionPorId } from '@/api'
import _ from 'lodash'
import moment from 'moment'
const leccionModule = {
  namespaced: true,
  state: {
    lecciones: []
  },
  actions: {
    obtener ({commit, state}, leccionId) {
      return new Promise((resolve, reject) => {
        ObtenerLeccionPorId(leccionId).then(response => {
          let leccion = response.leccion
          resolve(leccion)
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  mutations: {
    SET_LECCIONES (state, payload) {
      let leccionesFiltrado = payload.map((leccion) => {
        return {
          calificacion: leccion.calificacion,
          fechaInicioTomada: leccion.leccion.fechaInicioTomada,
          nombre: leccion.leccion.nombre,
          tipo: leccion.leccion.tipo,
          id: leccion.leccion._id
        }
      })
      let leccionesOrdenadasPorFechas = _.sortBy(leccionesFiltrado, function (o) {
        return moment(o.fechaTerminada).format('YYYYMMDD')
      }).reverse()
      state.lecciones = leccionesOrdenadasPorFechas
    }
  },
  getters: {
    dadas (state) {
      return state.lecciones
    }
  }
}

export default leccionModule
