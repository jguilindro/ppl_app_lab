<template>
  <main>
    <v-form>
      <v-layout row wrap>
        <v-flex xs12>
          <h2 class="mx-auto">Planteamiento</h2>
          <v-radio-group v-model="reglas.planteamiento">
            <v-radio v-for="regla in reglasPlanteamiento" :label="regla.texto" :value="regla.valor" :color="regla.color" class="mb-3" :key="regla.valor">
              {{regla.texto}}
            </v-radio>
          </v-radio-group>
          <v-divider></v-divider>
        </v-flex>
        <v-flex xs12 class="py-3">
          <h2 class="mx-auto">Desarrollo</h2>
          <v-radio-group v-model="reglas.desarrollo">
            <v-radio v-for="regla in reglasDesarrollo" :label="regla.texto" :value="regla.valor" :color="regla.color" class="mb-3" :key="regla.valor">
              {{regla.texto}}
            </v-radio>
          </v-radio-group>
          <v-divider></v-divider>
        </v-flex>
        <v-flex xs12 class="py-3">
          <h2 class="mx-auto">Conceptos Físicos</h2>
          <v-radio-group v-model="reglas.fisicos">
            <v-radio v-for="regla in reglasFisicos" :label="regla.texto" :value="regla.valor" :color="regla.color" class="mb-3" :key="regla.valor">
              {{regla.texto}}
            </v-radio>
          </v-radio-group>
          <v-divider></v-divider>
        </v-flex>
        <v-flex xs12 class="py-3">
          <h2 class="mx-auto">Conceptos Matemáticos</h2>
          <v-radio-group v-model="reglas.matematicos">
            <v-radio v-for="regla in reglasMatematicos" :label="regla.texto" :value="regla.valor" :color="regla.color" class="mb-3" :key="regla.valor">
              {{regla.texto}}
            </v-radio>
          </v-radio-group>
          <v-divider></v-divider>
        </v-flex>
        <v-flex xs12 class="py-3">
          <h2 class="mx-auto">Respuesta</h2>
          <v-radio-group v-model="reglas.respuesta">
            <v-radio v-for="regla in reglasRespuesta" :label="regla.texto" :value="regla.valor" :color="regla.color" class="mb-3" :key="regla.valor">
              {{regla.texto}}
            </v-radio>
          </v-radio-group>
          <v-divider></v-divider>
        </v-flex>
        <v-flex xs12 class="py-3">
          <h2 class="mx-auto">Trabajo en Equipo</h2>
          <v-radio-group v-model="reglas.equipo">
            <v-radio v-for="regla in reglasEquipo" :label="regla.texto" :value="regla.valor" :color="regla.color" class="mb-3" :key="regla.valor">
              {{regla.texto}}
            </v-radio>
          </v-radio-group>
          <v-divider></v-divider>
        </v-flex>
      </v-layout>
    </v-form>
    <v-layout row>
      <v-spacer></v-spacer>
      <label><b>Total: </b>{{ total }} / 15</label>
      <v-spacer></v-spacer>
    </v-layout>
  </main>
