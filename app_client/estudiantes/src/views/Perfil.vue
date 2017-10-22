<template>
  <div id="perfil">
    <h1 id="perfil-nombres">{{estudiante.nombres}}</h1>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: mapGetters([
    'estudiante'
  ])
}
</script>

<style scoped>
  h1#perfil-nombres {
    color: blue;
  }
</style>
