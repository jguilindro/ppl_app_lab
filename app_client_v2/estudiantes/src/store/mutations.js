import _ from 'lodash'
import moment from 'moment'

export default {
  SOCKET_TIEMPO_RESTANTE (state, socket) {
    if (typeof socket !== 'string') {
      state.tiempoLeccionRealtime = socket[0]
    } else {
      state.tiempoLeccionRealtime = socket
    }
  },
  SOCKET_EMPEZAR_LECCION (state, data) {
    state.leccionRealtime.timeout = data
    state.leccionRealtime.debeSerRedirigidoPorRealtime = true
    if (state.leccionRealtime.estado === 'tiene-que-esperar-a-que-empiece-la-leccion') {
      state.leccionRealtime.estado = 'redirigirlo-directamente'
    }
  },
  // SOCKET_PROFESOR_ENTRO_A_PARALELO (state, data) {
  //   delete state.usuarioDatos.lecciones
  //   let enviar = JSON.parse(JSON.stringify(state.usuarioDatos))
  //   enviar['parte'] = 'ingresarCodigo'
  //   enviar['leccionRealtimeId'] = JSON.parse(JSON.stringify(state.muchos.paralelo.leccion))
  //   enviar['paraleloId'] = JSON.parse(JSON.stringify(state.muchos.paralelo._id))
  //   state.io.emit('usuario estudiante', enviar)
  // },
  SOCKET_USUARIO (state) {
    delete state.usuarioDatos.lecciones
    let enviar = JSON.parse(JSON.stringify(state.usuarioDatos))
    enviar['parte'] = 'ingresarCodigo'
    enviar['leccionRealtimeId'] = JSON.parse(JSON.stringify(state.muchos.paralelo.leccion))
    enviar['paraleloId'] = JSON.parse(JSON.stringify(state.muchos.paralelo._id))
    if (state.io.emit) {
      state.io.emit('usuario estudiante', enviar)
    }
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
    state.estudiante.nombres = datos.estudiante.nombres
    state.estudiante.apellidos = datos.estudiante.apellidos
    state.estudiante.correo = datos.estudiante.correo
    state.estudiante.id = datos.estudiante._id
    state.usuarioDatos = datos.estudiante
    state.estudiante.grupoId = datos.grupo._id
    state.estudiante.paraleloId = datos.paralelo._id
    // console.log(grupo)
  },
  setDatosMuchos (state, datos) {
    state.muchos = datos
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
  setLeccion (state, leccion) {
    state.leccion = {...state.leccion, ...leccion}
  },
  setLeccionLimpiar (state) {
    state.leccion = {}
  },
  setRealtimeLeccion (state, datos) {
    try {
      // state.leccionDando.grupoId = datos.grupo._id
      state.leccionDando.leccionId = datos.leccion._id
      state.leccionDando.nombre = datos.leccion.nombre
      state.leccionDando.estado = datos.leccion.estado
      let preguntasOrdenadas = _.sortBy(datos.preguntas, (o) => {
        return o.ordenP
      })
      let respuestas = datos.respuestas
      let preguntasLimpiada = []
      for (let pregunta of preguntasOrdenadas) {
        if (!pregunta['esSeccion']) {
          let respuestaDePregunta = respuestas.find((resp) => {
            return resp.pregunta === pregunta['_id']
          })
          if (respuestaDePregunta) {
            respuestaDePregunta = {
              contestado: respuestaDePregunta['contestado'],
              imagen: respuestaDePregunta['imagenes'],
              fechaContestado: respuestaDePregunta['createdAt'],
              respuesta: respuestaDePregunta['respuesta']
            }
          }
          preguntasLimpiada.push({
            id: pregunta['_id'],
            descripcion: pregunta['descripcion'],
            nombre: pregunta['nombre'],
            puntaje: pregunta['puntaje'],
            subiendo: false,
            respuesta: respuestaDePregunta,
            // eslint-disable-next-line
            respondido: respuestaDePregunta ? true : false,
            tiempoEstimado: pregunta['tiempoEstimado']
          })
        }
      }
      state.leccionDando.preguntas = preguntasLimpiada
    } catch (err) {
      state.error = err
    }
  },
  setRespuestaLocal (state, { preguntaId, imagen, respuesta, local }) {
    let resp = { preguntaId, imagen, respuesta, local }
    let index = state.leccionDando.preguntas.findIndex((obj) => obj.id === preguntaId)
    state.leccionDando.preguntas[index].respuesta = resp
  }
}
