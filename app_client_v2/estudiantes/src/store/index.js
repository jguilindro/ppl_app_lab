import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import moment from 'moment'
import _ from 'lodash'

// import router from '../router'

Vue.use(Vuex)
Vue.use(VueResource)
export const store = new Vuex.Store({
  state: {
    error: null,
    // datos estudiante
    lecciones: {},
    estudiante: {
      correo: '',
      nombres: '',
      apellidos: ''
    },
    online: true,
    tmp: null,
    usuarioDatos: {}, // usado para una parte del realtime que se hace un emit, pero en realidad no tiene ninguna utilidad importante en el front
    // REALTIME
    io: {},
    connect: false,
    leccionRealtime: {
      estado: '',
      leccionYaComenzo: false,
      paraleloDandoLeccion: false,
      yaIngresoCodigo: false,
      timeout: -1,
      estudiateFueAnadidoAParalelo: false,
      debeSerRedirigidoPorRealtime: false,
      fueRedirigido: false
    },
    leccion: {
    }
  },
  mutations: {
    setSocket (state, socket) {
      state.io = socket
    },
    SOCKET_DISCONNECT (state) {
      state.io = null
      state.connect = false
    },
    SOCKET_CONNECT (state, socket) {
      state.connect = true
    },
    SOCKET_EMPEZAR_LECCION (state, data) {
      state.leccionRealtime.timeout = data
      state.leccionRealtime.debeSerRedirigidoPorRealtime = true
      if (state.leccionRealtime.estado === 'tiene-que-esperar-a-que-empiece-la-leccion') {
        state.leccionRealtime.estado = 'redirigirlo-directamente'
      }
    },
    SOCKET_USUARIO (state) {
      delete state.usuarioDatos.lecciones
      state.io.emit('usuario', JSON.parse(JSON.stringify(state.usuarioDatos)))
    },
    SOCKET_ESTUDIANTE_ANADIDO_PARALELO (state) {
      state.leccionRealtime.estudiateFueAnadidoAParalelo = true
    },
    setError (state, payload) {
      state.error = payload
    },
    setLecciones (state, lecciones) {
      state.lecciones = { }
      let leccionesFiltrado = lecciones.map((leccionDatos) => {
        return {
          calificacion: leccionDatos.calificacion,
          fechaInicioTomada: leccionDatos.leccion.fechaInicioTomada,
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
    setDatosEstudiante (state, datos) {
      state.estudiante.nombres = datos.nombres
      state.estudiante.apellidos = datos.apellidos
      state.estudiante.correo = datos.correo
      state.estudiante.id = datos._id
      state.usuarioDatos = datos
    },
    setLeccionRealtimeEstadoEstudiante (state, datos) {
      state.leccionRealtime.yaIngresoCodigo = datos.codigoIngresado
    },
    setCodigoDatos (state, datos) {
      state.codigoRespuesta = datos
      state.leccionRealtime.yaIngresoCodigo = datos.codigoLeccion
      state.leccionRealtime.leccionYaComenzo = datos.leccionYaComenzo
      state.leccionRealtime.paraleloDandoLeccion = datos.paraleloDandoLeccion
    },
    setLeccionYaComenzo (state, leccionYaComenzo) {
      state.leccionRealtime.leccionYaComenzo = leccionYaComenzo
    },
    setParaleloDandoLeccion (state, paraleloDandoLeccion) {
      state.leccionRealtime.paraleloDandoLeccion = paraleloDandoLeccion
    },
    accionesLeccion (state) {
      // yaIngresoCodigo  paraleloDandoLeccion leccionYaEmpezo
      // 0 0 0 = el paralelo no esta dando leccion
      // 0 1 0 = tiene que ingresar el codigo
      // 1 1 0 = tiene que esperar a que empiece la leccion
      // 0 1 1 = al ingresar el codigo redirigirlo directamente
      // 1 1 1 = redirigirlo directamente
      let { paraleloDandoLeccion, yaIngresoCodigo, leccionYaComenzo } = state.leccionRealtime
      if (!paraleloDandoLeccion) {
        state.leccionRealtime.estado = 'paralelo-no-esta-dando-leccion'
      } else if (paraleloDandoLeccion && leccionYaComenzo && yaIngresoCodigo) {
        state.leccionRealtime.estado = 'redirigirlo-directamente'
      } else if (yaIngresoCodigo && paraleloDandoLeccion) {
        state.leccionRealtime.estado = 'tiene-que-esperar-a-que-empiece-la-leccion'
      } else if (paraleloDandoLeccion && leccionYaComenzo) {
        state.leccionRealtime.estado = 'al-ingresar-el-codigo-redirigirlo-directamente'
      } else if (paraleloDandoLeccion) {
        state.leccionRealtime.estado = 'tiene-que-ingresar-el-codigo'
      }
    },
    setCodigoMalIngresado (state, valor) {
      state.codigoMalIngresado = valor
    },
    setTmp (state, datos) { // commit('setTmp', response.body.datos)
      state.tmp = datos
    },
    setRedirigir (state) {
      state.leccionRealtime.fueRedirigido = true
    },
    setOnline (state, valor) {
      state.online = valor
    },
    setLeccion (state, leccion) {
      state.leccion = {...state.leccion, ...leccion}
    }
  },
  actions: {
    async usuarioDatos ({commit}) {
      commit('setError', null)
      return new Promise((resolve, reject) => {
        Vue.http.get('/api/session/usuario_conectado')
          .then((response) => {
            if (response.body.estado) {
              commit('setLecciones', response.body.datos.lecciones)
              commit('setDatosEstudiante', response.body.datos)
              commit('setLeccionRealtimeEstadoEstudiante', response.body.datos)
              return resolve()
            } else {
              commit('setError', response.body)
            }
          })
          .catch((err) => {
            commit('setError', err)
            return reject(err)
          })
      })
    },
    verificarCodigo ({commit}, codigo) {
      commit('setError', null)
      return new Promise((resolve, reject) => {
        Vue.http.get(`/api/estudiantes/tomar_leccion/${codigo}`)
          .then((response) => {
            if (response.body.estado) {
              commit('setCodigoDatos', response.body.datos)
              commit('accionesLeccion')
              resolve()
            } else {
              commit('setError', response.body)
            }
          })
          .catch((err) => {
            commit('setError', err)
            reject(err)
          })
      })
    },
    async obtenerParaleloUsuario ({commit, state, dispatch}) {
      commit('setError', null)
      await dispatch('usuarioDatos')
      Vue.http.get(`/api/paralelos/estudiante/${state.estudiante.id}`)
        .then((response) => {
          if (response.body.estado) {
            commit('setLeccionYaComenzo', response.body.datos.leccionYaComenzo)
            commit('setParaleloDandoLeccion', response.body.datos.dandoLeccion)
            commit('accionesLeccion')
          } else {
            commit('setError', response.body)
          }
        })
        .catch((err) => {
          commit('setError', err)
        })
    },
    obtenerParaleloDatos ({commit, state}) {
      commit('setError', null)
      Vue.http.get(`/api/paralelos/estudiante/${state.estudiante.id}`)
        .then((response) => {
          if (response.body.estado) {
            commit('setLeccionYaComenzo', response.body.datos.leccionYaComenzo)
            commit('setParaleloDandoLeccion', response.body.datos.dandoLeccion)
            commit('accionesLeccion')
          } else {
            commit('setError', response.body)
          }
        })
        .catch((err) => {
          commit('setError', err)
        })
    },
    malIngresado ({commit}) {
      commit('setCodigoMalIngresado', true)
    },
    async setSocket ({commit}, socket) {
      commit('setSocket', socket)
    },
    async setSocketUsuario ({dispatch, commit}, socket) {
      await dispatch('setSocket', socket)
      commit('SOCKET_USUARIO')
    },
    redirigirlo ({commit}) {
      commit('setRedirigir')
    },
    async online ({commit, dispatch}, estado) {
      commit('setOnline', estado)
    },
    leccionDatos ({commit, state}, leccionId) {
      Vue.http.get(`/api/lecciones/detalle/${leccionId}`)
        .then((response) => {
          if (response.body.estado) {
            commit('setLeccion', response.body.datos.leccion)
            commit('setTmp', response.body.datos)
          } else {
            commit('setError', response.body)
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
      return state.estudiante.nombres
    },
    correo (state) {
      return state.estudiante['correo']
    },
    iniciales (state) {
      return `${state.estudiante['nombres'].charAt(0)}${state.estudiante['apellidos'].charAt(0)}`
    },
    yaIngresoCodigoEstudiante (state) {
      return state.leccionRealtime.yaIngresoCodigo
    },
    estadoRealtime (state) {
      return state.leccionRealtime.estado
    },
    online (state) {
      return state.online
    },
    leccion (state) {
      return state.leccion
    }
  }
})
