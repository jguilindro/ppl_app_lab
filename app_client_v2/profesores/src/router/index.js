import Vue from 'vue'
import Router from 'vue-router'
import VueSocketio from 'vue-socket.io-extended'
import io from 'socket.io-client'
import { store } from '../store'

import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'

// Rúbrica
import IngresarRubrica from '@/components/Rubrica/IngresarRubrica'
import RubricaCSV from '@/components/Rubrica/RubricaCSV'

// Preguntas
import VerPregunta from '@/components/Preguntas/VerPregunta'

// Lecciones
import VerLecciones from '@/components/Lecciones/VerLecciones'
import Leccion from '@/components/Lecciones/Leccion'
import Estadisticas from '@/components/Lecciones/Estadisticas'
import CrearLeccion from '@/components/Lecciones/CrearLeccion'
// import EditarLeccion from '@/components/Lecciones/EditarLeccion'
// import LeccionPanel from '@/components/Lecciones/LeccionPanel'
import SeleccionEstudiante from '@/components/Shared/SeleccionEstudiante'
import CalificarLeccion from '@/components/Lecciones/CalificarLeccion'

import BancoDePreguntas from '@/components/Preguntas/BancoDePreguntas'

Vue.use(Router)

const LeccionPanel = () => import('@/components/Lecciones/LeccionPanel')
let url = process.env.NODE_ENV === 'production' ? '/tomando_leccion' : 'http://localhost:8000/tomando_leccion'

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
      path: '/lecciones/crear',
      name: 'CrearLeccion',
      component: CrearLeccion
    },
    {
      path: '/lecciones/:id',
      name: 'Leccion',
      component: Leccion
    },
    {
      path: '/lecciones/:id/grupos',
      name: 'SeleccionEstudianteCalificar',
      component: SeleccionEstudiante,
      meta: { recalificar: false }
    },
    {
      path: '/lecciones/:id/recalificar/grupos',
      name: 'SeleccionEstudianteRecalificar',
      component: SeleccionEstudiante,
      meta: { recalificar: true }
    },
    {
      path: '/lecciones/:id/calificar/:id_grupo/:id_estudiante',
      name: 'CalificarLeccion',
      component: CalificarLeccion
    },
    {
      path: '/lecciones/:id/recalificar/:id_grupo/:id_estudiante',
      name: 'RecalificarLeccion',
      component: CalificarLeccion
    },
    /* {
      path: '/lecciones/:id/editar',
      name: 'EditarLeccion',
      component: EditarLeccion
    }, */
    {
      path: '/lecciones/:id/estadisticas',
      name: 'Estadisticas',
      component: Estadisticas
    },
    {
      path: '/leccion-panel/:id/paralelo/:id_paralelo',
      name: 'LeccionPanel',
      component: LeccionPanel,
      beforeEnter (to, from, next) {
        Vue.use(VueSocketio, io(url), { store })
        next()
      }
    },
    {

      path: '/preguntas',
      name: 'BancoDePregunta',
      component: BancoDePreguntas

    }
  ]
})
