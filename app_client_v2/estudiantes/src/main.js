import Vue from 'vue'
import Vuetify from 'vuetify'
import moment from 'moment'
import VeeValidate from 'vee-validate'
// import colors from 'vuetify/es5/util/colors'
import 'vuetify/dist/vuetify.min.css'
import 'vue-material-design-icons/styles.css'
import App from './App'
import router from './router'
import { store } from './store'

Vue.use(Vuetify, {
  // theme: {
  //   primary: colors.purple.base,
  //   secondary: colors.grey.darken1,
  //   accent: colors.shades.black,
  //   error: colors.red.accent3
  // }
})
Vue.use(VeeValidate)
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
