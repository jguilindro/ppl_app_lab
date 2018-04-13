<template>
  <div class="ingresarCodigo">
    <!-- {{ estadoRealtimeEstudiante }} -->
    <v-jumbotron>
      <!-- {{estadoRealtimeEstudiante}} -->
      <!-- {{estadoRealtimeE}}
      {{yaIngresoCodigoEstudiante}} -->
    <v-container fill-height v-if="estadoLeccion === 'paralelo-no-esta-dando-leccion' || estadoLeccion === 'tiene-que-ingresar-el-codigo' || estadoLeccion === 'al-ingresar-el-codigo-redirigirlo-directamente'">
      <v-layout align-center>
        <v-flex text-xs-center>
          <v-form v-model="valid">
            <v-text-field
              label="Código Lección"
              v-model="codigo"
              :counter="7"
              clearable
              :error-messages="errors.collect('codigo')"
              v-validate="'required|max:7|min:7|numeric'"
              data-vv-name="codigo"
              required
              pattern="[0-9]*"
              inputmode="numeric"
            ></v-text-field>
            <v-btn @click="submit" :disabled="!valid" color="success" large>
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
          <h2>Espere a que el profesor comience la lección</h2>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- <v-card>
       <v-snackbar
      :timeout="6000"
      :multi-line="true"
      :color="'error'"
      :vertical="true"
      v-model="codigoMalIngresado"
      >
      Código Incorrecto
    </v-snackbar>
    </v-card> -->
  </v-jumbotron>
  </div>
</template>
<script>
import { store } from '../store'
import { mapGetters } from 'vuex'

export default {
  $_veeValidate: {
    validator: 'new'
  },
  computed: {
    ...mapGetters({
      estadoLeccion: 'estadoRealtime'
    })
  },
  data () {
    return {
      valid: true,
      codigo: null,
      dictionary: {
        custom: {
          codigo: {
            required: () => 'El código no puede estar vacío',
            número: () => 'Deben ser números',
            max: 'El código debe tener 7 números',
            min: 'El código debe tener 7 números'
          }
        }
      }
    }
  },
  methods: {
    submit () {
      this.$validator.validateAll()
        .then((esValido) => {
          if (esValido) {
            store.dispatch('verificarCodigo', this.codigo)
          }
        })
    },
    malIngresado () {
      this.$store.dispatch('malIngresado')
    }
  },
  created () {
    this.$store.dispatch('obtenerParaleloUsuario')
    this.$validator.localize('es', this.dictionary)
    if (this.estadoLeccion === 'redirigirlo-directamente') {
      window.location.href = '/estudiantes/leccion'
    }
  }
}
</script>
<style scoped>

</style>
