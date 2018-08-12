import Vue from 'vue'
import Vuetify from 'vuetify'
import VeeValidate from 'vee-validate'
import Viewer from 'v-viewer'
import ElementUI from 'element-ui'
import VueSocketio from 'vue-socket.io'
import 'element-ui/lib/theme-chalk/index.css'
import 'vuetify/dist/vuetify.min.css'
import 'vue-material-design-icons/styles.css'
import lang from 'element-ui/lib/locale/lang/es'
import locale from 'element-ui/lib/locale'

import App from './App'
import * as filters from './filters'
import './permission'

import router from '@/router'
import { store } from '@/store'
let url = process.env.NODE_ENV === 'production' ? '/tomando_leccion' : 'http://localhost:8000/tomando_leccion'

locale.use(lang)
Vue.use(Vuetify)
Vue.use(VeeValidate)
Vue.use(VueSocketio, url, store)
Vue.use(Viewer)
Vue.use(ElementUI)

Vue.config.productionTip = false

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  sockets: {
    connect () {
      store.commit('SET_SOCKET', this.$socket)
    },
    disconnect () {
    }
  },
  template: '<App/>'
})
