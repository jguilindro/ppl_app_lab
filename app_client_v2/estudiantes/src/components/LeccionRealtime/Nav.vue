<template>
  <div id="app-nav">
    <v-navigation-drawer temporary v-model="side" app >
      <v-card>
        <v-card-title>
          <h4>{{ leccionNombre }}</h4>
        </v-card-title>
      </v-card>
      <v-divider dark inset></v-divider>
      <v-list>
        <v-list-tile v-for="(pregunta, index) in preguntas" :key="index" @click="$emit('pregunta', index); cambio(index)" :class="{ 'grey': preguntaActual === index}">
          <v-container xs12 fluid grid-list-lg>
            <v-layout row justify-space-between>
              <v-flex xs2>
                <v-icon color="blue">mdi-circle</v-icon>
              </v-flex>
              <v-flex xs10>
                <h4>Pregunta {{ pregunta }}</h4>
              </v-flex>
            </v-layout>
          </v-container>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dense app >
      <v-btn icon small @click="side = !side">
        <v-toolbar-side-icon></v-toolbar-side-icon>
      </v-btn>
      <div><v-toolbar-title >{{tiempo}}</v-toolbar-title></div>
      <v-icon >mdi-clock </v-icon>
      <v-toolbar-title slot="extension">{{pregunta}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-badge left overlap >
        <span slot="badge" dark small>1</span>
      </v-badge>
      <v-menu bottom left>
        <v-btn icon slot="activator">
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile>
            <v-list-tile-title>PPL</v-list-tile-title>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-title>ATT</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar >
    <v-content >
      <transition enter-active-class="animated slideInDown"
        leave-active-class="animated slideOutUp">
          <v-alert :value="!online" color="error" transition="scale-transition">
            <v-icon>mdi-wifi-off</v-icon> <span>Por favor conéctese a internet.</span>
          </v-alert>
      </transition>
    </v-content>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'app-nav',
  props: ['pregunta', 'tiempo', 'leccionNombre', 'cantidadPreguntas', 'preguntaActualParent'],
  computed: {
    ...mapGetters({
      online: 'online'
    }),
    preguntas () {
      var list = []
      for (var i = 1; i <= this.cantidadPreguntas; i++) {
        list.push(i)
      }
      return list
    }
  },
  data () {
    return {
      side: false,
      preguntaActual: this.preguntaActualParent
    }
  },
  methods: {
    cambio (pregunta) {
      this.side = false
      this.preguntaActual = pregunta
    }
  },
  watch: {
    preguntaActualParent (val) {
      this.preguntaActual = parseInt(this.preguntaActualParent)
    }
  }
}
</script>

<style scoped>
.toolbar__extension {
  width: 50% !important;
  margin: 0 auto;
}

</style>
