const mongoose = require('mongoose');
const shortid = require('shortid');
mongoose.Promise = global.Promise;

const CalificacionSchema = mongoose.Schema({
	_id: {
		type: String,
		unique: true,
		'default': require('shortid').generate
	},
	leccion: {
		type: String,
		ref: 'Leccion'
	},
	leccionTomada: {
		type: Boolean
	},
	grupo: {
		type: String,
		ref: 'Grupo'
	},
	participantes: [{
			type: String,
			ref: 'Estudiante'
	}],
	calificacion: {
		type: Number
	},
	calificada: {
		type: Boolean
	}
},{timestamps: true, versionKey: false, collection: 'calificaciones'});

CalificacionSchema.methods.crearRegistro = function(callback){
	this.save(callback);
}

CalificacionSchema.statics.obtenerRegistro = function(id_leccion, id_grupo, callback){
	this.find({leccion: id_leccion, grupo: id_grupo}, callback);
}

CalificacionSchema.statics.anadirParticipante = function(id_leccion, id_grupo, id_estudiante, callback){
	this.update({leccion: id_leccion, grupo: id_grupo}, {$addToSet: {participantes: id_estudiante}}, callback);
}

CalificacionSchema.statics.calificar = function(id_leccion, id_grupo, calificacion_nueva, callback){
	this.update({leccion: id_leccion, grupo: id_grupo}, {calificacion: calificacion_nueva, calificada: true}, callback);
}

CalificacionSchema.statics.obtenerRegistroPorleccion = function(id_leccion, callback){
	this.find({leccion: id_leccion}, callback)
}

module.exports = mongoose.model('Calificacion', CalificacionSchema);