import Vue from 'vue'
// import VueMaterial from 'vue-material'
// import 'vue-material/dist/vue-material.css'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { sync } from 'vuex-router-sync'
import socketio from 'socket.io-client'
import VueSocketio from 'vue-socket.io'
import App from './App'
import router from './router'
import store from './store/index'

Vue.use(Vuetify)

sync(store, router)
Vue.config.productionTip = false

let url
if (process.env.NODE_ENV === 'production') {
  url = '/tomando_leccion'
} else {
  url = 'http://localhost:8000/tomando_leccion'
}

Vue.use(VueSocketio, socketio(url))

/* eslint-disable no-new */
new Vue({
  sockets: {
    connect: () => {
      console.log('la coneccion fue correcta')
    },
    customEmit: () => {
      console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    },
  },
  el: '#app',
  router,
  store,
  template: '<App/>',
  created() {
    // this.$store.dispatch('getEstudiante')
  },
  components: { App },
})
