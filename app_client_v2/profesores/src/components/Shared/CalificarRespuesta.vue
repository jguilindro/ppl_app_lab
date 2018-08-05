<template>
  <v-layout row wrap style="clear: both;">
    <v-flex xs7 class="pr-5">
      <h3 class="mb-3">Respuesta del estudiante</h3>
      <p v-if="sub.respondida" v-html="sub.respuesta" style="text-align: justify;"></p>
      <img v-if="sub.imagen !== '' || sub.imagenes !== ''" :src="sub.imagen">
      <p v-if="!sub.respondida"><b><i>El estudiante no respondió esta pregunta.</i></b></p>
    </v-flex>
    <v-flex xs5>
      <h3 class="mb-3">Calificación</h3>
      <v-form>
        <v-layout row wrap>
          <v-flex xs12>
            <v-select :items="[0, 1, 2]" v-model="sub.calificacion" label="Nota" :disabled="disabled"></v-select>
          </v-flex>
          <v-flex xs12>
            <v-text-field v-model="sub.feedback" label="Feedback" placeholder="Ej: Esta respuesta está incompleta porque..." required :disabled="disabled" auto-grow multi-line rows="2"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-btn class="indigo darken-5 white--text" @click.native="calificarSubPregunta" :disabled="disabled" :loading="loading">Calificar</v-btn>
          </v-flex>
        </v-layout>
      </v-form>
    </v-flex>
    <v-snackbar :timeout="snackbar.timeout" :color="snackbar.color" v-model="snackbar.active">
      {{ snackbar.text }}
      <v-btn dark flat @click.native="snackbar.active = false">x</v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
  export default {
    props: ['sub', 'idPregunta', 'esSeccion'],
    data () {
      return {
        loading: false,
        error: '',
        calificada: false,
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
        return this.sub.calificada || this.calificada || !this.sub.respondida
      }
    },
    methods: {
      calificar () {
        if (this.esSeccion) {
          this.calificarSubPregunta()
        } else {
          this.calificarPregunta()
        }
      },
      calificarPregunta () {
        this.calificada = true
        this.calificada = true
        this.loading = true
        const data = {
          calificacion: this.sub.calificacion,
          feedback: this.sub.feedback
        }
        this.$http.put(`/api/respuestas/calificar/leccion/${this.$route.params.id}/pregunta/${this.idPregunta}/grupo/${this.$route.params.id_grupo}`, data)
          .then((response) => {
            this.loading = false
            this.snackbarSuccess()
            this.emitCalificacion(this.sub.calificacion)
          }, (err) => {
            this.loading = false
            this.calificada = true
            this.calificada = false
            this.snackbarError()
            console.log(err)
          })
      },
      calificarSubPregunta () {
        this.calificada = true
        this.loading = true
        const data = {
          ordenPregunta: this.sub.orden,
          calificacionNueva: this.sub.calificacion,
          feedbackNuevo: this.sub.feedback
        }
        this.$http.put(`/api/respuestas/calificar/sub/${this.$route.params.id}/pregunta/${this.idPregunta}/grupo/${this.$route.params.id_grupo}`, data)
          .then(() => {
            this.snackbarSuccess()
            this.emitCalificacion(this.sub.calificacion)
            this.loading = false
          }, (err) => {
            this.loading = false
            this.calificada = false
            this.error = err
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
      },
      emitCalificacion (calificacion) {
        this.$emit('calificacion', calificacion)
      }
    }
  }
</script>

<style scoped>

</style>
