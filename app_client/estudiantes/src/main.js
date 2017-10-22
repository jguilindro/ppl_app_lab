import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import socketio from 'socket.io-client'
import VueSocketio from 'vue-socket.io'
import offline from 'offline-js'
import axios from 'axios'
import VueMaterial from 'vue-material'
// import 'vue-material/dist/vue-material.css'
Vue.use(VueMaterial)
Vue.use(VueSocketio, socketio('/tomando_leccion'));

new Vue({
  sockets:{
    connect: function(){
      console.log('la coneccion fue correcta')
    },
    customEmit: function(val){
      console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    }
  },
  el: '#app',
  store,
  router,
  created() {
    this.$store.dispatch('getEstudiante')
  },
  template: '<App/>',
  components: { App }
})
