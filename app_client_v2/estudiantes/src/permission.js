import router from './router'
import { store } from '@/store'
router.beforeEach((to, from, next) => {
  let path = to['path']
  if (path === '/lecciones') {
    store.dispatch('Inicializar').then(() => {
      next()
    })
  } else if (path === '/leccionRealtime') {
    store.dispatch('Inicializar').then(() => {
      let estadoLeccion = store.getters['realtime/estado']
      if (estadoLeccion !== 'redirigirlo-directamente') {
        router.push('/lecciones')
      } else {
        next()
      }
    })
  } else if (path === '/ingresarCodigo') {
    store.dispatch('Inicializar').then(() => {
      let estadoLeccion = store.getters['realtime/estado']
      if (estadoLeccion === 'redirigirlo-directamente') {
        if (process.env.NODE_ENV === 'production') {
          window.location.href = '/estudiantes/leccion' // CAMBIAR
        } else {
          router.push('/leccionRealtime')
        }
      } else {
        next()
      }
    })
  } else {
    next()
  }
})
