// comenzar, pausar, continuar, aumentar, terminar

function intervalExiste(intervals, leccionId) {
  return intervals.find(function(interval) {
    return interval.leccionId == leccionId
  })
}

module.exports = ({ moment, tz, logger, db, socket }) => {
  let intervals = []
  let timeouts = []
  const proto = {
    obtenerIntervals() {
      return intervals
    },
    obtenerTimeouts() {
      return timeouts
    },
    limpiarIntervals() {
      intervals = []
    },
    ingresarIntervals(intervalsTmp) {
      intervals = intervalsTmp
    },
    comenzar({ leccionId, paraleloId, fechaInicioTomada, tiempoEstimado, usuarioId }) {
      const CURRENT_TIME = moment(moment().tz('America/Guayaquil').format())
      const FECHA_INICIO = moment(fechaInicioTomada)
      const FECHA_FIN = FECHA_INICIO.add(tiempoEstimado, 's')
      intervalId = setInterval(function() {
        let fechaFinLeccion = FECHA_FIN.subtract(1, 's')
        let tiempoRestante = moment.duration(fechaFinLeccion.diff(CURRENT_TIME)).format('h:mm:ss')
        socket.in(paraleloId).emit('tiempo-restante-leccion', tiempoRestante)
        if (!CURRENT_TIME.isBefore(fechaFinLeccion)) {
          intervals = intervals.filter(inicial => { inicial.leccionId != leccionId ? inicial : clearInterval(inicial.interval) }) // para hacer los test esto debe estar aqui y no en una funcion por alguna razon
          socket.in(paraleloId).emit('terminada-leccion', true)
          socket.in(paraleloId).emit('tiempo-restante-leccion', 0)
          logger.info(`Leccion Termino usuarioId: ${usuarioId}, fechaInicioTomada: ${moment(fechaInicioTomada).format("DD-MM-YY_hh-mm-ss")}, tiempoEstimado: ${tiempoEstimado}`)
          db.terminarLeccion(paraleloId) // TODO: si no termina la leccion mandar error
        }
      }, 1000)
      intervalId.ref()

      const MICROSEGUNDOS_FIN = parseInt(moment.duration(FECHA_FIN.clone().add(5, 's').diff(CURRENT_TIME), 'seconds').format('ss'), 10) // si no termina con setInterval, despues de 5 segundos terminara con setTimeout
      timeoutId = setTimeout(function() {
        if (intervalExiste(intervals, leccionId)) {
          intervals = intervals.filter(inicial => { inicial.leccionId != leccionId ? inicial : clearInterval(inicial.interval) })
          socket.in(paraleloId).emit('terminada-leccion', true)
          logger.info(`Leccion Termino por setTimeout usuarioId: ${usuarioId}, fechaInicioTomada: ${moment(fechaInicioTomada).format("DD-MM-YY_hh-mm-ss")}, tiempoEstimado: ${tiempoEstimado}`)
          db.terminarLeccion(paraleloId)
        } else {
          logger.info(`Leccion fue terminada por setInterval usuarioId: ${usuarioId}, fechaInicioTomada: ${moment(fechaInicioTomada).format("DD-MM-YY_hh-mm-ss")}, tiempoEstimado: ${tiempoEstimado}`)
        }
        timeouts = timeouts.filter(inicial => { inicial.leccionId != leccionId ? inicial : clearTimeout(inicial.interval) })
      }, MICROSEGUNDOS_FIN)
      timeouts.push({ leccionId, interval: intervalId, usuarioId })
      intervals.push({ leccionId, interval: intervalId, usuarioId })
      socket.in(paraleloId).emit('empezar-leccion', true) // para redireccionar a los estudiantes si estan en la pagina esperando a que comienze la leccion
      logger.info(`Leccion Comenzo usuarioId: ${usuarioId}, fechaInicioTomada: ${moment(fechaInicioTomada).format("DD-MM-YY_hh-mm-ss")}, tiempoEstimado: ${tiempoEstimado}`)
    },
    reconectarProfesor() {
      // volver a 
    },
    reconectarEstudiante() {
      //
    },
    pausar() {
      // 
    },
    continuar() {
      //
    },
    terminar() {
      //
    },
    aumentarTiempo() {
      //
    },
    cancelar() {
      //
    }
  }
  return Object.assign(Object.create(proto), {})
}