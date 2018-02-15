// Si la leccion esta pausada y si estaYaCorriendoTiempo, si LeccionYaComenzo, estadoLeccion('pendiente', 'tomando', 'terminado')
module.exports = ({ }) => {
  const proto = {
    terminarLeccion() {
      LeccionModel.leccionTerminada(id_leccion, (err, res) => {
        if (err) return console.log(err);
        console.log('leccion terminado ' + id_leccion);
      })
      // cambia valor dandoLeccion en paralelo por false
      ParaleloModel.leccionTerminada(paralelo._id, (err, res) => {
        if (err) return console.log(err);
        console.log('leccion terminada ' + paralelo._id);
      })
      var promises = []
      // anade a cada estudiante la leccion y cambia el boolean dandoLeccion por false
      // TODO: anadir fecha empezado leccion
      paralelo.estudiantes.forEach(estudiante => {
        promises.push(new Promise((resolve, reject) => {
          EstudianteModel.leccionTerminada(estudiante._id, (err, e) => {
            if (err) return reject(err)
            return resolve(true)
          })
        }))
      })
      return Promise.all(promises).then(values => {
        for (var i = 0; i < values.length; i++) {
          if (values[i] != true){
            return false
          }
        }
        return true
        console.log('terminado leccion estudiantes');
      }, fail => {
       console.log(fail);
      })
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