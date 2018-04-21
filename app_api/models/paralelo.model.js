let mongoose = {}
let db = {}
if (process.env.NODE_ENV === 'production' && process.env.SERVIDOR === 'heroku') {
  mongoose = require('mongoose')
  db = require('mongoose')
} else if (process.env.NODE_ENV) {
  db = require('../../databases/mongo/mongo').getDatabaseConnection()
  mongoose = require('mongoose')
}

mongoose.Promise = global.Promise

const ParaleloSchema = new mongoose.Schema({
  _id: {
    type: String,
    'default': require('shortid').generate
  },
  nombre: {
    type: String
  },
  nombreMateria: {
    type: String
  },
  codigo: {
    type: String
  },
  dandoLeccion: {
    type: Boolean,
		'default': false
  },
  leccionYaComenzo: {
    type: Boolean,
    'default': false
  },
  leccion: {
    type: String,
    ref: 'Leccion'
  },
  limiteEstudiantes: {
    type: Number
  },
  anio: {
    type: String
  },
  termino: {
    type: String,
    enum: ['1s','2s']
  },
  profesor: {
    type: String,
    ref: 'Profesor',
    'default': ''
  },
  peers: [{
    type: String,
    ref: 'Profesor',
    'default': ''
  }],
  horario: { // DOCUMENTACION
    type: String,
  },
  diasClase: { // DOCUMENTACION
    type: [String],
    enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes']
  },
  estudiantes: [{
    type: String,
    ref: 'Estudiante'
  }],
  grupos: [{
    type: String,
    ref: 'Grupo'
  }]
}, {timestamps: true, versionKey: false, collection: 'paralelos'});

// V2 metodos
ParaleloSchema.methods = {
  Crear() {
    let self = this
    return Promise.resolve(self.save())
  }
}

ParaleloSchema.statics = {
  ObtenerTodos() {
    let self = this
    return new Promise(function(resolve) {
      resolve(self.find({ }))
    })
  },
  ObtenerTodosPopulateEstudiantes() {
    let self = this
    return new Promise(function(resolve) {
      resolve(self.find({ }).populate({path: 'estudiantes'}))
    })
  },
  ObtenerParaleloEstudiante({ estudianteId }) {
    let self = this
    return new Promise(function(resolve) {
      resolve(self.findOne({ 'estudiantes': estudianteId }))
    })
  },
  AnadirEstudiante({ materiaParalelo, materiaCodigo, estudianteId }) {
    const self = this
    return new Promise(function(resolve) {
      self.update({$and: [{ nombre: materiaParalelo }, { codigo: materiaCodigo }]}, {$addToSet: {'estudiantes': estudianteId }}).then((accionEstado) => {
        resolve(accionEstado.nModified ? true : false)
      })
    })
  },
  AnadirProfesorTitular({ materiaParalelo, materiaCodigo, profesorId }) {
    const self = this
    return new Promise(function(resolve) {
      self.update({$and: [{ nombre: materiaParalelo }, { codigo: materiaCodigo }]}, {$set: {'profesor': profesorId }}).then((accionEstado) => {
        resolve(accionEstado.nModified ? true : false)
      })
    })
  },
  EliminarEstudiante({ materiaParalelo, materiaCodigo, estudianteId }) {
    const self = this
    return new Promise(function(resolve) {
      self.update({$and: [{ nombre: materiaParalelo }, { codigo: materiaCodigo }]}, {$pull: { 'estudiantes': estudianteId }}).then((accionEstado) => {
        resolve(accionEstado.nModified ? true : false)
      })
    })
  }
}

ParaleloSchema.statics.obtenerTodosParalelos = function(callback) {
  //this.find({}).populate({path: 'estudiantes grupos'}).exec(callback);
  this.find({}, callback)
}

ParaleloSchema.statics.obtenerTodosParalelosNoPopulate = function(callback) {
  //this.find({}).populate({path: 'estudiantes grupos'}).exec(callback);
  this.find({}, callback)
}

ParaleloSchema.statics.obtenerParalelo = function(id_paralelo,callback) {
  //this.find({_id: id_paralelo}, callback);
  this.findOne({_id: id_paralelo}).populate({path: 'grupos'}).exec(callback);
}

ParaleloSchema.statics.obtenerParaleloCsv = function(id_paralelo, callback) {
  // this.findOne({_id: id_paralelo}).populate({path: 'grupos estudiantes'}).exec(callback);
  this.findOne({_id: id_paralelo}).populate({
    path: 'grupos',
    populate: { path: 'estudiantes' },
    select: 'estudiantes nombre'
  }).exec(callback);
}

