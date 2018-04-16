let mongoose = {}
let db = {}
if (process.env.NODE_ENV === 'production' && process.env.SERVIDOR === 'heroku') {
  mongoose = require('mongoose')
  db = require('mongoose')
} else if (process.env.NODE_ENV) {
  db = require('../../databases/mongo/mongo').getDatabaseConnection()
  mongoose = require('mongoose')
}

const shortid = require('shortid');
mongoose.Promise = global.Promise;

const GrupoSchema = mongoose.Schema({
	_id: {
		type: String,
		'default': shortid.generate
	},
  nombre: {
    type: String
  },
	estudiantes: [{
		type: String,
		ref: 'Estudiante',
	}],
	paralelo: {
		type: String,
		ref: 'Paralelo'
	}
},{versionKey: false, timestamps: true, collection: 'grupos'})

GrupoSchema.statics.obtenerTodosGrupos = function(callback) {
	this.find({}).populate({path: 'estudiantes'}).exec(callback);
}

GrupoSchema.statics.obtenerGrupo = function(id_grupo,callback) {
  this.findOne({_id: id_grupo}).populate({path: 'estudiantes'}).exec(callback);
}

GrupoSchema.methods.crearGrupo = function(callback) {
	this.save(callback);
}

GrupoSchema.statics.eliminarGrupo = function(id_grupo, callback) {
	this.findOneAndRemove({_id: id_grupo}, callback)
}

/*
* Estudiante
 */
GrupoSchema.statics.anadirEstudiante = function(id_grupo,id_estudiante, callback) {
  this.update({_id: id_grupo}, {$addToSet: {estudiantes: id_estudiante}}, callback);
}

GrupoSchema.statics.eliminarEstudiante = function(id_grupo, id_estudiante, callback) {
  this.update({_id: id_grupo}, {$pull: {estudiantes: id_estudiante}}, callback);
}

GrupoSchema.statics.eliminarEstudianteDeGrupos = function(id_estudiante, callback) {
  this.update({},{$pull: {estudiantes: id_estudiante}}, { multi: true }, callback)
}

GrupoSchema.statics.obtenerGrupoDeEstudiante = function(id_estudiante, callback) {
  this.findOne({estudiantes: id_estudiante}, callback)
}

GrupoSchema.statics.obtenerGruposDeEstudiante = function(id_estudiante, callback) {
  this.find({estudiantes: id_estudiante}, callback)
}

GrupoSchema.statics.obtenerGruposDeEstudiantePopulate = function(id_estudiante, callback) {
  this.findOne({estudiantes: id_estudiante}).populate({path: 'estudiantes'}).exec(callback)
}
/*
	Lecciones
*/
GrupoSchema.statics.anadirLeccion = function(id_grupo, id_leccion, id_pregunta){

}

// REALTIME
// GrupoSchema.statics.guardarParticipanteLeccionGrupo = function(id_grupo, id_leccion, id_estudiante, callback){
//   this.findOne({_id: id_grupo},)
// }

module.exports = mongoose.model('Grupo', GrupoSchema)
