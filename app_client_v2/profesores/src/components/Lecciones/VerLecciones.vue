<style scoped>
  th {
    color: #001a43 !important;
  }
  td button {
    width: 125px !important;
    max-width:  125px !important;
    min-width: 125px !important;
  }
  span.chip__content {
    text-transform: uppercase;
  }
  table {
    text-align: center !important;
  }
</style>

<template>
  <v-card>
    <v-card-title primary-title>
      <h1 class="mx-auto display-1">Lecciones</h1>
    </v-card-title>
    <v-layout row class="mb-3">
      <v-flex xs6 class="pl-4">
        <v-text-field v-model="dataTable.search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs4 lg2 class="pl-5">
        <v-tooltip top>
          <v-btn icon class="green white--text" medium slot="activator" @click="csv">
            <v-icon>get_app</v-icon>
          </v-btn>
          <a :hidden="true" :href="url" :download="'calificaciones.xlsx'" ref="descargar"></a>
          <span>Descargar</span>
        </v-tooltip>
        <v-tooltip top>
          <v-btn icon class="red white--text" medium slot="activator" router :to="'/lecciones/crear'">
            <v-icon>add</v-icon>
          </v-btn>
          <span>Nueva</span>
        </v-tooltip>
      </v-flex>
    </v-layout>
    <v-data-table :headers="dataTable.headers" :items="lecciones" class="elevation-1" :loading="dataTable.loading" :search="dataTable.search" :pagination.sync="dataTable.pagination">
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td class="text-xs-center" @click="leccion(props.item._id)" style="cursor: pointer;">{{ props.item.nombre }}</td>
        <td class="text-xs-center">{{ props.item.tipo | capitalizeFirst }}</td>
        <td class="text-xs-center">{{ props.item.nombreMateria }}@{{ props.item.nombreParalelo }}</td>
        <td class="text-xs-center">{{ props.item.createdAt | formatoCreatedAt}}</td>
        <td class="text-xs-center">{{ props.item.fechaInicioTomada | formatoHoraInicio}}</td>
        <td class="text-xs-center">{{ props.item.fechaTerminada | formatoHoraInicio}}</td>
        <td class="text-xs-center">
          <v-chip outline label :color="setColor(props.item.estado)">{{ props.item.estado | capitalizeFirst }}</v-chip>
        </td>
        <td class="text-xs-center">
          <v-btn v-if="props.item.estado === 'pendiente'" class="indigo darken-5 white--text" @click.native="tomarLeccion(props.item._id, props.item.paralelo)">
            Tomar
          </v-btn>
          <v-btn v-else-if="props.item.estado === 'tomando'" class="orange darken-3 white--text" router :to="'/leccion-panel/' + props.item._id + '/' + props.item.paralelo">
            Entrar
          </v-btn>
          <v-btn v-else-if="props.item.estado === 'terminado'" class="green white--text" router :to="'/lecciones/' + props.item._id + '/grupos'">
            Calificar
          </v-btn>
          <v-btn v-if="props.item.estado === 'calificado'" class="yellow darken-3 white--text" router :to="'/lecciones/' + props.item._id + '/grupos'">
            Recalificar
          </v-btn>
          <v-btn v-if="props.item.estado === 'calificado'" class="blue accent-4 white--text" router :to="`/lecciones/${props.item._id}/estadisticas`">
            Estadísticas
          </v-btn>
        </td>
      </template>
      <template slot="no-data">
        <v-alert :value="dataTable.error" color="error" icon="warning">
          No se encontraron resultados para su búsqueda
        </v-alert>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
  export default {
    computed: {
      lecciones () {
        return this.$store.getters.lecciones
      }
    },
    data () {
      return {
        dataTable: {
          pagination: {
            sortBy: 'createdAt',
            descending: true
          },
          search: '',
          headers: [
            {
              text: 'Nombre',
              value: 'nombre',
              class: 'text-xs-center'
            },
            {
              text: 'Tipo',
              value: 'tipo',
              class: 'text-xs-center'
            },
            {
              text: 'Materia/Paralelo',
              value: 'materia',
              class: 'text-xs-center'
            },
            {
              text: 'Fecha Creada',
              value: 'createdAt',
              class: 'text-xs-center'
            },
            {
              text: 'Fecha Tomada',
              value: 'fechaInicioTomada',
              class: 'text-xs-center'
            },
            {
              text: 'Hora Terminada',
              value: 'fechaTerminada',
              class: 'text-xs-center'
            },
            {
              text: 'Estado',
              value: 'estado',
              class: 'text-xs-center'
            },
            {
              text: 'Acción',
              class: 'text-xs-center'
            }
          ],
          loading: false,
          error: false
        },
        url: ''
      }
    },
    methods: {
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
      },
      csv () {
        this.$http.post('/api/calificaciones/csv')
          .then((response) => {
            console.log(response)
            if (response.body.estado) {
              this.generarLinkDescarga(response.body.datos)
            } else {
              console.log('ERROR')
            }
          }, (err) => {
            console.log(err)
          })
      },
      generarLinkDescarga (datos) {
        let byteCharacters = atob(datos)
        let byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        let byteArray = new Uint8Array(byteNumbers)
        let blob = new Blob([byteArray], {type: 'application/octet-stream'})
        this.url = window.URL.createObjectURL(blob)
        this.$refs.descargar.download = 'aux.xlsx'
        this.$refs.descargar.click()
        window.URL.revokeObjectURL(this.url)
      },
      leccion (id) {
        this.$router.push('/lecciones/' + id)
      },
      tomarLeccion (idLeccion, idParalelo) {
        this.$store.dispatch('leccionRealTime/tomar', { idLeccion, idParalelo })
      }
    }
  }
</script>
