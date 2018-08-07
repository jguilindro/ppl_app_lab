<template>
  <div>
    <v-card-title>
      <h4 class="title text-xs-center mx-auto" v-if="!esSeccion">Pregunta #{{ index+1 }}</h4>
      <h4 class="title text-xs-center mx-auto" v-else>Sección #{{ index+1 }}</h4>
    </v-card-title>
    <v-card-title>
      <p class="text-xs-center mx-auto title">{{ nombre }}</p>
    </v-card-title>
    <v-card-text>
      <label class="title">Descripción</label>
      <p v-html="descripcion" class="mt-2"></p>
      <p class="text-xs-right">Puntaje: {{ puntaje }} puntos</p>
    </v-card-text>
  </div>
</template>

<script>
  export default {
    props: ['index', 'nombre', 'descripcion', 'puntaje', 'esSeccion']
  }
</script>

<style scoped>

</style>
