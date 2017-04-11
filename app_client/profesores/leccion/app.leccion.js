var App = new Vue({
  el: '#app',
  methods: {
    crearLeccion() {
      var crearLeccionURL = '/api/lecciones'
      this.$http.post(crearLeccionURL, this.leccion_nueva)
        .then(res => {
          console.log(res.body)
        })
    },
    obtenerTodasPreguntas() {
      this.$http.get('/api/preguntas')
        .then(res => {
          this.preguntas = res.body.datos
        })
    }
  },
  data: {
    leccion_nueva: {
      nombre: '',
      tiempoEstimado: '',
      tipo: '',
      fechaInicio: '',
      preguntas: [],
      puntaje: 0
    },
    preguntas: []
  }
})
App.obtenerTodasPreguntas()

function preguntaSeleccionada(_element) {
  var existe = App.leccion_nueva.preguntas.some(pregunta => _element.id == pregunta)
  if (!existe) {
    App.leccion_nueva.preguntas.push(_element.id)
  } else {
    App.leccion_nueva.preguntas = App.leccion_nueva.preguntas.filter(pregunta => _element.id != pregunta)
  }
}
// document.getElementById('datePicker').valueAsDate = new Date();
// document.getElementById('datePicker').setAttribute('min', "2017-04-09")
