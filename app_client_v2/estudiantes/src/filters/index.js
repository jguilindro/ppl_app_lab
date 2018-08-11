import moment from 'moment'
export function fechaFormato (fecha) {
  if (fecha) {
    return `${moment(fecha).locale('es').format('dddd DD MMMM YYYY, HH:mm')}`
  }
}
