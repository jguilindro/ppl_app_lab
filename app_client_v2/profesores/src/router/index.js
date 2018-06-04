import Vue from 'vue'
import Router from 'vue-router'

import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'

// Rúbrica
import IngresarRubrica from '@/components/Rubrica/IngresarRubrica'
import RubricaCSV from '@/components/Rubrica/RubricaCSV'

// Preguntas
import VerPregunta from '@/components/Preguntas/VerPregunta'

// Lecciones
import VerLecciones from '@/components/Lecciones/VerLecciones'

import BancoDePreguntas from '@/components/Preguntas/BancoDePreguntas'

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
    },
    {
      path: '/preguntas/:id',
      name: 'VerPregunta',
      component: VerPregunta
    },
    {

      path: '/lecciones/',
      name: 'VerLecciones',
      component: VerLecciones
    },
    {

      path: '/preguntas',
      name: 'BancoDePregunta',
      component: BancoDePreguntas

    }
  ]
})
