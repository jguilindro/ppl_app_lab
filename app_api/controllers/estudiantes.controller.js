/*
* Estudiante metodos basicos
*/
const obtenerTodosEstudiantes = (req, res) => {
  res.send('todos Estudiantes');
}

const crearEstudiante = (req, res) => {
	res.send('crearEstudiante');
}

const actualizarEstudiante = (req, res) => {
	res.send('actualizarEstudiante');
}

const actualizarEstudianteNoDatosPrivados = (req, res) => {
	res.send(`actualizarEstudianteNoDatos ${req.params.id_estudiante}`)
}

const eliminarEstudiante = (req, res) => {
	res.send('eliminarEstudiante');
}

const obtenerEstudiante = (req, res) => {
	res.send(`obtenerEstudiante ${req.params.id_estudiante}`);
}

/*
* Lecciones
*/
const obtenerLecciones = (req, res) => {
	res.send(`obtenerLecciones`)
}

const anadirLeccion = (req, res) => {
	res.send(`anadirLeccion ${req.params.id_leccion} ${req.params.calificacion}`)
}

const editarLeccion = (req, res) => {
	res.send(`editar ${req.params.id_leccion} ${req.params.calificacion}`)
}

const eliminarLeccion = (req, res) => {
	res.send(`elimnar leccion ${req.params.id_leccion}`)
}

/*
* Grupo
*/
const obtenerGrupo = (req, res) => {
	res.send(`obtenerGrupo`)
}
const anadirGrupo = (req, res) => {
	res.send(`anadirGrupo ${req.params.id_grupo}`)
}

const eliminarGrupo = (req, res) => {
	res.send(`eliminarGrupo ${req.params.id_grupo}`)
}

/*
* Profesor
*/
const anadirProfesor = (req, res) => {
	res.send(`anadirGrupo ${req.params.id_profesor}`)
}

const editarProfesor = (req, res) => {
	res.send(`editarProfesor ${req.params.id_profesor}`)
}

const eliminarProfesor = (req, res) => {
	res.send(`eliminarProfesor ${req.params.id_profesor}`)
}

/*
* Eliminar Paralelo
*/
const anadirParalelo = (req, res) => {
	res.send(`anadirParalelo ${req.params.id_paralelo}`)
}

const eliminarParalelo = (req, res) => {
	res.send(`eliminarParalelo ${req.params.id_paralelo}`)
}

module.exports = {
	obtenerTodosEstudiantes,
	crearEstudiante,
	actualizarEstudiante,
	actualizarEstudianteNoDatosPrivados,
	eliminarEstudiante,
	obtenerEstudiante,
	// lecciones
	obtenerLecciones,
	anadirLeccion,
	editarLeccion,
	eliminarLeccion,
	// grupo
	obtenerGrupo,
	anadirGrupo,
	eliminarGrupo,
	// profesor
	anadirProfesor,
	eliminarProfesor,
	// paralelo
	anadirParalelo,
	eliminarParalelo,
}