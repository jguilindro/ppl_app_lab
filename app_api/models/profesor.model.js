const mongoose = require('mongoose');

const ProfesorSchema = mongoose.Schema({
  _id: {
    type: String,
    unique: true,
    'default': require('shortid').generate
  },
  correo: {
    type: String
  },
  nombres: {
    type: String
  },
  apellidos: {
    type: String
  },
  foto: {
    type: String
  },
  preguntasCreadas: [{
    type: String,
    ref: 'Pregunta'
  }]
});
//,{timestamps: true, versionKey: false, collection: 'profesores'}

ProfesorSchema.statics.obtenerTodosProfesores = function(callback) {
  this.model('Profesor').find({}, callback);
}

ProfesorSchema.statics.obtenerProfesorPorCorreo = function(correo_profesor, callback) {
  this.findOne({correo: correo_profesor}, callback)
}

ProfesorSchema.methods.crearProfesor = function(callback) {
  this.save(callback);
}

module.exports = mongoose.model('Profesor', ProfesorSchema)
