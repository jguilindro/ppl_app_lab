// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import moment from 'moment'
import 'vuetify/dist/vuetify.min.css'
import 'chart.js'
import VueCharts from 'hchs-vue-charts'

import App from './App'
import router from './router'
import { store } from './store'
// Shared components
import Navbar from '@/components/Shared/Navbar'
import Rubrica from '@/components/Shared/Rubrica'
import CalificarPregunta from '@/components/Shared/CalificarPregunta'
import DescripcionPregunta from '@/components/Shared/DescripcionPregunta'
import CalificarRespuesta from '@/components/Shared/CalificarRespuesta'
import GruposLeccion from '@/components/Shared/GruposLeccion'

Vue.use(VueCharts)
Vue.use(window.VueCharts)
Vue.use(Vuetify)

Vue.component('navbar', Navbar)
Vue.component('rubrica', Rubrica)
Vue.component('calificar-pregunta', CalificarPregunta)
Vue.component('calificar-respuesta', CalificarRespuesta)
Vue.component('descripcion-pregunta', DescripcionPregunta)
Vue.component('grupos-leccion', GruposLeccion)

Vue.config.productionTip = false

Vue.filter('fechaFormato', (value) => {
  if (value) {
    return `${moment(value).locale('es').format('dddd DD MMMM YYYY, HH:mm')}`
  }
})
Vue.filter('formatoCreatedAt', (value) => {
  if (value) {
    return `${moment(value).locale('es').format('DD MMMM YYYY')}`
  }
})
Vue.filter('formatoHoraInicio', (value) => {
  if (value) {
    return `${moment(value).locale('es').format('DD MMMM, HH:mm')}`
  }
})
Vue.filter('capitalizeFirst', (value) => {
  if (value) {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
