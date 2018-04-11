import Vue from 'vue'
import Vuetify from 'vuetify'
import moment from 'moment'
import 'vuetify/dist/vuetify.min.css'
import 'vue-material-design-icons/styles.css'
import App from './App'
import router from './router'
import { store } from './store'

Vue.use(Vuetify)
Vue.config.productionTip = false

Vue.filter('timeFromDate', (value) => {
  if (value) {
    return `Terminado ${moment(value).locale('es').fromNow()}`
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
