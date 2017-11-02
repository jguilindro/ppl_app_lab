import Vue from 'vue'
import Router from 'vue-router'
import Lecciones from '@/components/Lecciones'
import LeccionesDetalle from '@/components/LeccionesDetalle'
import NotFound from '@/components/NotFound'
import IngresarCodigo from '@/components/IngresarCodigo'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
    },
    {
      path: '/Lecciones',
      name: 'Lecciones',
      component: Lecciones,
    },
    {
      path: '/LeccionesDetalle',
      name: 'LeccionesDetalle',
      component: LeccionesDetalle,
    },
    {
      path: '/ingresar-codigo',
      name: 'IngresarCodigo',
      component: IngresarCodigo,
    },
    { path: '*',
      component: NotFound,
    },
  ],
})
