const RespuestaModel = require('../models/respuestas.model');
var response  			 = require('../utils/responses');

const co 		 = require('co');
const multer = require('multer');
const path   = require('path');

const storage = multer.diskStorage({
	destination : 'public/imagenes',
	filename    : function(req, file, cb){
		const nombre = file.originalname.split('.')[0];
		cb(null, nombre + '-' + Date.now() + path.extname(file.originalname));
	}
});

const upload = multer({
	storage : storage,
	fileFilter : function(req, file, cb){
		checkFileType(file, cb);
	}
}).single('imagenes');

function checkFileType(file, cb){
	//Allowed ext
	const filetypes = /jpeg|jpg|png/;
	//Test ext
	const extname  = filetypes.test( path.extname(file.originalname).toLowerCase() );
	//Test mimetype
	const mimetype = filetypes.test(file.mimetype);
  
	if( extname && mimetype ){
		return cb(null, true);
	}else { 
		return cb('Error: Images Only!');
	}
}

const subirImagen = (req, res, next) => {
	upload(req, res, (err) => {
		if (err) {
			return response.serverError(res);
		} else { 
			if ( req.file == undefined ) {
				return response.serverError(res);
			}
			const path = '/imagenes/' + req.file.filename;
			return response.creado(res, path);
		}
	});
};


const crearRespuesta = (req, res) => {
  console.log(req.body)
	let arraySubrespuestas = JSON.parse(req.body.arraySubrespuestas);
	let resp = new RespuestaModel({
		estudiante 	: req.body.estudiante,
		leccion 		: req.body.leccion,
		pregunta		: req.body.pregunta,
		paralelo		: req.body.paralelo,
		grupo 			: req.body.grupo,
		contestado 	: req.body.contestado,
		respuesta 	: req.body.respuesta,
		imagenes 		: req.body.imagenes,
		calificacion: 0,
		feedback 		: '',
		subrespuestas : arraySubrespuestas
	});
	co(function* (){
		let respuesta = yield  obtenerRespuestaDeEstudianteP(req.body.leccion, req.body.pregunta, req.body.estudiante);
		if( respuesta == null ){
			resp.crearRespuesta( err => {
				if(err) {
          console.log(err)
          return response.serverError(res)
        }
				return response.creado(res);
			});
		}else{
			return response.serverError(res);	
		}
	}).catch( fail => {
    console.log(fail)
		return response.serverError(res);
	});
}

const anadirSubrespuesta = (req, res) => {
	const id_leccion 				 = req.body.leccion;
	const id_pregunta				 = req.body.pregunta;
	const id_estudiante 		 = req.body.estudiante;
	const arraySubrespuestas = JSON.parse(req.body.subrespuestas);

	RespuestaModel.anadirSubrespuesta(id_leccion, id_pregunta, id_estudiante, arraySubrespuestas, (err, doc) => {
		if(err) return response.serverError(res);
		return response.okActualizado(res, doc);
	});
}

const obtenerRespuestasPorGrupoAPregunta = (req, res) => {
	RespuestaModel.obtenerRespuestasPorGrupoAPregunta(req.body.leccion, req.body.pregunta, req.body.grupo, (err, respuesta) => {
		if(err) return response.serverError(res);
		return response.ok(res, respuesta);
	})
}

const obtenerRespuestasPorGrupoAPreguntaGet = (req, res) => {
	RespuestaModel.obtenerRespuestasPorGrupoAPregunta(req.params.id_leccion, req.params.id_pregunta, req.params.id_grupo, (err, respuesta) => {
		if(err) return response.serverError(res);
		return response.ok(res, respuesta);
	})
}

const obtenerRespuestaDeEstudiante = (req, res) => {
	RespuestaModel.obtenerRespuestaDeEstudiante(req.params.id_leccion, req.params.id_pregunta, req.params.id_estudiante, (err, doc) => {
		if(err) return response.serverError(res);
		return response.ok(res, doc);
	})
}

const actualizarRespuesta = (req, res) => {
	RespuestaModel.actualizarRespuesta(req.params.id_respuesta, req.body.respuesta, (err, doc) => {
		if (!doc.nModified) return response.mongoError(res, 'La respuesta no existe');
		if(err) return response.serverError(res);
		return response.okActualizado(res);
	});
}

const obtenerRespuestaPorId = (req, res) => {
	RespuestaModel.obtenerRespuestaPorId(req.params.id_respuesta, (err, respuesta) => {
		if (err) return response.serverError(res);
    return response.ok(res, respuesta);
	})
}

const calificarRespuestaGrupal = (req, res) => {
	RespuestaModel.calificarRespuestaGrupal(req.params.id_leccion, req.params.id_pregunta, req.params.id_grupo, req.body.calificacion, req.body.feedback, (err, doc) => {
		if (!doc.nModified) return response.mongoError(res, 'La respuesta no existe');
		if(err) return response.serverError(res);
		return response.okActualizado(res);
	});
}

const calificarSub = (req, res) => {
	const id_leccion 				 = req.params.id_leccion;
	const id_pregunta 			 = req.params.id_pregunta;
	const id_grupo 					 = req.params.id_grupo;
	const orden_pregunta 		 = req.body.ordenPregunta;
	const calificacion_nueva = req.body.calificacionNueva;
	const feedback_nuevo 		 = req.body.feedbackNuevo;

	RespuestaModel.calificarSub(id_leccion, id_pregunta, id_grupo, orden_pregunta, calificacion_nueva, feedback_nuevo, (err, doc) => {
		if (!doc.nModified) return response.mongoError(res, 'La respuesta no existe');
		if(err) return response.serverError(res);
		return response.okActualizado(res);
	});

};

module.exports = {
	crearRespuesta,
	anadirSubrespuesta,
	obtenerRespuestasPorGrupoAPregunta,
	obtenerRespuestaDeEstudiante,
	actualizarRespuesta,
	obtenerRespuestaPorId,
	calificarRespuestaGrupal,
	obtenerRespuestasPorGrupoAPreguntaGet,
	calificarSub,
	subirImagen
}


function obtenerRespuestaDeEstudianteP(idLeccion, idPregunta, idEstudiante){
	return new Promise( (resolve, reject) => {
		RespuestaModel.obtenerRespuestaDeEstudiante(idLeccion, idPregunta, idEstudiante, (err, doc) => {
			if(err) return reject( new Error('No se pudo obtener el registro'));
			return resolve(doc);
		});
	});
}