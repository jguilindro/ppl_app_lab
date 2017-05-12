var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const LeccionRealtimeSchema = mongoose.Schema({
  _id: {
    type: String,
    unique: true,
    'default': require('shortid').generate
  },
  leccion: {
    type: String,
    ref: 'Leccion'
  },
  profesor: {
    type: String,
    ref: 'Profesor'
  },
  estudiantesDandoLeccion: [{
    type: String,
    ref: 'Estudiante'
  }],
  estudiantesDesconectados: [{
    type: String,
    ref: 'Estudiante'
  }],
  fechaInicio: {
    type: Date
  }
},{timestamps: true, versionKey: false, collection: 'leccionesRealtime'})

LeccionRealtimeSchema.methods.crearLeccion = function(callback) {
  this.save(callback)
}

LeccionRealtimeSchema.statics.buscarLeccion = function(id_leccion, callback) {
  this.findOne({leccion: id_leccion}, callback)
}

LeccionRealtimeSchema.statics.buscarLeccionPopulate = function(id_leccion, callback) {
  this.findOne({leccion: id_leccion}).populate({path: 'estudiantesDandoLeccion estudiantesDesconectados leccion profesor' }).exec(callback);
}

/*solo anadir a los estuidantes mientras den la leccion*/
LeccionRealtimeSchema.statics.estudianteConectado = function(id_leccion, id_estudiante, callback) {
  this.update({leccion: id_leccion}, {$addToSet: {estudiantesDandoLeccion: id_estudiante}}, callback)
}

/*anadir cuando un estudiante se salga de la leccion*/
LeccionRealtimeSchema.statics.estudianteDesconectado = function(id_leccion, id_estudiante, callback) {
  this.update({leccion: id_leccion}, {$addToSet: {estudiantesDesconectados: id_estudiante}}, callback)
}

/*cuando un estudiante vuelva ha estar conecatdo nuevamente*/
LeccionRealtimeSchema.statics.estudianteReconectado = function(id_leccion, id_estudiante, callback) {
  this.update({leccion: id_leccion}, {$pull: {estudiantesDesconectados: id_estudiante}}, callback)
}

// LeccionRealtimeSchema.statics.anadirProfesor = function(id_leccion, id_profesor, callback) {
//   this.
// }

module.exports = mongoose.model('LeccionRealtime', LeccionRealtimeSchema);
