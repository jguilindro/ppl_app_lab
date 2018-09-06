<template>
    <main>
      <v-card v-if="leccion">
        <v-card-title primary-title>
          <h1 class="text-xs-center mx-auto display-1">{{ leccion.nombre }}</h1>
        </v-card-title>
        <v-card-title>
          <h2 class="text-xs-center mx-auto" v-if="tiempo !== 'Lección pausada'">
            Tiempo restante: {{ tiempo }} minutos
          </h2>
          <h2 v-else class="text-xs-center mx-auto">{{ tiempo }}</h2>
        </v-card-title>
        <!-- Btn Comenzar Leccion -->
        <v-card-title class="pb-0" v-if="estadoLeccion === 'sin comenzar'">
          <v-container fill-height>
            <v-layout row align-center>
              <v-flex class="text-xs-center">
                <v-btn @click.native="comenzar" color="primary">Comenzar</v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-title>
        <!-- Botones -->
        <v-card-title class="pb-0" v-else>
          <v-container fill-height>
            <v-layout row justify-space-between>
              <v-flex xs2>
              </v-flex>
              <v-flex xs5 md3 class="pt-2">
                <v-tooltip top>
                  <v-btn flat icon slot="activator" :disabled="tiempo === 'Lección pausada'" @click.native="pause">
                    <v-icon x-large>pause</v-icon>
                  </v-btn>
                  <span>Pausar</span>
                </v-tooltip>
                <v-tooltip top>
                  <v-btn flat icon slot="activator" class="mx-4" :disabled="tiempo !== 'Lección pausada'" @click.native="play">
                    <v-icon x-large>play_arrow</v-icon>
                  </v-btn>
                  <span>Continuar</span>
                </v-tooltip>
                <v-tooltip top>
                  <v-btn flat icon slot="activator" @click.native="stop">
                    <v-icon x-large>stop</v-icon>
                  </v-btn>
                  <span>Terminar</span>
                </v-tooltip>
              </v-flex>
              <v-flex xs2 md1>
                <v-text-field type="number" append-icon="add" :append-icon-cb="aumentar" v-model="tiempoAumentado"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-title>
        <v-card-text class="pt-0">
          <v-tabs fixed-tabs grow v-model="tab">
            <v-tab ripple href="#tab-leccion">Lección</v-tab>
            <v-tab ripple href="#tab-respuestas">Respuestas</v-tab>
          </v-tabs>
        </v-card-text>
        <v-card-text>
          <v-tabs-items v-model="tab">
            <!-- Grupos -->
            <v-tab-item :id="'tab-leccion'">
              <header class="mx-auto text-xs-center">
                <h1>Código</h1>
                  <h1 class="code">{{leccion.codigo}}</h1>
              </header>
              <main class="mt-3">
                <grupos-leccion :grupos="grupos"></grupos-leccion>
              </main>
            </v-tab-item>
            <!-- Respuestas -->
            <v-tab-item :id="'tab-respuestas'">
              respuestas
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
      </v-card>
      <div v-else class="text-xs-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <v-dialog v-model="dialogTerminar" persistent max-width="290">
        <v-card>
          <v-card-text>¿Está seguro de que desea terminar la lección?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click.native="dialogTerminar = false">No</v-btn>
            <v-btn color="green darken-1" flat @click.native="terminar">Si</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar :timeout="snackbar.timeout" :color="snackbar.color" v-model="snackbar.active">
        {{ snackbar.text }}
      </v-snackbar>
    </main>
</template>

<script>
  export default {
    mounted () {
      this.$store.commit('sockets/setSocket', this.$socket)
      // Esto fue culpa de Joel y sus endpoints mal definidos
      Promise.all([
        this.$http.get(`/api/lecciones/${this.$route.params.id}`),
        this.$http.get(`/api/paralelos/${this.$route.params.id_paralelo}/obtener_paralelo`)
      ]).then(([res1, res2]) => {
        const leccion = res1.body.datos
        const paralelo = res2.body.datos
        this.paralelo = JSON.parse(JSON.stringify(paralelo))
        this.$store.commit('leccionRealTime/setLeccion', leccion)
        this.$store.commit('leccionRealTime/setGrupos', this.paralelo.grupos)
        this.$store.dispatch('sockets/conectarLeccion', { leccion, paralelo })
        if (this.leccion.leccionYaComenzo) {
          this.$store.commit('leccionRealTime/setEstadoLeccion', 'comenzada')
        }
      }).catch((err) => console.log(err))
    },
    data () {
      return {
        tab: '',
        dialogTerminar: false,
        paralelo: null,
        tiempoAumentado: 0,
        snackbar: {
          active: false,
          color: '',
          timeout: 2000,
          text: ''
        }
      }
    },
    computed: {
      leccion () {
        return this.$store.getters['leccionRealTime/leccion']
      },
      tiempo () {
        return this.$store.getters['leccionRealTime/tiempo']
      },
      grupos () {
        return this.$store.getters['leccionRealTime/grupos']
      },
      estadoLeccion () {
        return this.$store.getters['leccionRealTime/estadoLeccion']
      }
    },
    methods: {
      comenzar () {
        this.$store.dispatch('leccionRealTime/comenzar', { idLeccion: this.leccion._id, idParalelo: this.paralelo._id })
      },
      play () {
        this.$store.dispatch('leccionRealTime/continuar', this.leccion._id)
      },
      pause () {
        this.$store.dispatch('leccionRealTime/pausar', { leccion: this.leccion._id, paralelo: this.paralelo._id })
      },
      stop () {
        this.dialogTerminar = true
      },
      aumentar () {
        console.log(this.tiempoAumentado)
        this.$http.post(`/api/lecciones/${this.leccion._id}/mas_tiempo`, { tiempo: this.tiempoAumentado })
          .then((res) => {
            this.$store.dispatch('sockets/aumentarTiempo')
            this.snackbar.text = `Han sido añadidos ${this.tiempoAumentado} minutos`
            this.snackbar.active = true
            this.tiempoAumentado = 0
          }, (err) => {
            console.log(err)
          })
      },
      terminar () {
        this.$store.dispatch('leccionRealTime/terminar')
      }
    }
  }
</script>

<style scoped>
  h1.code{
    font-weight: bold;
    color: rgba(0,0,0,0.5) !important;
  }
</style>
