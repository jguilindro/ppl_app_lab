<style scoped>
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
  .border {
    margin-top: 0px;
    width: 100%;
    box-shadow: -1px 2px 5px 0px grey;
  }
  .border > * {
    display:inline-block;
    width: 100%;
  }
  .contenido {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 75%;
  }
  .contenido p span {
    font-size: 150% !important;
  }
  .contenido span {
    font-size: 150% !important;
  }
</style>
<template>
  <v-card v-if="leccion">
    <v-chip class="mx-auto border text-xs-center" label :color="setColor(leccion.estado)" text-color="white">
      <b style="right:5%; position:absolute;">{{ leccion.estado }}</b>
    </v-chip>
    <v-card-title primary-title>
        <h1 class="mx-auto display-1 headline mb-0">{{ leccion.nombre | capitalizeFirst}}</h1>        
    </v-card-title>
    <p class="text-xs-center">( <i>{{ leccion.tipo | capitalizeFirst }}</i> )</p>
    <v-card-title class="pt-0">      
    </v-card-title>
    <v-card-text>
      <v-layout row wrap>
        <v-flex xs6>
          <p class="text-xs-center"><b>Fecha prevista:</b> {{ leccion.fechaInicio | formatoCreatedAt }}</p>
        </v-flex>
        <v-flex xs6>
          <p class="text-xs-center"><b>Tiempo estimado:</b> {{ leccion.tiempoEstimado }} minutos</p>
        </v-flex>
        <v-flex xs6>
          <p v-if="leccion.fechaInicioTomada" class="text-xs-center"><b>Inicio:</b> {{ leccion.fechaInicioTomada | formatoHoraInicio }}</p>
        </v-flex>
        <v-flex xs6>
          <p v-if="leccion.fechaTerminada" class="text-xs-center"><b>Fin:</b> {{ leccion.fechaTerminada | formatoHoraInicio }}</p>
        </v-flex>
        <v-flex xs6>
          <p class="text-xs-center"><b>Puntaje:</b> {{ leccion.puntaje }} puntos</p>            
        </v-flex>
        <v-flex xs6>
          <p class="text-xs-center"><b>{{ leccion.nombreMateria }}</b> P{{ leccion.nombreParalelo }}</p>
        </v-flex>        
      </v-layout>
    </v-card-text>
    <v-divider></v-divider>
    <h2 class="mx-auto display-1 my-2">Preguntas</h2>
    <section v-for="pregunta in preguntas" :key="pregunta._id">      
      <v-card
      hover
      raised
      >
      <v-card-title primary-title>
        <h3 class="mb-2 headline mb-0">{{ pregunta.nombre }}</h3>
      </v-card-title>
        <v-card-text  @click="goToPregunta(pregunta._id)">
          <p v-html="pregunta.descripcion" class="contenido"></p>
        </v-card-text>
      </v-card>
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
