<template>
  <v-layout row wrap>
    <v-flex xs6 v-for="grupo in grupos" class="px-2 mb-5" :key="grupo._id">
      <header class="group-name">
        <h2 class="text-xs-left px-3">
          {{grupo.nombre}}
          <i style="float: right;">
            <v-icon class="mr-2" medium>group</v-icon>{{ grupo.estudiantesConectados.length }}/{{grupo.estudiantes.length}}
          </i>
        </h2>
      </header>
      <section v-for="estudiante in grupo.estudiantes">
        <div class="student left-align py-2 pl-2">
          <div :class="{ online: estudiante.conectado, offline: !estudiante.conectado }" :id="estudiante._id"></div>
          {{ estudiante.nombres }} {{ estudiante.apellidos }}
        </div>
      </section>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    props: ['grupos'],
    mounted () {
      this.grupos.forEach((grupo) => {
        grupo.estudiantes.sort((a, b) => {
          return a.nombres > b.nombres
        })
      })
    }
  }
</script>

<style scoped>
  header.group-name{
    background-color: rgba(192,192,192,0.5);
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
  }
  header.group-name > h2 {
    font-size: 1.8em;
    font-weight: bold;
  }
  .student{
    border: 1px solid rgba(192,192,192,0.5);
    border-top: 0px;
  }

  div.estado {
    position:fixed;
    top:15%;
    margin-left: 0%;
  }

  /*estados estudiante online*/
  .online {
    -webkit-transition: width 2s; /* Safari */
    transition: width 2s;
    transition-duration: 3s;
    background-color: green;
    width: 20px;
    height: 20px;
    float: left;
    border-radius: 10px 10px 10px 10px;
    margin-right: 5px;
  }

  .offline {
    -webkit-transition: width 2s; /* Safari */
    transition: width 2s;
    transition-duration: 3s;
    background-color: red;
    width: 20px;
    height: 20px;
    float: left;
    border-radius: 10px 10px 10px 10px;
    margin-right: 5px;

  }

  .no-ingresado {
    background-color: gray;
    width: 20px;
    height: 20px;
    float: left;
    border-radius: 10px 10px 10px 10px;
    margin-right: 5px;
  }

  .dando-leccion {
    background-color: yellow;
    width: 20px;
    height: 20px;
    float: left;
    border-radius: 10px 10px 10px 10px;
    margin-right: 5px;
  }

  /*
  total de estudiantes conectados
   */

  /*boton bloquear estudiante*/

  /*acciones*/
  /*
  tipeando codigo
  esperando leccion
  dando leccion
  en pagina tomando-leccion
  bloqueado(colocar una linea intermedia o raya que diga que fue bloqueado, hablar de como setear eso en info de las lecciones.- Seria en estudiantes lecciones un campo bloqueado)
   */
  .loader {
    display: flex;
    height: 50vh;
    justify-content: center;
    align-items: center;
  }

  .spinner {
    height: 4vh;
    width: 4vh;
    border: 5px solid rgba(0, 174, 239, 0.2);
    border-top-color: rgba(0, 174, 239, 0.8);
    border-radius: 100%;
    animation: rotation 0.6s infinite linear 0.25s;
    padding-right: 10px;
    margin-right: 10px;
    /* the opacity is used to lazyload the spinner, see animation delay */
    /* this avoid the spinner to be displayed when visible for a very short period of time */
    opacity: 0;
  }

  @keyframes rotation {
    from {
      opacity: 1;
      transform: rotate(0deg);
    }
    to {
      opacity: 1;
      transform: rotate(359deg);
    }
  }

  .icono {
    padding-right: 2%;
  }

</style>

