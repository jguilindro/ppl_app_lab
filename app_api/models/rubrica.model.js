const mongoose = require('mongoose');
const shortid = require('shortid');
mongoose.Promise = global.Promise;

const RubricaSchema = mongoose.Schema({
	_id: {
		type: String,
		unique: true,
		'default': require('shortid').generate
	},
	paralelo: {
		type: String,
	},
	grupo: {
		type: String
	},
	capitulo: {
		type: String
	},
	ejercicio: {
		type: String
	},
	calificacion: {
		type: Number
	},
	evaluador: {
		type: String
	}
}, {timestamps: true, versionKey: false, collection: 'rubricas'});

RubricaSchema.statics.crearRegistro = function(callback){
	this.save(callback);
}

/*
	Obtiene el registro indicado por el id
*/
RubricaSchema.statics.obtenerRegistroPorId = function(idRegistro, callback){
	this.find({ _id : idRegistro }, callback);
}

/*
	Obtiene todos los registros de calificaciones del grupo indicado
*/
RubricaSchema.statics.obtenerRegistrosDeGrupo = function(paralelo, grupo, callback){
	this.find({ paralelo : paralelo, grupo : grupo }, callback);
}

/*
	Obtiene los registros de todos los ejercicios del capítulo indicado del grupo indicado
*/
RubricaSchema.statics.obtenerRegistrosDeCapituloDeGrupo = function(paralelo, grupo, capitulo, callback){
	this.find({ paralelo : paralelo, grupo : grupo, capitulo : capitulo }, callback);
}

/*
	Obtiene los registros de toods los ejercicios del capítulo indicado de todos los grupos del paralelo indicado
*/
RubricaSchema.statics.obtenerRegistrosDeCapituloDeParalelo = function(paralelo, capitulo, callback){
	this.find({ paralelo : paralelo, capitulo : capitulo }, callback);
}

module.exports = mongoose.model('Rubrica', RubricaSchema);

