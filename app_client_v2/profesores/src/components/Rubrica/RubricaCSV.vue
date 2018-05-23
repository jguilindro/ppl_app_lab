<template>
  <v-card>
    <v-card-title title>
      <h1 class="mx-auto">Rúbrica - CSV</h1>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-xl fluid>
        <v-layout row>
          <v-flex xs4>
            <v-select :items="materias" v-model="rubrica.materia" label="Materia"></v-select>
          </v-flex>
          <v-flex xs4>
            <v-select :items="capitulos" v-model="rubrica.capitulos" multiple label="Capítulo"></v-select>
          </v-flex>
          <v-flex xs4>
            <v-select :items="paralelos" v-model="rubrica.paralelos" multiple label="Paralelos"></v-select>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat @click="descargar" :loading="loading" :disabled="!habilitado">
        Descargar
        <v-icon right>get_app</v-icon>
      </v-btn>
      <a :hidden="true" :href="url" :download="'rubrica.xlsx'" ref="descargar"></a>
    </v-card-actions>
  </v-card>
</template>
<script>
  export default {
    computed: {
      habilitado () {
        return this.rubrica.materia !== '' && this.rubrica.materia !== undefined && this.rubrica.materia !== null && this.rubrica.capitulos !== undefined && this.rubrica.capitulos !== null && this.rubrica.capitulos.length > 0 && this.rubrica.paralelos !== undefined && this.rubrica.paralelos !== null && this.rubrica.paralelos.length > 0
      }
    },
    data () {
      return {
        materias: ['Física 3', 'Física 2', 'Física Conceptual'],
        capitulos: ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37'],
        paralelos: ['1', '2', '3', '4', '5'],
        rubrica: {
          materia: '',
          capitulos: [],
          paralelos: []
        },
        loading: false,
        url: ''
      }
    },
    methods: {
      descargar () {
        this.loading = true
        const csv = {
          materia: this.rubrica.materia,
          capitulos: JSON.stringify(this.rubrica.capitulos),
          paralelos: JSON.stringify(this.rubrica.paralelos)
        }
        this.$http.post('/api/rubrica/csv', csv)
          .then((response) => {
            this.loading = false
            if (response.body.estado) {
              this.generarLinkDescarga(response.body.datos)
            } else {
            }
          }, (err) => {
            this.loading = false
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
        this.$refs.descargar.click()
        window.URL.revokeObjectURL(this.url)
      }
    }
  }
</script>
<style>
</style>
