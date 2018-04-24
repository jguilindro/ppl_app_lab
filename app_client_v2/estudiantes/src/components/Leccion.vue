<template>
  <v-card>
  <v-container fluid style="min-height: 0;" grid-list-lg>
      <h1>{{ leccion.nombre }}</h1>
      <v-avatar size="50px" slot="activator" class="blue" >
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
        <v-card >
          <v-card-title primary-title>
            <v-layout row wrap>
              <v-flex xs12>
                <h2>Pregunta {{ index + 1 }}</h2>
              </v-flex>
              <v-flex xs12>
                <v-avatar size="30px" slot="activator" class="red" v-if="pregunta.puntaje != pregunta.calificacion">
                  <span class="white--text" >{{ pregunta.calificacion }}/{{ pregunta.puntaje }}</span>
                </v-avatar>
                <v-avatar size="30px" slot="activator" class="green" v-if="pregunta.puntaje == pregunta.calificacion">
                  <span class="white--text" >{{ pregunta.calificacion }}/{{ pregunta.puntaje }}</span>
                </v-avatar>
              </v-flex>
              <v-flex xs12 v-for="(respuesta, i) in pregunta.respuestas" :key="i">
                <v-card color="blue-grey darken-2" class="white--text">
                  <!-- respuesta sin imagen -->
                  <v-card-title primary-title v-if="!respuesta.imagenes">
                    <div class="grey--text">{{ respuesta.estudiante.apellidos }}</div>
                  </v-card-title>
                  <v-card-text v-if="!respuesta.imagenes && respuesta.respuesta">
                      {{ respuesta.respuesta }}
                  </v-card-text>

                  <!-- respuesta con imagen -->
                  <v-container fluid grid-list-lg v-if="respuesta.imagenes && respuesta.imagenes != '' && respuesta.respuesta != ''">
                    <v-layout row>
                      <v-flex xs7>
                        <div>
                          <div class="grey--text">{{ respuesta.estudiante.apellidos }}</div>
                          <div>{{ respuesta.respuesta }}</div>
                        </div>
                      </v-flex>

                      <v-flex xs5 class="images" >
                        <v-card-media  height="125px" v-viewer="{'title': false, 'navbar': false, 'scalable': false }">
                          <img :src="respuesta.imagenes">
                        </v-card-media>
                      </v-flex>
                    </v-layout>
                  </v-container>

                  <!-- sin respuesta con imagen -->
                  <v-container fluid grid-list-lg v-if="!respuesta.respuesta && respuesta.imagenes">
                    <v-layout row justify-space-around>
                      <v-flex xs7>
                        <div>
                          <div class="grey--text">{{ respuesta.estudiante.apellidos }}</div>
                        </div>
                      </v-flex>
                      <v-flex xs5>
                        <v-card-media  height="125px" v-viewer="{'title': false, 'navbar': false, 'scalable': false }">
                          <img :src="respuesta.imagenes">
                        </v-card-media>
                      </v-flex>
                    </v-layout>
                  </v-container>
                  <v-card-actions v-if="!respuesta.respuesta && !respuesta.imagenes">
                    <v-flex xs12 class="text-xs-center">
                      <span >NO RESPONDIÓ</span>
                    </v-flex>

                  </v-card-actions>
                </v-card>
              </v-flex>

              <v-flex xs12 v-if="pregunta.feedback != ''" >
                <v-card color="cyan darken-2" class="white--text text-xs-center">
                  <v-card-title primary-title >
                    <div>{{ pregunta.feedback }}</div>
                  </v-card-title>
                </v-card>
              </v-flex>
            </v-layout>
          </v-card-title>
        </v-card>
        <v-divider dark inset></v-divider>
      </div>

      <!-- Preguntas con secciones -->
      <div v-if="obtenerTipo === 'secciones'" v-for="(seccion, indexSeccion) in leccion.secciones" :key="indexSeccion">
          <div v-for="(pregunta, indexPreguntas) in seccion.preguntas" :key="indexPreguntas">
            <v-card >
              <v-card-title primary-title>
                <v-layout row wrap>
                  <v-flex xs12>
                    <h2>Sección {{ indexSeccion + 1 }}</h2>
                    <h3>Pregunta {{ indexPreguntas + 1 }}</h3>
                  </v-flex>
                  <v-flex xs12>
                    <v-avatar size="30px" slot="activator" class="red" v-if="pregunta.puntaje != pregunta.calificacion">
                      <span class="white--text" >{{ pregunta.calificacion }}/{{ pregunta.puntaje }}</span>
                    </v-avatar>
                    <v-avatar size="30px" slot="activator" class="green" v-if="pregunta.puntaje == pregunta.calificacion">
                      <span class="white--text" >{{ pregunta.calificacion }}/{{ pregunta.puntaje }}</span>
                    </v-avatar>
                  </v-flex>
                  <v-flex xs12 v-for="(respuesta, i) in pregunta.respuestas" :key="i">
                    <v-card color="blue-grey darken-2" class="white--text">

                      <!-- respuesta sin imagen -->
                      <v-card-title primary-title v-if="!respuesta.imagenes">
                        <div class="grey--text">{{ respuesta.estudiante.apellidos }}</div>
                      </v-card-title>
                      <v-card-text v-if="!respuesta.imagenes && respuesta.respuesta">
                          {{ respuesta.respuesta }}
                      </v-card-text>

                      <!-- respuesta con imagen -->
                      <v-container fluid grid-list-lg v-if="respuesta.imagenes && respuesta.imagenes != '' && respuesta.respuesta != ''">
                        <v-layout row>
                          <v-flex xs7>
                            <div>
                              <div class="grey--text">{{ respuesta.estudiante.apellidos }}</div>
                              <div>{{ respuesta.respuesta }}</div>
                            </div>
                          </v-flex>

                          <v-flex xs5 class="images" >
                            <v-card-media  height="125px" v-viewer="{'title': false, 'navbar': false, 'scalable': false }">
                              <img :src="respuesta.imagenes">
                            </v-card-media>
                          </v-flex>
                        </v-layout>
                      </v-container>

                      <!-- sin respuesta con imagen -->
                      <v-container fluid grid-list-lg v-if="!respuesta.respuesta && respuesta.imagenes">
                        <v-layout row justify-space-around>
                          <v-flex xs7>
                            <div>
                              <div class="grey--text">{{ respuesta.estudiante.apellidos }}</div>
                            </div>
                          </v-flex>
                          <v-flex xs5>
                            <v-card-media  height="125px" v-viewer="{'title': false, 'navbar': false, 'scalable': false }">
                              <img :src="respuesta.imagenes">
                            </v-card-media>
                          </v-flex>
                        </v-layout>
                      </v-container>
                      <v-card-actions v-if="!respuesta.respuesta && !respuesta.imagenes">
                        <v-flex xs12 class="text-xs-center">
                          <span >NO RESPONDIÓ</span>
                        </v-flex>

                      </v-card-actions>
                    </v-card>
                  </v-flex>

                  <v-flex xs12 v-if="pregunta.feedback != ''" >
                    <v-card color="cyan darken-2" class="white--text text-xs-center">
                      <v-card-title primary-title >
                        <div>{{ pregunta.feedback }}</div>
                      </v-card-title>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-card-title>
            </v-card>
          </div>
        <v-divider dark inset></v-divider>
      </div>
  </v-container>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
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
  methods: {
  },
  data () {
    return {
    }
  },
  mounted () {
    const leccionId = this.$route.params.leccionId
    this.$store.dispatch('leccionDatos', leccionId)
  }
}
</script>

<style scoped>
</style>