ParaleloSchema.statics.obtenerParaleloWebService = function(paralelo, codigomateria, callback) {
  this.findOne({$and: [{nombre: paralelo}, {codigo: codigomateria}]}, callback)
  // this.find({}, callback)
  // this.findOne({codigo: codigomateria}, callback)
}

ParaleloSchema.methods.crearParalelo = function(callback) {
  this.save(callback);
}

ParaleloSchema.statics.actualizarParalelo = function(id_paralelo, actualizar, callback) {
  this.update({_id:id_paralelo}, {$set: {nombre: actualizar.nombre, limiteEstudiantes: actualizar.limiteEstudiantes}},callback)
}

ParaleloSchema.statics.eliminarParalelo = function(id_paralelo, callback) {
  this.findOneAndRemove({_id: id_paralelo}, callback);
}

/*
* Paralelos
 */
ParaleloSchema.statics.anadirGrupoAParalelo = function(id_paralelo, id_grupo, callback) {
  this.update({_id: id_paralelo}, {$addToSet: {'grupos': id_grupo}}, callback);
}

ParaleloSchema.statics.eliminarGrupoDeParalelo = function(id_paralelo, id_grupo, callback) {
  this.findOneAndUpdate({_id: id_paralelo}, {$pull: {'grupos': id_grupo}}, callback);
}


/*
* Profesores
 */
ParaleloSchema.statics.anadirProfesorAParalelo = function(id_paralelo, id_profesor, callback) {
  this.update({_id: id_paralelo}, {$set: {'profesor': id_profesor}}, callback);
}

ParaleloSchema.statics.eliminarProfesorDeParalelo = function(id_paralelo, callback) {
  this.update({_id: id_paralelo}, {$set: {'profesor': ''}}, callback);
}

ParaleloSchema.statics.obtenerParalelosProfesor = function(id_profesor, callback) {
  this.find({profesor: id_profesor}).populate({path: 'grupos estudiantes'}).exec(callback);
}

ParaleloSchema.statics.obtenerParaleloPeer = function(id_profesor, callback) {
  this.find({peers: id_profesor}).populate({path: 'grupos estudiantes'}).exec(callback);
}

ParaleloSchema.statics.obtenerParaleloPeerCsv = function(id_profesor, callback) {
  this.find({peers: id_profesor}).populate({
    path: 'grupos',
    populate: { path: 'estudiantes' },
    select: 'estudiantes nombre'
  }).exec(callback);
}

ParaleloSchema.statics.obtenerParaleloProfesorCsv = function(id_profesor, callback) {
  this.findOne({profesor: id_profesor}).populate({
    path: 'grupos',
    populate: { path: 'estudiantes' },
    select: 'estudiantes nombre'
  }).exec(callback);
}


/* PEERS*/
ParaleloSchema.statics.anadirPeerAParalelo = function(id_paralelo, id_profesor, callback) {
  this.update({_id: id_paralelo}, {$addToSet: {'peers': id_profesor}}, callback);
}

/*
* Estudiantes
 */
ParaleloSchema.statics.anadirEstudianteAParalelo = function(id_paralelo, id_estudiante, callback) {
  this.update({_id: id_paralelo}, {$addToSet: {estudiantes: id_estudiante}}, callback)
}

ParaleloSchema.statics.eliminarEstudianteDeParalelo = function(id_paralelo, id_estudiante, callback) {
  this.update({_id: id_paralelo}, {$pull: {estudiantes: id_estudiante}}, callback);
}

ParaleloSchema.statics.obtenerParaleloDeEstudiante = function(id_estudiante, callback) {
  this.findOne({estudiantes: id_estudiante}, callback)
}

/*
Lecciones
 */
ParaleloSchema.statics.dandoLeccion = function(id_paralelo, id_leccion, callback) {
	this.update({_id: id_paralelo}, {$set: {'leccion': id_leccion, 'dandoLeccion': true}},callback)
}

ParaleloSchema.statics.empezoLeccion = function(id_paralelo, callback) {
  this.update({_id: id_paralelo}, {$set: {'leccionYaComenzo': true}},callback)
}

ParaleloSchema.statics.leccionTerminada = function(id_paralelo, callback) {
	this.update({_id: id_paralelo}, {$set: {'leccion': '', 'dandoLeccion': false, 'leccionYaComenzo': false}},callback)
}

module.exports = mongoose.model('Paralelo', ParaleloSchema);
