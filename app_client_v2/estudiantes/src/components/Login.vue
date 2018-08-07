<template>
  <v-form v-model="valid" ref="form" lazy-validation action="/api/session/login">
    <v-text-field
      label="Correo"
      v-model="correo"
      required
    ></v-text-field>
    <v-btn
      @click="submit"
    >
      submit
    </v-btn>
  </v-form>
</template>
<script>
import axios from 'axios'
import router from '../router'
export default {
  data: () => ({
    valid: true,
    correo: 'walava@espol.edu.ec'
  }),
  methods: {
    submit () {
      if (this.$refs.form) {
        axios.post('/api/session/login/dev', {
          correo: this.$data.correo
        }).then((resp) => {
          if (resp.data.tipo === 'estudiante') {
            router.push('lecciones')
          }
        })
      }
    }
  }
}
</script>
<style scoped>
</style>
