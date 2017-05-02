var jwt = require('jsonwebtoken');
var j = jwt.sign({
  profesor,
  exp: parseInt(expiracion.getTime() / 1000),
}, 'asd' );
