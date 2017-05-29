var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var moment = require('moment')
var tz = require('moment-timezone')
const LeccionSchema = mongoose.Schema({
  _id: {
    type: String,
    unique: true,
    'default': require('shortid').generate
  },
  nombre: {
    type: String,
    unique: false
  },
  estado: {
    type: String,
    enum: ['pendiente', 'tomando', 'terminado', 'calificado'],
    'default': 'pendiente',
    unique: false
  },
  tiempoEstimado: {
    type: Number,
    unique: false
  },
  puntaje: {
    type: Number,
    unique: false
  },
  tipo: {
    type: String,
    enum: ['estimacion|laboratorio', 'tutorial'],
    'default': 'estimacion|laboratorio',
    unique: false
  },
  fechaInicio: {
    type: Date,
    unique: false
  },
  fechaInicioTomada: { // DOCUMENTACION
    type: Date
  },
  codigo: {
    type: String,
    unique: true
  },
  creador: {
    type: String,
    ref: 'Profesor',
    unique: false
  },
  leccionYaComenzo: {
    type: Boolean,
    'default': false
  },
  preguntas: [{
    pregunta: {
      type: String,
      ref: 'Pregunta'
    },
    ordenPregunta: {
      type: Number
    }
  }],
  paralelo: {
    type: String,
    ref: 'Paralelo'
  },
  nombreParalelo:{
    type: String
  },
  codigoMateria:{
    type: String
  },
  nombreMateria:{
    type: String
  }
},{timestamps: true, versionKey: false, collection: 'lecciones'})



LeccionSchema.pre('save', function(next) {
  this.codigo = require('../utils').random()
  next()
})

// TODO: settear creador aqui
LeccionSchema.methods.crearLeccion = function(callback) {
  this.save(callback);
}

LeccionSchema.statics.obtenerTodasLecciones = function(callback) {
  this.find({}, callback);
}

LeccionSchema.statics.obtenerLeccionesParalelo = function (id_paralelo, callback) {
  this.find({paralelo: id_paralelo}, callback);
}

LeccionSchema.statics.obtenerLeccion = function(id_leccion, callback) {
  this.findOne({_id: id_leccion}, callback);
}

LeccionSchema.statics.actualizarLeccion = function(id_leccion, actualizar, callback) {
  this.update(
    {_id: id_leccion},
    {$set:
      {
        nombre: actualizar.nombre,
        tiempoEstimado: actualizar.tiempoEstimado,
        puntaje: actualizar.puntaje,
        tipo: actualizar.tipo,
        fechaInicio: actualizar.fechaInicio,
        paralelo: actualizar.paralelo,
        nombreParalelo: actualizar.nombreParalelo,
        codigoMateria: actualizar.codigoMateria,
        nombreMateria: actualizar.nombreMateria,
        preguntas: actualizar.preguntas
      }
    },
    callback
  );
}

LeccionSchema.statics.eliminarLeccion = function(id_leccion, callback) {
  this.findOneAndRemove({_id: id_leccion}, callback);
}

// realtime
LeccionSchema.statics.tomarLeccion = function(id_leccion, callback) {
  this.update({_id: id_leccion}, {$set: {estado: 'tomando', leccionYaComenzo: false}}, callback)
}

LeccionSchema.statics.comenzarLeccion = function(id_leccion, callback) {
  let fecha = moment();
  let current_time_guayaquil = moment(fecha.tz('America/Guayaquil').format())
  this.update({_id: id_leccion}, {$set: {fechaInicioTomada: current_time_guayaquil, leccionYaComenzo: true}}, callback)
}

LeccionSchema.statics.leccionTerminada = function(id_leccion, callback) {
  let fecha = moment();
  this.update({_id: id_leccion}, {$set: {estado: 'terminado',leccionYaComenzo: false}}, callback)
}

LeccionSchema.statics.leccionTerminadaDevelop = function(id_leccion, callback) {
  let fecha = moment();
  this.update({_id: id_leccion}, {$set: {estado: 'pendiente',leccionYaComenzo: false }}, callback)
}

LeccionSchema.statics.obtenerLeccionPorCodigo = function(codigo_leccion, callback) {
  this.findOne({codigo: codigo_leccion}, callback)
}

LeccionSchema.statics.aumentarTiempo = function(id_leccion, tiempo, callback) {
  this.findOneAndUpdate({_id: id_leccion}, {$inc: {tiempoEstimado: tiempo}}, callback)
}

LeccionSchema.statics.calificar = function(id_leccion, callback){
  //Esta función solo le cambia el estado al registro de la lección a 'calificado'
  this.update({_id: id_leccion}, {estado: 'calificado'}, callback);
}

module.exports = mongoose.model('Leccion', LeccionSchema);
