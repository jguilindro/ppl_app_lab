import Vue from 'vue'
import Router from 'vue-router'
import Lecciones from '@/components/Lecciones'
import Login from '@/components/Login'
import Leccion from '@/components/Leccion/Leccion'
import IngresarCodigo from '@/components/IngresarCodigo'
import NotFound from '@/components/NotFound'
import LeccionRealtime from '@/components/LeccionRealtime/LeccionRealtime'

Vue.use(Router)

let routes = [{
  path: '/leccion/:leccionId',
  name: 'Leccion',
  component: Leccion
},
{
  path: '/ingresarCodigo',
  name: 'IngresarCodigo',
  component: IngresarCodigo
},
{
  path: '/leccionRealtime',
  name: 'LeccionRealtime',
  component: LeccionRealtime
},
{ path: '*',
  component: NotFound
}]

if (process.env.NODE_ENV === 'development') {
  routes.push({
    path: '/',
    name: 'Login',
    component: Login },
  {
    path: '/lecciones',
    name: 'Lecciones',
    component: Lecciones
  })
} else if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'testing') {
  routes.push({
    path: '/',
    name: 'Lecciones',
    component: Lecciones
  })
}

export default new Router({
  routes
})
