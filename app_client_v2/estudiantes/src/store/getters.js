export const loggeado = state => state.loggeado

export const estudiante = (state) => {
  const nombre = state.estudiante.nombres.split(' ')[0]
  const apellido = state.estudiante.apellidos.split(' ')[0]
  const correo = state.estudiante.correo
  return { nombres: nombre.concat(' ').concat(apellido), correo }
}

export const lecciones = state => state.lecciones
