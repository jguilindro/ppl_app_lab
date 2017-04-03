function login(req, res) {
  // comprobacion en la base de datos si existe este usuario
	if (req.body.username == 'joel' && req.body.password == '123'){
		req.session.login = true;
		req.session.username = req.body.username
		res.redirect('/profesores')
	} else {
		res.redirect('/')
	}
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

module.exports = {
  login,
  logout
}
