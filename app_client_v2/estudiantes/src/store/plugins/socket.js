import router from '@/router'
export default function createWebSocketPlugin (socket) {
  return store => {
    socket.on('connect', () => {
      store.commit('SET_SOCKET', socket)
      let estudianteId = store.getters['estudiante/id']
      let leccionId = store.getters['realtime/leccion']['id']
      let paraleloId = store.getters['estudiante/paralelo']
      socket.emit('usuario estudiante', { estudianteId, leccionId, paraleloId })
    })
    socket.on('TIEMPO_RESTANTE', (tiempo) => {
      store.commit('realtime/SET_TIEMPO', tiempo)
    })
    socket.on('disconnect', () => {
      store.commit('SOCKET_DISCONNECT')
    })
    socket.on('terminado leccion', (match) => {
      router.push('/lecciones')
    })
    socket.on('EMPEZAR_LECCION', () => {
      router.push('/leccionRealtime')
    })
  }
}
