// SERVER MODES
//   production .- usado en el servidor
//   development .- usado para desarrollo local
//   testing .- usado para los test automaticos
//   development:cas .- usado para pruebas locales del CAS

const { app, server } = require('./app')

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }
  const port = process.env.PORT
  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`
  switch (error.code) {
    case 'EACCES':
      console.info(`${bind} correr en otro puerto, este puerto requiere permisos de root`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.info(`${bind} el puerto ya esta en uso client`)
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? `Pipe ${addr}`
    : `Port ${addr.port}`
  if (process.env.NODE_ENV !== 'testing') {
    console.info(`server corriendo en  ${bind}`)
  }
}

server.on('error', onError)
server.on('listening', onListening)
server.listen(app.get('port'))
