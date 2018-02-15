module.exports = ({ }) => {
  const proto = {
    terminarLeccion() {
       	if (process.env.NODE_ENV !== 'testing')
        	console.log('DB: terminar leccion')
    },
    terminarLeccionPromise() {
       return new Promise((resolve, reject) => {
       	if (process.env.NODE_ENV !== 'testing')
        	console.log('DB: terminar leccion')
       	resolve(true)	
       })
    }
  }
  return Object.assign(Object.create(proto), {})
}