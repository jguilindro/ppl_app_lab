<template>
  <div>
    <h1>Login</h1>
    <v-form>
      <v-text-field
        label="Usuario"
        v-model="usuario"
        >
      </v-text-field>
      <v-btn
      @click="submit">
      submit
      </v-btn>
    </v-form>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        usuario: 'stsemaci',
      }
    },
    methods: {
      submit() {
        axios({
          method: 'post',
          url: '/api/v2/auth/login',
          data: {
            usuario: this.usuario,
          },
        }).then((res) => {
          if (res.data) {
            localStorage.clear()
            this.$store.dispatch('LOGGEARSE')
            this.$router.push('/Lecciones')
          }
        }).catch(() => {
          localStorage.clear()
        })
      },
    },
  }
</script>
