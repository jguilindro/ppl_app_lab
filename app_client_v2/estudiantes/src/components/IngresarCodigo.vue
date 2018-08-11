<template>
  <div>
    <app-nav></app-nav>
    <div class="ingresarCodigo">
      <v-jumbotron>
      <v-container fill-height v-if="estadoLeccion === 'paralelo-no-esta-dando-leccion' || estadoLeccion === 'tiene-que-ingresar-el-codigo' || estadoLeccion === 'al-ingresar-el-codigo-redirigirlo-directamente'">
        <v-layout align-center>
          <v-flex text-xs-center>
            <v-form v-model="valid">
              <v-text-field
                label="Código Lección"
                v-model="codigo"
                :counter="7"
                :autofocus="true"
                :max="7"
                clearable
                :error-messages="errors.collect('codigo')"
                v-validate="'required|max:7|numeric'"
                data-vv-name="codigo"
                required
                pattern="[0-9]*"
                inputmode="numeric"
                @keypress="keypressed($event)"
              ></v-text-field>
              <v-btn class="hidden-md-and-up" @click="submit" block :disabled="!valid" color="primary" dark>
                Enviar
              </v-btn>
              <v-btn class="hidden-sm-and-down" @click="submit" :disabled="!valid" color="primary" large>
                Enviar
              </v-btn>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container fill-height v-if="estadoLeccion === 'tiene-que-esperar-a-que-empiece-la-leccion'">
        <v-layout align-center>
          <v-flex text-xs-center>
            <v-progress-circular indeterminate :size="70" :width="7" color="blue"></v-progress-circular>
            <h2>Espere a que el profesor comience la lección. Si no lo redirige, por favor recargue la página</h2>
          </v-flex>
        </v-layout>
      </v-container>
       <v-snackbar
        :timeout="3000"
        :multi-line="true"
        :color="'error'"
        :top="true"
        v-model="snackbar"
      >
        {{ mensajeSnackbar }}
        <v-btn flat color="white" @click.native="snackbar = false">Cerrar</v-btn>
      </v-snackbar>
    </v-jumbotron>
    </div>
  </div>
</template>
<script>
import AppNav from '@/components/Nav/AppNav'
import { store } from '@/store'

export default {
  components: { AppNav },
  $_veeValidate: {
    validator: 'new'
  },
  created () { // al iniciar debe poder redirigirlo
    this.$validator.localize('es', this.dictionary)
  },
  computed: {
    estadoLeccion () {
      return this.$store.getters['realtime/estado']
    },
    online () {
      return this.$store.getters['estaOnline']
    }
  },
  data () {
    return {
      valid: false,
      codigo: null,
      snackbar: false,
      mensajeSnackbar: '',
      dictionary: {
        custom: {
          codigo: {
            required: () => 'El código no puede estar vacío',
            pattern: () => 'Deben ser números',
            max: 'El código debe tener 7 números',
            min: 'El código debe tener 7 números'
          }
        }
      }
    }
  },
  methods: {
    async submit () {
      let self = this
      let esValido = await this.$validator.validateAll()
      if (esValido) {
        self.snackbar = false
        await store.dispatch('realtime/Codigo', this.codigo)
        let { estadoRealtime } = self.$store.getters
        if (estadoRealtime === 'paralelo-no-esta-dando-leccion') {
          self.snackbar = true
          self.mensajeSnackbar = 'El paralelo no esta dando lección'
        } else if (estadoRealtime === 'tiene-que-ingresar-el-codigo') {
          self.snackbar = true
          self.mensajeSnackbar = 'El código ingresado no es de la lección'
        } else if (estadoRealtime === 'al-ingresar-el-codigo-redirigirlo-directamente') {
          if (process.env.NODE_ENV === 'production') {
            window.location.href = '/estudiantes/leccion'
          } else {
            this.$router.push('/leccionRealtime')
          }
        }
      } else {
        self.snackbar = true
        self.mensajeSnackbar = 'Código con formato no válido'
      }
    },
    keypressed (e) {
      const code = (e.keyCode ? e.keyCode : e.which)
      if (code === 13) {
        this.submit()
      }
    }
  },
  watch: {
    estadoLeccion (val) {
      if (val === 'redirigirlo-directamente') {
        if (process.env.NODE_ENV === 'production') {
          window.location.href = '/estudiantes/leccion'
        } else {
          this.$router.push('/leccionRealtime')
        }
      }
    }
  }
}
</script>
