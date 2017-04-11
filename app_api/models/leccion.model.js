var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

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
    enum: ['pendiente', 'tomando', 'terminado'],
    'default': 'pendiente',
    unique: false
  },
  tiempoEstimado: {
    type: String,
    unique: false
  },
  puntaje: {
    type: Number,
    unique: false
  },
  tipo: {
    type: String,
    enum: ['estimacion', 'tutorial', 'experimento'],
    'default': 'estimacion',
    unique: false
  },
  fechaInicio: {
    type: Date,
    unique: false
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
  preguntas: [{
    type: String,
    ref: 'Pregunta'
  }]
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

LeccionSchema.statics.obtenerLeccion = function(id_leccion, callback) {
  this.findOne({_id: id_leccion}, callback);
}

LeccionSchema.statics.actualizarLeccion = function(id_leccion, actualizar, callback) {
  this.update({_id: id_leccion}, {$set: {nombre: actualizar.nombre, tiempoEstimado: actualizar.tiempoEstimado, puntaje: actualizar.tiempoEstimado, tipo: actualizar.tipo, fechaInicio: actualizar.fechaInicio}}, callback);
}

LeccionSchema.statics.eliminarLeccion = function(id_leccion, callback) {
  this.findOneAndRemove({_id: id_leccion}, callback);
}

// realtime
LeccionSchema.statics.tomarLeccion = function(id_leccion, callback) {
  this.update({_id: id_leccion}, {$set: {estado: 'tomando'}}, callback)
}

LeccionSchema.statics.obtenerLeccionPorCodigo = function(codigo_leccion, callback) {
  this.findOne({codigo: codigo_leccion}, callback)
}

module.exports = mongoose.model('Leccion', LeccionSchema);
