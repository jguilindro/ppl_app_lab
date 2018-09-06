import router from '../../router'

const state = {
  io: null,
  estado: 'desconectado'
}

const getters = {
  estado (state) {
    return state.estado
  }
}

const actions = {
  // SOCKETS RECIBIDOS
  socket_connect ({ commit }) {
    commit('setEstado', 'conectado')
  },
  socket_disconnect ({commit}) {
    commit('setEstado', 'desconectado')
  },
  socket_tiempoRestante ({ commit }, payload) {
    commit('leccionRealTime/setTiempo', payload, { root: true })
  },
  socket_estudianteConectado ({ commit }, payload) {
    commit('leccionRealTime/addEstudiante', payload, { root: true })
  },
  socket_leccionDatos ({ commit }, payload) {
    payload.estudiantesDandoLeccion.forEach((estudiante) => {
      commit('leccionRealTime/addEstudiante', estudiante, { root: true })
    })
  },
  socket_terminadoLeccion ({ commit }, payload) {
    if (payload) {
      commit('leccionRealTime/setEstadoLeccion', 'terminada', { root: true })
    } else {
      commit('leccionRealTime/setError', 'Error al terminar la leccion', { root: true })
    }
  },
  // SOCKETS A ENVIAR
  conectarLeccion ({ state }, payload) {
    let datos = {
      leccion: { tiempoEstimado: payload.leccion['tiempoEstimado'], fechaInicioTomada: payload.leccion['fechaInicioTomada'] },
      leccionId: payload.leccion._id,
      paralelo: payload.paralelo,
      paraleloId: payload.paralelo._id
    }
    state.io.emit('usuario profesor', datos)
  },
  comenzarLeccion ({ state }) {
    state.io.emit('comenzar leccion', true)
  },
  continuarLeccion ({ state }, payload) {
    state.io.emit('continuar leccion', payload)
  },
  pausarLeccion ({ state, commit }, payload) {
    state.io.emit('pausar leccion', {leccion: payload.leccion, paralelo: payload.paralelo})
  },
  aumentarTiempo ({ state }) {
    state.io.emit('aumentar tiempo', true)
  },
  terminarLeccion ({ state }) {
    state.io.emit('parar leccion', 'la leccion ha sido detenida')
  },
  disconnectSocket ({ state }) {
    state.io.emit('disconnect')
    router.push('/login')
  }
}
const mutations = {
  setSocket (state, socket) {
    state.io = socket
  },
  setEstado (state, payload) {
    state.estado = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
