import Vue from 'vue'
import Router from 'vue-router'
import Lecciones from '@/components/Lecciones'
import Index from '@/components/Index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/lecciones',
      name: 'Lecciones',
      component: Lecciones,
    },
    {
      path: '/',
      name: 'Index',
      component: Index,
    },
  ],
})
