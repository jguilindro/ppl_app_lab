const mongoose = require('mongoose');
const shortid = require('shortid');
mongoose.Promise = global.Promise;
const GrupoModel = require("./grupo.model");

const respuestasSchema = mongoose.Schema({
	_id: {
		type: String,
		'default' : shortid.generate
	},
  estudiante: {
    type: String,
    ref: 'Estudiante'
  },
  leccion: {
    type: String,
    ref: 'Leccion'
  },
  pregunta: {
    type: String,
    ref: 'Pregunta'
  },
  paralelo: {
    type: String,
    ref: 'Paralelo'
  },
  grupo: {
    type: String,
    ref: 'Grupo'
  },
	contestado: {
    type: Boolean,
    'default': false
  },
  respuesta: {
    type: String
  },
  fechaEmpezado: {
    type: Date
  },
  fechaTerminado: {
    type: Date
  },
  calificacion: {
    type: Number
  },
	feedback: {
		type: String
	},
  imagenes:{
    type: String
  },
  calificada : {
    type : Boolean
  },
  subrespuestas: [{
    respuesta     : { type : String },
    ordenPregunta : { type : Number },
    feedback      : { type : String },
    calificacion  : { type : Number },
    imagen        : { type : String },
    calificada    : { type : Boolean }
  }]
}, {versionKey: false, timestamps: true, collection: 'respuestas'})

respuestasSchema.methods.crearRespuesta = function(callback){
  this.save(callback);
}

respuestasSchema.statics.anadirSubrespuesta = function(id_leccion, id_pregunta, id_estudiante, arraySubrespuestas, callback){
  this.update({
    leccion   : id_leccion,
    pregunta  : id_pregunta,
    estudiante: id_estudiante
  }, {
    $set: {
      subrespuestas : arraySubrespuestas
    }
  }, callback);
}

respuestasSchema.statics.obtenerRespuestasPorGrupoAPregunta = function(id_leccion, id_pregunta, id_grupo, callback){
  this.find({$and: [{leccion:id_leccion}, {pregunta:id_pregunta}, {grupo:id_grupo}]}, callback);
}

respuestasSchema.statics.obtenerRespuestaDeEstudiante = function(id_leccion, id_pregunta, id_estudiante, callback){
  this.findOne({$and: [{leccion:id_leccion}, {pregunta:id_pregunta}, {estudiante:id_estudiante}]}, callback);
}

respuestasSchema.statics.obtenerRespuestasDeEstudianteRecalificacion = function(id_leccion, id_estudiante, callback){
  //this.find({$and: [{leccion:id_leccion}, {estudiante:id_estudiante}]}, callback);
  this.find({$and: [{leccion:id_leccion}, {estudiante:id_estudiante}]})
        .populate('leccion')
        .populate('estudiante')
        .populate('pregunta')
        .exec(callback);
}
respuestasSchema.statics.obtenerRespuestasDeEstudiante = function(id_leccion, id_estudiante, callback){
  this.find({$and: [{leccion:id_leccion}, {estudiante:id_estudiante}]}, callback);
}

respuestasSchema.statics.actualizarRespuesta = function(id_respuesta, actualizar, callback){
  this.update({_id:id_respuesta}, {$set : {respuesta: actualizar}}, callback);
}

respuestasSchema.statics.obtenerRespuestaPorId = function(id_respuesta, callback){
  this.findOne({_id: id_respuesta}, callback);
}

respuestasSchema.statics.obtenerRespuestaPorGrupo = function(grupoId, leccionId, callback){
  this.find({$and: [{ grupo: grupoId }, { leccion : leccionId }]}, callback)
}

respuestasSchema.statics.calificarRespuestaGrupal = function(id_leccion, id_pregunta, id_grupo, calificacion_nueva, feedback_nuevo, callback){
  //Busca en la colección a todas las respuestas del grupo dado a la pregunta dada de la lección dada
  //Actualiza el valor de la calificación de todas las respuestas encontradas (todas las respuestas del grupo) a valor de la nueva calificación
  //Actualiza el valor del feedback
  this.update({
    leccion : id_leccion, 
    pregunta: id_pregunta, 
    grupo   : id_grupo
  }, {
    $set: {
      calificacion: calificacion_nueva, 
      feedback    : feedback_nuevo,
      calificada  : true
    }
  }, { multi: true }, callback);
}

respuestasSchema.statics.calificarSub = function(id_leccion, id_pregunta, id_grupo, orden_pregunta, calificacion_nueva, feedback_nuevo, callback){
  this.update({
    leccion  : id_leccion,
    pregunta : id_pregunta,
    grupo    : id_grupo,
    "subrespuestas.ordenPregunta" : orden_pregunta
  }, {
    $set: {
      "subrespuestas.$.calificacion" : calificacion_nueva,
      "subrespuestas.$.feedback"     : feedback_nuevo,
      "subrespuestas.$.calificada"   : true,
    }
  }, { multi : true}, callback);
}

/*
  Devuelve un array de las calificaciones de todos los grupos a una pregunta de una lección
*/
/*respuestasSchema.statics.estadisticasPregunta = function(id_leccion, id_pregunta, array_estudiantes, callback){
  console.log(array_estudiantes)
  this.aggregate([
    { 
      $match : { 
        leccion  : id_leccion,
        pregunta : id_pregunta
      } 
    },
    { 
      $sort : { grupo : 1 }
    },
    {
      $group : {
        _id          : "$grupo",
        calificacion : { $first : "$calificacion" },
        //cal          : { $first : "$subrespuestas.calificacion"}
        cal : { 
          $cond : {
            if   : { 
              estudiante : { $in : [1, 2]}
            },
            then : { $first : "$subrespuestas.calificacion"}
          }
        }
      }
    }
  ])
  .exec(function(err, docs){
    GrupoModel.populate(docs, {path : "_id", select: "nombre"}, callback)
  })
}*/

/* Obtengo las respuestas solo de los estudiantes calificados */
respuestasSchema.statics.obtenerRespuestasCalificadas = function(id_leccion, array_estudiantes, callback){
  this.find({
    leccion    : id_leccion,
    estudiante : { $in : array_estudiantes}
  }, callback);
}

module.exports = mongoose.model('Respuesta', respuestasSchema);
