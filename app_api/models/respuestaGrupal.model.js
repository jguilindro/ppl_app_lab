const mongoose = require('mongoose');
const shortid = require('shortid');
mongoose.Promise = global.Promise;

const RespuestaGrupalSchema = mongoose.Schema({
	_id: {
		type: String, 
		unique: true,
		'default' : shortid.generate
	},
	respuesta:{
		type: String
	},
	feedback: {
		type: String
	},
	grupo: {
		type: String,
		ref: 'Grupo'
	},
	pregunta: {
		type: String,
		ref: 'Pregunta'
	},
	leccion: {
		type: String,
		ref: 'Leccion'
	},
	fechaContestada: {
		type: Date
	}

}, {versionKey: false, timestamps: true, collection: 'respuestas'})

