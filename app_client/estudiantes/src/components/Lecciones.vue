<template>
  <div id="container_general">
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
                <v-list-tile-sub-title id="nota" class="red|--text" v-html="item.calificacion"></v-list-tile-sub-title>
                <div id="totalNota">| 20</div>
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
    created() {
      this.$store.dispatch('PERFIL_API_PETICION')
    },
    data() {
      return {
        items: [
          { header: 'Hoy' },
          { leccion: 'Laboratorio de ondas mecánicasasdasdasdsadasdasdasdasdasdasdasdasdasdasdasdassadsad', tipo: 'Laboratorio', calificacion: '20', link: '/LeccionesDetalle' },
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

  #container_leccion {
    /*border: 1px solid yellow;*/
  }

  /*Leccion y tipo*/
  .left {
    float: left;
    width: 80%;
    overflow:hidden;
    white-space:nowrap;
    text-overflow: ellipsis;
    /*border: 1px solid red;*/
  }

  /*Calificación*/
  .rigth {
    float: right;
    width: 20%;
    /*border: 1px solid red;*/
    text-align: right;
  }

  .rigth *{
    font-size: 25px; 
  }

  #nota {
    display: inline-block;
  }

  #totalNota {
    font-size: 0.75em;
    display: inline-block;
    vertical-align: top;
  }

</style>


<!-- Posible botón para ver lección 8:41-->
<!-- https://www.youtube.com/watch?v=AesqUS2udb4&list=PL55RiY5tL51qxUbODJG9cgrsVd7ZHbPrt&index=8 -->
