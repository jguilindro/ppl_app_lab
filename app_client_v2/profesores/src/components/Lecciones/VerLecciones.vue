<template>
  <v-card>
    <v-card-title primary-title>
      <h1 class="mx-auto display-1">Lecciones</h1>
    </v-card-title>
    <v-layout row class="mb-3">
      <v-flex xs6 class="pl-4">
        <v-text-field
          v-model="dataTable.search"
          append-icon="search"
          label="Búsqueda"
          single-line
          hide-details
        ></v-text-field>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs4 lg2 class="pl-5">
        <v-tooltip top>
          <v-btn icon class="green white--text" medium slot="activator">
            <v-icon>get_app</v-icon>
          </v-btn>
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
    <v-data-table :headers="dataTable.headers" :items="lecciones" class="elevation-1" :loading="dataTable.loading" :search="dataTable.search">
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.item.nombre }}</td>
        <td>{{ props.item.tipo | capitalizeFirst }}</td>
        <td>{{ props.item.nombreMateria }}@{{ props.item.nombreParalelo }}</td>
        <td>{{ props.item.createdAt | formatoCreatedAt}}</td>
        <td>{{ props.item.fechaInicioTomada | formatoHoraInicio}}</td>
        <td>{{ props.item.fechaTerminada | formatoHoraInicio}}</td>
        <td>
          <v-chip outline label :color="setColor(props.item.estado)">{{ props.item.estado }}</v-chip>
        </td>
        <td>
          <v-btn v-if="props.item.estado === 'pendiente'" class="indigo darken-5 white--text">
            Tomar
          </v-btn>
          <v-btn v-else-if="props.item.estado === 'tomando'" class="orange darken-3 white--text">
            Entrar
          </v-btn>
          <v-btn v-else-if="props.item.estado === 'terminado'" class="green white--text">
            Calificar
          </v-btn>
          <v-btn v-if="props.item.estado === 'calificado'" class="yellow darken-3 white--text">
            Recalificar
          </v-btn>
          <v-btn v-if="props.item.estado === 'calificado'" class="blue accent-4 white--text">
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
          search: '',
          headers: [
            {
              text: 'Nombre',
              value: 'nombre',
              class: 'header-center'
            },
            {
              text: 'Tipo',
              value: 'tipo',
              class: 'header-center'
            },
            {
              text: 'Materia/Paralelo',
              value: 'materia',
              class: 'header-center'
            },
            {
              text: 'Fecha Creada',
              value: 'createdAt',
              class: 'header-center'
            },
            {
              text: 'Fecha Tomada',
              value: 'fechaInicioTomada',
              class: 'header-center'
            },
            {
              text: 'Hora Terminada',
              value: 'fechaTerminada',
              class: 'header-center'
            },
            {
              text: 'Estado',
              value: 'estado',
              class: 'header-center'
            },
            {
              text: 'Acción',
              class: 'header-center'
            }
          ],
          loading: false,
          error: false
        }
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
      }
    }
  }
</script>
<style>
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
  .header-center {
    text-align: center !important;
    font-weight: bold !important;
  }
</style>
