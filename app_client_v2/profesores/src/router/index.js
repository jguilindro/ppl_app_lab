import Vue from 'vue'
import Router from 'vue-router'

import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'

// Rúbrica
import IngresarRubrica from '@/components/Rubrica/IngresarRubrica'
import RubricaCSV from '@/components/Rubrica/RubricaCSV'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/rubrica',
      name: 'IngresarRubrica',
      component: IngresarRubrica
    },
    {
      path: '/rubrica/csv',
      name: 'RubricaCSV',
      component: RubricaCSV
    }
  ]
})
