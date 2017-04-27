var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const PreguntaSchema = mongoose.Schema({
  _id: {
    type: String,
    unique: true,
    'default': require('shortid').generate
  },
  nombre: {
    type: String
  },
  creador: {
    type: String,
    ref: 'Profesor'
  },
  nombreCreador: {
    type: String
  },
  tipoLeccion: {  // <= DOCUMENTACION
    type: String,
    enum: ['estimacion', 'tutorial', 'laboratorio'],
    'default': 'estimacion'
  },
  tipoPregunta: {
    type: String,
    enum: ['v_f','opcion', 'justificacion'],
    'default': 'justificacion'
  },
  capitulo: {
    type: String
  },
  tutorial: {
    type: String
  },
  laboratorio: {
    type: String
  },
  tiempoEstimado: {
    type: String
  },
  descripcion: {
    type: String
  },
  puntaje: {
    type: Number
  }
},{timestamps: true, versionKey: false, collection: 'preguntas'});

PreguntaSchema.statics.obtenerTodasPreguntas = function(callback) {
  this.find({}, callback);
}

PreguntaSchema.statics.obtenerPregunta = function(id_pregunta, callback) {
  this.findOne({_id: id_pregunta}, callback);
}

PreguntaSchema.statics.obtenerPreguntasPorCreador = function(id_creador, callback) {
  this.find({creador: id_creador}, callback);
}

PreguntaSchema.methods.crearPregunta = function(callback) {
  this.save(callback);
}

PreguntaSchema.statics.actualizarPregunta = function(id_pregunta, actualizar, callback) {
  this.update({_id: id_pregunta}, {$set: {nombre: actualizar.nombre, tipoLeccion: actualizar.tipoLeccion, tipoPregunta: actualizar.tipoPregunta, capitulo: actualizar.capitulo, laboratorio: actualizar.laboratorio, tutorial: actualizar.tutorial, tiempoEstimado: actualizar.tiempoEstimado, tiempoMinimo: actualizar.tiempoMinimo, puntaje: actualizar.puntaje, descripcion: actualizar.descripcion}},callback);
}

PreguntaSchema.statics.eliminarPregunta = function(id_pregunta, callback) {
  this.findOneAndRemove({_id: id_pregunta}, callback);
}

module.exports = mongoose.model('Pregunta', PreguntaSchema);
