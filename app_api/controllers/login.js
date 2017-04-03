var EstudianteModel = require('../models/estudiante.model')
var passport = require('passport');
function login(req, res) {
  require('../config/passport.estudiante')(passport)
  res.send('hjoel')
}

module.exports = {
  login
}
