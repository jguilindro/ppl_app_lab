<template>
  <v-card>
    <!-- movil -->
    <app-nav class="hidden-sm-and-down"></app-nav>

    <!-- web -->
    <v-toolbar color="white" flat class="hidden-md-and-up">
      <v-btn icon light router to="/lecciones">
        <v-icon color="grey darken-2" >arrow_back</v-icon>
      </v-btn>
    </v-toolbar>

    <v-container fluid style="min-height: 0;" grid-list-lg>
      <!-- headers lecciones -->
      <h1>{{ leccion.nombre }}</h1>
      <v-avatar size="50px" slot="activator" class="blue">
        <span class="white--text" >{{ leccion.calificacion }}</span>
      </v-avatar>
      <h4 class="grey--text">{{ leccion.fechaTomada | fechaFormato }}</h4>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card color="blue-grey darken-2" class="white--text">
          </v-card>
        </v-flex>
      </v-layout>

      <!-- preguntas -->
      <div v-if="obtenerTipo === 'preguntas'" v-for="(pregunta, index) in leccion.preguntas" :key="index">
        <pregunta v-bind:pregunta="pregunta" v-bind:index="index"></pregunta>
      </div>

      <!-- secciones -->
      <div v-if="obtenerTipo === 'secciones'" v-for="(seccion, indexSeccion) in leccion.secciones" :key="indexSeccion">
        <seccion v-bind:seccion="seccion" v-bind:indexSeccion="indexSeccion"></seccion>
      </div>

    </v-container>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import AppNav from '@/components/Nav/AppNav'
import Pregunta from './Pregunta'
import Seccion from './Seccion'

export default {
  components: { AppNav, Pregunta, Seccion },
  computed: {
    ...mapGetters({
      leccion: 'leccion'
    }),
    obtenerTipo () {
      if (this.leccion['preguntas']) {
        return 'preguntas'
      } else {
        return 'secciones'
      }
    }
  },
  mounted () {
    window.scrollTo(0, 0)
    const leccionId = this.$route.params.leccionId
    this.$store.dispatch('leccionDatos', leccionId)
  }
}
</script>

<style scoped>
</style>
