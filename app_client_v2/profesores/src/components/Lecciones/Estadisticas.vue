<template>
  <v-card>
    <v-card-title>
      <h1 class="mx-auto display-1">Estadísticas</h1>
    </v-card-title>
    <v-card-text v-if="leccion">
      <v-layout row wrap>
        <v-flex xs12 md8 class="mt-2">
          <v-card height="100%" raised>
            <v-card-text>
              <chartjs-bar :datalabel="'Calificación general'" :labels="grupos" :data="calificaciones" :backgroundcolor="arrayColores"></chartjs-bar>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 md4 class="mt-2">
          <v-card height="100%" raised>
            <v-card-title>
              <h3 class="mx-auto display-1">Datos</h3>
            </v-card-title>
            <v-card-text>
              <h3 class="mx-auto title" style="text-align: center;">{{ leccion.nombre }}</h3>
              <p class="mx-auto mt-3" style="text-align: center;">{{leccion.nombreMateria}} P{{leccion.nombreParalelo}}</p>
              <p><b>Tipo: </b>{{leccion.tipo | capitalizeFirst }}</p>
              <p><b>Calificación Mínima:</b> {{estadisticas.min.calificacion}} ({{estadisticas.min.grupo}})</p>
              <p><b>Calificación Máxima:</b> {{estadisticas.max.calificacion}} ({{estadisticas.max.grupo}})</p>
              <p><b>Promedio:</b> {{estadisticas.prom}}</p>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout row wrap class="mt-3">
        <v-flex xs12 md8 v-if="datasets.length > 0" class="mt-2">
          <v-card height="100%" raised>
            <v-card-text>
              <chartjs-bar :labels="labelsPreguntas" :datasets="datasets"></chartjs-bar>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 md4 class="mt-2">
          <v-card height="100%" raised>
            <v-card-text>
              <v-list two-line>
                <v-list-tile>
                  <v-list-tile-title style="text-align: center;">
                    <h3 class="title" v-if="leccion.tipo == 'estimacion|laboratorio'">Preguntas</h3>
                    <h3 class="title" v-if="leccion.tipo == 'tutorial'">Secciones</h3>
                  </v-list-tile-title>
                </v-list-tile>
                <v-divider></v-divider>
                <template v-for="(pregunta, index) in leccion.preguntas">
                  <v-list-tile :key="pregunta.pregunta._id" avatar ripple @click="goToPregunta(pregunta.pregunta._id)">
                    <v-list-tile-content>
                      <v-list-tile-title>
                        <p v-if="leccion.tipo == 'estimacion|laboratorio'">Pregunta #{{(index+1)}}</p>
                        <p v-if="leccion.tipo == 'tutorial'">Sección #{{(index+1)}}</p>
                      </v-list-tile-title>
                      <v-list-tile-sub-title>{{ pregunta.pregunta.nombre }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </template>
              </v-list>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-text class="loading-card-text" v-else>
      <v-progress-circular class="mx-auto" :size="50" indeterminate color="primary"></v-progress-circular>
    </v-card-text>
  </v-card>
</template>
<script>
  export default {
    mounted () {
      this.getEstadisticasLeccion(this.$route.params.id)
      this.getEstadisticasPreguntas(this.$route.params.id)
    },
    data () {
      return {
        grupos: [],
        calificaciones: [],
        arrayColores: [],
        leccion: null,
        estadisticas: {
          min: null,
          max: null,
          prom: 0.00
        },
        labelsPreguntas: [],
        datasets: []
      }
    },
    methods: {
      getEstadisticasLeccion (idLeccion) {
        this.$http.get(`/api/lecciones/${idLeccion}/estadisticas`)
          .then((res) => {
            if (res.body.estado) {
              this.grupos = res.body.datos.grupos
              this.calificaciones = res.body.datos.calificaciones
              this.leccion = res.body.datos.leccion
              this.estadisticas.min = res.body.datos.min
              this.estadisticas.max = res.body.datos.max
              this.estadisticas.prom = res.body.datos.prom
              this.arrayColores = this.formarColores(this.calificaciones)
            } else {
              console.log(res.body)
            }
          }, (err) => {
            console.log(err)
          })
      },
      getEstadisticasPreguntas (idLeccion) {
        this.$http.get(`/api/lecciones/${idLeccion}/estadisticas/preguntas`)
          .then((res) => {
            if (res.body.estado) {
              this.labelsPreguntas = res.body.datos.labels
              this.datasets.push(this.armarDataset('0', res.body.datos.cal0, Array(res.body.datos.cal0.length).fill('rgba(198, 40, 40, 0.3)')))
              this.datasets.push(this.armarDataset('1', res.body.datos.cal1, Array(res.body.datos.cal1.length).fill('rgba(255, 143, 0, 0.3)')))
              this.datasets.push(this.armarDataset('2', res.body.datos.cal2, Array(res.body.datos.cal2.length).fill('rgba(255, 235, 59, 0.3)')))
            } else {
              console.log(res.body)
            }
          }, (err) => {
            console.log(err)
          })
      },
      formarColores (calificaciones) {
        let arrayColores = []
        for (let i = 0; i < calificaciones.length; i++) {
          let actual = calificaciones[i]
          if (actual > 70) {
            arrayColores.push('rgba(141, 185, 99, 0.3)')
          } else if (actual > 50) {
            arrayColores.push('rgba(255, 235, 59, 0.3)')
          } else {
            arrayColores.push('rgba(198, 40, 40, 0.3)')
          }
        }
        return arrayColores
      },
      armarDataset (label, data, backgroundColor) {
        return {
          label,
          data,
          backgroundColor
        }
      },
      goToPregunta (id) {
        this.$router.push(`/preguntas/${id}`)
      }
    }
  }
</script>
<style>
  .loading-card-text {
    text-align: center;
  }
</style>
