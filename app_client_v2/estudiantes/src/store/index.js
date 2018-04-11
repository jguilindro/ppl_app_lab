import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import moment from 'moment'
import _ from 'lodash'

Vue.use(Vuex)
Vue.use(VueResource)

export const store = new Vuex.Store({
  state: {
    lecciones: {},
    nombres: null,
    apellidos: null,
    correo: null,
    error: null
  },
  mutations: {
    setError (state, payload) {
      state.error = payload
    },
    setLecciones (state, lecciones) {
      let leccionesFiltrado = lecciones.map((leccionDatos) => {
        return {
          calificacion: leccionDatos.calificacion,
          fechaTerminada: leccionDatos.leccion.fechaTerminada,
          nombre: leccionDatos.leccion.nombre,
          tipo: leccionDatos.leccion.tipo,
          id: leccionDatos.leccion._id
        }
      })
      let leccionesOrdenadasPorFechas = _.sortBy(leccionesFiltrado, function (o) {
        return moment(o.fechaTerminada).format('YYYYMMDD')
      }).reverse()
      state.lecciones = leccionesOrdenadasPorFechas
    },
    setDatos (state, datos) {
      state.nombres = datos.nombres
      state.apellidos = datos.apellidos
      state.correo = datos.correo
    }
  },
  actions: {
    usuarioDatos ({commit}) {
      commit('setError', null)
      Vue.http.get('/api/session/usuario_conectado')
        .then((response) => {
          if (response.body.estado) {
            commit('setLecciones', response.body.datos.lecciones)
            commit('setDatos', response.body.datos)
          } else {
            window.location = '/' // como hacer el redirect si no esta loggeado
          }
        })
        .catch((err) => {
          commit('setError', err)
        })
    }
  },
  getters: {
    lecciones (state) {
      return state.lecciones
    },
    nombres (state) {
      return state.nombres
    }
  }
})
