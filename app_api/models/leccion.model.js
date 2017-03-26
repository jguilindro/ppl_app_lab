var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const LeccionSchema = mongoose.Schema({
  _id: {
    type: String,
    unique: true,
    'default': require('shortid').generate
  },
  nombre: {
    type: String
  },
  estado: {
    type: Number
  },
  tiempoEstimado: {
    type: Date
  },
  puntaje: {
    type: Number
  },
  tipo: {
    type: Number
  },
  fechaInicio: {
    type: Date
  },
  codigo: {
    type: String,
    unique: true
  },
  creador: {
    type: String,
    ref: 'Profesor'
  }
},{timestamps: true, versionKey: false, collection: 'lecciones'})

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

module.exports = mongoose.model('Leccion', LeccionSchema);
