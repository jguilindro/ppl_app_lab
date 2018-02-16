// https://www.thecodeship.com/web-development/alternative-to-javascript-evil-setinterval/
// comenzar, pausar, continuar, aumentar, terminar

// TODO: captar errores de todo....
// TODO: no se puede continuar si no se pauso. No puede terminar una leccion si no se ha comenzado
// TODO: prubas con dos lecciones al mismo tiempo
// TODO: que pasa si al momento de colocar continuar solo se hace via POST y no via sockets?
// TODO: si coloca comenzar dos veces?

// REGLAS
// Una leccion tiene que comenzar para poder ser terminada
// Una leccion debe haber sido pausada para poder continuar
// Una leccion se puede terminar solo si no esta en pausa

function intervalExiste(intervals, leccionId) {
  return intervals.find(function(interval) {
    return interval.leccionId == leccionId
  })
}

var intervals = []
var timeouts = []
module.exports = ({ moment, tz, logger, co, db }) => {
  const proto = {
    obtenerIntervals() {
      return intervals
    },
    obtenerTimeouts() {
      return timeouts
    },
    estaCorriendoLeccionInterval(leccionId) {
      return intervals.some(leccion => leccionId == leccion.leccionId)
    },
    estaCorriendoLeccionTimeout(leccionId) {
      return timeouts.some(leccion => leccionId == leccion.leccionId)
    },
    // para aumentar el tiempo lo unico que se hace es reenviar el tiempo a todos los sockets
    // reiniciar intervals y timeouts para que se ajusten al tiempo
    // lo unico que recibe es el tiempoEstimado aumentado, que es el tiempo que aumento el moderados
    // tiempoEstimado - tiempoAumentado = tiempoOriginalEstimado
    // el clienter hace un POST donde se guardara la metadata de continuar
    // el cliente enviara via sockets los datos que se necesitan para continuar con la leccion
    run({ accion, socket, leccionId, paraleloId, fechaInicioTomada, tiempoEstimado, usuarioId }) {
      // reconectarProfesor
      // limpiarlos pos si acaso el moderador envia dos veces la misma peticion
      const existeInterval = intervals.some(leccion => leccionId == leccion.leccionId)
      const existeTimeout = timeouts.some(leccion => leccionId == leccion.leccionId)
      if (existeInterval)
        intervals = intervals.filter(inicial => { if (inicial.leccionId == leccionId) {clearInterval(inicial.interval)} return inicial.leccionId !=leccionId })
      if (existeTimeout) { // si comento esto, se crean 3?
        timeouts = timeouts.filter(inicial => { if (inicial.leccionId == leccionId) {clearTimeout(inicial.timeout)} return inicial.leccionId != leccionId })
      }
      if (accion === 'comenzar') {
        // socket.join(paraleloId)
        logger.info(`Leccion Comenzo usuarioId: ${usuarioId}, leccionId: ${leccionId}, paraleloId: ${paraleloId}, fechaInicioTomada: ${moment(fechaInicioTomada).format("DD-MM-YY_hh-mm-ss")}, tiempoEstimado: ${tiempoEstimado}`)
      } else if (accion === 'aumentarTiempo') {
        logger.info(`Leccion aumentado tiempo usuarioId: ${usuarioId}, leccionId: ${leccionId}, paraleloId: ${paraleloId}`)
      } else if (accion === 'continuar') {
        logger.info(`Leccion continua usuarioId: ${usuarioId}, leccionId: ${leccionId}, paraleloId: ${paraleloId}, fechaInicioTomada: ${moment(fechaInicioTomada).format("DD-MM-YY_hh-mm-ss")}, tiempoPausado+TiempoRestante: ${tiempoEstimado}`)
      }
      const CURRENT_TIME = moment(moment().tz('America/Guayaquil').format())
      const FECHA_INICIO = moment(fechaInicioTomada)
      const FECHA_FIN = FECHA_INICIO.add(tiempoEstimado, 's')
      intervalId = setInterval(() => {
        let fechaFinLeccion = FECHA_FIN.subtract(1, 's')
        let tiempoRestante = moment.duration(fechaFinLeccion.diff(CURRENT_TIME)).format('h:mm:ss')
        socket.in(paraleloId).emit('tiempo-restante-leccion', tiempoRestante)
        if (!CURRENT_TIME.isBefore(fechaFinLeccion)) {
          intervals = intervals.filter(inicial => {  if (inicial.leccionId == leccionId) {clearInterval(inicial.interval)} return inicial.leccionId !=leccionId })
          socket.in(paraleloId).emit('terminada-leccion', true)
          socket.in(paraleloId).emit('tiempo-restante-leccion', 0)
          logger.info(`Leccion Termino usuarioId: ${usuarioId}, leccionId: ${leccionId}, paraleloId: ${paraleloId}, fechaInicioTomada: ${moment(fechaInicioTomada).format("DD-MM-YY_hh-mm-ss")}, tiempoEstimado: ${tiempoEstimado}`)
        }
      }, 1000)
      intervalId.ref()

      const SEGUNDOS_FIN = parseInt(moment.duration(FECHA_FIN.clone().add(5, 's').diff(CURRENT_TIME), 'seconds').format('ss'), 10) // si no termina con setInterval, despues de 5 segundos terminara con setTimeout
      timeoutId = setTimeout(() => {
        if (intervalExiste(intervals, leccionId)) {
          intervals = intervals.filter(inicial => {  if (inicial.leccionId == leccionId) {clearInterval(inicial.interval)} return inicial.leccionId !=leccionId })
          socket.in(paraleloId).emit('terminada-leccion', true)
          logger.info(`Leccion Termino por setTimeout usuarioId: ${usuarioId}, leccionId: ${leccionId}, paraleloId: ${paraleloId}, fechaInicioTomada: ${moment(fechaInicioTomada).format("DD-MM-YY_hh-mm-ss")}, tiempoEstimado: ${tiempoEstimado}`)
        } else {
          logger.info(`Leccion fue terminada por setInterval usuarioId: ${usuarioId}, leccionId: ${leccionId}, paraleloId: ${paraleloId}, fechaInicioTomada: ${moment(fechaInicioTomada).format("DD-MM-YY_hh-mm-ss")}, tiempoEstimado: ${tiempoEstimado}`)
        }
        timeouts = timeouts.filter(inicial => {  if (inicial.leccionId == leccionId) {clearTimeout(inicial.timeouts)} return inicial.leccionId !=leccionId })
      }, SEGUNDOS_FIN)
      intervals.push({ leccionId, interval: intervalId, usuarioId })
      timeouts.push({ leccionId, timeout: timeoutId, usuarioId })
      if (accion === 'comenzar') {
        socket.in(paraleloId).emit('empezar-leccion', true) // este solo sirve cuando los estudiantes estan en "ingresar-codigo"
      }
    },
    // el cliente hace un POST donde se guardara metadata de la pausa
    // recibe la confirmacion y entonces ahi ingresa aqui con los datos que se piden
    pausar({ socket, leccionId, paraleloId, usuarioId }) {
      intervals = intervals.filter(inicial => { inicial.leccionId != leccionId ? inicial : clearInterval(inicial.interval) })
      timeouts = timeouts.filter(inicial => { inicial.leccionId != leccionId ? inicial : clearTimeout(inicial.timeout) })
      logger.info(`Leccion Pausada usuarioId: ${usuarioId}, leccionId: ${leccionId}, paraleloId: ${paraleloId}`)
      socket.in(paraleloId).emit('tiempo-restante-leccion', 'Lección pausada')
    },
    terminar({ socket, leccionId, paraleloId, usuarioId }) {
      intervals = intervals.filter(inicial => { inicial.leccionId != leccionId ? inicial : clearInterval(inicial.interval) })
      timeouts = timeouts.filter(inicial => { inicial.leccionId != leccionId ? inicial : clearTimeout(inicial.timeout) })
      socket.in(paraleloId).emit('terminada-leccion', true)
      logger.info(`Leccion Terminada usuarioId: ${usuarioId}, leccionId: ${leccionId}, paraleloId: ${paraleloId}`)
    },
    reconectarProfesor() {
      //
    },
    reconectarEstudiante() {
      //
    },
    cancelar() {
      //
    }
  }
  return Object.assign(Object.create(proto), {})
}