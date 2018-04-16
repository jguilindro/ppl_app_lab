let mongoose = {}
let db = {}
if (process.env.NODE_ENV === 'production' && process.env.SERVIDOR === 'heroku') {
  mongoose = require('mongoose')
  db = require('mongoose')
} else if (process.env.NODE_ENV) {
  db = require('../../databases/mongo/mongo').getDatabaseConnection()
  mongoose = require('mongoose')
}

mongoose.Promise = global.Promise;

const PreguntaSchema = mongoose.Schema({
  _id: {
    type: String,
    'default': require('shortid').generate
  },
  nombre: {
    type: String
  },
  creador: {
    type: String,
    ref: 'Profesor'
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
  subpreguntas: [],
  capitulo: {
    type: String,
    ref: 'Capitulo'
  },
  tiempoEstimado: {
    type: String
  },
  descripcion: {
    type: String
  },
  puntaje: {
    type: Number
  },
  leccionesUsada: [{
    ref: 'Leccion',
    type: String
  }]
},{timestamps: true, versionKey: false, collection: 'preguntas'});

//CRUD
PreguntaSchema.statics.obtenerTodasPreguntas = function(callback) {
  this.find({})
      .populate('capitulo')
      .populate('creador', '_id nombres apellidos')
      .exec(callback);
}

PreguntaSchema.statics.obtenerPregunta = function(id_pregunta, callback) {
  this.findOne({_id: id_pregunta})
      .populate('creador', '_id nombres apellidos')
      .exec(callback);
}

PreguntaSchema.methods.crearPregunta = function(callback) {
  this.save(callback);
}

PreguntaSchema.statics.actualizarPregunta = function(id_pregunta, actualizar, callback) {
  this.update({
    _id: id_pregunta
  }, {
    $set: {
      nombre        : actualizar.nombre, 
      tipoLeccion   : actualizar.tipoLeccion, 
      tipoPregunta  : actualizar.tipoPregunta, 
      capitulo      : actualizar.capitulo, 
      tiempoEstimado: actualizar.tiempoEstimado, 
      puntaje       : actualizar.puntaje, 
      descripcion   : actualizar.descripcion, 
      subpreguntas  : actualizar.subpreguntas}
    },
    callback);
}

PreguntaSchema.statics.eliminarPregunta = function(id_pregunta, callback) {
  this.findOneAndRemove({_id: id_pregunta}, callback);
}

//METODOS APARTE
PreguntaSchema.statics.obtenerPreguntasPorCreador = function(id_creador, callback) {
  this.find({creador: id_creador}, callback);
}

PreguntaSchema.statics.anadirUsadaEnLeccion = function(id_pregunta,id_leccion, callback) {
  this.update({_id: id_pregunta}, {$addToSet: {leccionesUsada: id_leccion}}, callback);
}


module.exports = mongoose.model('Pregunta', PreguntaSchema);
