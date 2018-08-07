import { ObtenerLeccionPorId } from '@/api'
const leccionModule = {
  namespaced: true,
  actions: {
    Obtener ({commit, state}, leccionId) {
      return new Promise((resolve, reject) => {
        ObtenerLeccionPorId(leccionId).then(response => {
          let leccion = response.leccion
          resolve(leccion)
        }).catch(error => {
          reject(error)
        })
      })
    },
    ObtenerTodas ({commit, state}, leccionId) {
    }
  }
}

export default leccionModule
