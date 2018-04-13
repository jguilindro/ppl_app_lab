<template>
  <div class="lecciones">
              <!-- <v-list-tile-action>
            <v-list-tile-action-text>{{ leccion.calificacion }}</v-list-tile-action-text>
          </v-list-tile-action> -->
          <!-- <img id="logo_espol" src="/assets/logo_espol_new.png" alt=""> -->
    <v-list two-line>
      <template v-for="(leccion, index) in lecciones">
        <v-list-tile avatar ripple :key="index" @click="irLeccion(leccion.id, leccion.calificacion)">
          <v-list-tile-avatar>

                {{ leccion.calificacion }}
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ leccion.nombre }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ leccion.tipo }}</v-list-tile-sub-title>
            <v-list-tile-sub-title>{{ leccion.fechaInicioTomada | timeFromDate }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider v-if="index + 1 < lecciones.length" :key="`divider-${index}`"></v-divider>
      </template>
    </v-list>
    <!-- <v-card> -->
      <!-- <v-container
        fluid
        style="min-height: 0;"
        grid-list-lg
      >
        <v-layout row wrap>
           <v-flex xs12 v-for="(leccion, index) in lecciones" :key="index">
            <v-card >
              <v-container fluid grid-list-lg>
                <v-layout row>
                  <v-flex xs7>
                    <div>
                      <div class="headline">{{ leccion.nombre }}</div>
                      <div> {{ leccion.fechaTerminada | timeFromDate }} </div>
                      <div> {{ leccion.tipo }} </div>
                    </div>
                  </v-flex>
                  <v-flex xs5>
                    <v-card-media
                      src="/static/doc-images/cards/halcyon.png"
                      height="125px"
                      contain
                    ></v-card-media>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container> -->
    <!-- </v-card> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import router from '../router'

export default {
  computed: mapGetters([
    'lecciones'
  ]),
  methods: {
    irLeccion (leccionId, calificacion) {
      if (calificacion) {
        router.push({name: 'Leccion', params: { leccionId }})
      }
    }
  }
}
</script>
<style scoped>

</style>
