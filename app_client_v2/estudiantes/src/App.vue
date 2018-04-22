<template>
  <v-app id="app">
    <v-navigation-drawer temporary v-model="sideNav" app>
      <v-list>
         <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar>
            <v-avatar class="red">
              <span class="white--text headline">{{ inicialesEstudiante }}</span>
            </v-avatar>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title> {{ nombresEstudiante }}</v-list-tile-title>
              <v-list-tile-sub-title> {{ correoEstudiante }} </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-list-tile v-for="item in menuItems" :key="item.title" router :to="item.link">
          <v-list-tile-content >{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="att">
          <v-list-tile-content>ATT</v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile @click="logout">
          <v-layout row justify-space-between>
            <v-flex xs6 ms6>
              <v-list-tile-content>Cerrar Sesión</v-list-tile-content>
            </v-flex>
            <v-flex xs6 ms6>
              <v-icon>mdi-logout</v-icon>
            </v-flex>
          </v-layout>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <!-- MOVIL -->
    <v-toolbar app color="blue darken-4" dark class="hidden-md-and-up">
      <v-toolbar-side-icon @click="sideNav = !sideNav" class="white--text"></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">PPL ASSESSMENT</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn class="white--text" icon @click="ingresarCodigo()" v-show="esRutaIngresarCodigo">
        <v-icon>mdi-lead-pencil</v-icon>
      </v-btn> -->
    </v-toolbar >
    <!-- <v-toolbar color="white" flat>
      <v-btn icon light @click="back">
        <v-icon color="grey darken-2">arrow_back</v-icon>
      </v-btn>
    </v-toolbar> -->
    <!-- #ebebeb blanco
         #001a43 azul
        #F5b400 dorado
    -->
    <!-- WEB -->
    <v-toolbar app color="blue darken-4" class="hidden-sm-and-down">
      <v-toolbar-title class="white--text">PPL ASSESSMENT</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat class="white--text" v-for="item in menuItems" :key="item.title" router :to="item.link">
        <span v-show="estadoLeccion === 'redirigirlo-directamente' && item.link === '/ingresarCodigo'">INGRESAR A LECCIÓN</span>
        <span v-show="estadoLeccion !== 'redirigirlo-directamente' && item.link === '/ingresarCodigo'">{{ item.title }}</span>
        <span v-show="item.link !== '/ingresarCodigo'">{{ item.title }}</span>
      </v-btn>
      <v-btn flat class="white--text" @click="att">ATT</v-btn>
      <v-btn flat class="white--text" @click="logout"><v-icon>mdi-logout</v-icon> </v-btn>
    </v-toolbar>
    <v-content > <!-- style="padding-top: 0px" -->
      <transition enter-active-class="animated slideInDown"
        leave-active-class="animated slideOutUp">
          <v-alert :value="!online" color="error" transition="scale-transition">
            <v-icon>mdi-wifi-off</v-icon> <span>Por favor conéctese a internet.</span>
          </v-alert>
      </transition>
      <!-- <img :src="clearImageLocal('static/logo/logo_espol_new.png')" alt="">  v-show="estadoLeccion === 'redirigirlo-directamente'"-->
      <v-btn class="hidden-md-and-up" color="amber white--text" dark large v-show="estadoLeccion === 'redirigirlo-directamente'">INGRESAR A LECCIÓN</v-btn>
      <v-btn class="hidden-md-and-up" color="amber white--text" @click="ingresarCodigo()"  dark large v-show="estadoLeccion !== 'redirigirlo-directamente' && esRutaIngresarCodigo">INGRESAR CÓDIGO</v-btn>
      <router-view></router-view>
    </v-content>
    <!-- <main>

    </main> -->
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import router from './router'

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
  computed: {
    ...mapGetters({
      nombresEstudiante: 'nombres',
      inicialesEstudiante: 'iniciales',
      correoEstudiante: 'correo',
      estadoLeccion: 'estadoRealtime',
      online: 'online'
    }),
    esRutaIngresarCodigo () {
      return this.$route.path !== '/ingresarCodigo'
    }
  },
  data () {
    return {
      sideNav: false,
      menuItems
    }
  },
  created () {
    this.$store.dispatch('setSocketUsuario', this.$socket)
    this.$store.dispatch('usuarioDatos')
  },
  methods: {
    logout () {
      window.location = '/api/session/logout'
    },
    att () {
      window.location = '/att/estudiantes'
    },
    ingresarCodigo () {
      router.push({name: 'IngresarCodigo'})
    },
    back () {
      router.go(-1)
    },
    clearImageLocal (urlDevelopment) {
      if (process.env.NODE_ENV === 'production') {
        return urlDevelopment.split('static')['1'].substring(1)
      }
      return urlDevelopment
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
</style>
