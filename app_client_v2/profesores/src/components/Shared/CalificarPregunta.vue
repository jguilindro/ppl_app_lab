<template>
  <v-card :key="pregunta._id" class="mb-3 elevation-5">
    <v-card-title>
      <h4 class="title text-xs-center mx-auto" v-if="!pregunta.esSeccion">Pregunta #{{ index+1 }}</h4>
      <h4 class="title text-xs-center mx-auto" v-else>Sección #{{ index+1 }}</h4>
    </v-card-title>
    <v-card-title>
      <p class="text-xs-center mx-auto title">{{ pregunta.nombre }}</p>
    </v-card-title>
    <v-card-text>
      <label class="title">Descripción</label>
      <p v-html="pregunta.descripcion" class="mt-2"></p>
      <p class="text-xs-right">Puntaje: {{ pregunta.puntaje }} puntos</p>
    </v-card-text>
    <v-card-text v-if="pregunta.esSeccion">
      <v-layout row wrap>
        <v-flex xs12 v-for="(sub, j) in pregunta.subpreguntas" :key="pregunta._id + '-' + sub.orden">
          <v-divider class="mb-3"></v-divider>
          <calificar-sub-pregunta :sub="sub" :index="j" :idPregunta="pregunta._id"></calificar-sub-pregunta>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-text v-else>
      <v-layout row wrap>
        <v-flex xs7 class="pr-5">
          <h3 class="mb-3">Respuesta del estudiante</h3>
          <p v-if="pregunta.respuesta !== ''" v-html="pregunta.respuesta" style="text-align: justify;"></p>
          <p v-else>El estudiante no respondió esta pregunta.</p>
        </v-flex>
        <v-flex xs5>
          <h3 class="mb-3">Calificación</h3>
          <v-form>
            <v-layout row wrap>
              <v-flex xs12>
                <v-select :items="[0, 1, 2]" v-model="calificacion" label="Nota" :disabled="disabled"></v-select>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="feedback" label="Feedback" placeholder="Ej: Esta respuesta está incompleta porque..." required :disabled="disabled"></v-text-field>
              </v-flex>
              <v-flex xs4 offset-xs8>
                <v-btn class="indigo darken-5 white--text" @click.native="calificarPregunta" :disabled="disabled" :loading="loading">Calificar</v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-snackbar :timeout="snackbar.timeout" :color="snackbar.color" v-model="snackbar.active">
      {{ snackbar.text }}
      <v-btn dark flat @click.native="snackbar.active = false">x</v-btn>
    </v-snackbar>
  </v-card>
</template>
<script>
  export default {
    props: ['pregunta', 'index'],
    data () {
      return {
        calificacion: 0,
        feedback: '',
        calificada: false,
        loading: false,
        snackbar: {
          active: false,
          text: '',
          color: '',
          timeout: 3000
        }
      }
    },
    computed: {
      disabled () {
        return this.pregunta.calificada || this.calificada
      }
    },
    methods: {
      calificarPregunta () {
        this.calificada = true
        this.calificada = true
        this.loading = true
        const data = {
          calificacion: this.sub.calificacion,
          feedback: this.sub.feedback
        }
        this.$http.put(`/api/respuestas/calificar/leccion/${this.$route.params.id}/pregunta/${this.pregunta._id}/grupo/${this.$route.params.id_grupo}`, data)
          .then((response) => {
            this.loading = false
            this.snackbarSuccess()
          }, (err) => {
            this.loading = false
            this.calificada = true
            this.calificada = false
            this.snackbarError()
            console.log(err)
          })
      },
      snackbarSuccess () {
        this.snackbar.text = 'Calificación enviada.'
        this.snackbar.color = 'success'
        this.snackbar.active = true
      },
      snackbarError () {
        this.snackbar.text = 'Error al enviar calificación.'
        this.snackbar.color = 'error'
        this.snackbar.active = true
      }
    }
  }
</script>
