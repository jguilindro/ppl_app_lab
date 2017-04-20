const mongoose = require('mongoose');
const shortid = require('shortid');
mongoose.Promise = global.Promise;

const respuestasEstudiantesSchema = mongoose.Schema({
	_id: {
		type: String,
		unique: true,
		'default' : shortid.generate
	},
  estudiante: {
    type: String,
    ref: 'Estudiante'
  },
  leccion: {
    type: String,
    ref: 'Leccion'
  },
  pregunta: {
    type: String,
    ref: 'Pregunta'
  },
  paralelo: {
    type: String,
    ref: 'Paralelo'
  },
  grupo: {
    type: String,
    ref: 'Grupo'
  },
	contestado: {
    type: Boolean,
    'default': false
  },
  respuesta: {
    type: String
  },
  fechaEmpezado: {
    type: Date
  },
  fechaTerminado: {
    type: Date
  },
  calificacion: {
    type: Number
  },
	feedback: {
		type: String
	}
}, {versionKey: false, timestamps: true, collection: 'respuestasEstudiantes'})
