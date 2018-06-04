<template>
  <v-container white mx-0 px-0>
    <v-card-title class="justify-center" >
       <span class="display-1 espol text-xs-center pb-5">Banco de Preguntas</span>
    </v-card-title>
    <v-layout row wrap>
        <v-flex  d-flex xs4 md4  offset-xs1>
          <v-select
            :items="materias"
            v-model="materia"
            class="input-group--focused"
            hint="Seleccione la materia"
            persistent-hint
            label="Materia"
            item-value="value"
            @input="filtrarPreguntas"
          ></v-select>
        </v-flex>
        <v-flex  d-flex xs4  md4 offset-md1  offset-xs1>
          <v-select
            :items="tipospregunta"
            v-model="tipoLeccion"
            class="input-group--focused"
            label="Tipo de pregunta"
            hint="Seleccione el tipo de pregunta"
            persistent-hint
            item-value="value"
            @input="filtrarPreguntas"
          ></v-select>
        </v-flex>
    </v-layout>

    <v-container
        fluid
        style="min-height: 0;"
        grid-list-lg
      >
        <v-layout row wrap>
          <v-flex xs12 md10 offset-md1>

            <v-card v-for="capitulo in capitulosSelect" v-if="capitulosSelect.length > 0" :key="capitulosSelect.indexOf(capitulo)" class="mt-1 px-3 pb-1 elevation-24">
              <v-card-actions>
                <span>{{capitulo.nombre}}</span>
                <v-spacer></v-spacer>
                <v-btn icon @click.native="capitulo.showCap = !capitulo.showCap">
                  <v-icon>{{ capitulo.showCap ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                </v-btn>
              </v-card-actions>
              <v-slide-y-transition>
              <v-card-text  v-show="capitulo.showCap">
                  <v-card v-for="pregunta in preguntasSelect" v-if="pregunta.capitulo._id === capitulo._id" :key="preguntas.indexOf(pregunta)" class="mt-2 px-5 elevation-10" ripple :to= '"/preguntas/"+ pregunta._id'>
                    <v-card-title primary-title class="mb-0 pb-0">
                      <div class="headline">{{pregunta.nombre}}</div>
                    </v-card-title>
                    <v-card-text  class="mt-0 pt-0">
                      <div class="caption">Creador: {{ pregunta.creador.nombres }} {{ pregunta.creador.apellidos }}</div>
                      <div class="caption">Fecha: {{ formatFecha(pregunta.createdAt) }}</div>
                    </v-card-text>
                    <v-card-media class="preview">
                      <div v-html="pregunta.descripcion"></div>
                    </v-card-media>
                    <v-card-actions v-if="pregunta.subpreguntas.length > 0">
                      <p class="blue--text text--darken-2 caption">Esta pregunta tiene subpreguntas</p>
                    </v-card-actions>
                    <v-divider></v-divider>
                  </v-card>
              </v-card-text>
            </v-slide-y-transition>

          </v-card>

          </v-flex>
        </v-layout>
      </v-container>

  </v-container >
</template>

<script>
export default {
  mounted () {
    this.getPreguntas()
    this.getCapitulos()
  },
  data: () => ({
    loading: false,
    materia: '',
    tipoLeccion: '',
    error: null,
    materias: [],
    tipospregunta: ['Tutorial', 'Laboratorio', 'Estimacion'],
    capitulos: [],
    preguntas: [],
    capitulosSelect: [],
    preguntasSelect: []
  }),
  methods: {
    getCapitulos () {
      this.$http.get(`/api/capitulos/`)
      .then((response) => {
        if (response.body.estado) {
          this.capitulos = response.body.datos
          this.capitulos.sort(function (a, b) {
            if (a.nombre > b.nombre) {
              return 1
            }
            if (a.nombre < b.nombre) {
              return -1
            }
            return 0
          })
          for (let cap of this.capitulos) {
            this.$set(cap, 'showCap', false)
          }
          this.getMaterias()
        } else {
          this.error = response.body
        }
      }, (err) => {
        this.error = err
      })
    },
    getPreguntas () {
      this.$http.get(`/api/preguntas/`)
      .then((response) => {
        if (response.body.estado) {
          this.preguntas = response.body.datos
        }
      }, (err) => {
        this.error = err
      })
    },
    getMaterias () {
      let materias = new Set(null)
      for (let cap of this.capitulos) {
        if (cap.nombreMateria !== '') {
          materias.add(cap.nombreMateria)
        }
      }
      this.materias = Array.from(materias)
    },
    filtrarPreguntas () {
      this.capitulosSelect = this.capitulos.filter(capitulo =>
        capitulo.nombreMateria === this.materia).filter(capitulo => capitulo.nombre !== '')
      this.capitulosSelect.sort(function (a, b) {
        if (a.nombre > b.nombre) {
          return 1
        }
        if (a.nombre < b.nombre) {
          return -1
        }
        return 0
      })
      this.preguntasSelect = this.preguntas.filter(pregunta => pregunta.tipoLeccion === this.tipoLeccion.toLowerCase())
    },
    formatFecha (fecha) {
      return Date(fecha)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  v-card{
    width: 100% !important;
  }

  .preview{
    max-height: 100px !important;
  }

</style>
