module.exports = (app) => {

  app
  .route('/login')
  .post((req, res) => {
    // si no envio nada, pedir el token(enviar datos de estudiante ademas del paralelo y del grupo)
  })

  app
  .route('/perfil')
  .get((req, res) => {
    // lecciones con calificacion
    // datos estudiante
    // leccion realtime estados
    // 'paralelo-no-esta-dando-leccion'
    // 'redirigirlo-directamente'
    // 'tiene-que-esperar-a-que-empiece-la-leccion'
    // 'al-ingresar-el-codigo-redirigirlo-directamente'
    // 'tiene-que-ingresar-el-codigo'
    // leccion realtime si existen datos (preguntas y respuestas)
  })

  app
  .route('/verLeccion/:leccionId')
  .get((req, res) => {
    
  })

  app
  .route('/verificarCodigo/:codigo')
  .post((req, res) => {
    
  })

  app
  .route('/leccionRealtime/:paraleloId') // la leccion que esta dando el paralelo
  .get((req, res) => {

  })

  app
  .route('/responder')
  .post((req, res) => {
    // leccionId, preguntaId, estudianteId
    // mandar un array de respuestas
  })

  app
  .route('/imagen')
  .post((req, res) => {

  })

  // REALTIME LECCION
  // /api/estudiantes/leccion/datos_leccion
  // /api/respuestas/
  // /api/respuestas/imagen
  // // coregir respuesta
  // /api/session/usuario_conectado
  // /api/respuestas/buscar/leccion/" + idLeccion + "/pregunta/" + pregunta._id + "/estudiante/" +idEstudiante

}