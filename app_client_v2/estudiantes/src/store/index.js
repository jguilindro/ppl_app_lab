// NOTA IMPORTANTE
// en los acrions se limpiara la pregunta y se le dara un formato que entiendan los componentes
// para que al hacer el cambio de api no se cambie tanto todo

// se debe documentar lo que se ENVIARA al back
// y lo que recibira el FRONT
// siendo lo mas declarativo posible para hacer los mas facil posible el cambio de api

import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import LeccionesModule from './modules/lecciones'

Vue.use(Vuex)
Vue.use(VueResource)

export const store = new Vuex.Store({
  modules: {
    lecciones: LeccionesModule
  },
  state: {
    online: true,
    io: {},

    // no se usan
    error: null,
    tiempoLeccionRealtime: 0,
    // datos estudiante
    lecciones: {},
    estudiante: {
      correo: '',
      nombres: '',
      apellidos: '',
      id: '',
      grupoId: '',
      paraleloId: ''
    },
    tmp: null,
    usuarioDatos: {
    }, // usado para una parte del realtime que se hace un emit, pero en realidad no tiene ninguna utilidad importante en el front
    muchos: {},
    // REALTIME

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
    leccionDando: {
      nombre: '',
      estado: '',
      preguntas: [],
      leccionId: null
    }
  },

  mutations,
  actions,
  getters
})
