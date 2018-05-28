<template>
  <main>
    <v-alert :value="true" type="info" v-if="calificacionExistente">
      Ya se ha enviado una calificación del grupo {{ rubrica.grupo }}
    </v-alert>
    <v-card v-if="usuario">
      <v-card-title title>
        <h1 class="mx-auto">Rúbrica de exposición de problema en grupo</h1>
      </v-card-title>
      <v-card-title class="pb-0">
        <p class="mx-auto">{{ usuario.nombres }} {{ usuario.apellidos }}</p>
      </v-card-title>
      <v-card-text class="pt-0">
        <v-layout row wrap>
          <v-flex xs6 sm4 class="px-1">
            <v-dialog ref="fecha" v-model="dialogFecha" :return-value.sync="rubrica.fecha" persistent lazy full-width width="290px">
              <v-text-field slot="activator" v-model="rubrica.fecha" label="Fecha" readonly></v-text-field>
              <v-date-picker v-model="rubrica.fecha" scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="dialogFecha = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.fecha.save(rubrica.fecha)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-flex>
          <v-flex xs6 sm4 class="px-1">
            <v-select :items="materias" v-model="rubrica.materia" label="Materia"></v-select>
          </v-flex>
          <v-flex xs6 sm4>
            <v-select :items="capitulos" v-model="rubrica.capitulo" label="Capítulo"></v-select>
          </v-flex>
          <v-flex xs6 sm4 class="px-1">
            <v-select :items="paralelos" v-model="rubrica.paralelo" label="Paralelo"></v-select>
          </v-flex>
          <v-flex xs6 sm4 class="px-1">
            <v-select :items="grupos" v-model="rubrica.grupo" label="Grupo" @change="grupoOnChange"></v-select>
          </v-flex>
          <v-flex xs6 sm4 class="px-1">
            <v-select :items="ejercicios" v-model="rubrica.ejercicio" label="Ejercicio" @change="ejercicioOnChange" :disabled="!selectEjercicioHabilitado"></v-select>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-text v-if="habilitado">
        <rubrica :reglas="reglas" :total="rubrica.total" v-on:ponderar="ponderar"></rubrica>
      </v-card-text>
      <v-card-text v-if="habilitado">
        <v-layout row class="mt-3">
          <v-spacer></v-spacer>
          <v-btn class="indigo darken-5 white--text" :loading="loading" @click="calificar">
            Calificar
            <v-icon right>send</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialogApi" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Calificación exitosa</v-card-title>
        <v-card-text>Se ha ingresado su calificación a este ejercicio</v-card-text>
        <v-card-text>¿Desea continuar calificando o terminar?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="continuar">Continuar</v-btn>
          <v-btn color="green darken-1" flat @click.native="terminar">Terminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogError" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">¡Error!</v-card-title>
        <v-card-text>No se pudo guardar su calificación en la base de datos</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="terminar">Salir</v-btn>
          <v-btn color="green darken-1" flat @click.native="dialogError = false">Volver a intentar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </main>
