<template>
  <main class="container row">
    <div class="col s12" id="info">
      <a href="/profesores/leccion">
        <div class="col s12 m4">
          <p class="center-align"><i class="large material-icons" id="pru">visibility</i></p>
          <h4 class="center-align">Ver lecciones</h4>
          <p class="center-align">Mira y edita las lecciones de tus paralelos.</p>
        </div>
      </a>
      <a href="/profesores/leccion/crear">
        <div class="col s12 m4">
          <p class="center-align"><i class="large material-icons" id="pru">note_add</i></p>
          <h4 class="center-align">Crea lecciones</h4>
          <p class="center-align">Usa el banco de pregunta y crea de manera rápido y sencilla una lección para los paralelos.</p>
        </div>
      </a>
      <a href="/profesores/grupos">
        <div class="col s12 m4">
          <p class="center-align"><i class="large material-icons" id="pru">mode_edit</i></p>
          <h4 class="center-align">Editar grupo</h4>
          <p class="center-align">¿Tienes duda de los grupos?, si un estudiante se retira o entran nuevos, aquí será la sección para editar esos grupos, mover a los estudiantes o crear nuevos grupos </p>
        </div>
      </a>
       <a href="/profesores/preguntas/banco">
        <div class="col s12 m6">
          <p class="center-align"><i class="large material-icons" id="pru">list</i></p>
          <h4 class="center-align">Banco de pregunta</h4>
          <p class="center-align">Dale una visita al banco de preguntas, crea preguntas en cualquier capítulo y revisa las preguntas de otros profesores, saber cuales preguntas hay puede ayudar a crear una lección más rápidamente.</p>
        </div>
      </a>
        
      <a href="/profesores/preguntas/nueva-pregunta">
        <div class="col s12 m6">
          <p class="center-align"><i class="large material-icons" id="pru">add</i></p>
          <h4 class="center-align">Crea una pregunta</h4>
          <p class="center-align">Ó ten un acceso rápido para crear preguntas</p>
      </div>
      </a>
    </div>
  </main>
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
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #35495E;
}
body{
      background-color:   #d3dbdb;
    }
    #info div{
      height: 40vh;
      margin-bottom: 3%;
    }
    a{
      color: black;
    }
    a:hover{
      color:grey;
    }
    span a{
      color: #039be5;
    }
    .container{
      background-color: rgba(255,255,255,0.7);
      height:   100%;
      margin-bottom:  10px;
    }
    #source_image, #result_image{
      width: 50%;
      height: 50%;
    }
</style>
