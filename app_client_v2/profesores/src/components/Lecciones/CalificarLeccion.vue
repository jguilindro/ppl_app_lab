<style>
  p img {
    max-width: -webkit-fill-available !important;
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 60%;
  }
</style>
<template>
  <main>
    <v-card v-if="!loading">
      <v-card-title primary-title>
        <h1 class="text-xs-center mx-auto">Calificar lección</h1>
      </v-card-title>
      <v-card-text>
        <p class="text-xs-center mx-auto"><v-icon class="mr-2">person</v-icon>{{ estudianteSel.nombres }} {{ estudianteSel.apellidos }}</p>
      </v-card-text>
      <!-- Calificacion de preguntas -->
      <v-card-text v-if="leccion">
        <v-layout row wrap>
          <v-flex xs12 class="mb-3">
            <h1 class="text-xs-center">{{ leccion.nombre }}</h1>
          </v-flex>
          <v-flex xs12 v-for="(pregunta, index) in preguntas" :key="pregunta._id">
            <calificar-pregunta :pregunta="pregunta" :index="index" v-on:calificacionPregunta="calificarPregunta"></calificar-pregunta>
          </v-flex>
        </v-layout>
      </v-card-text>
      <!-- Calificacion de leccion -->
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12>
            <h3 class="text-xs-center">Calificación total: {{calificacionTotal}}/{{leccion.puntaje}}</h3>
            <h3 class="text-xs-center">Calificación ponderada: {{calificacionPonderada}}/100</h3>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-btn flat class="indigo darken-5 white--text" @click.native="regresar">
          Regresar
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn flat class="indigo darken-5 white--text" @click.native="dialogAceptar = true">
          Aceptar
        </v-btn>
      </v-card-actions>
    </v-card>
    <div class="text-xs-center" v-else>
      <v-progress-circular indeterminate color="primary" class="text-xs-center"></v-progress-circular>
    </div>
    <v-dialog v-model="dialogAceptar" persistent max-width="290">
      <v-card>
        <v-card-text>¿Está seguro de que desea enviar esta calificación?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="dialogAceptar = false">No</v-btn>
          <v-btn color="green darken-1" flat @click.native="aceptar">Si</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogAPI" persistent max-width="290">
      <v-card>
        <v-card-text>{{ apiMsg }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="regresar">Continuar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </main>
</template>
<script>
  export default {
    mounted () {
      this.getDatosLeccion(this.$route.params.id_estudiante, this.$route.params.id)
    },
    computed: {
      leccion () {
        return this.$store.getters.leccionCalificar
      }
    },
    data () {
      return {
        dialogAPI: false,
        apiMsg: '',
        dialogAceptar: false,
        loading: true,
        disabled: true,
        estudianteSel: null,
        preguntas: [],
        calificacionTotal: 0.00,
        calificacionPonderada: 0.00
      }
    },
    methods: {
      getDatosLeccion (idEstudiante, idLeccion) {
        this.$http.get(`/api/lecciones/datos/${idEstudiante}/${idLeccion}`)
          .then((response) => {
            this.loading = false
            this.estudianteSel = response.body.datos.estudiante
            this.$store.commit('setLeccionCalificar', response.body.datos.leccion)
            response.body.datos.preguntas.forEach((pregunta) => {
              if (pregunta.esSeccion) {
                pregunta.subpreguntas.forEach((sub) => {
                  this.calificarPregunta(sub.calificacion)
                })
              } else {
                this.calificarPregunta(pregunta.calificacion)
              }
            })
            this.preguntas = response.body.datos.preguntas
          }, (err) => {
            this.loading = false
            console.log(err)
          })
      },
      ponderarCalificacion (puntajeMax, puntajeObtenido, ponderacion) {
        return parseFloat(((puntajeObtenido * ponderacion) / puntajeMax).toFixed(2))
      },
      calificarPregunta (calificacion) {
        this.calificacionTotal += calificacion
        this.calificacionPonderada += this.ponderarCalificacion(this.leccion.puntaje, calificacion, 100)
      },
      continuar () {
        this.getDatosLeccion(this.estudianteSel._id, this.$route.params.id)
      },
      regresar () {
        this.$router.go(-1)
      },
      aceptar () {
        this.dialogAceptar = false
        const data = {
          calificacion: this.calificacionPonderada,
          estudiante: this.$route.params.id_estudiante
        }
        this.$http.put(`/api/calificaciones/calificar/${this.$route.params.id}/${this.$route.params.id_grupo}`, data)
          .then((res) => {
            this.dialogAPI = true
            this.apiMsg = 'Lección calificada correctamente.'
          }, (err) => {
            this.dialogAPI = true
            this.apiMsg = err
          })
      }
    }
  }
</script>
