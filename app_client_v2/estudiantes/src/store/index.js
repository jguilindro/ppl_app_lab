import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'

Vue.use(Vuex)

const state = {
  conectado: false,
  loggeado: process.env.NODE_ENV === 'production', // usado solo para pruebas en local
  estudiante: {},
  lecciones: [],
  paralelo: {},
  leccion_detalle_id: -1,
  leccion_detalle: {},
}

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state,
  getters,
  actions,
  mutations,
  plugins: [createPersistedState()],
})


export default store
