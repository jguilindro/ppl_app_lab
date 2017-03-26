const mongoose = require('mongoose');
const shortid = require('shortid');

const ProfesorSchema = mongoose.Schema({
  _id: {
    type: String,
    unique: true,
    'default': shortid.generate
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
})

ProfesorSchema.statics.obtenerTodosProfesores = function(callback) {
  this.model('Profesor').find({}, callback);
}

module.exports = mongoose.model('Profesor', ProfesorSchema)
