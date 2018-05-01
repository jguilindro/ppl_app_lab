<template>
  <div id="leccion">
    <app-nav :pregunta="preguntaActualNombre" tiempo="15:55" :leccionNombre="leccionNombre" :cantidadPreguntas="cantidadPreguntas "
        v-on:pregunta="pestana($event)" :preguntaActualParent="activo"
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
          <v-divider dark inset></v-divider>
          <v-card>
            <v-card-title primary-title v-if="pregunta.respuesta">
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
              ></v-text-field>
            </v-card-title>
            <v-card-media height="200px"  v-if="pregunta.respuesta" > <!-- style="width: 50%; margin: 0 auto;" -->
              <img src="http://images5.fanpop.com/image/photos/28300000/Guilty-Crown-7-guilty-crown-28316715-1280-720.jpg" :v-show="false">
            </v-card-media>
            <!-- <v-btn>RESUBIR</v-btn> -->
            <input type="file" class="filepond imagen" name="imagenes" v-if="!pregunta.respuesta">
            <v-btn class="hidden-md-and-up" block color="primary" large :disabled="botonEnviarBloqueado || pregunta.respuesta !== undefined">
              Responder
            </v-btn>
            <!-- <v-btn class="hidden-md-and-up" block color="primary" dark large>
              Próxima
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn> -->
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-container>
  </div>
</template>

<script>
import Viewer from 'viewerjs'
import { mapGetters } from 'vuex'
import * as FilePondO from 'filepond'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilepondPluginImagePreview from 'filepond-plugin-image-preview'

import AppNav from './Nav'

import 'filepond/dist/filepond.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

export default {
  components: { AppNav },
  computed: {
    ...mapGetters({
      leccion: 'leccionDando'
    }),
    leccionNombre () {
      return this.leccion.nombre
    },
    cantidadPreguntas () {
      return this.leccion.preguntas.length
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
      botonEnviarBloqueado: false,
      myFile: null,
      side: false
    }
  },
  mounted () {
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
    // let self = this
    for (let pond of document.querySelectorAll('.imagen')) {
      FilePondO.create(pond, {
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
    }

    for (let pond of document.querySelectorAll('.imagen')) {
      pond.addEventListener('FilePond:addfile', (e) => {
      })
      pond.addEventListener('FilePond:addfilestart', (e) => {
        this.botonEnviarBloqueado = true
        // this.myFile = URL.createObjectURL(file.file)
      })
      pond.addEventListener('FilePond:processfile', (e) => {
        this.botonEnviarBloqueado = false
      })
    }
  },
  ready () {
  },
  created () {
    this.$store.dispatch('usuarioDatos')
  },
  methods: {
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
