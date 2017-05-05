const os = require('os');

const local = function() {
  if (os.hostname() === 'joelerll') {
    if (process.env.NODE_ENV == 'development') {
      console.log('development local')
      return require('../config/main').local //local
    } else if (process.env.NODE_ENV == 'production') {
      console.log('production local')
      return require('../config/main').local_production
    } else if (process.env.NODE_ENV == 'production-test') {
      console.log('production-test local')
      return require('../config/main').local
    } else if (process.env.NODE_ENV == 'testing') {
      console.log('testing local')
      return require('../config/main').local_testing
    }
  } else {
    if (process.env.NODE_ENV == 'development') {
      console.log('development mlab')
      return require('../config/main').mlab //local
    } else if (process.env.NODE_ENV == 'production') {
      console.log('production mlab')
      return require('../config/main').mlab_production
    } else if (process.env.NODE_ENV == 'production-test') {
      console.log('production-test mlab')
      return require('../config/main').mlab
    } else if (process.env.NODE_ENV == 'testing') {
      console.log('testing mlab')
      return require('../config/main').mlab_testing
    }
  }
}

module.exports = {
  local,
}
