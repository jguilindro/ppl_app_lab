import _ from 'lodash'
import moment from 'moment'

export default {
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
    state.io.emit('usuario estudiante', enviar)
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
  setOnline (state, valor) {
    state.online = valor
  },
  setLeccion (state, leccion) {
    state.leccion = {...state.leccion, ...leccion}
  },
  setLeccionLimpiar (state) {
    state.leccion = {}
  }
}
