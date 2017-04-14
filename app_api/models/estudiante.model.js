const mongoose = require('mongoose');
const shortid = require('shortid');
var jwt             = require('jsonwebtoken');
var config = require('../config/main')
mongoose.Promise = global.Promise;
const EstudianteSchema = mongoose.Schema({
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
  genero: {
    type: String,
    enum: ['masculino', 'femenino']
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
		type: String,
    ref: 'Grupo'
	},
  dandoLeccion: {
    type: Boolean,
    'default': false
  },
	lecciones: [{
		leccion: {
			type: String,
			ref: 'Leccion'
		},
		calificado: {
			type: Boolean
		},
		calificacion: {
			type: Number
		},
    autorizado: {
      type: Boolean
    },
    terminado: {
      type: Boolean
    }
	}]
},{timestamps: true, versionKey: false, collection: 'estudiantes'})

EstudianteSchema.methods.generarJwt = function() {
  var expiracion = new Date();
  expiracion.setDate(expiracion.getDate() + 5);
  return jwt.sign({
    _id: this._id,
    correo: this.correo,
    nombres: this.nombres,
    apellidos: this.apellidos,
    exp: parseInt(expiracion.getTime() / 1000),
  }, config.secret );// process.env.JWT_SECRET
};

EstudianteSchema.statics.obtenerTodosEstudiantes = function(callback) {
  this.find({}, callback)
}

EstudianteSchema.methods.crearEstudiante = function(callback) {
  this.save(callback)
}

EstudianteSchema.statics.obtenerEstudiante = function(id_estudiante, callback) {
  this.findOne({_id: id_estudiante}, callback)
}

EstudianteSchema.statics.obtenerEstudiantePorCorreo = function(correo_estudiante, callback) {
  this.findOne({correo: correo_estudiante}, callback)
}

// Realtime
EstudianteSchema.statics.anadirEstudianteDandoLeccion = function(id_estudiante,callback) {
  this.update({_id: id_estudiante}, {$set: {dandoLeccion: true}},callback)
}

EstudianteSchema.statics.anadirEstudianteTerminoLeccion = function(id_estudiante,callback) {
  this.update({_id: id_estudiante}, {$set: {dandoLeccion: false}},callback)
}

module.exports = mongoose.model('Estudiante', EstudianteSchema)
