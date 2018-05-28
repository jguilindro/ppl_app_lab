<template>
  <v-container>
    <v-layout row wrap v-if="error">
      <v-flex xs12 sm9 offset-sm1>
        <v-alert type="error" dismissible v-model="alert" @input="onClose">
          {{ error.mensaje }}
        </v-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm9 offset-sm1>
        <v-card>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field prepend-icon="person" label="correo" name="correo" id="correo" type="email" v-model="correo" required></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field prepend-icon="lock" label="Contraseña" name="contrasenna" id="contrasenna" type="password" v-model="contrasenna" required></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-btn
                  type="submit"
                  class="right red white--text"
                  :disabled="!habilitado"
                  :loading="loading">
                    Login
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  computed: {
    habilitado () {
      return this.correo !== '' && this.correo !== undefined && this.contrasenna !== '' && this.contrasenna !== undefined && !this.loading
    },
    error () {
      return this.$store.getters.error
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  data () {
    return {
      correo: '',
      contrasenna: '',
      alert: true
    }
  },
  methods: {
    login () {
      const data = {
        correo: this.correo,
        contrasenna: this.contrasenna
      }
      this.$store.dispatch('login', data)
    },
    onClose () {
      this.$store.commit('setError', null)
    }
  }
}
</script>
