let mongoose = {}
let db = {}
if (process.env.NODE_ENV === 'production' && process.env.SERVIDOR === 'heroku') {
  mongoose = require('mongoose')
  db = require('mongoose')
} else if (process.env.NODE_ENV) {
  db = require('../../databases/mongo/mongo').getDatabaseConnection()
  mongoose = require('mongoose')
}

mongoose.Promise = global.Promise

const ProfesorSchema = mongoose.Schema({
  _id: {
    type: String,
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

// V2 metodos

ProfesorSchema.methods = {
  Crear() {
    let self = this
    return Promise.resolve(self.save())
  }
}


ProfesorSchema.statics = {
  ObtenerPorCorreo({ correo }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOne({ correo }))
    })
  }
}

ProfesorSchema.statics.obtenerTodosProfesores = function(callback) {
  this.model('Profesor').find({}, callback);
}

ProfesorSchema.statics.obtenerProfesorPorCorreo = function(correo_profesor, callback) {
  this.findOne({correo: correo_profesor}, callback)
}

ProfesorSchema.statics.obtenerProfesor = function(id_profesor, callback) {
  this.findOne({_id: id_profesor}, callback)
}

ProfesorSchema.statics.obtenerProfesorPorNombres = function(nombres_profesor, callback) {
  this.findOne({nombres: nombres_profesor}, callback)
}

ProfesorSchema.methods.crearProfesor = function(callback) {
  this.save(callback);
}

module.exports = mongoose.model('Profesor', ProfesorSchema)
