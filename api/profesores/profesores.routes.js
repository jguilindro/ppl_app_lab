module.exports = (app) => {
  app.get('/ping', function(req, res) { res.send({ ping: 'pong' })})
}