</template>
<script>
  export default {
    computed: {
      usuario () {
        return this.$store.getters.usuario
      },
      habilitado () {
        return this.isNotEmpty(this.rubrica.fecha) && this.isNotEmpty(this.rubrica.materia) && this.isNotEmpty(this.rubrica.capitulo) && this.isNotEmpty(this.rubrica.paralelo) && this.isNotEmpty(this.rubrica.grupo) && this.isNotEmpty(this.rubrica.ejercicio)
      }
    },
    data () {
      return {
        dialogFecha: false,
        dialogApi: false,
        dialogError: false,
        loading: false,
        calificacionExistente: false,
        selectEjercicioHabilitado: false,
        arrayRegistros: [],
        materias: ['Física 3', 'Física 2', 'Física Conceptual'],
        capitulos: ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37'],
        paralelos: ['1', '2', '3', '4', '5'],
        grupos: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'],
        ejercicios: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'],
        reglas: {
          planteamiento: 0,
          desarrollo: 0,
          fisicos: 0,
          matematicos: 0,
          respuesta: 0,
          equipo: 0
        },
        rubrica: {
          fecha: new Date().toISOString().split('T')[0],
          materia: '',
          capitulo: '',
          paralelo: '',
          grupo: '',
          ejercicio: '',
          total: ''
        }
      }
    },
    methods: {
      calificar () {
        this.loading = true
        let calificaciones = [
          {
            regla: 'Planteamiento',
            calificacion: this.reglas.planteamiento
          },
          {
            regla: 'Desarrollo',
            calificacion: this.reglas.desarrollo
          },
          {
            regla: 'Físicos',
            calificacion: this.reglas.fisicos
          },
          {
            regla: 'Matemáticos',
            calificacion: this.reglas.matematicos
          },
          {
            regla: 'Respuesta',
            calificacion: this.reglas.respuesta
          },
          {
            regla: 'Equipo',
            calificacion: this.reglas.equipo
          }
        ]
        calificaciones = JSON.stringify(calificaciones)
        this.rubrica.evaluador = this.usuario._id
        let rubrica = JSON.stringify(this.rubrica)
        this.$http.post('/api/rubrica/', {rubrica, calificaciones})
          .then((response) => {
            this.loading = false
            this.dialogApi = response.body.estado
            this.dialogError = !response.body.estado
          }, (err) => {
            this.loading = false
            this.dialogApi = false
            this.dialogError = true
            console.log(err)
          })
      },
      terminar () {
        this.dialogApi = false
        this.dialogError = false
        this.$router.push('/')
      },
      continuar () {
        this.calificacionExistente = false
        this.dialogApi = false
        this.dialogError = false
        this.selectEjercicioHabilitado = false
        this.empty(this.reglas)
        this.empty(this.rubrica)
        this.rubrica.fecha = new Date().toISOString().split('T')[0]
      },
      getCalificaciones (paralelo, grupo, capitulo) {
        const url = `/api/rubrica/paralelo/${paralelo}/grupo/${grupo}/capitulo/${capitulo}`
        this.loading = true
        this.selectEjercicioHabilitado = false
        this.$http.get(url)
          .then((response) => {
            this.loading = false
            this.selectEjercicioHabilitado = response.body.estado
            if (response.body.estado) {
              this.arrayRegistros = response.body.datos
              this.calificacionExistente = (response.body.datos.length > 0)
            } else {
              this.arrayRegistros = []
            }
          }, (err) => {
            this.loading = false
            this.arrayRegistros = []
            console.log(err)
          })
      },
      isNotEmpty (value) {
        return value !== '' && value !== undefined && value !== null
      },
      grupoOnChange (value) {
        if (this.isNotEmpty(this.rubrica.paralelo) && this.isNotEmpty(this.rubrica.capitulo) && this.isNotEmpty(value)) {
          this.getCalificaciones(this.rubrica.paralelo, value, this.rubrica.capitulo)
        }
      },
      ejercicioOnChange (value) {
        if (this.ejercicios.includes(value)) {
          this.armarReglasCalificaciones(value, this.arrayRegistros)
        }
      },
      armarReglasCalificaciones (numEjercicio, arrayRegistros) {
        this.empty(this.reglas)
        this.rubrica.total = 0
        let ejercicioSel = arrayRegistros.find((elemento) => {
          return elemento.ejercicio === numEjercicio
        })
        if (this.isNotEmpty(ejercicioSel)) {
          this.asignarValoresReglas(ejercicioSel.calificaciones)
          this.rubrica.total = ejercicioSel.total
        }
      },
      asignarValoresReglas (calificaciones) {
        for (let j = calificaciones.length - 1; j >= 0; j--) {
          let calActual = calificaciones[j]
          let nombreRegla = this.parseNombreRegla(calActual.regla)
          this.reglas[nombreRegla] = calActual.calificacion
        }
      },
      empty (reglas) {
        for (let key in reglas) {
          if (typeof (reglas[key]) === 'string') {
            reglas[key] = ''
          } else if (typeof (reglas[key]) === 'number') {
            reglas[key] = 0
          }
        }
      },
      parseNombreRegla (regla) {
        return regla.toLowerCase().replace('í', 'i').replace('á', 'a')
      },
      ponderar (calificacion) {
        this.rubrica.total = ((calificacion * 15) / 18).toFixed(2)
      }
    }
  }
</script>
