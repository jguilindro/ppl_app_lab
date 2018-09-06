import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'

import getters from './getters'
import actions from './actions'
import mutations from './mutations'

import sockets from './modules/sockets'
import leccionRealTime from './modules/leccionRealTime'

Vue.use(Vuex)
Vue.use(VueResource)

export const store = new Vuex.Store({
  modules: {
    sockets,
    leccionRealTime
  },
  state: {
    usuario: null,
    error: null,
    loading: false,
    lecciones: [],
    preguntas: [],
    leccionCalificar: null
  },
  getters,
  actions,
  mutations
})
