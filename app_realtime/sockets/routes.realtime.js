module.exports = (app, io) => {
  const sessionSockets = io.of('/leccion')
  sessionSockets.on('connection', () => {
    console.log('conectod')
  })
}
