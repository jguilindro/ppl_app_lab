import Vue from 'vue'
import Router from 'vue-router'
import Lecciones from '@/components/Lecciones'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Lecciones',
      component: Lecciones,
    },
  ],
})
