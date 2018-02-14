const local = function() {
  if (process.env.NODE_ENV == 'development:cas' || process.env.NODE_ENV == 'debug' || process.env.NODE_ENV == 'development') {
    return require('../config/main').local //local
  } else if (process.env.NODE_ENV == 'production') {
    return require('../config/main').local //local
  } else if (process.env.NODE_ENV === 'testprofesores') {
    return "mongodb://localhost/ppltestprofesores"
  }
}

module.exports = {
  local,
}