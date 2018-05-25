<template>
  <v-card v-if="pregunta">
    <v-card-title class="white justify-center">
      <span class="headline white--text espol">{{ pregunta.nombre }}</span>
    </v-card-title>

        <v-layout row wrap>
          <v-flex d-flex xs12 sm6 md6>

            <v-list two-line>
              <v-list-tile>
                <v-list-tile-action>
                  <v-tooltip bottom>
                    <v-icon slot="activator">assignment_ind</v-icon>
                    <span>Creador</span>
                  </v-tooltip>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-sub-title>{{ pregunta.creador.nombres }} {{ pregunta.creador.apellidos }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>

            </v-list>

          </v-flex>
          <v-flex d-flex xs6 sm4 md4 offset-md2 offset-sm2>
            <v-list two-line>
              <v-list-tile>
                <v-list-tile-action>
                  <v-tooltip bottom>
                    <v-icon slot="activator">school</v-icon>
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
            <v-list two-line>
              <v-list-tile>
                <v-list-tile-action>
                  <v-tooltip bottom>
                    <v-icon slot="activator">beenhere</v-icon>
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
            <v-list two-line>
              <v-list-tile>
                <v-list-tile-action>
                  <v-tooltip bottom>
                    <v-icon slot="activator">star</v-icon>
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
            <v-list two-line>
              <v-list-tile>
                <v-list-tile-action>
                  <v-tooltip bottom>
                    <v-icon slot="activator">access_time</v-icon>
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
            <v-list two-line>
              <v-list-tile>
                <v-list-tile-action>
                  <v-tooltip bottom>
                    <v-icon slot="activator">calendar_today</v-icon>
                    <span>Fecha de Creación</span>
                  </v-tooltip>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-sub-title>{{ pregunta.createdAt}}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-flex>
        </v-layout>


    <v-divider></v-divider>
    <v-card-actions>
      <v-tooltip bottom>
          <v-icon slot="activator">assignment</v-icon>
          <span>Descripción</span>
      </v-tooltip>
      <v-subheader>Descripción</v-subheader>
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
      //  this.getPregunta(this.$route.params.id)
    },
    data: () => ({
      loading: false,
      error: null,
      pregunta: {
        _id: 'ByZfFW6h-',
        capitulo: '1',
        creador: {
          _id: 'BkpJJM5yW',
          apellidos: 'MONTERO CARPIO',
          nombres: 'EDUARDO EFRAIN'},
        createdAt: '2017-10-12',
        descripcion: '<p><span style="font-size:11.0pt;line-height:107%; font-family:&quot;Calibri&quot;,sans-serif;mso-ascii-theme-font:minor-latin;mso-fareast-font-family: Calibri;mso-fareast-theme-font:minor-latin;mso-hansi-theme-font:minor-latin; mso-bidi-theme-font:minor-latin;mso-ansi-language:ES-EC;mso-fareast-language: EN-US;mso-bidi-language:AR-SA">La figura inferior muestra varios pulsos en una cuerda estirada.&nbsp;</span><br></p><p><img src="http://4.bp.blogspot.com/-qT9q4k4M3kc/UQ-jNDiK2hI/AAAAAAAACGA/4ZcPs55VPBc/s400/Ondaviajandosobrecuerda2.GIF" alt="Resultado de imagen para ondas en una cuerda"><br></p>',
        nombre: 'Pulsos en una cuerda',
        puntaje: 6,
        subpreguntas: [
          {
            contenido: '<p><p class="MsoListParagraph" style="text-indent:-18.0pt;line-height:115%; mso-list:l0 level1 lfo1">&nbsp; &nbsp; &nbsp; &nbsp;<span style="color: inherit; text-align: justify;">¿Alguna de las siguientes características cambiará significativamente mientras el pulso se mueve a lo largo de la cuerda? (Ignore lo que ocurre cuando el pulso llega al final de la cuerda)</span></p><p class="MsoNormal" style="margin: 0cm 0cm 12pt 21.3pt; text-align: justify; line-height: 12.95pt; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><o:p></o:p></p> <p class="MsoListParagraph" style="margin: 5pt 0cm 0.0001pt 42.55pt; text-indent: -21.25pt; line-height: 12.95pt; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><!--[if !supportLists]--><span style="font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family: Symbol">·<span style="font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 7pt; line-height: normal; font-family: &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><!--[endif]-->Amplitud del pulso<o:p></o:p></p> <p class="MsoListParagraph" style="margin: 5pt 0cm 0.0001pt 42.55pt; text-indent: -21.25pt; line-height: 12.95pt; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><!--[if !supportLists]--><span style="font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family: Symbol">·<span style="font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 7pt; line-height: normal; font-family: &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><!--[endif]-->Ancho del pulso<o:p></o:p></p> <p class="MsoListParagraph" style="margin-left: 42.55pt; text-indent: -21.25pt; line-height: 12.95pt; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><!--[if !supportLists]--><span style="font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family: Symbol">·<span style="font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 7pt; line-height: normal; font-family: &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><!--[endif]-->Forma del pulso<o:p></o:p></p> <p class="MsoListParagraph" style="margin-left: 42.55pt; text-indent: -21.25pt; line-height: 12.95pt; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;"><!--[if !supportLists]--><span style="font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family: Symbol">·<span style="font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 7pt; line-height: normal; font-family: &quot;Times New Roman&quot;;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span><!--[endif]-->Velocidad del pulso<o:p></o:p></p> <span style="font-size:12.0pt;line-height:107%;font-family:&quot;Times New Roman&quot;,serif; mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin;mso-ansi-language: ES-EC;mso-fareast-language:EN-US;mso-bidi-language:AR-SA"><br></span></p><p><span style="font-size:12.0pt;line-height:107%;font-family:&quot;Times New Roman&quot;,serif; mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin;mso-ansi-language: ES-EC;mso-fareast-language:EN-US;mso-bidi-language:AR-SA">Justifique su respuesta</span></p>',
            orden: 1,
            puntaje: '2',
            show: false
          }
        ],
        tiempoEstimado: '10',
        tipoLeccion: 'tutorial',
        tipoPregunta: 'justificacion',
        updatedAt: '2018-05-15T20:21:56.018Z'
      }
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



</style>

