<template>
  <v-app>
    <navbar v-if="usuario"></navbar>
    <v-content id="content">
      <v-container fluid fill-height>
        <v-layout align-center justify-center wrap row>
          <v-flex xs12 sm10 md8>
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
</style>
