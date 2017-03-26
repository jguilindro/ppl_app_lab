const GrupoModel = require('../models/grupo.model')

const obtenerTodosGrupos = (req, res) => {
	GrupoModel.obtenerTodosGrupos((err, grupos) => {
		if (err) return res.send(`error`);
		res.send(grupos)
	})
}

const crearGrupo = (req, res) => {
	let grupo = new GrupoModel({
		nombre: req.body.nombre
	})
	grupo.crearGrupo((err) => {
		if (err) return res.send(`error`);
		res.send(`crear grupo ${grupo}`);
	})
}

const editarGrupo = (req, res) => {
	res.send('editarGrupo');
}

const eliminarGrupo = (req, res) => {
	GrupoModel.eliminarGrupo(req.params.id_grupo, (err, doc, result) => {
		if (!doc) {
			return res.send('no existe grupo con id');
		}
		if (err) {
			return res.send(`error`);	
		}
		res.send('grupo eliminado');
	})
}

const obtenerGrupo = (req, res) => {
	res.send('obtenerGrupo')
}

module.exports = {
	obtenerTodosGrupos,
	crearGrupo,
	editarGrupo,
	eliminarGrupo,
	obtenerGrupo,
}