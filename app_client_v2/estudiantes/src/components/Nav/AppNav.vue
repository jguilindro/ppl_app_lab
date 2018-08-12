<!--
  COLORES ESPOL
  #ebebeb blanco
  #001a43 azul
  #F5b400 dorado
  #8da9c6 logo
-->
<template>
  <div id="app-nav">
    <v-navigation-drawer temporary v-model="sideNav" app >
      <v-list>
         <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar color="blue" size="60px" style="margin-right: 15px;">
            <v-avatar size="59px">
              <img color="red" src="@/assets/espol.png" alt="">
            </v-avatar>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title> {{ nombres }}</v-list-tile-title>
              <v-list-tile-sub-title> {{ correo }} </v-list-tile-sub-title>
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
    </v-toolbar >
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
    <v-content >
      <transition enter-active-class="animated slideInDown"
        leave-active-class="animated slideOutUp">
          <v-alert :value="!online" color="error" transition="scale-transition">
            <v-icon>mdi-wifi-off</v-icon> <span>Por favor conéctese a internet.</span>
          </v-alert>
      </transition>
      <v-btn class="hidden-md-and-up" color="amber white--text" dark large v-show="estadoLeccion === 'redirigirlo-directamente'">INGRESAR A LECCIÓN</v-btn>
      <v-btn class="hidden-md-and-up" color="amber white--text" @click="ingresarCodigo()"  dark large v-show="estadoLeccion !== 'redirigirlo-directamente' && esRutaIngresarCodigo">INGRESAR CÓDIGO</v-btn>
    </v-content>
  </div>
</template>

<script>

import router from '@/router'

// Para pruebas en local, como todavia no esta el single page de estudiantes leccion realtime
// se usa para pruebas locales
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
  name: 'app-nav',
  computed: {
    nombres () {
      return this.$store.getters['estudiante/nombres']
    },
    correo () {
      return this.$store.getters['estudiante/correo']
    },
    iniciales () {
      return this.$store.getters['estudiante/iniciales']
    },
    online () {
      return this.$store.getters['estaOnline']
    },
    estadoLeccion () {
      // TODO: anadir accion
      return 'dando-leccion'
    },
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
  methods: {
    logout () {
      window.location = '/api/session/logout'
    },
    att () {
      window.location = '/att/estudiantes'
    },
    ingresarCodigo () {
      router.push({ name: 'IngresarCodigo' })
    }
  }
}
</script>
