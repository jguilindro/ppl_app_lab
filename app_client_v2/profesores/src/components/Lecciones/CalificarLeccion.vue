<template>
  <v-card v-if="leccion">
    <v-card-title primary-title>
      <h1 class="text-xs-center mx-auto">Calificar lección</h1>
    </v-card-title>
    <v-card-text>
      <p class="text-xs-center mx-auto"><v-icon class="mr-2">person</v-icon>{{ estudianteSel.nombres }} {{ estudianteSel.apellidos }}</p>
    </v-card-text>
    <v-card-text v-if="leccion">
      <v-layout row wrap>
        <v-flex xs12 class="mb-3">
          <h1 class="text-xs-center">{{ leccion.nombre }}</h1>
        </v-flex>
        <v-flex xs12 v-for="(pregunta, index) in preguntas">
          <calificar-pregunta :pregunta="pregunta" :index="index"></calificar-pregunta>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-btn flat class="indigo darken-5 white--text" @click.native="regresar">
        Regresar
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn flat class="indigo darken-5 white--text" @click.native="aceptar">
        Aceptar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
  export default {
    mounted () {
      this.getDatosLeccion(this.$route.params.id_estudiante, this.$route.params.id)
    },
    data () {
      return {
        disabled: true,
        estudianteSel: null,
        leccion: null,
        preguntas: [],
        respuestas: []
      }
    },
    methods: {
      getDatosLeccion (idEstudiante, idLeccion) {
        this.$http.get(`/api/lecciones/datos/${idEstudiante}/${idLeccion}`)
          .then((response) => {
            console.log(response)
            this.estudianteSel = response.body.datos.estudiante
            this.leccion = response.body.datos.leccion
            this.preguntas = response.body.datos.preguntas
            this.respuestas = response.body.datos.respuestas
          })
          .catch((err) => {
            console.log(err)
          })
      },
      continuar () {
        this.getDatosLeccion(this.estudianteSel._id, this.$route.params.id)
      },
      regresar () {
        this.disabled = true
      },
      aceptar () {

      }
    }
  }
</script>
