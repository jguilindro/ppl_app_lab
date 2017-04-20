const mongoose = require('mongoose');
const shortid = require('shortid');
mongoose.Promise = global.Promise;

const GrupoLeccionSchema = mongoose.Schema({
	_id: {
		type: String,
		unique: true,
		'default': shortid.generate
	},
  grupo: {
    type: String,
    'ref': 'Grupo'
  }
  leccion: {
    type: String,
    ref: 'Leccion'
  },
  tiempoBono: {
    type: String
  },
  preguntas: [{
    type: String,
    ref: 'Pregunta'
  }],
  preguntaActual: {
    type: Number,
    'default': 0
  },
  fechaEmpezado:{
    type: Date
  },
  fechaTerminado: {
    type: Date
  },
  participantes: [{
    estudiante: {
      type: String,
      ref: 'Estudiante'
    },
    estudianteSocketId: {
      type: String
    },
    contestadoPreguntaActual: {
      type: Boolean,
      'default': false
    }
  }]
},{versionKey: false, timestamps: true, collection: 'grupos'})


module.exports = mongoose.model('GrupoLeccion', GrupoLeccionSchema)
