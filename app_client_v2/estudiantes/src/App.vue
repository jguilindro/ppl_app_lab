<template>
  <v-app id="app">
    <v-navigation-drawer  id="navegacion" temporary v-model="sideNav" app>
      <v-list>
        <!-- <avatar id="avatarUsuario" :username="nombres" :size="55" color="#fff"></avatar> -->
        <v-list-tile v-for="item in menuItems" :key="item.title" router :to="item.link">
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="logout">
          <v-list-tile-content>Logout</v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="att">
          <v-list-tile-content>ATT</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app dark>
      <v-toolbar-side-icon @click="sideNav = !sideNav" class="hidden-md-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>PPL ASSESSMENT</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down" >
        <v-btn flat v-for="item in menuItems" :key="item.title" router :to="item.link">{{ item.title }}</v-btn>
        <v-btn flat @click="att">ATT</v-btn>
        <v-btn flat @click="logout">Cerrar Sesión</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container>
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import Avatar from 'vue-avatar'

let menuItems = [{
  title: 'Ingresar Código',
  link: '/ingresarCodigo'
}]
if (process.env.NODE_ENV === 'development') {
  menuItems.push({
    title: 'Lecciones',
    link: '/lecciones'
  })
} else if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'testing') {
  menuItems.push({
    title: 'Lecciones',
    link: '/'
  })
}

export default {
  name: 'App',
  computed: mapGetters([
    'nombres'
  ]),
  data () {
    return {
      sideNav: false,
      menuItems
    }
  },
  created () {
    this.$store.dispatch('usuarioDatos')
  },
  components: { Avatar },
  methods: {
    logout () {

    },
    att () {
      window.location = '/att/estudiantes'
    }
  }
}
</script>

<style>
/*@import url('https://fonts.googleapis.com/css?family=Varela+Round');*/
/*@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
@import url('https://code.getmdl.io/1.2.1/material.blue-red.min.css');*/
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
@media only screen and (max-width : 750px) {
  #navegacion {
    width: 75% !important;
  }
}
</style>
