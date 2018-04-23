<template>
  <div class="lecciones">
    <v-list two-line>
      <template v-for="(leccion, index) in lecciones">
        <v-list-tile avatar ripple :key="index" @click="irLeccion(leccion.id, leccion.calificacion)">
          <v-list-tile-avatar>
            {{ leccion.calificacion }}
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ leccion.nombre }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ leccion.tipo }}</v-list-tile-sub-title>
            <v-list-tile-sub-title>{{ leccion.fechaInicioTomada | fechaFormato }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider v-if="index + 1 < lecciones.length" :key="`divider-${index}`"></v-divider>
      </template>
    </v-list>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import router from '../router'

export default {
  computed: {
    ...mapGetters({
      lecciones: 'lecciones'
    })
  },
  methods: {
    irLeccion (leccionId, calificacion) {
      if (calificacion) {
        router.push({name: 'Leccion', params: { leccionId }})
      }
    }
  },
  mounted () {
    this.$store.dispatch('limpiarLeccion')
  }
}
</script>
<style scoped>

</style>
