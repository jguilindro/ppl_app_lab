var passport = require('passport');
LocalStrategy = require('passport-local').Strategy;
module.exports = function( passport ) {
  passport.use('estudiante-local' ,new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'clave'
  },
    function(username, password, done) {
      console.log('joel')
      retrun done(null, true, {nombre: 'joel'})
      // Estudiante.getPorCorreo(username, function(err, estudiante) {
      //   if ( !estudiante ) {
      //     return done(null, false, { status: 404, success: false, message: 'estudiante no existe' });
      //   }
      // })
    }
  ));
}
