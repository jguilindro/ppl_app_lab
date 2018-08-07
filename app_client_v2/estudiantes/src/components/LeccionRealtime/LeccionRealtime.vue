<template>
  <div id="leccion">
    <app-nav :pregunta="preguntaActualNombre" :tiempo="tiempoRestante" :leccionNombre="leccionNombre" :cantidadPreguntas="cantidadPreguntas"
        v-on:pregunta="pestana($event)" :preguntaActualParent="activo" :preguntas="preguntas"
    ></app-nav>
    <v-container fluid style="min-height: 0;" grid-list-lg>
      <v-tabs :hide-slider="true" v-model="active"  fixed-tabs  v-touch="{
          left: () => next(),
          right: () => prev()
        }">
        <v-flex xs2 ms2 class="text-xs-left">
          <v-btn icon @click.native="prev" :disabled="botonIzquierdoBloqueado">
            <v-icon color="grey darken-2" >mdi-chevron-left</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs8 ms8 fill-height grid-list-xs class="text-xs-center">
          <h3>{{ preguntaActualNombre }}</h3>
          <h4 color="blue" v-if="!preguntaActualRespondida"> <v-icon color="blue" >mdi-circle</v-icon> no contestado</h4>
          <h4 class="grey--text" v-if="preguntaActualRespondida"> respondido </h4>
        </v-flex>
        <v-flex xs2 ms2 class="text-xs-right">
          <v-btn icon @click.native="next" :disabled="botonDerechoBloqueado">
            <v-icon color="grey darken-2" >mdi-chevron-right</v-icon>
          </v-btn>
        </v-flex>
        <v-tab v-for="(pregunta, index) in leccion.preguntas" :key="index" v-show="false">
          A
        </v-tab>
        <v-tab-item v-for="(pregunta, index) in leccion.preguntas" :key="index" >
          <v-card  class="text-xs-center">
            <v-card-text primary-title  class="text-xs-center">
              <h3>{{ pregunta.nombre }}</h3>
            </v-card-text>
              <span v-html="pregunta.descripcion"></span>
            <v-card-actions>
              <span class="grey--text">Tiempo Estimado: {{ pregunta.tiempoEstimado }} minutos</span>
            </v-card-actions>
          </v-card>
          <v-card>
            <v-card-title primary-title v-if="pregunta.respuesta" >
              <v-text-field
                name="input-4-1"
                label="Su Respuesta"
                multi-line
                :value="pregunta.respuesta.respuesta"
                disabled
              ></v-text-field>
            </v-card-title>
            <v-card-title primary-title v-if="!pregunta.respuesta">
              <v-text-field
                name="input-4-1"
                label="Su Respuesta"
                multi-line
                :id="`respuesta_${pregunta.id}`"
              ></v-text-field>
            </v-card-title>
            <v-card-media height="100px"  v-if="valido(pregunta.respuesta)" > <!-- style="width: 50%; margin: 0 auto;"   && pregunta.respuesta.imagen-->
              <img :src="pregunta.respuesta.imagen" :id="`imagen_${pregunta.id}`">
            </v-card-media>
            <div v-if="!valido(pregunta.respuesta)">
              <input type="file" class="filepond imagen" name="imagenes" :id="pregunta.id">
            </div>
            <v-btn class="hidden-md-and-up" block color="primary" large :disabled="pregunta.respuesta !== undefined || pregunta.subiendo" @click.native="responder(pregunta.id)">
              Responder
            </v-btn>
            <v-btn class="hidden-sm-and-down" large color="primary" :disabled="pregunta.respuesta !== undefined || pregunta.subiendo" @click.native="responder(pregunta.id)">
              Responder
            </v-btn>
            <!-- botonEnviarBloqueado === index ||  -->
            <!-- <v-btn class="hidden-md-and-up" block color="primary" dark large>
              Próxima
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn> -->
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-container>
    <v-snackbar
        :timeout="4000"
        :multi-line="true"
        :color="'error'"
        :top="true"
        v-model="snackbar"
      >
        Error al enviar imagen en {{preguntaActualNombre}}, por favor reintente
        <v-btn flat color="white" @click.native="snackbar = false">Cerrar</v-btn>
    </v-snackbar>
    <v-snackbar
        :timeout="4000"
        :multi-line="true"
        :color="'error'"
        :top="true"
        v-model="snackbarErrorResponder"
      >
        Error al responder en {{preguntaActualNombre}}, por favor reintente
        <v-btn flat color="white" @click.native="snackbarErrorResponder = false">Cerrar</v-btn>
    </v-snackbar>
    <v-snackbar
        :timeout="4000"
        :multi-line="true"
        :color="'success'"
        :top="true"
        v-model="snackbarResponder"
      >
        Respuesta de {{preguntaActualNombre}} enviada
        <v-btn flat color="white" @click.native="snackbarResponder = false">Cerrar</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import Viewer from 'viewerjs'
