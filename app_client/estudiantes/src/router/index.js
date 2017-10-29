import Vue from 'vue'
import Router from 'vue-router'
import Lecciones from '@/components/Lecciones'
import NotFound from '@/components/NotFound'
import IngresarCodigo from '@/components/IngresarCodigo'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Lecciones',
      component: Lecciones,
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
