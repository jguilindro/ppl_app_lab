const MateriaModel = require('../models/materia.model')

module.exports.getAll = (req, res, next) => {
	MateriaModel.getAll()
	.then((materias) => {
		return responses.okGet(res, materias)
	})
	.catch((error) => {
		return responses.serverError(res, error)
	})
}