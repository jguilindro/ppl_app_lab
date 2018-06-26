<style scoped>
  #time {
    position: fixed;
    bottom: 0;
    right: 0;
  }
</style>
<template>
  <main>
    <v-card>
      <v-card-title>
        <h1 class="mx-auto display-1">Crear Lección</h1>
      </v-card-title>
      <v-card-text>
        <v-tabs fixed-tabs grow centered v-model="tab">
          <v-tab :href="'#tab-general'">General</v-tab>
          <v-tab :href="'#tab-preguntas'" :disabled="disabledPreguntas">Preguntas</v-tab>
          <v-tab :href="'#tab-resumen'">Resumen</v-tab>
        </v-tabs>
      </v-card-text>
      <v-card-text>
        <v-tabs-items v-model="tab">
          <v-tab-item id="tab-general">
            <v-form>
              <v-container grid-list-xl fluid>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field v-model="leccion.nombre" label="Nombre de la lección" placeholder="Ej: Cap. 11 Campo Magnético" required></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-select :items="materias" label="Materia" v-model="leccion.codigoMateria" required></v-select>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-select :items="paralelosMostrar" label="Paralelo" v-model="leccion.paralelo" item-value="_id" item-text="nombre" required></v-select>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-dialog ref="dialogFecha" v-model="dialogFecha" :return-value.sync="leccion.fechaInicio" persistent lazy full-width width="290px">
                      <v-text-field slot="activator" v-model="leccion.fechaInicio" label="Fecha de inicio"  readonly required></v-text-field>
                      <v-date-picker v-model="leccion.fechaInicio" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="dialogFecha = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.dialogFecha.save(leccion.fechaInicio)">OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-select :items="tipos" label="Tipo de lección" v-model="leccion.tipo" required></v-select>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-tab-item>
          <v-tab-item id="tab-preguntas">
            <v-expansion-panel v-for="capitulo in capitulos" :key="capitulo.nombre" popout>
              <v-expansion-panel-content>
                <div slot="header">{{ capitulo.nombre }}</div>
                <v-card style="border-top: 1px solid #d3dbdb">
                  <v-card-text v-if="capitulo.preguntas.length === 0" style="text-align: center;" class="grey lighten-2">
                    <section>
                      <span>No hay preguntas en este capítulo</span>
                    </section>
                  </v-card-text>
                  <v-card-text v-else>
                    <v-list>
                      <v-list-tile v-for="pregunta in capitulo.preguntas" :key="pregunta._id" class="pt-4" style="border-bottom: 1px solid #d3dbdb" avatar>
                        <v-checkbox v-model="leccion.preguntasSel" :label="pregunta.nombre" :value="pregunta._id"></v-checkbox>
                        <v-list-tile-action>
                          <span class="caption">{{ pregunta.tiempoEstimado }} minutos</span>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <div id="time" class="pa-2">
              <v-icon>timer</v-icon>
              {{ leccion.tiempoEstimado }} minutos
            </div>
          </v-tab-item>
          <v-tab-item id="tab-resumen">
            <v-card>
              <v-card-title primary-title>
                <h3 class="title mx-auto">{{ leccion.nombre }}</h3>
              </v-card-title>
              <v-card-text>
                <v-list>
                  <v-divider></v-divider>
                  <v-list-tile>
                    <v-list-tile-content>
                      <v-list-tile-title>
                        <v-icon>school</v-icon>
                        {{ leccion.nombreMateria }} P{{ leccion.nombreParalelo }}
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>
                  <v-list-tile>
                    <v-list-tile-content>
                      <v-list-tile-title>
                        <v-icon>timer</v-icon>
                        {{ leccion.tiempoEstimado }} minutos
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>
                  <v-list-tile>
                    <v-list-tile-content>
                      <v-list-tile-title>
                        <v-icon>event</v-icon>
                        {{ leccion.fechaInicio | formatoCreatedAt }}
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>
                  <v-list-tile>
                    <v-list-tile-content>
                      <v-list-tile-title>
                        <v-icon>grade</v-icon>
                        {{ leccion.puntaje }} puntos
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>
                  <v-list-tile>
                    <v-list-tile-content>
                      <v-list-tile-title>
                        <v-icon>subject</v-icon>
                        {{ leccion.tipo }}
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>
                </v-list>
              </v-card-text>
              <v-card-text>
                <h3 class="title" style="text-align: center;">Preguntas escogidas</h3>
                <v-list two-line>
                  <template v-for="pregunta in preguntasSelAux" >
                    <v-list-tile avatar :key="pregunta._id">
                      <v-list-tile-content>
                        <v-list-tile-title>
                          {{ pregunta.nombre }}
                        </v-list-tile-title>
                        <v-list-tile-sub-title>
                          {{ pregunta.capitulo.nombre }}
                        </v-list-tile-sub-title>
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <v-list-tile-action-text>
                          {{ pregunta.tiempoEstimado }} minutos
                        </v-list-tile-action-text>
                      </v-list-tile-action>
                    </v-list-tile>
                    <v-divider></v-divider>
                  </template>
                </v-list>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat class="indigo darken-5 white--text" @click.native="crearLeccion" :disabled="disabledPreguntas || leccion.preguntasSel.length === 0">
                  Crear
                  <v-icon right>send</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
    <v-dialog v-model="successDialog" persistent max-width="290">
      <v-card>
        <v-card-title primary-title>
          <h3 class="headline mx-auto">Lección creada!</h3>
        </v-card-title>
        <v-card-text>Se añadió el registro a la base de datos correctamente.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="green darken-1" to="/lecciones/">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="errorDialog" persistent max-width="290">
      <v-card>
        <v-card-title primary-title>
          <h3 class="headline mx-auto">Error</h3>
        </v-card-title>
        <v-card-text>Ocurrió un error al crear su lección. Intente nuevamente</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="green darken-1" @click.native="errorDialog = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </main>
