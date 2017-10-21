var app = require('./app')
var server = require('http').Server(app)

server.on('error', onError)
server.on('listening', onListening)
server.listen(app.get('port'))

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' correr en otro puerto, este puerto requiere permisos de root');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' el puerto ya esta en uso client');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'puerto  ' + addr.port;
  if (process.env.NODE_ENV !== 'testing') {
    console.log('server corriendo en ' + bind)
  }
  
}