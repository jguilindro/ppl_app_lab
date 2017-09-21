/**
 * @apiDefine UserNotFoundError
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */

var router = require('express').Router();
var CalificacionController = require('../controllers/calificacion.controller');

router.post('/csv', CalificacionController.csv);
router.post('/', CalificacionController.crearRegistro);


/**
  * @api {get} calificaciones/:id_leccion/:id_grupo Obtener Calificacion
  * @apiVersion 0.0.0
  * @apiName ObtenerCalificaion
  * @apiGroup Calificaciones
  * @apiPermission Estudiantes profesores
  *
  * @apiDescription Todas las calificaciones
  *
  * @apiParam { String } id_leccion Leccion
  * @apiParam { String } id_grupo Grupo
  *
  * @apiExample Example usage:
  * curl -i http://localhost:8000/calificaciones/:id_leccion/:id_grupo
  * @apiSuccess { Number }   _id            id del objeto calificacion
  *
  * @apiUse UserNotFoundError
**/
router.get('/:id_leccion/:id_grupo', CalificacionController.obtenerRegistro);

router.put('/:id_leccion/:id_grupo', CalificacionController.anadirParticipante);
router.put('/calificar/:id_leccion/:id_grupo', CalificacionController.calificar);


router.get('/:id_leccion', CalificacionController.obtenerRegistroPorLeccion);
//router.get('/:id_grupo' , CalificacionController.obtenerRegistroPorGrupo);
//router.get('/registros', CalificacionController.obtenerRegistroParalelo);

router.put('/:id_grupo', CalificacionController.anadirNombreGrupo);


router.get('/profesores/registros/todos', CalificacionController.obtenerCalificaciones);

router.put('/recalificar/leccion/:id_leccion/grupo/:id_grupo', CalificacionController.recalificar);


module.exports = router;