</template>
<script>
  export default {
    props: ['reglas', 'total'],
    watch: {
      reglas: {
        handler (val) {
          let totalChild = 0
          for (let key in val) {
            totalChild += val[key]
          }
          this.$emit('ponderar', totalChild)
        },
        deep: true
      }
    },
    data () {
      return {
        reglasPlanteamiento: [
          {
            valor: 0,
            color: 'red darken-3',
            texto: 'Planteamiento incorrecto, demostrando poco entendimiento del problema. No hacen uso de gráficos, ni esquemas.'
          },
          {
            valor: 1,
            color: 'amber darken-4',
            texto: 'Planteamiento incorrecto, demostrando poco entendimiento del problema. Hacen uso de gráficos y/o esquemas para explicar su razonamiento.'
          },
          {
            valor: 2,
            color: 'yellow darken-1',
            texto: 'Identifican el problema cometiendo errores mínimos. Hacen uso de gráficos y/o esquemas para explicarlo.'
          },
          {
            valor: 3,
            color: 'green',
            texto: 'Identifican claramente el problema. Hacen uso de gráficos y/o esquemas para explicarlo.'
          }
        ],
        reglasDesarrollo: [
          {
            valor: 0,
            color: 'red darken-3',
            texto: 'Presentan la solución del problema de una manera desodenada y omiten pasos en el desarrollo. '
          },
          {
            valor: 1,
            color: 'amber darken-4',
            texto: 'Omiten pasos importantes en el desarrollo.'
          },
          {
            valor: 2,
            color: 'yellow darken-1',
            texto: 'El procedimiento es claro, pero desordenado. '
          },
          {
            valor: 3,
            color: 'green',
            texto: 'Presentan la solución del problema de una  manera ordenada, organizada y detallada.'
          }
        ],
        reglasFisicos: [
          {
            valor: 0,
            color: 'red darken-3',
            texto: 'Presentan la solución del problema de una manera desodenada y omiten pasos en el desarrollo. '
          },
          {
            valor: 1,
            color: 'amber darken-4',
            texto: 'Omiten pasos importantes en el desarrollo.'
          },
          {
            valor: 2,
            color: 'yellow darken-1',
            texto: 'El procedimiento es claro, pero desordenado. '
          },
          {
            valor: 3,
            color: 'green',
            texto: 'Presentan la solución del problema de una  manera ordenada, organizada y detallada.'
          }
        ],
        reglasMatematicos: [
          {
            valor: 0,
            color: 'red darken-3',
            texto: 'La mayor parte del desarrollo contiene errores matemáticos, demostrando poco conocimiento de los conceptos matematicos requeridos.'
          },
          {
            valor: 1,
            color: 'amber darken-4',
            texto: 'El desarrollo del problema contiene múltiples errores matemáticos. '
          },
          {
            valor: 2,
            color: 'yellow darken-1',
            texto: 'Utiliza los conceptos y expresiones matematicas cometiendo errores mínimos. '
          },
          {
            valor: 3,
            color: 'green',
            texto: 'Utilizan los conceptos y expresiones matemáticas correctamente. '
          }
        ],
        reglasRespuesta: [
          {
            valor: 0,
            color: 'red darken-3',
            texto: 'No obtienen ninguna respuesta correcta.'
          },
          {
            valor: 1,
            color: 'amber darken-4',
            texto: '< 50% de respuestas son correctas '
          },
          {
            valor: 2,
            color: 'yellow darken-1',
            texto: '> 50% de respuestas son correctas.'
          },
          {
            valor: 3,
            color: 'green',
            texto: 'Obtienen el 100% de respuestas correctas y (Numéricamente y conceptualmente).'
          }
        ],
        reglasEquipo: [
          {
            valor: 0,
            color: 'red darken-3',
            texto: 'Los estudiantes no permitieron a cada uno explicar el problema. La presentación no demuestra conexión entre ellos y no promueve discusión lógica del tema. Se tratan con respeto y cortesía.'
          },
          {
            valor: 1,
            color: 'amber darken-4',
            texto: 'Los estudiantes permitieron a pocos explicar el problema. La presentación demuestra muy poca conexión entre ellos y promueve discusión lógica del tema. Se tratan con respeto y cortesía.'
          },
          {
            valor: 2,
            color: 'yellow darken-1',
            texto: 'Los estudiantes permitieron a algunos explicar el problema. La presentación no demuestra mucha conexión entre ellos y promueve discusión lógica del tema. Se tratan con respeto y cortesía.'
          },
          {
            valor: 3,
            color: 'green',
            texto: 'Los estudiantes permitieron a cada uno explicar el problema. La presentación demuestra conexión entre ellos y promueve discusión lógica del tema. Se tratan con respeto y cortesía.'
          }
        ]
      }
    }
  }
</script>
<style>
  .flex h2 {
    text-align: center;
  }
  .input-group.radio {
    flex-wrap: nowrap;
  }
  .input-group.radio label {
    margin-left: 2%;
    text-align: justify;
    position: static !important;
    height: auto !important;
    width: auto !important;
    order: 1 !important;
    text-overflow: initial !important;
    white-space: normal !important;
    max-width: 90% !important;
  }
  .input-group.radio .input-group__input {
    margin-left: 2%;
    width: auto !important;
    flex: 0 0 30px !important;
  }
  .input-group.radio.input-group--active {
    transition: 0.4s cubic-bezier(0, 0, 0.2, 1) !important;
  }
</style>
