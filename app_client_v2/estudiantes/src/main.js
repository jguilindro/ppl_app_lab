import Vue from 'vue'
import Vuetify from 'vuetify'
import VeeValidate from 'vee-validate'
import Viewer from 'v-viewer'
import ElementUI from 'element-ui'
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

locale.use(lang)
Vue.use(Vuetify)
Vue.use(VeeValidate)
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
  template: '<App/>'
})
