module.exports = ({ }) => {
  const proto = {
    terminarLeccion() {
      if (process.env.NODE_ENV !== 'testing')
        console.log('DB: terminar leccion')
    }
  }
  return Object.assign(Object.create(proto), {})
}