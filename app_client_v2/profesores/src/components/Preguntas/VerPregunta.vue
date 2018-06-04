<template>
  <v-card v-if="pregunta">
    <v-card-title class="white justify-center">
      <span class="headline white--text espol">{{ pregunta.nombre }}</span>
    </v-card-title>

        <v-layout row wrap>
          <v-flex d-flex xs12 sm6 md6>

            <v-list>
              <v-list-tile>
                <v-list-tile-action class="icons">
                  <v-tooltip bottom>
                    <v-icon slot="activator" class=mr-2>assignment_ind</v-icon>
                    <span>Creador</span>
                  </v-tooltip>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-sub-title>{{ pregunta.creador.nombres }} {{ pregunta.creador.apellidos }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>

            </v-list>

          </v-flex>
          <v-flex d-flex xs6 sm4 md4 offset-md2 offset-xs0>
            <v-list >
              <v-list-tile>
                <v-list-tile-action class="icons">
                  <v-tooltip bottom>
                    <v-icon slot="activator" class=mr-2>school</v-icon>
                    <span>Tipo de Lección</span>
                  </v-tooltip>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-sub-title>{{ pregunta.tipoLeccion }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-flex>

          <v-flex d-flex xs6 sm4 md4>
            <v-list>
              <v-list-tile>
                <v-list-tile-action class="icons">
                  <v-tooltip bottom>
                    <v-icon slot="activator" class=mr-2>beenhere</v-icon>
                    <span>Tipo de Pregunta</span>
                  </v-tooltip>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-sub-title>{{ pregunta.tipoPregunta }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-flex>

          <v-flex d-flex xs6 sm4 md2 offset-md4 offset-sm2>
            <v-list>
              <v-list-tile>
                <v-list-tile-action class="icons">
                  <v-tooltip bottom>
                    <v-icon slot="activator" class=mr-2>star</v-icon>
                    <span>Puntaje</span>
                  </v-tooltip>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-sub-title>{{ pregunta.puntaje }} Puntos</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-flex>

          <v-flex d-flex xs6 sm4 md4>
            <v-list>
              <v-list-tile>
                <v-list-tile-action class="icons">
                  <v-tooltip bottom>
                    <v-icon slot="activator" class=mr-2>access_time</v-icon>
                    <span>Tiempo Estimado</span>
                  </v-tooltip>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-sub-title>{{ pregunta.tiempoEstimado }} Minutos</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-flex>

          <v-flex d-flex xs6 sm4 md4 offset-md4 offset-sm2>
            <v-list >
              <v-list-tile>
                <v-list-tile-action class="icons">
                  <v-tooltip bottom>
                    <v-icon slot="activator" class=mr-2>calendar_today</v-icon>
                    <span>Fecha de Creación</span>
                  </v-tooltip>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-sub-title>{{Date(pregunta.createdAt)}}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-flex>
        </v-layout>


    <v-divider></v-divider>
    <v-card-actions>
      <v-tooltip bottom>
          <v-icon slot="activator" class=ml-2>assignment</v-icon>
          <span>Descripción</span>
      </v-tooltip>
      <v-subheader  class=px-2>Descripción</v-subheader>
    </v-card-actions>
    <v-card-text v-html="pregunta.descripcion"></v-card-text>
    <v-divider></v-divider>
    <v-card-text v-for="sub in pregunta.subpreguntas" v-if="pregunta.subpreguntas" :key="sub.orden">
      <v-card-actions>
        <v-subheader>Subpregunta {{ sub.orden }}</v-subheader>
        <v-spacer></v-spacer>
        <v-btn icon @click.native="sub.show = !sub.show">
          <v-icon>{{ sub.show ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>
        </v-btn>
      </v-card-actions>
      <v-slide-y-transition>
        <v-card-text v-show="sub.show">
          <p v-html="sub.contenido"></p>
          <span class="right">Puntaje: {{ sub.puntaje }}</span>
        </v-card-text>
      </v-slide-y-transition>
      <v-divider class="mt-4"></v-divider>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    mounted () {
      this.getPregunta(this.$route.params.id)
    },
    data: () => ({
      loading: false,
      error: null,
      pregunta: null
    }),
    methods: {
      getPregunta (id) {
        this.loading = true
        this.$http.get(`/api/preguntas/${id}`)
          .then((response) => {
            console.log(response)
            this.loading = false
            if (response.body.estado) {
              this.pregunta = response.body.datos
              if (this.pregunta.hasOwnProperty('subpreguntas') && this.pregunta.subpreguntas.length > 0) {
                for (let i = 0; i < this.pregunta.subpreguntas.length; i++) {
                  this.$set(this.pregunta.subpreguntas[i], 'show', false)
                }
              }
            } else {
              this.error = response.body
            }
          }, (err) => {
            this.loading = false
            this.error = err
          })
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.espol{
  color: #001C43 !important;
}
p img {
  max-width: -webkit-fill-available !important;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 60%;
}

div.list__tile__action.icons{

  min-width: 24px !important;

}

</style>

