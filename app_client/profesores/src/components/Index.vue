<template>

  <v-container grid-list-md text-xs-center  id="info">
    <v-layout row wrap child-flex >
      <v-flex xs5>
        <v-card class="container" href="/profesores/leccion">
        <v-icon large id="pru">visibility</v-icon>
          <v-card-text class="headline">Ver lecciones</v-card-text>
          <v-card-text class="caption">Mira y edita las lecciones de tus paralelos.</v-card-text>
          
        </v-card>
      </v-flex>
      <v-flex xs5>
        <v-card class="container" href="/profesores/grupos">
        <v-icon large id="pru">mode_edit</v-icon>
          <v-card-text class="headline">Editar grupo</v-card-text>
          <v-card-text class="caption">¿Tienes duda de los grupos?, si un estudiante se retira o entran nuevos, aquí será la sección para editar esos grupos, mover a los estudiantes o crear nuevos grupos.</v-card-text>
          
        </v-card>
      </v-flex>
      <v-flex xs5>
        <v-card class="container" href="/profesores/leccion/crear">
        <v-icon large id="pru">note_add</v-icon>
          <v-card-text class="headline">Crea lecciones</v-card-text>
          <v-card-text class="caption">Usa el banco de pregunta y crea de manera rápido y sencilla una lección para los paralelos.</v-card-text>
          
        </v-card>
      </v-flex>

      <v-flex xs5>
        <v-card class="container" href="/profesores/leccion/crear">
        <v-icon large id="pru">list</v-icon>
          <v-card-text class="headline">Banco de preguntas</v-card-text> 
          <v-card-text class="caption">Dale una visita al banco de preguntas, crea preguntas en cualquier capítulo y revisa las preguntas de otros profesores, saber cuales preguntas hay puede ayudar a crear una lección más rápidamente.</v-card-text>
          
        </v-card>
      </v-flex>
      <v-flex xs5>
        <v-card class="container" href="/profesores/preguntas/nueva-pregunta">
        <v-icon large id="pru">add</v-icon>
          <v-card-text class="headline">Crea una pregunta</v-card-text>
          <v-card-text class="caption">Ó ten un acceso rápido para crear preguntas</v-card-text>
          {{prueba()}}
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
    
</template>

<script>
export default {
  name: 'hello',
  data() {
    return {
      msg: 'Welcome to Your Vue.js PWA',
    }
  },
  methods: {
    prueba() {
      console.log('hola')
    },
  },
}
</script>

<style>
*{
  box-sizing: border-box;
}
a {
  color: #35495E;
}
body{
      background-color:   #d3dbdb;
    }
    
    a{
      color: black;
    }
    a:hover{
      color:grey;
    }
    
    .container{
      background-color: rgba(255,255,255,0.7);
      margin-bottom:  10px;
    }

    #info .container{
      
      margin-bottom: 5%;
      padding: 10%;
      margin-left: 20%;

    }
  
    .headline{
      text-decoration: underline;
    }
</style>
