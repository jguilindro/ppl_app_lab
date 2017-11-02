import Vue from 'vue'
import Vuex from 'vuex'
// import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'

Vue.use(Vuex)

const state = {
  conectado: false,
  loggeado: false,
  estudiante: {},
  lecciones: [],
  paralelo: {},
}

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state,
  // getters,
  actions,
  mutations,
})


export default store
