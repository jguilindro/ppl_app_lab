const mongoose = require('mongoose');
const shortid = require('shortid');
mongoose.Promise = global.Promise;

const GrupoSchema = mongoose.Schema({
	_id: {
		type: String,
		unique: true,
		'default': shortid.generate
	},
  nombre: {
    type: String
  },
	estudiantes: [{
		type: String,
		ref: 'Estudiante',
	}]
},{versionKey: false, timestamps: true, collection: 'grupos'})

GrupoSchema.statics.obtenerTodosGrupos = function(callback) {
	this.find({}).populate({path: 'estudiantes'}).exec(callback);
}

GrupoSchema.statics.obtenerGrupo = function(id_grupo,callback) {
  this.findOne({_id: id_grupo}, callback)
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

module.exports = mongoose.model('Grupo', GrupoSchema)
