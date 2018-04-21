const co = require('co')
const Estudiante = require('../app_api/models/estudiante.model')
const Profesor = require('../app_api/models/profesor.model')
const Paralelo = require('../app_api/models/paralelo.model')
const Grupo = require('../app_api/models/grupo.model')

module.exports = {
  crearEstudiante({ nombres, apellidos, correo, matricula, paralelo,  codigoMateria }) { // null si no se creo o lo que sea?
    return new Promise(function(resolve, reject) {
      let estudiante = new Estudiante({
        nombres,
        apellidos,
        correo,
        matricula
      })
      estudiante.Crear()
      .then((estudiante) => {
        let estudianteId = estudiante['_id']
        Paralelo.AnadirEstudiante({ materiaParalelo: paralelo, materiaCodigo: codigoMateria, estudianteId }).then((resp) => {
          if (resp) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
      .catch((err) => {
        console.error(err)
        reject(false)
      })
    })
  },
  crearProfesor({ nombres, apellidos, correo, tipo, paralelo, codigoMateria }) {
    return new Promise(function(resolve, reject) {
      co(function* () {
        let profesor = new Profesor({
          nombres,
          apellidos,
          correo,
          tipo
       })
       if (tipo === 'titular') {
          let existe = yield Profesor.ObtenerPorCorreo({ correo })
          let profesorId = ''
          if (existe) {
            profesorId = existe['_id']
          } else { 
            let profesorCreado = yield profesor.Crear()
            profesorId = profesorCreado['_id']
          }
          let fueAnadido = yield Paralelo.AnadirProfesorTitular({ materiaParalelo: paralelo, materiaCodigo: codigoMateria, profesorId })
          if (fueAnadido) {
            resolve(true)
          } else {
            resolve(false)
          }
        } else {
          profesor.Crear()
          resolve(true)
        }
      }).catch((err) => {
        console.error(err)
        reject(false)
      })
    })
  },
  crearParalelo({ codigoMateria, nombreMateria, paralelo, termino, anio }) {
    return new Promise(function(resolve, reject) {
      let paraleloCreado = new Paralelo({
        nombre: paralelo,
        nombreMateria,
        codigo: codigoMateria,
        termino,
        anio
      })
      paraleloCreado.Crear()
      .then(() => {
        resolve(true)
      })
      .catch((err) => {
        console.error(err)
        reject(false)
      })
    })
  },
  eliminarEstudiante({ paralelo, codigoMateria, correo, matricula }) {
    return new Promise(function(resolve, reject) {
      co(function* () {
        let estudiante = yield Estudiante.ObtenerPorCorreo({ correo })
        let estudianteId = estudiante['_id']
        Estudiante.Eliminar({ id: estudianteId })
        Grupo.EliminarEstudiante({ estudianteId })
        Paralelo.EliminarEstudiante({ materiaParalelo: paralelo, materiaCodigo: codigoMateria, estudianteId })
        resolve(true)
      }).catch((err) => {
        console.error(err)
        reject(false)
      })
    })
  },
  cambiarEstudianteParalelo({ nuevo, correo, matricula }) {
    return new Promise(function(resolve, reject) {
      co(function* () {
        let estudiante = yield Estudiante.ObtenerPorCorreo({ correo })
        let estudianteId = estudiante['_id']
        let paralelo = yield Paralelo.ObtenerParaleloEstudiante({ estudianteId })
        let materiaParalelo = paralelo['nombre']
        let materiaCodigo = paralelo['codigo']
        Grupo.EliminarEstudiante({ estudianteId })
        Paralelo.EliminarEstudiante({ materiaParalelo, materiaCodigo, estudianteId })
        Paralelo.AnadirEstudiante({ materiaParalelo: nuevo, materiaCodigo, estudianteId })
        resolve(true)
      }).catch((err) => {
        console.error(err)
        reject(false)
      })
    })
  },
  cambiarCorreoEstudiante({ nuevo, correo, matricula }) {
    return new Promise(function(resolve, reject) {
      Estudiante.CambiarCorreo({ correo, correoNuevo: nuevo })
      .then((estado) => {
        if (estado) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  },
  cambiarNombresEstudiante({ nuevo, correo, matricula }) {
    return new Promise(function(resolve, reject) {
      Estudiante.CambiarNombres({ correo, nombresNuevos: nuevo })
      .then((estado) => {
        if (estado) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  },
  cambiarApellidosEstudiante({ nuevo, correo, matricula }) {
    return new Promise(function(resolve, reject) {
      Estudiante.CambiarApellidos({ correo, apellidosNuevos: nuevo })
      .then((estado) => {
        if (estado) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  },
  estaLleno() {
    return new Promise(function(resolve, reject) {
      Paralelo.ObtenerTodos().then((paralelos) => {
        if (paralelos.length == 0) {
          resolve(false)
        } else {
          resolve(true)
        }
      })
    })
  },
  obtenerTodosEstudiantes() {
    return new Promise(function(resolve, reject) {
      co(function* () {
        let estudiantesDatos = []
        let paralelos = yield Paralelo.ObtenerTodosPopulateEstudiantes()
        for (paralelo of paralelos) {
          for (estudiante of paralelo.estudiantes) { 
            estudiantesDatos.push({
              nombres: estudiante['nombres'],
              apellidos: estudiante['apellidos'],
              matricula: estudiante['matricula'],
              correo: estudiante['correo'],
              paralelo: paralelo['nombre'],
              codigoMateria: paralelo['codigo']
            })
          } 
        }
        resolve(estudiantesDatos)
      })
    })
  }
}