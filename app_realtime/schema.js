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
  paralelo: {
    id: { type: String },
    nombre: { type: String },
    nombreMateria: { type: String }
  },
  leccion: {  // estatico
    id: { type: String },
    creador: { 
      id: { type: String },
      nombres: { type: String },
      apellidos: { type: String },
      correo: { type: String }
    },  // datos del profesor en texto plano
    nombre: { type: String },
    tiempoEstimado: { type: Number }, // en minutos
    tipo: { type: String }
  },
  moderadoresConectados: [{
    id: { type: String },
    nombres: { type: String },
    apellidos: { type: String },
    tipo: { type: String },
    nivelPeer: { type: Number },
    correo: { type: String }
  }],
  preguntas: [{
    id: { type: String },
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
  estudiantes: [{ // estatico
    id: { type: String },
    nombres: { type: String },
    apellidos: { type: String },
    matricula: { type: String },
    correo: { type: String },
    conexiones: [{ fecha: Date }],
    desconexiones: [{ fecha: Date }]
  }],
  estudiantesDandoLeccion: [{ // solo hace add
    id: { type: String },
    socketId: { type: String },
    dispositivo: { type: String, 'default': ' ' }, // sera un json pasado a string. Porque no se sabe que informacion tendra
    nombres: { type: String },
    apellidos: { type: String },
    matricula: { type: String },
    correo: { type: String },
    grupoId: { type: String },
    grupoNombre: { type: String },
  }],
  respuestas: [{

  }],
  fechaInicio: { type: Date },
  fechaFin: { type: Date },
  aumentados: [{
    fecha: { type: Date },
    segundos: { type: Date },
    moderador: { }
  }],
  pausas: [{
    fecha: { type: Date },
    moderador: { 
      id: { type: String },
      nombres: { type: String },
      apellidos: { type: String }
    }
  }],
  continuadas: [{
    fecha: { type: Date },
    moderador: {
      id: { type: String },
      nombres: { type: String },
      apellidos: { type: String }
    }
  }],
  estado: {
    type: String,
    enum: ['sin-empezar', 'tomando', 'pausado', 'terminado', 'calificado'], // 'pendiente' no esta porque este se crea solo cuando el profesor da click en tomar-leccion
    'default': 'sin-empezar'
  }
})

module.exports = mongoose.model('LeccionRealtimev2', LeccionRealtimev2);