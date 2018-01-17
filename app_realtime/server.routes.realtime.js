module.exports = (app, io) => {
  const sessionSockets = io.of('/tomando_leccion')
  sessionSockets.on('connection', () => {
    console.log('conectod')
  })
}