</template>
<script>
  export default {
    mounted () {
      this.getParalelos()
    },
    computed: {
      materia () {
        return this.leccion.codigoMateria
      },
      paralelo () {
        return this.leccion.paralelo
      },
      tipoLeccion () {
        return this.leccion.tipo
      },
      preguntasSel () {
        return this.leccion.preguntasSel
      },
      disabledPreguntas () {
        return this.isEmpty(this.leccion.nombre) || this.isEmpty(this.leccion.codigoMateria) || this.isEmpty(this.leccion.paralelo) || this.isEmpty(this.leccion.fechaInicio) || this.isEmpty(this.leccion.tipo)
      },
      preguntas () {
        return this.$store.getters.preguntas
      }
    },
    watch: {
      materia (value) {
        this.leccion.tipo = '' // Para que se encere el array de preguntas y se muestren las de esa materia
        this.leccion.preguntasSel = [] // No se puede crear una lección con preguntas de diferentes materias. Cada vez que cambie la materia se encera el array de preguntas seleccionadas
        this.leccion.nombreMateria = this.materias.find((x) => {
          return x.value === value
        }).text
        this.paralelosMostrar = this.paralelos.filter((paralelo) => {
          return paralelo.codigo === value
        })
        this.preguntasSelAux = []
      },
      paralelo (value) {
        if (!this.isEmpty(value)) {
          this.leccion.nombreParalelo = this.paralelos.find((x) => {
            return x._id === value
          }).nombre
        }
      },
      tipoLeccion (value) {
        if (value === 'estimacion|laboratorio') {
          value = 'laboratorio'
        }
        this.leccion.preguntasSel = [] // No se puede crear una lección con preguntas de diferentes tipos. Cada vez que cambie el tipo se encera el array de preguntas seleccionadas
        this.preguntasMostrar = this.preguntas.filter((pregunta) => {
          return pregunta.tipoLeccion === value && pregunta.capitulo.codigoMateria === this.leccion.codigoMateria
        })
        this.preguntasSelAux = []
      },
      preguntasMostrar (value) {
        this.capitulos = this.getCapitulosFromPreguntas(this.preguntasMostrar)
      },
      preguntasSel (value) {
        this.leccion.tiempoEstimado = this.calcularTiempoEstimado(value)
        this.leccion.puntaje = this.calcularPuntaje(value)
        this.preguntasSelAux = []
        for (let i = 0; i < value.length; i++) {
          this.preguntasSelAux.push(this.preguntasMostrar.find(x => {
            return x._id === value[i]
          }))
        }
      }
    },
    data () {
      return {
        tab: 'tab-general',
        dialogFecha: false,
        successDialog: false,
        errorDialog: false,
        leccion: {
          _id: '',
          estado: 'pendiente',
          nombre: '',
          codigoMateria: '',
          nombreMateria: '',
          paralelo: '',
          nombreParalelo: '',
          tipo: '',
          fechaInicio: '',
          preguntas: [],
          preguntasSel: [],
          tiempoEstimado: 0,
          puntaje: 0
        },
        materias: [
          {
            value: 'FISG1002',
            text: 'Física 2'
          },
          {
            value: 'FISG1003',
            text: 'Física 3'
          },
          {
            value: 'FISG2001',
            text: 'Física Conceptual'
          }
        ],
        tipos: [
          {
            value: 'estimacion|laboratorio',
            text: 'Estimación|Laboratorio'
          },
          {
            value: 'tutorial',
            text: 'Tutorial'
          }
        ],
        paralelos: [], // Array que contiene todos los paralelos de la base de datos
        paralelosMostrar: [],
        preguntasMostrar: [],
        capitulos: [],
        preguntasSelAux: [] // Array que contiene todo el json de preguntas seleccionadas
      }
    },
    methods: {
      getParalelos () {
        this.$http.get('/api/paralelos')
          .then((res) => {
            if (res.body.estado) {
              this.paralelos = res.body.datos
            } else {
              console.log('Error')
            }
          }, (err) => {
            console.log(err)
          })
      },
      isEmpty (field) {
        return field === '' || field === null || field === undefined
      },
      getCapitulosFromPreguntas (preguntas) {
        let capitulos = []
        for (let i = 0; i < preguntas.length; i++) {
          if (preguntas[i].capitulo === null) {
            // capitulos.add(preguntas[i].capitulo.nombre)
            continue
          }
          let capitulo = capitulos.find((capitulo) => {
            return capitulo.nombre === preguntas[i].capitulo.nombre
          })
          // Si no encuentra el capitulo, entonces hay que añadirlo al array
          if (capitulo === null || capitulo === undefined) {
            capitulo = {
              nombre: preguntas[i].capitulo.nombre,
              preguntas: []
            }
            capitulo.preguntas.push(preguntas[i])
            capitulos.push(capitulo)
          } else {
            capitulo.preguntas.push(preguntas[i])
          }
        }
        return capitulos
      },
      calcularTiempoEstimado (idPreguntas) {
        let tiempo = 0
        for (let i = 0; i < idPreguntas.length; i++) {
          let pregunta = this.preguntasMostrar.find((x) => {
            return x._id === idPreguntas[i]
          })
          if (pregunta) {
            tiempo += parseInt(pregunta.tiempoEstimado)
          }
        }
        return tiempo
      },
      calcularPuntaje (idPreguntas) {
        let puntaje = 0
        for (let i = 0; i < idPreguntas.length; i++) {
          let pregunta = this.preguntasMostrar.find((x) => {
            return x._id === idPreguntas[i]
          })
          if (pregunta) {
            puntaje += parseInt(pregunta.puntaje)
          }
        }
        return puntaje
      },
      crearLeccion () {
        for (let i = 0; i < this.leccion.preguntasSel.length; i++) {
          let actual = this.leccion.preguntasSel[i]
          this.leccion.preguntas.push({
            pregunta: actual,
            ordenPregunta: (i+1)
          })
        }
        this.$http.post('/api/lecciones/', this.leccion)
          .then((res) => {
            if (res.body.estado) {
              this.successDialog = true
              this.leccion._id = res.body.datos._id
              this.$store.commit('addLeccion', this.leccion)
            } else {
              this.errorDialog = true
            }
          }, (err) => {
            console.log(err)
            this.errorDialog = true
          })
      }
    }
  }
</script>
