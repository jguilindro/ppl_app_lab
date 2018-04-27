import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)
Vue.use(VueResource)

export const store = new Vuex.Store({
  state: {
    error: null,
    // datos estudiante
    lecciones: {},
    estudiante: {
      correo: '',
      nombres: '',
      apellidos: ''
    },
    online: true,
    tmp: null,
    usuarioDatos: {
    }, // usado para una parte del realtime que se hace un emit, pero en realidad no tiene ninguna utilidad importante en el front
    muchos: {},
    // REALTIME
    io: {},
    connect: false,
    leccionRealtime: {
      estado: '',
      leccionYaComenzo: false,
      paraleloDandoLeccion: false,
      yaIngresoCodigo: false,
      timeout: -1,
      estudiateFueAnadidoAParalelo: false,
      debeSerRedirigidoPorRealtime: false,
      fueRedirigido: false
    },
    leccion: { // leccion actual mostrada
    }
  },
  mutations,
  actions,
  getters
})
