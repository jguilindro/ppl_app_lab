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

const RubricaSchema = mongoose.Schema({
	_id: {
		type: String,
		'default': require('shortid').generate
	},
	materia: {
		type: String,
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
	calificaciones: [{
		regla: {
			type: String
		},
		calificacion: {
			type: Number
		}
	}],
	total: {
		type: Number
	},
	evaluador: {
		type: String
	}
}, {timestamps: true, versionKey: false, collection: 'rubricas'});

RubricaSchema.methods.crearRegistro = function(callback){
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
	Obtiene los registros de toods los ejercicios del capítulo indicado de TODOS LOS GRUPOS del paralelo indicado
*/
RubricaSchema.statics.obtenerRegistrosDeCapituloDeParalelo = function(materia, paralelo, capitulo, callback){
	this.find({ materia: materia, paralelo : paralelo, capitulo : capitulo }, callback);
}

module.exports = mongoose.model('Rubrica', RubricaSchema);

