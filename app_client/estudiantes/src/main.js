import Vue from 'vue'
import axios from 'axios'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import App from './App'
import router from './router'
import store from './store/index'
// import socketio from 'socket.io-client'
// import VueSocketio from 'vue-socket.io'
// import offline from 'offline-js'


Vue.use(VueMaterial)

// Vue.material.registerTheme('default', {
//   primary: '#FDD835',
//   accent: '#FDD835',
//   warn: '#FDD835',
//   background: 'white',
// })

Vue.config.productionTip = false

axios.get('/api/profesores/').then((resp) => {
  console.log(resp.data)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  created() {
    this.$store.dispatch('getEstudiante')
  },
  components: { App },
})
