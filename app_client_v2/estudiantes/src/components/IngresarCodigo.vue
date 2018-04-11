<template>
  <div class="lecciones">
    <v-form v-model="valid">
      <v-text-field
        label="Código Lección"
        v-model="codigo"
        :counter="7"
        :error-messages="errors.collect('codigo')"
        v-validate="'required|max:7|min:7|numeric'"
        data-vv-name="codigo"
        required
        pattern="[0-9]*"
        inputmode="numeric"
      ></v-text-field>
      <v-btn @click="submit" :disabled="!valid" >
        Enviar
      </v-btn>
    </v-form>
  </div>
</template>
<script>
export default {
  $_veeValidate: {
    validator: 'new'
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
            this.$store.dispatch('verificarCodigo', this.codigo)
          }
        })
    }
  },
  mounted () {
    this.$validator.localize('es', this.dictionary)
  }
}
</script>
<style scoped>

</style>
