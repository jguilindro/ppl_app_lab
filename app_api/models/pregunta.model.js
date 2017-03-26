var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const PreguntaSchema = mongoose.Schema({
  _id: {
    type: String,
    unique: true,
    'default': require('shortid').generate
  },
  creador: {
    type: String,
    ref: 'Profesor'
  },
  tipo: {
    type: Number
  },
  capitulo: {
    type: Number
  },
  tiempoEstimado: {
    type: Date
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
  this.update({_id: id_pregunta}, {$set: {tipo: actualizar.tipo, capitulo: actualizar.capitulo, tiempoEstimado: actualizar.tiempoEstimado, puntaje: actualizar.puntaje}},callback);
}

PreguntaSchema.statics.eliminarPregunta = function(id_pregunta, callback) {
  this.findOneAndRemove({_id: id_pregunta}, callback);
}

module.exports = mongoose.model('Pregunta', PreguntaSchema);