import { mapGetters } from 'vuex'
import * as FilePondO from 'filepond'
import _ from 'lodash'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilepondPluginImagePreview from 'filepond-plugin-image-preview'
// import store from '@/store'

import AppNav from './Nav'

import 'filepond/dist/filepond.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

export default {
  components: { AppNav },
  computed: {
    ...mapGetters({
      leccion: 'leccionDando',
      tiempoRestante: 'tiempoRestante',
      io: 'getSocket'
    }),
    preguntas () {
      return this.leccion.preguntas
    },
    leccionNombre () {
      return this.leccion.nombre
    },
    cantidadPreguntas () {
      return this.leccion.preguntas.length
    },
    socket () {
      return this.io
    },
    sidenav () {
      return this.side
    },
    activo () {
      return this.active
    },
    preguntaActualRespondida () {
      if (this.leccion.preguntas[this.preguntaActual] && this.leccion.preguntas[this.preguntaActual].respuesta) {
        return true
      } else {
        return false
      }
    }
  },
  data () {
    return {
      active: null,
      preguntaActualNombre: 'Pregunta 1',
      preguntaActual: 0,
      botonDerechoBloqueado: false,
      botonIzquierdoBloqueado: true,
      botonEnviarBloqueado: -1,
      botonesBloqueados: [],
      myFile: null,
      snackbar: false,
      snackbarResponder: false,
      side: false,
      snackbarErrorResponder: false,
      respuestas: [],
      ponds: {}
    }
  },
  beforeRouteEnter (to, from, next) {
    console.log('beforeRouteEnter')
    // let user = store.getters.nombres
    // store.actions.usuarioDatos.then(() => {
    //   console.log('finalizado')
    //   next(true)
    // })
    // console.l
    // next(vm => vm.setData(err, post))
    next(vm => vm.setData())
  },
  mounted () {
    // return new Promise((resolve, reject) => {
    //    this.$store.dispatch('usuarioDatos').then((datos) => {
    //       console.log(datos)
    //       console.log('mounted')
    //       resolve()
    //    })
    // })
    // await this.$store.dispatch('usuarioDatos')
    // this.$store.subscribe((mutation, state) => {
    //   this.$store.dispatch('usuarioDatos')
    // })
    // this.$nextTick(function () {
    //   console.log('before mounted')
    // })
    for (let elemento of this.$el.querySelectorAll('img')) {
      elemento.style.width = `${(1100 * screen.width) / 1280}px`
      /* eslint-disable no-new */
      new Viewer(elemento, { toolbar: { zoomIn: 1, zoomOut: 1, rotateLeft: 1, rotateRight: 1 }, title: false, navbar: false })
    }
    FilePondO.registerPlugin(FilePondPluginFileValidateType, FilePondPluginImageExifOrientation, FilePondPluginImageResize, FilePondPluginImageTransform, FilePondPluginImageCrop, FilepondPluginImagePreview)
    FilePondO.setOptions({
      server: {
        url: './api/respuestas/imagen',
        timeout: 7000
      }
    })
    let ponds = []
    for (let pond of document.querySelectorAll('.imagen')) {
      let pondTmp = FilePondO.create(pond, {
        labelIdle: `Subir imagen... <span class="filepond--label-action">Buscar</span>`,
        imagePreviewHeight: 170,
        imageCropAspectRatio: '1:1',
        imageResizeTargetWidth: 300,
        imageResizeTargetHeight: 300,
        imageTransformOutputQuality: 30,
        labelFileLoading: 'Comprimiendo',
        labelFileProcessing: 'Subiendo',
        labelFileProcessingComplete: 'Completada',
        labelTapToCancel: 'Toque para cancelar',
        labelTapToUndo: 'Toque para eliminar',
        acceptedFileTypes: ['image/*']
        // instantUpload: false
        // files
      })
      ponds.push(pondTmp)
    }

    for (let pond of document.querySelectorAll('.imagen')) {
      pond.addEventListener('FilePond:addfilestart', (e) => {
        this.$store.dispatch('subiendoImagen', e.srcElement.id)
      })
      pond.addEventListener('FilePond:processfile', (e) => {
        this.ponds[e.detail.file.id] = { preguntaId: e.srcElement.id }
        this.$store.dispatch('terminoSubirImagen', e.srcElement.id)
      })
      pond.addEventListener('FilePond:removefile', (e) => {
        delete this.ponds[e.detail.file.id]
      })
    }

    for (let pond of ponds) {
      pond.on('processfile', (error, file) => {
        if (error) {
          this.snackbar = true
          return
        }
        this.ponds[file.id]['server'] = file.serverId
        let URL = window.URL
        var url = URL.createObjectURL(file.file)
        this.ponds[file.id]['local'] = url
      })
    }
  },
  ready () {
    // this.$store.dispatch('usuarioDatos')
    console.log('ready')
  },
  created () {
    this.$store.dispatch('usuarioDatos').then(() => { console.log('termino') })
    // this.$http.get(`/api/estudiantes/leccion/datos_leccion`)
    //   .then(paralelos => {
    //     console.log(paralelos)
    //     if (paralelos.body.estado) {
    //       this.$store.commit('setLecciones', paralelos.body.datos.estudiante.lecciones)
    //       this.$store.commit('setDatosEstudiante', paralelos.body.datos)
    //       this.$store.commit('setLeccionRealtimeEstadoEstudiante', paralelos.body.datos.estudiante)
    //       this.$store.commit('setDatosMuchos', paralelos.body.datos)
    //       this.$store.commit('setRealtimeLeccion', paralelos.body.datos)
    //       this.$store.commit('SOCKET_USUARIO')
    //     }
    //   })
    //   .catch(e => {
    //     console.log(e)
    //     // this.errors.push(e)
    //   })
    // console.log(this.socket)
    // this.$socket.on('TIEMPO_RESTANTE', function (tiempo) {
    //   console.log(tiempo)
    // })
    console.log('created')
  },
  methods: {
    setData () {
      console.log('set data')
    },
    getLecciones () {
      // this.$http.get(`/api/lecciones/${id}`)
    },
    valido (objeto) {
      if (!objeto) {
        return false
      }
      return !_.isEmpty(objeto)
    },
    next () {
      const active = parseInt(this.active)
      if (parseInt(active + 2) === this.cantidadPreguntas) {
        this.botonDerechoBloqueado = true
        this.botonIzquierdoBloqueado = false
        this.preguntaActualNombre = `Pregunta ${parseInt(this.active) + 2}`
        this.active = (active + 1).toString()
      } else if (parseInt(active + 2) < this.cantidadPreguntas) {
        this.botonIzquierdoBloqueado = false
        this.preguntaActualNombre = `Pregunta ${parseInt(this.active) + 2}`
        this.active = (active + 1).toString()
      }
      this.preguntaActual = parseInt(this.active)
    },
    prev () {
      const active = parseInt(this.active)
      if (active === 1) {
        this.botonDerechoBloqueado = false
        this.botonIzquierdoBloqueado = true
        this.preguntaActualNombre = `Pregunta ${parseInt(this.active)}`
        this.active = (active - 1).toString()
      } else if (active > 1) {
        this.preguntaActualNombre = `Pregunta ${parseInt(this.active)}`
        this.active = (active - 1).toString()
        this.botonDerechoBloqueado = false
      }
      this.preguntaActual = parseInt(this.active)
    },
    pestana (numero) {
      this.preguntaActualNombre = `Pregunta ${parseInt(numero) + 1}`
      if (numero === 0) {
        this.botonDerechoBloqueado = false
        this.botonIzquierdoBloqueado = true
      } else if ((numero + 1) === this.cantidadPreguntas) {
        this.botonDerechoBloqueado = true
        this.botonIzquierdoBloqueado = false
      } else {
        this.botonDerechoBloqueado = false
        this.botonIzquierdoBloqueado = false
      }
      this.active = numero.toString()
      this.preguntaActual = parseInt(this.active)
    },
    responder (preguntaId) {
      let imagen = ''
      let local = ''
      // console.log(this.ponds)
      for (let id in this.ponds) {
        if (this.ponds[id]['preguntaId'] === preguntaId) {
          imagen = JSON.parse(this.ponds[id]['server'])['datos']
          local = this.ponds[id]['local']
        }
      }
      let respuesta = this.$el.querySelector(`#respuesta_${preguntaId}`).value
      this.$store.dispatch('responder', { imagen, respuesta, preguntaId, local })
        .then(() => {
          this.snackbarResponder = true
        })
        .catch(() => {
          this.snackbarErrorResponder = true
        })
      // https://vuetifyjs.com/en/components/buttons Loader al boton al enviar
    }
  }
}
</script>

<style scoped>
</style>

<!-- // mediumZoom // usarla para lecciones vue-fullscreen' 'img-vuer' -->
<!-- prueba de imagen como medium -->
<!-- <img height="50px" src="https://pm1.narvii.com/6173/8d68f90a6ab1fe0588f9ff40ee133a35012ecb72_hq.jpg">
    mediumZoom(this.$el.querySelector('img'), { scrollOffset: 0, metaClick: false, background: '#000' }) -->
<!-- https://sparanoid.com/work/lightense-images/ -->
<!-- https://github.com/fat/zoom.js/ -->
