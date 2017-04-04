var EstudianteModel = require('../models/estudiante.model');
var ProfesorModel = require('../models/profesor.model');
// TODO: usar async
function login(req, res) {
  // comprobacion en la base de datos si existe este usuario
  EstudianteModel.obtenerEstudiantePorCorreo(req.body.username, (err, estudiante) => {
    if (err) return res.redirect('/')
    if (!estudiante) {
      ProfesorModel.obtenerProfesorPorCorreo(req.body.username, (err, profesor) => {
        if (err) return res.redirect('/');
        if (!profesor) return res.redirect('/');
        req.session.correo = req.body.username
        req.session.login = true;
        return res.redirect('/profesores')
      })
    } else {
      req.session.correo = req.body.username
      req.session.login = true;
      return res.redirect('/estudiantes')
    }
  })
}

function logout(req, res) {
  req.session.destroy(function(err) {
		if (err) {
			console.log(err)
		}
    console.log(req.session)
    res.redirect('/')
	})
}

function obtenerUsuarioLoggeado(req, res) {

}

module.exports = {
  login,
  logout
}
