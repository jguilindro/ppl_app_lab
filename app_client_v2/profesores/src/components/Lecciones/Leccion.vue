<template>
  <v-card v-if="leccion">
    <v-card-title>
      <h1 class="mx-auto display-1">{{ leccion.nombre }}</h1>
    </v-card-title>
    <v-card-title class="pt-0">
      <v-chip class="mx-auto" outline label :color="setColor(leccion.estado)">{{ leccion.estado }}</v-chip>
    </v-card-title>
    <v-card-text>
      <v-layout>
        <v-flex xs6>
          <p>Fecha prevista: {{ leccion.fechaInicio | formatoCreatedAt }}</p>
          <p v-if="leccion.fechaInicioTomada">Inicio: {{ leccion.fechaInicioTomada | formatoHoraInicio }}</p>
          <p v-if="leccion.fechaTerminada">Fin: {{ leccion.fechaTerminada | formatoHoraInicio }}</p>
          <p>{{ leccion.nombreMateria }} P{{ leccion.nombreParalelo }}</p>
          <p>Tiempo estimado: {{ leccion.tiempoEstimado }} minutos</p>
          <p>Puntaje: {{ leccion.puntaje }} puntos</p>
          <p>Tipo: {{ leccion.tipo | capitalizeFirst}}</p>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-divider></v-divider>
    <h2 class="mx-auto display-1 my-2">Preguntas</h2>
    <section v-for="pregunta in preguntas" :key="pregunta._id">
      <v-card-text  @click="goToPregunta(pregunta._id)" class="pregunta">
        <h3 class="mb-2">{{ pregunta.nombre }}</h3>
        <p v-html="pregunta.descripcion"></p>
      </v-card-text>
      <v-divider></v-divider>
    </section>
  </v-card>
</template>
<script>
  export default {
    mounted () {
      let id = this.$route.params.id
      this.getLeccion(id)
    },
    computed: {
      lecciones () {
        return this.$store.getters.lecciones
      }
    },
    data () {
      return {
        leccion: null,
        preguntas: []
      }
    },
    methods: {
      getLeccion (id) {
        this.$http.get(`/api/lecciones/${id}`)
          .then((response) => {
            if (response.body.estado) {
              this.leccion = response.body.datos
              this.getPreguntas(this.leccion)
            } else {
              console.log(response)
            }
          }, (err) => {
            console.log(err)
          })
      },
      getPreguntas (leccion) {
        this.preguntas = []
        for (let i = 0; i < leccion.preguntas.length; i++) {
          this.$http.get(`/api/preguntas/${leccion.preguntas[i].pregunta}`)
            .then((response) => {
              this.preguntas.push(response.body.datos)
            })
        }
      },
      goToPregunta (id) {
        this.$router.push(`/preguntas/${id}`)
      },
      setColor (estado) {
        if (estado === 'terminado') {
          return 'green'
        } else if (estado === 'pendiente') {
          return 'red'
        } else if (estado === 'tomando') {
          return 'orange'
        } else if (estado === 'calificado') {
          return 'blue'
        }
      }
    }
  }
</script>
<style>
  span.chip__content {
    text-transform: uppercase;
  }
  h1.display-1, h2.display-1 {
    text-align: center;
  }
  .pregunta:hover {
    background-color: rgba(192,192,192,0.4);
    cursor: pointer;
  }
</style>
