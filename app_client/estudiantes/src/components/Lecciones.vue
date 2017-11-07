
<template>
  <div id="container_general">

    <v-list two-line >
      <div v-for="(value,key) in agruparPorFecha()">
        <v-subheader class="grey lighten-3" v-text="comprobarDia(key)"></v-subheader>
        
        <div v-for="v in value">
          <v-list-tile @click="" to="/LeccionesDetalle">
            <v-list-tile-content >        
              <div id="container_leccion">
                <div class="left">
                  <div> <v-list-tile-title v-html="v.nombre"></v-list-tile-title></div>
                  <div> <v-list-tile-sub-title v-html="v.tipo"></v-list-tile-sub-title> </div>
                </div>
                <div class="rigth" v-if="v.calificacion">
                  <v-list-tile-sub-title id="nota" class="red--text" v-html="comprobarCalificacion(v.calificacion)"></v-list-tile-sub-title>
                  <div id="totalNota">| 100</div>
                </div>
                <div v-if="!v.calificacion">
                  <div id="rigthSinCalificacion">No hay calificación</div>
                </div>
              </div>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
        </div>
        
      </div>
    </v-list>
  </div>

</template>

<script>

  import { mapGetters } from 'vuex'
  import _ from 'lodash'
  import moment from 'moment'

  export default {
    computed: mapGetters([
      'lecciones',
    ]),
    created() {
      this.$store.dispatch('PERFIL_API_PETICION')
    },
    data() {
      return {
      }
    },
    methods: {
      agruparPorFecha() {
        const agrupado = _.groupBy(this.lecciones, 'fecha_terminado')
        return agrupado
      },
      comprobarDia(dia) {
        moment.updateLocale('es', {
          weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
        })
        const fechaActual = moment().format('ddd DD/MM')
        const fechaAyer = moment().subtract(1, 'days').format('ddd DD/MM')

        if (dia === fechaActual) {
          return 'Hoy'
        }
        if (dia === fechaAyer) {
          return 'Ayer'
        }
        return dia
      },
      comprobarCalificacion(calificacion) {
        // const a = calificacion.length
        // console.log('cal', a)
        if (calificacion === null) {
          return 'NN'
        }
        if (calificacion < 10) {
          const string = calificacion.toString()
          const cero = '0'
          return cero.concat(string)
        }
        return calificacion
      },
    },
  }
</script>

<!-- Libreria usada para agrupar lecciones -->

  <!-- npm i -g npm -->
  <!-- npm i --save lodash -->

<!-- Libreria usada para cambiar formato de fecha actual -->

  <!-- npm install moment --save  -->
  <!-- npm i -S moment -->

<!-- Configuración de puerto -->
<!-- echo fs.inotify.max_user_watches=582222 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p -->

</script>

<style>

  #container_general {
    padding: 2%;
   
  }

  #container_leccion {
    width: 100%;
  }

  /*Leccion y tipo*/
  .left {
    float: left;
    width: 80%;
  }

  /*Calificación*/
  .rigth {
    float: right;
    width: 20%;
    text-align: right;
  }
  
  .rigth *{
    font-size: 1.5em; 
  }

  #rigthSinCalificacion {
    float: right;
    width: 20%;
    text-align: right;
    font-size: 0.8em;
    font-style: italic;
    opacity: 0.5;
    display: inline-block;
  }

  #nota {
    display: inline-block;
    width: auto;
  }

  #totalNota {
    font-size: 0.75em;
    display: inline-block;
    vertical-align: top;
    /*border: 1px solid red;*/
  }

</style>


<!-- Posible botón para ver lección 8:41-->
<!-- https://www.youtube.com/watch?v=AesqUS2udb4&list=PL55RiY5tL51qxUbODJG9cgrsVd7ZHbPrt&index=8 -->
