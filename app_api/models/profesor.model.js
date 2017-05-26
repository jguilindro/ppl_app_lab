const mongoose = require('mongoose');
mongoose.Promise = global.Promise

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
  tipo: {
    type: String,
    enum: ['titular', 'peer']
  },
  nivelPeer: [{
    paralelo: {
      ref: 'Paralelo',
      type: String
    },
    nivel: {
      type: Number
    }
  }]
},{timestamps: true, versionKey: false, collection: 'profesores'});

ProfesorSchema.statics.obtenerTodosProfesores = function(callback) {
  this.model('Profesor').find({}, callback);
}

ProfesorSchema.statics.obtenerProfesorPorCorreo = function(correo_profesor, callback) {
  this.findOne({correo: correo_profesor}, callback)
}

ProfesorSchema.statics.obtenerProfesorPorNombres = function(nombres_profesor, callback) {
  this.findOne({nombres: nombres_profesor}, callback)
}

ProfesorSchema.methods.crearProfesor = function(callback) {
  this.save(callback);
}

module.exports = mongoose.model('Profesor', ProfesorSchema)
