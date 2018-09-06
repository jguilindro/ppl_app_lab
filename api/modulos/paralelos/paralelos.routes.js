module.exports = function (app, opts, next) {
  app.get('/paralelos', async (request, reply) => {
    return { hello: 'paralelos' }
  })
  next()
}
