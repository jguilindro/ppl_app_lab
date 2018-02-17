// https://stackoverflow.com/questions/14626636/how-do-i-shutdown-a-node-js-https-server-immediately

module.exports = function({ io, co, db, logger, timer  }) { // , co, logger, db, timer
  const Socket = io.of('/leccion')
  let sockets = [] // socket por leccion [{ socketId, socket, usuarioId, paraleloId }] leccionId
  let nextSocketId = 0
  Socket.on('connection', function(socket) {
    let socketId = nextSocketId++
    sockets.push({ socketId, socket })
  
    socket.on('comenzar-leccion', function({ leccionId, paraleloId, fechaInicioTomada, tiempoEstimado, usuarioId }) { // comenzar leccion
      timer.run({ accion: 'comenzar', socket, Socket, leccionId: leccionId, paraleloId: paraleloId, fechaInicioTomada: fechaInicioTomada, tiempoEstimado: tiempoEstimado, usuarioId: usuarioId })
    })
    socket.on('terminar-leccion', function({ leccionId, paraleloId, usuarioId }) { // parar leccion
      timer.terminar({ Socket,  leccionId: leccionId, paraleloId: paraleloId, usuarioId: usuarioId })
    })
    socket.on('aumentar-tiempo-leccion', function() { // aumentar tiempo

    })
    socket.on('pausar-leccion', function() { // pausar leccion

    })
    socket.on('continuar-leccion', function() { // continuar leccion

    })
    socket.on('respuesta-estudiante', function() { // respuesta estudiante

    })
    socket.on('usuario', function({ paraleloId, usuarioId }) { // usuario
      const index = sockets.findIndex(obj => obj.socketId == socketId)
      sockets[index]['paraleloId'] = paraleloId
      sockets[index]['usuarioId'] = usuarioId
      socket.join(`${paraleloId}`)
    })
    socket.on('reconectar-estudiante', function() { // reconectar estudiante
      // socket.destroy()
    })
    socket.on('reconectar-profesor', function() { // reconectar profesor
      
    })
    socket.on('disconnect', function() {
      let socketDesconectado = sockets.find(socketObjeto => socketId == socketObjeto.socketId)
      sockets = sockets.filter(socketObjeto => socketId != socketObjeto.socketId)
      if (socketDesconectado) {
        // let socketIdReal = socketDesconectado['socket']['id'].split('#')[1]
        delete socketDesconectado['socket'] // .destroy() .close() .disconnect(0) .close()
        delete socketDesconectado
        console.log(Object.keys(io.sockets.connected).length)
      }
    })
    socket.once('close', function () {
      // console.log('socket', socketId, 'closed')
      // delete sockets[socketId]
    })
    socket.on('tiempo-restante-leccion', function({ leccionId }) {
      // console.log('socket', socketId, 'closed')
      // // sockets[socketId].destroy()
      // delete sockets[socketId]
    })
  })
}

// // Count down from 10 seconds
// (function countDown (counter) {
//   console.log(counter);
//   if (counter > 0)
//     return setTimeout(countDown, 1000, counter - 1);

//   // Close the server
//   server.close(function () { console.log('Server closed!'); });
//   // Destroy all open sockets
//   for (var socketId in sockets) {
//     console.log('socket', socketId, 'destroyed');
//     sockets[socketId].destroy();
//   }
// })(10);
// server.close(callback);
// setImmediate(function(){server.emit('close')});
      // io.sockets.emit('message', "casa")