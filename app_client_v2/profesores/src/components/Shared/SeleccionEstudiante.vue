<template>
  <v-card>
    <v-card-title primary-title>
      <h1 class="text-xs-center mx-auto">Selección de estudiante</h1>
    </v-card-title>
    <v-card-text>
      <v-layout row>
        <v-flex xs4>
          <h2 class="text-xs-center">Grupos</h2>
          <v-list class="pl-4" style="height: 500px; overflow: auto;">
            <template v-for="grupo in grupos" >
              <v-list-tile :key="grupo._id" avatar>
                <v-list-tile-content>
                  <v-checkbox v-model="grupoSel" :label="grupo.grupo.nombre" :value="grupo.grupo._id" class="pt-3"></v-checkbox>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider></v-divider>
            </template>
          </v-list>
        </v-flex>
        <v-flex xs8>
          <h2 class="text-xs-center">Estudiantes</h2>
          <v-list class="px-5">
            <template v-for="estudiante in estudiantes">
              <v-list-tile :key="estudiante._id" avatar>
                <v-list-tile-content>
                  <v-checkbox v-model="estudianteSel" :label="estudiante.nombres + ' ' + estudiante.apellidos" :value="estudiante._id" class="pt-3"></v-checkbox>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider></v-divider>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat class="indigo darken-5 white--text" :disabled="disabled" @click.native="continuar">
        Continuar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
  export default {
    mounted () {
      this.getRegistrosCalificaciones(this.$route.params.id)
    },
    data () {
      return {
        grupos: [],
        grupoSel: '',
        estudiantes: [],
        estudianteSel: ''
      }
    },
    watch: {
      grupoSel (value) {
        this.estudianteSel = ''
        if (value) {
          this.estudiantes = this.grupos.find((grupo) => {
            return grupo.grupo._id === value
          }).participantes
        } else {
          this.estudiantes = []
        }
      }
    },
    computed: {
      disabled () {
        return this.isEmpty(this.estudianteSel) || this.isEmpty(this.grupoSel)
      }
    },
    methods: {
      getRegistrosCalificaciones (idLeccion) {
        this.$http.get(`/api/calificaciones/${idLeccion}`)
          .then((response) => {
            this.grupos = response.body.datos.filter((calificaciones) => {
              return calificaciones.grupo !== null // Por el grupo que siempre se crea vacio...
            })
          })
          .catch((err) => {
            console.log(err)
          })
      },
      isEmpty (field) {
        return field === '' || field === null || field === undefined
      },
      continuar () {
        const idLeccion = this.$route.params.id
        this.$router.push(`/lecciones/${idLeccion}/calificar/${this.grupoSel}/${this.estudianteSel}`)
      }
    }
  }
</script>
