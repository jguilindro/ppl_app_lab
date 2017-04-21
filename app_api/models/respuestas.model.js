const mongoose = require('mongoose');
const shortid = require('shortid');
mongoose.Promise = global.Promise;

const respuestasSchema = mongoose.Schema({
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
}, {versionKey: false, timestamps: true, collection: 'respuestas'})

respuestasSchema.methods.crearRespuesta = function(callback){
  this.save(callback);
}

respuestasSchema.statics.obtenerRespuestasPorGrupoAPregunta = function(id_leccion, id_pregunta, id_grupo, callback){
  this.find({$and: [{leccion:id_leccion}, {pregunta:id_pregunta}, {grupo:id_grupo}]}, callback);
}


module.exports = mongoose.model('Respuesta', respuestasSchema);