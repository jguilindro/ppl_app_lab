const LeccionesController = require('../controllers/lecciones.controller')
const LeccionModel			  = require('../models/leccion.model')

const Leccion 	= new LeccionModel(logger, db)		//Instancia del Modelo
const Lecciones = new LeccionesController(logger, Leccion, responses)	//Instancia del Controller


module.exports = (app) => {
	app.route('/lecciones/')
		.get( (req, res) => {
			Lecciones.getAll()
				.then( respuesta => {
					res.status(respuesta.codigo_estado)
					res.json(respuesta)
					return res
				})
				.catch( error => {
					logger.info(error)
          logger.error(`Lecciones Router Error ${error}`)
          res.status(error.codigo_estado)
          res.json(error.estado)
          return res
				})
		});

	app.route('/lecciones/paralelos')
		 .get( (req, res) => {
		 		const paralelos = req.query.array;
		 		Lecciones.getLeccionesDeParalelos(paralelos)
		 			.then( respuesta => {
		 				res.status(respuesta.codigo_estado)
						res.json(respuesta)
						return res
		 			})
		 			.catch( error => {
		 				logger.info(error)
	          logger.error(`Lecciones Router Error ${error}`)
	          res.status(error.codigo_estado)
	          res.json(error.estado)
	          return res
		 			});
		 });

	app.route('/lecciones/:id')
		 .get( (req, res) => {
		 		const idLeccion = req.params.id;
		 		Lecciones.getById(idLeccion)
		 			.then( respuesta => {
		 				res.status(respuesta.codigo_estado)
						res.json(respuesta)
						return res
		 			})
		 			.catch( error => {
		 				ogger.info(error)
	          logger.error(`Lecciones Router Error ${error}`)
	          res.status(error.codigo_estado)
	          res.json(error.estado)
	          return res
		 			});
		 });
}