const os = require('os');

const local = function() {
  if (os.hostname() === 'joelerll-laptop') {
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
    } else if (process.env.NODE_ENV == 'api') {
      console.log('api EMERGENCIA PELIGRO')
      return require('../config/main').mlab_production
    }
  }else if(os.hostname() === 'DESKTOP-H2S89J8'){
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
    } else if (process.env.NODE_ENV == 'api') {
      console.log('api EMERGENCIA PELIGRO')
      return require('../config/main').mlab_production
    }
  }else if(os.hostname() === 'usuario'){
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
    } else if (process.env.NODE_ENV == 'api') {
      console.log('api EMERGENCIA PELIGRO')
      return require('../config/main').mlab_production
    }
  }else if(os.hostname() === 'DESKTOP-Q8KFD4E'){
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
    } else if (process.env.NODE_ENV == 'api') {
      console.log('api EMERGENCIA PELIGRO')
      return require('../config/main').mlab_production
    }
  } else if (os.hostname() === 'srv01appPPL') {
      return require('../config/main').local
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
    } else if (process.env.NODE_ENV == 'api') {
      console.log('api EMERGENCIA PELIGRO')
      return require('../config/main').local_production
    }
  }
}

module.exports = {
  local,
}
