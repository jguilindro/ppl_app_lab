<template>
  <div>
    <app-nav></app-nav>
    <div id="lecciones">
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
  </div>
</template>

<script>
import router from '@/router'
import AppNav from '@/components/Nav/AppNav'

export default {
  components: { AppNav },
  computed: {
    lecciones () {
      return this.$store.getters['lecciones/dadas']
    }
  },
  methods: {
    irLeccion (leccionId, calificacion) {
      if (calificacion) {
        router.push({name: 'Leccion', params: { leccionId }})
      }
    }
  }
}
</script>
