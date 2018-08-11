// NOTA IMPORTANTE
// en los mutations de cada modulo se limpiran los datos cuando se cambie de api
// se debe documentar lo que se ENVIARA al back
// y lo que recibira el FRONT
// siendo lo mas declarativo posible para hacer los mas facil posible el cambio de api

import Vue from 'vue'
import Vuex from 'vuex'

import { ObtenerDatosIniciales, ObtenerEstadosRealtime } from '@/api'
import getters from './getters'
import LeccionesModule from './modules/lecciones'
import EstudianteModule from './modules/estudiante'
import RealtimeModule from './modules/realtime'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    lecciones: LeccionesModule,
    estudiante: EstudianteModule,
    realtime: RealtimeModule
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
    Inicializar ({commit, dispatch}) {
      return new Promise((resolve, reject) => {
        ObtenerDatosIniciales().then((resp) => {
          let estudianteId = resp.estudiante._id
          let lecciones = resp.estudiante.lecciones
          let leccionRealtime = resp.leccion
          let estudiante = resp.estudiante
          commit('estudiante/SET_ESTUDIANTE', estudiante)
          commit('lecciones/SET_LECCIONES', lecciones)
          commit('realtime/SET_ESTADO_ESTUDIANTE', estudiante)
          commit('realtime/SET_LECCION', leccionRealtime)
          return estudianteId
        }).then((estudianteId) => {
          dispatch('ObtenerDatosRealtime', estudianteId)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    ObtenerDatosRealtime ({commit, state}, estudianteId) {
      return new Promise((resolve, reject) => {
        ObtenerEstadosRealtime(estudianteId).then(response => {
          commit('realtime/SET_LECCION_ESTADO', response)
          commit('realtime/SET_ESTADO')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  getters
})
