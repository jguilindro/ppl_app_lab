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
  },
  paralelo: {
    type: String,
    ref: 'Paralelo'
  },
  leccion: {
    type: String,
    ref: 'Leccion'
  },
  tiempoBono: { // tiempo en minutos
    type: Number
  },
  preguntaActual: {
    type: Number,
    'default': 1
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
      ref: 'Estudiante',
      unique: true
    },
    estudianteSocketId: {
      type: String
    },
    contestadoPreguntaActual: {
      type: Boolean,
      'default': false
    }
  }],
  calificacion: {
    type: Number
  },
  calificada: {
    type: Boolean
  }
},{versionKey: false, timestamps: true, collection: 'grupoLeccion'})

GrupoLeccionSchema.methods.crearGrupoLeccion = function(callback) {
  this.save(callback)
}

GrupoLeccionSchema.statics.anadirParticipante = function(id_grupo, id_leccion, id_estudiante, callback) {
  let participante = {
    estudiante: id_estudiante
  }
  this.update({$and: [{grupo: id_grupo}, {leccion: id_leccion}]},{$addToSet: {'participantes': participante}}, callback)
}

GrupoLeccionSchema.statics.participanteExiste = function(id_grupo, id_leccion, id_estudiante, callback) {
  this.findOne({$and: [{grupo: id_grupo}, {leccion: id_leccion}, {'participantes.estudiante': id_estudiante}]}, callback)
}

GrupoLeccionSchema.statics.obtenerGrupoLeccion = function(id_grupo, id_leccion, callback) {
  this.findOne({$and: [{grupo: id_grupo}, {leccion: id_leccion}]}, callback)
}

GrupoLeccionSchema.statics.calificarLeccionPorGrupo = function(id_leccion, id_grupo, calificacion_nueva, callback){
  this.update({grupo: id_grupo, leccion: id_leccion}, {$set: {calificacion: calificacion_nueva, calificada: true }}, callback);
}

GrupoLeccionSchema.statics.obtenerRegistroPorLeccion = function(id_leccion, callback){
  tihs.find({leccion: id_leccion}, callback);
}


module.exports = mongoose.model('GrupoLeccion', GrupoLeccionSchema)
