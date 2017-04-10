const mongoose = require('mongoose');

const ParaleloSchema = new mongoose.Schema({
  _id: {
    type: String,
    unique: true,
    'default': require('shortid').generate
  },
  nombre: {
    type: String
  },
  dandoLeccion: {  // <= para ver si un estudiante puede dar leccion y verificar que cursos estan dando leccion DOCUMENTACION
    type: Boolean,
		'default': false
  },
  leccion: { // <= saber que leccion esta dando el curso, setear a null cuando termine la leccion  DOCUMENTACION
    type: String,
    ref: 'Leccion'
  },
  cantidadEstudiantes: {
    type: Number
  },
  profesor: {
    type: String,
    ref: 'Profesor',
    'default': ''
  },
  estudiantes: [{
    type: String,
    ref: 'Estudiante'
  }],
  grupos: [{
    type: String,
    ref: 'Grupo',
    unique: true
  }]
}, {timestamps: true, versionKey: false, collection: 'paralelos'});

ParaleloSchema.statics.obtenerTodosParalelos = function(callback) {
  this.find({}).populate({path: 'profesor estudiantes grupos'}).exec(callback);
}

ParaleloSchema.statics.obtenerParalelo = function(id_paralelo,callback) {
  this.find({_id: id_paralelo}, callback);
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

ParaleloSchema.statics.obtenerParalelo = function(id_paralelo, callback) {
  this.findOne({_id: id_paralelo}, callback)
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
  this.find({profesor: id_profesor}).populate({path: 'grupos.estudiantes estudiantes grupos '}).exec(callback);
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

/*
Lecciones
 */
ParaleloSchema.statics.dandoLeccion = function(id_paralelo, id_leccion, callback) {
	this.update({_id: id_paralelo}, {$set: {'leccion': id_leccion, 'dandoLeccion': true}},callback)
}


module.exports = mongoose.model('Paralelo', ParaleloSchema);
