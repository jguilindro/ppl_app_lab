// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import moment from 'moment'
import VueSocketio from 'vue-socket.io'
import 'vuetify/dist/vuetify.min.css'

import App from './App'
import router from './router'
import { store } from './store'
// Shared components
import Navbar from '@/components/Shared/Navbar'
import Rubrica from '@/components/Shared/Rubrica'

let url = process.env.NODE_ENV === 'production' ? '/tomando_leccion' : 'http://localhost:8000/tomando_leccion'

Vue.use(Vuetify)
Vue.use(VueSocketio, url, store)

Vue.component('navbar', Navbar)
Vue.component('rubrica', Rubrica)

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
