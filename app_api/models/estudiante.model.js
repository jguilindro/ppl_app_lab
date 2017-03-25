const mongoose = require('mongoose');
const shortid = require('shortid');

const EstudianteSchema = new Schema({
	_id: {
		type: String,
		unique: true,
		'default': shortid.generate
	},
	nombres: {
		type: String
	},
	apellidos: {
		type: String
	},
	correo: {
		type: String
	},
	matricula: {
		type: String
	},
	foto: {
		type: String
	},
	grupo: {
		type: String, ref 'Grupo'
	},
	lecciones: [{
		leccion: {
			type: String,
			ref: 'Leccion'
		},
		calificacion: {
			type: Number
		}
	}]
})