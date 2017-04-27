var App = new Vue({
  el: '#app',
  methods: {
    obtenerLecciones() {
      this.$http.get('/api/lecciones').then(res => {
        this.lecciones = res.body.datos
      })
    },
    tomarLeccion(id_leccion) {
      this.$http.post(`/api/lecciones/tomar/${id_leccion}`).then(res => {
        if (res.body.estado) {
          this.$http.post(`/api/paralelos/${this.paralelo_escogido}/leccion/${id_leccion}`).
            then(res => {
              if (res.body.estado) {
                window.location.href = `/profesores/leccion-panel/${id_leccion}/paralelo/${this.paralelo_escogido}`
              }
            })
        }
      })
      // FIXME verificar que no esten vacios los this.paralelo_escogido y id_leccion
    },
    tomandoLeccion(id_leccion) {
      window.location.href = `/profesores/leccion-panel/${id_leccion}/paralelo/${this.paralelo_escogido}`
    },
    misParalelos() {
      this.$http.get(`/api/paralelos/profesores/mis_paralelos`).then(response => {
        if (response.body.estado) {
          this.paralelos = response.body.datos
        }
      }, response => {
        console.error('error')
      });
    }
  },
  data: {
    lecciones: [
    ],
    paralelos: [
    ],
    paralelo_escogido: ''
  }
})

App.misParalelos()
App.obtenerLecciones()

function escogerParalelo(element) {
  App.paralelo_escogido = element[element.selectedIndex].id
}
