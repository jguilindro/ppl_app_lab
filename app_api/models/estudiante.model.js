const mongoose = require('mongoose');
const shortid = require('shortid');
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
	lecciones: [{
		leccion: {
			type: String,
			ref: 'Leccion'
		},
		calificado: { // Si el estudiante es el que el profesor escoge a ser calificado por el grupo
			type: Boolean
		},
		calificacion: {
			type: Number
		}
	}]
},{timestamps: true, versionKey: false, collection: 'estudiantes'})

EstudianteSchema.statics.obtenerTodosEstudiantes = function(callback) {
  this.find({}, callback)
}

EstudianteSchema.methods.crearEstudiante = function(callback) {
  this.save(callback)
}

module.exports = mongoose.model('Estudiante', EstudianteSchema)
