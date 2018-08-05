<template>
  <v-card :key="pregunta._id" class="mb-3 elevation-5">
    <descripcion-pregunta :index="index" :nombre="pregunta.nombre" :descripcion="pregunta.descripcion" :puntaje="pregunta.puntaje" :esSeccion="pregunta.esSeccion"></descripcion-pregunta>
    <v-card-text v-if="pregunta.esSeccion">
      <v-layout row wrap>
        <v-flex xs12 v-for="(sub, j) in pregunta.subpreguntas" :key="pregunta._id + '-' + sub.orden">
          <v-divider class="mb-3"></v-divider>
          <v-card flat>
            <descripcion-pregunta :index="j" :descripcion="sub.contenido" :puntaje="sub.puntaje" :esSeccion="false"></descripcion-pregunta>
            <v-card-text>
              <calificar-respuesta :sub="sub" :idPregunta="pregunta._id" v-on:calificacion="onCalificacion" :esSeccion="true"></calificar-respuesta>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-text v-else>
      <calificar-respuesta :sub="pregunta" :idPregunta="pregunta._id" v-on:calificacion="onCalificacion" :esSeccion="false"></calificar-respuesta>
    </v-card-text>
  </v-card>
</template>
<script>
  export default {
    props: ['pregunta', 'index'],
    methods: {
      onCalificacion (value) {
        this.$emit('calificacionPregunta', value)
      }
    }
  }
</script>
