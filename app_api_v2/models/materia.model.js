module.exports.getAll = () => {
	return new Promise((resolve, reject) => {
		db.from('materias')
			.select()
			.then((materias) => {
				resolve(materias)
			})
			.catch((error) => {
				logger.info(error)
        logger.error(`Materia model Error ${error}`)
				reject(error)
			})
	})
	
}