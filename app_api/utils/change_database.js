const os = require('os');

const local = function() {
  if (os.hostname() === 'joelerll') {
    console.log('local')
    return require('../config/main').mlab //local
  } else {
    console.log('mlab')
    return require('../config/main').mlab
  }
}

const session = function(){
  if (os.hostname() === 'joelerll') {
    console.log('sesion local')
    return require('../config/main').mlab_sesiones //local_sesiones
  } else {
    console.log('sesion mlab')
    return require('../config/main').mlab_sesiones
  }
}

module.exports = {
  local,
  session
}
