import Vue from 'vue'

// import estimacion from './dump/data/leccion.estimacion.json'
// import estimacionTexto from './dump/data/leccion.estimacion.texto.json'
// import tutorial from './dump/data/leccion.tutorial.json'
import usuario from './dump/data/usuarioDatos.json'

export default {
  usuarioDatos ({commit}) {
    if (process.env.NODE_ENV === 'production') {
      return new Promise((resolve, reject) => {
        Vue.http.get('/api/estudiantes/leccion/datos_leccion')
          .then((paralelos) => {
            if (paralelos.body.estado) {
              // console.log('llamado usuario datos')
              console.log(JSON.stringify(paralelos))
              commit('setLecciones', paralelos.body.datos.estudiante.lecciones)
              commit('setDatosEstudiante', paralelos.body.datos)
              commit('setLeccionRealtimeEstadoEstudiante', paralelos.body.datos.estudiante)
              commit('setDatosMuchos', paralelos.body.datos)
              commit('setRealtimeLeccion', paralelos.body.datos)
              commit('SOCKET_USUARIO')
              return resolve()
            }
          }).catch((err) => {
            commit('setError', err)
            return reject(err)
          })
      })
    } else {
      return new Promise((resolve, reject) => {
        let paralelos = usuario
        commit('setLecciones', paralelos.body.datos.estudiante.lecciones)
        commit('setDatosEstudiante', paralelos.body.datos)
        commit('setLeccionRealtimeEstadoEstudiante', paralelos.body.datos.estudiante)
        commit('setDatosMuchos', paralelos.body.datos)
        commit('setRealtimeLeccion', paralelos.body.datos)
        return resolve()
      })
    }
  },
  verificarCodigo ({commit, dispatch}, codigo) {
    commit('setError', null)
    dispatch('usuarioDatos')
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
        } else {
          commit('setError', response.body)
        }
      })
      .catch((err) => {
        commit('setError', err)
      })
  },
  limpiarLeccion ({commit}) {
    commit('setLeccionLimpiar')
  },
  subiendoImagen ({commit}, preguntaId) {
    commit('setSubiendoImagen', preguntaId)
  },
  terminoSubirImagen ({commit}, preguntaId) {
    commit('setTerminoSubirImagen', preguntaId)
  },
  responder ({commit, state}, datos) {
    let respuesta = {
      estudiante: state.estudiante.id,
      leccion: state.leccionDando.leccionId,
      paralelo: state.estudiante.paraleloId,
      grupo: state.estudiante.grupoId,
      pregunta: datos.preguntaId,
      imagenes: datos.imagen,
      respuesta: datos.respuesta,
      contestado: true,
      arraySubrespuestas: `[]`
    }
    return new Promise((resolve, reject) => {
      Vue.http.post(`/api/respuestas/`, respuesta)
        .then((response) => {
          if (response.body.estado) {
            commit('setRespuestaLocal', { preguntaId: datos.preguntaId, imagen: datos.imagen, respuesta: datos.respuesta, local: datos.local })
            resolve(true)
          } else {
            commit('setError', response.body)
            reject(new Error(false))
          }
        })
        .catch((err) => {
          commit('setError', err)
          reject(err)
        })
    })
  },
  getImagen ({commit, state}, url) {
    Vue.http.get(url)
      .then((response) => {
        console.log(response)
      })
      .catch((err) => {
        commit('setError', err)
      })
  }
}
