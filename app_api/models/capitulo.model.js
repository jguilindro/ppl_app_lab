const mongoose = require('mongoose');
const shortid = require('shortid');
mongoose.Promise = global.Promise;

const CapituloSchema = mongoose.Schema({
	_id: {
    type: String,
    unique: true,
    'default': require('shortid').generate
	 },
  nombre: {
    type: String
  },
  preguntas:[{
  	pregunta: {
  		type: String
  	}
  }],
  tipo:{
  	type: String,
  	enum: ['estimacion', 'tutorial', 'laboratorio'],
    'default': 'estimacion'
  },
  codigoMateria:{
    type: String
  },
  nombreMateria: {
    type: String
  }
},{timestamps: true, versionKey: false, collection: 'capitulos'});

//CRUD

CapituloSchema.methods.crearCapitulo = function(callback){
	this.save(callback);
}
CapituloSchema.statics.obtenerTodosCapitulos = function(callback){
	this.find({}, callback);
}
CapituloSchema.statics.agregarPregunta = function(id_capitulo, pregunta, callback){
	this.update({_id: id_capitulo}, {$push: {preguntas: pregunta}})
}
CapituloSchema.statics.obtenerCapituloPorNombre = function(nombre_capitulo, callback){
  this.findOne({nombre: nombre_capitulo}, callback);
}
CapituloSchema.statics.obtenerCapitulosPorMateria = function(codigo_materia, callback){
  this.find({codigoMateria: codigo_materia}, callback);
}

module.exports = mongoose.model('Capitulo', CapituloSchema);