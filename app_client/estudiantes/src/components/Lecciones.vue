
<template>

  <div id="container_general">

  <!-- <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12> -->
        <!-- <div id="prueba">
          <v-card dark color="primary" class="pt-15">
            <v-card-text class="green darken-1 white--text">LECCIONES</v-card-text>
          </v-card>  
        </div> -->
        
      <!-- </v-flex>
    </v-layout>
  </v-container> -->


    <v-list two-line >
      <template v-for="item in items">
        <v-subheader class="grey lighten-3" v-if="item.header" v-text="item.header"></v-subheader>
        <v-divider v-else-if="item.divider"></v-divider>

        <v-list-tile v-else @click="" to="/LeccionesDetalle">
          <v-list-tile-content >
            <div id="container_leccion">
              <div class="left">
                <div> <v-list-tile-title v-html="item.leccion"></v-list-tile-title> </div>
                <div> <v-list-tile-sub-title v-html="item.tipo"></v-list-tile-sub-title> </div>
              </div>
              <div class="rigth">
                <v-list-tile-sub-title class="red|--text" v-html="item.calificacion"></v-list-tile-sub-title>
              </div>
            </div>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </div>

</template>


<script>
  export default {
    data() {
      return {
        items: [
          { header: 'Hoy' },
          { leccion: 'Laboratorio de ondas mecánicas', tipo: 'Laboratorio', calificacion: '20', link: '/LeccionesDetalle' },
          { divider: true, inset: true },
          { leccion: 'Tutorial de ondas mecánicas', tipo: 'Tutorial', calificacion: '78', link: '/LeccionesDetalle' },
          { divider: true, inset: true },
          { leccion: 'Laboratorio de ondas sonoras', tipo: 'Laboratorio', calificacion: '89', link: '/LeccionesDetalle' },
          { header: 'Ayer' },
          { leccion: 'Laboratorio de ondas mecánicas', tipo: 'Laboratorio', calificacion: '10', link: '/LeccionesDetalle' },
          { leccion: 'Laboratorio de ondas mecánicas', tipo: 'Laboratorio', calificacion: '10', link: '/LeccionesDetalle' },
          { leccion: 'Laboratorio de ondas mecánicas', tipo: 'Laboratorio', calificacion: '10', link: '/LeccionesDetalle' },
          { leccion: 'Laboratorio de ondas mecánicas', tipo: 'Laboratorio', calificacion: '10', link: '/LeccionesDetalle' },
          { leccion: 'Laboratorio de ondas mecánicas', tipo: 'Laboratorio', calificacion: '10', link: '/LeccionesDetalle' },
          { leccion: 'Laboratorio de ondas mecánicas', tipo: 'Laboratorio', calificacion: '10', link: '/LeccionesDetalle' },
          { leccion: 'Laboratorio de ondas mecánicas', tipo: 'Laboratorio', calificacion: '10', link: '/LeccionesDetalle' },
          { leccion: 'Laboratorio de ondas mecánicas', tipo: 'Laboratorio', calificacion: '10', link: '/LeccionesDetalle' },
        ],
      }
    },
  }
</script>

<style>

  #container_general {
    padding: 2%;
    width: 100%;
  }

  #container_leccion {
    padding: 12px;
    width: 100%;
  }

  #logo_espol{
    padding: 8px;
  }
  /*Leccion y tipo*/
  .left {
    float: left;
  }
  /*Calificación*/
  .rigth {
    float: right;
  }

  .rigth *{
    font-size: 25px;
    /*font-weight: bold;*/
  }

  /*#prueba {
    padding-top: 30px;
    padding-bottom: 23px;
  }  */

</style>


<!-- Posible botón para ver lección 8:41-->
<!-- https://www.youtube.com/watch?v=AesqUS2udb4&list=PL55RiY5tL51qxUbODJG9cgrsVd7ZHbPrt&index=8 -->