// Todos los que dicen estaticos no deben depender de ninguna otro documento para funcionar

const mongoose = require('mongoose');
const shortid = require('shortid');
mongoose.Promise = global.Promise;

const LeccionRealtimev2Schema = mongoose.Schema({
   _id: { // estatico
    type: String,
    unique: true,
    'default': require('shortid').generate
  },
  codigo: { type: String },
  paralelo: {
    _id: { type: String },
    nombre: { type: String },
    nombreMateria: { type: String }
  },
  grupos: [{ // sera actualizado al momento de colocar tomar-leccion
    _id: { type: String },
    nombre: { type: String },
    estudiantes: [{
      _id: { type: String },
      nombres: { type: String },
      apellidos: { type: String },
      matricula: { type: String },
      correo: { type: String }
    }]
  }],
  leccion: {
    _id: { type: String },
    creador: { 
      _id: { type: String },
      nombres: { type: String },
      apellidos: { type: String },
      correo: { type: String }
    },  // datos del profesor en texto plano
    nombre: { type: String },
    tiempoEstimado: { type: Number }, // en minutos
    tipo: { type: String }
  },
  moderadoresConectados: [{
    _id: { type: String },
    nombres: { type: String },
    apellidos: { type: String },
    tipo: { type: String },
    nivelPeer: { type: Number },
    correo: { type: String }
  }],
  preguntas: [{
    _id: { type: String },
    nombre: { type: String },
    tiempoEstimado: { type: Number },
    puntaje: { type: Number },
    descripcion: { type: String },
    subpreguntas: [{
      orden: { type: Number },
      puntaje: { type: String },
      contenido: { type: String }
    }],
    tipoPregunta: { type: String }
  }],
  estudiantes: [{ // sera actualizado al momento de colocar tomar-leccion
    _id: { type: String },
    nombres: { type: String },
    apellidos: { type: String },
    matricula: { type: String },
    correo: { type: String },
    conexiones: [{ fecha: Date }],
    desconexiones: [{ fecha: Date }]
  }],
  estudiantesDandoLeccion: [{ // solo hace add
    _id: { type: String },
    socketId: { type: String },
    dispositivo: { type: String, 'default': ' ' }, // sera un json pasado a string. Porque no se sabe que informacion tendra
    nombres: { type: String },
    apellidos: { type: String },
    matricula: { type: String },
    correo: { type: String },
    grupoId: { type: String },
    grupoNombre: { type: String },
    estado: {
      type: String,
      enum: ['ingresando-codigo', 'esperando-empiece-leccion', 'dando-leccion'],
      'default': 'ingresando-codigo'
    }
  }],
  respuestas: [{
    estudianteId: { type: String },
    estudianteNombre: { type: String },
    estudianteApellido: { type: String },
    grupoId: { type: String },
    grupoNombre: { type: String },
    leccion: { type: String },
    paralelo: { type: String },
    pregunta: { type: String },
    preguntaNombre: { type: String },
    descripcion: { type: String },
    subpreguntas: [{
      orden: { type: Number },
      puntaje: { type: String },
      contenido: { type: String },
      respuesta: { type: Number },
      imagen:  { type: Number }
    }],
    orden: { type: Number },
    respuesta: { type: String },
    imagenes: { type: String }
  }],
  fechaInicio: { type: Date },
  fechaFin: { type: Date },
  aumentados: [{
    fecha: { type: Date },
    segundos: { type: Date },
    moderador: { 
      _id: { type: String },
      nombres: { type: String },
      apellidos: { type: String }
    }
  }],
  pausas: [{
    fecha: { type: Date },
    moderador: { 
      _id: { type: String },
      nombres: { type: String },
      apellidos: { type: String }
    }
  }],
  continuadas: [{
    fecha: { type: Date },
    moderador: {
      _id: { type: String },
      nombres: { type: String },
      apellidos: { type: String }
    }
  }],
  estado: {
    type: String,
    enum: ['pendiente', 'sin-empezar', 'tomando', 'pausado', 'terminado', 'calificado'],
    'default': 'pendiente'
  }
},{timestamps: true, versionKey: false, collection: 'leccionesRealtime'})

LeccionRealtimev2Schema.statics.obtenerLecciones = function(){
  let self = this
  return new Promise(function(resolve) {
    resolve(self.find({}))
  })
}

LeccionRealtimev2Schema.methods.crearLeccion = function(){
  let self = this
  return new Promise(function(resolve) {
    resolve(self.save())
  })
}

LeccionRealtimev2Schema.statics.obtenerLeccionPorCodigo = function({ codigo }){
  let self = this
  return new Promise(function(resolve) {
    resolve(self.findOne({ codigo }))
  })
}


module.exports = mongoose.model('LeccionRealtimev2', LeccionRealtimev2Schema)