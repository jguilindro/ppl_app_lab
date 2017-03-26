const mongoose = require('mongoose');
const shortid = require('shortid');

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
		ref: 'Estudiante'
	}]
},{versionKey: false, timestamps: true, collection: 'grupos'})

// obtener todos los grupos
GrupoSchema.statics.obtenerTodosGrupos = function(callback) {
	this.find({},callback);
}

// crear grupo
GrupoSchema.methods.crearGrupo = function(callback) {
	this.save(callback);
}

// eliminar grupo
GrupoSchema.statics.eliminarGrupo = function(id_grupo, callback) {
	this.model('Grupo').findOneAndRemove({_id: id_grupo}, callback) 
}

module.exports = mongoose.model('Grupo', GrupoSchema)