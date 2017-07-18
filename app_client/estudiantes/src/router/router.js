// dependencias
import Vue from 'vue'
import Router from 'vue-router'

// components y views
import Prueba from '../components/Prueba.vue'
import Perfil from '../views/Perfil.vue'
import TomarLeccion from '../views/TomarLeccion.vue'
import Quejas from '../views/Quejas.vue'
import Leccion from '../views/Leccion.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'perfil',
      component: Perfil
    },
    {
      path: '/tomar-leccion',
      name: 'tomar-leccion',
      component: TomarLeccion
    },
    {
      path: '/leccion',
      name: 'leccion',
      component: Leccion
    },
    {
      path: '/prueba',
      name: 'prueba',
      component: Prueba
    },
    {
      path: '/quejas',
      name: 'quejas',
      component: Quejas
    }
  ]
})
