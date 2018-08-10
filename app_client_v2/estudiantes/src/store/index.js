// NOTA IMPORTANTE
// en los mutations de cada modulo se limpiran los datos cuando se cambie de api
// se debe documentar lo que se ENVIARA al back
// y lo que recibira el FRONT
// siendo lo mas declarativo posible para hacer los mas facil posible el cambio de api

import Vue from 'vue'
import Vuex from 'vuex'

import { ObtenerDatosIniciales } from '@/api'
import getters from './getters'
import LeccionesModule from './modules/lecciones'
import EstudianteModule from './modules/estudiante'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    lecciones: LeccionesModule,
    estudiante: EstudianteModule
  },
  state: {
    online: true,
    io: {}
  },

  mutations: {
    SET_SOCKET (state, socket) {
      state.io = socket
    },
    SOCKET_DISCONNECT (state) {
      state.io = null
      state.online = false
    },
    SOCKET_CONNECT (state, socket) {
      state.online = true
    }
  },
  actions: {
    Inicializar ({commit}) {
      return new Promise((resolve, reject) => {
        ObtenerDatosIniciales().then((resp) => {
          let lecciones = resp.estudiante.lecciones
          let estudiante = resp.estudiante
          commit('estudiante/SET_ESTUDIANTE', estudiante)
          commit('lecciones/SET_LECCIONES', lecciones)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  getters
})
