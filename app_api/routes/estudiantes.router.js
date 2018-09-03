/**
* @apiDefine MySuccess
* @apiSuccess {string} firstname The users firstname.
* @apiSuccess {number} age The users age.
*/
var authApi = require('../config/auth.api')
var router = require('express').Router();
const EstudiantesController = require('../controllers/estudiantes.controller');

// Estudiante CRUD
/**
  * @api {get} estudiantes Todos Estudiantes
  * @apiName ObteneEstudiantes
  * @apiGroup Estudiantes
  * @apiPermission Estudiantes Profesores
  * @apiDescription Obtener todos los estudiantes
**/
router.get('/',authApi.estudiante, EstudiantesController.obtenerTodosEstudiantes);

/**
  * @api {get} estudiantes/:id_estudiante Obtener un estudiante
  * @apiName ObteneEstudiante
  * @apiGroup Estudiantes
  * @apiPermission Estudiantes Profesores
  *
  * @apiParam { String } id_estudiante Estudiante id
  *
  *
  *
  * @apiSuccess {String} _id   Id unico estudiante
  * @apiSuccess {String} nombres
  * @apiSuccess {String} apellidos
  * @apiSuccess {String} matricula
  * @apiSuccess {String} correo
  * @apiSuccess {Object[]} lecciones Todas la lecciones que ha dado
  * @apiSuccess {Boolean} lecciones.calificado Si ya fue calificada esa leccion
  * @apiSuccess {String} lecciones.leccion id de la leccion
  * @apiSuccess {Boolean} codigoIngresado Si ya ingreso el codigo en una leccion
  * @apiSuccess {dandoLeccion} dandoLeccion Despues de ingresar el codigo ya esta dando la leccion
  * @apiSuccess {Boolean} esperandoLeccion ELIMINARLO, cambiado por bloqueadoLeccion
  * @apiSuccess {Number} calificacion La calificacion por la leccion
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 200 OK
  *   {
  *     "_id" : "B1-LJJGqJ-",
  *      "updatedAt" : ISODate("2017-07-06T16:25:20.035Z"),
  *      "createdAt" : ISODate("2017-05-05T14:40:29.549Z"), // eliminar esto
  *      "nombres" : "GEOVANNY ANDRES",
  *      "apellidos" : "ZAMBRANO MACIAS",
  *      "matricula" : "201411684",
  *      "correo" : "geozamp@espol.edu.ec",
  *      "lecciones" : [
  *        {
  *          "calificado" : false,
  *          "leccion" : "r1xkcYyeW",
  *          "fechaEmpezado" : ISODate("2017-05-09T21:32:49.000Z"), // eliminarlo
  *          "_id" : ObjectId("591235818c561100044562e8") // eliminarlo
  *        },
  *        {
  *          "calificado" : true,
  *          "leccion" : "r1keU7flb",
  *          "fechaEmpezado" : ISODate("2017-05-11T19:38:26.000Z"),
  *          "_id" : ObjectId("5914bdb2bfd9960004a462e2"),
  *          "calificacion" : 83.33
  *        },
  *      ],
  *      "codigoIngresado" : false,
  *      "esperandoLeccion" : true,
  *      "dandoLeccion" : false
  *   }
  *
  * @apiSampleRequest off
**/
router.get('/:id_estudiante', EstudiantesController.obtenerEstudiante);
// authApi.estudiante,
/**
  * @api {post} estudiantes Crear un estudiante
  * @apiName CrearEstudiante
  * @apiGroup Estudiantes
  *  @apiUse MySuccess
**/
router.post('/', authApi.profesor, EstudiantesController.crearEstudiante);

/**
  * @api {put} estudiantes/calificar/leccion/:id_leccion/estudiante/:id_estudiante Calificar leccion de estudiante
  * @apiName CalificarLeccion
  * @apiGroup Estudiantes
  * @apiParamExample {json} Request-Example:
  *     {
  *       "_id": "B1-gxdLCJ-"
  *     }
**/
router.put('/calificar/leccion/:id_leccion/estudiante/:id_estudiante', authApi.profesor, EstudiantesController.calificarLeccion)

/**
  * @api {get} estudiantes/tomar_leccion/:codigo_leccion Tomar Leccion Estudiante
  * @apiName CalificarLeccion
  * @apiGroup Estudiantes
  * @apiDescription Usado cuando el estudiante esta en la pagina tomar-leccion.
  * Toma el codigo y devuelve los parametros para validar su estado en la leccion
  *
**/
router.get('/tomar_leccion/:codigo_leccion', authApi.estudiante, EstudiantesController.tomarLeccion)

/**
  * @api {get} estudiantes/leccion/datos_leccion Obtener preguntas y respuestas de leccion
  * @apiName CalificarLeccion
  * @apiGroup Estudiantes
  * @apiDescription Obtener la leccion que esta dando el estudiante
  *
**/
router.get('/leccion/datos_leccion', authApi.estudiante,EstudiantesController.leccionDatos)
module.exports = router;
