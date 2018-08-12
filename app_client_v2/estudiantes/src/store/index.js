// NOTA IMPORTANTE
// en los mutations de cada modulo se limpiran los datos cuando se cambie de api
// se debe documentar lo que se ENVIARA al back
// y lo que recibira el FRONT
// siendo lo mas declarativo posible para hacer los mas facil posible el cambio de api

import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'

import { ObtenerDatosIniciales, ObtenerEstadosRealtime } from '@/api'
import getters from './getters'
import LeccionesModule from './modules/lecciones'
import EstudianteModule from './modules/estudiante'
import RealtimeModule from './modules/realtime'
// import socketPlugin from './plugins/socket'
// import io from 'socket.io-client'
// let url = process.env.NODE_ENV === 'production' ? '/tomando_leccion' : 'http://localhost:8000/tomando_leccion'
// const socket = io(url, {
//   'reconnect': true,
//   'forceNew': true
// })
// const socketPlg = socketPlugin(socket)

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    lecciones: LeccionesModule,
    estudiante: EstudianteModule,
    realtime: RealtimeModule
  },
  // plugins: [socketPlg],
  state: {
    online: true,
    io: {}
  },
  mutations: {
    SET_SOCKET (state, socket) {
      state.io = socket
    },
    SOCKET_TIEMPO_RESTANTE (state, socket) {
      if (typeof socket !== 'string') {
        store.commit('realtime/SET_TIEMPO', socket[0])
      } else {
        store.commit('realtime/SET_TIEMPO', socket)
      }
    },
    SOCKET_DISCONNECT (state) {
      state.io = null
      state.online = false
    },
    SOCKET_CONNECT (state, socket) {
      let estudianteId = store.getters['estudiante/id']
      let leccionId = store.getters['realtime/leccion']['id']
      let paraleloId = store.getters['estudiante/paralelo']
      let io = store.getters['io']
      io.emit('usuario estudiante', { estudianteId, leccionId, paraleloId })
    },
    SOCKET_EMPEZAR_LECCION (state, data) {
      router.push('/leccionRealtime')
    },
    SOCKET_TERMINADO_LECCION (state, data) {
      if (process.env.NODE_ENV === 'development') {
        router.push('/lecciones')
      } else if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'testing') {
        router.push('/')
      }
    }
  },
  actions: {
    Inicializar ({commit, dispatch}) {
      return new Promise((resolve, reject) => {
        ObtenerDatosIniciales().then((resp) => {
          let estudianteId = resp.estudiante._id
          let lecciones = resp.estudiante.lecciones
          let leccionRealtime = resp.leccion
          if (leccionRealtime) {
            leccionRealtime['respuestas'] = resp.respuestas
          }
          let estudiante = resp.estudiante
          let grupo = resp.grupo
          let paralelo = resp.paralelo
          commit('estudiante/SET_ESTUDIANTE', estudiante)
          commit('estudiante/SET_GRUPO', grupo)
          commit('estudiante/SET_PARALELO', paralelo)
          commit('lecciones/SET_LECCIONES', lecciones)
          commit('realtime/SET_ESTADO_ESTUDIANTE', estudiante)
          commit('realtime/SET_LECCION', leccionRealtime)
          return estudianteId
        }).then((estudianteId) => {
          dispatch('ObtenerDatosRealtime', estudianteId).then(() => {
            resolve()
          })
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
