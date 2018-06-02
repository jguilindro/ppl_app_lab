<template>
  <v-app>
    <navbar v-if="usuario"></navbar>
    <v-content id="content">
      <v-container fluid fill-height id="container">
        <v-layout align-center justify-center wrap row id="layout">
          <v-flex xs12 sm10 class="flex">
            <router-view/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
export default {
  computed: {
    usuario () {
      return this.$store.getters.usuario
    }
  },
  created () {
    this.$store.dispatch('obtenerUsuario')
    this.$store.dispatch('getLecciones')
  },
  data () {
    return {}
  },
  name: 'App'
}
</script>
<style>
  #content {
    background-color: #d3dbdb !important;
  }
  .indigo.darken-5 {
    background-color: #001a43 !important;
  }
  h1, h2, h3, h4, h5 {
    color: #001a43 !important;
    font-family: Heuristica-Regular !important;
  }
</style>
