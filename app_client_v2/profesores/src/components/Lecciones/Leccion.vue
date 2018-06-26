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
  p img {
    max-width: -webkit-fill-available !important;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
</style>

<template>
  <v-card v-if="leccion">
    <v-card-title>
      <h1 class="mx-auto display-1">{{ leccion.nombre }}</h1>
    </v-card-title>
    <v-card-title class="pt-0">
      <v-chip class="mx-auto" outline label :color="setColor(leccion.estado)">{{ leccion.estado }}</v-chip>
    </v-card-title>
    <v-card-text>
      <v-layout row wrap>
        <v-flex xs12 sm4>
          <v-list class="text-xs-center">
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>
                  <v-icon>school</v-icon>
                  {{ leccion.nombreMateria }} P{{ leccion.nombreParalelo }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>
                  <v-icon>subject</v-icon>
                  {{ leccion.tipo | capitalizeFirst}}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-flex>
        <v-flex xs12 sm4>
          <v-list>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>
                  <v-icon>grade</v-icon>
                  {{ leccion.puntaje }} puntos
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>
                  <v-icon>timer</v-icon>
                  {{ leccion.tiempoEstimado }} minutos
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-flex>
        <v-flex xs12 sm4>
          <v-list>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>
                  <v-icon>event</v-icon>
                  {{ leccion.fechaInicio | formatoCreatedAt }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
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
    <v-card-actions v-if="leccion.estado === 'pendiente'">
      <v-tooltip top>
        <v-btn icon large slot="activator">
          <v-icon>delete</v-icon>
        </v-btn>
        <span>Eliminar</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <v-btn icon large slot="activator">
          <v-icon>edit</v-icon>
        </v-btn>
        <span>Editar</span>
      </v-tooltip>
    </v-card-actions>
    <v-card-actions v-else>
      <p class="caption mx-auto">**No puede editar ni eliminar una lección que ya ha sido tomada.</p>
    </v-card-actions>
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
