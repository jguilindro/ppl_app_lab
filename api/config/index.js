module.exports = {
  logger () {
    if (process.env.NODE_ENV === 'testing') {
      return {}
    } else {
      return { logger: true }
    }
  },
  URL_DB () {
    if (process.env.NODE_ENV === 'testing') {
      return 'mongodb://localhost/ppl_testing'
    } else if (process.env.NODE_ENV === 'development') {
      return 'mongodb://localhost/ppl_development_v2'
    } else if (process.env.NODE_ENV === 'production') { 
      return 'mongodb://localhost/ppl_production_v2'
    } else {
      console.error('No se ha especificado un entorno de variable')
      process.exit(1)
    }
  },
  PORT: process.env.PORT || 8001
}