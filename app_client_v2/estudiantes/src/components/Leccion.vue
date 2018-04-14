<template>
  <h1> </h1>
</template>
<script>

import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      leccion: 'leccion'
    })
  },
  methods: {

  },
  mounted () {
    const leccionId = this.$route.params.leccionId
    this.$store.dispatch('leccionDatos', leccionId)
  }
}
</script>
<style scoped>

</style>
