var app = new Vue({
  el: '#app',
  mounted: function(){
    this.obtenerLogeado();
    this.obtenerLeccion();
  },
  data: {
    estudiante: {},
    leccion: {}
  },
  methods: {
    tomarLeccion : function(){
        window.location.href = '/estudiantes/tomar-leccion'
    },
    obtenerLogeado: function() {
      var self = this;
      this.$http.get('/api/session/usuario_conectado').
        then(res => {
          if (res.body.estado) {
            self.estudiante = res.body.datos;
            console.log(self.estudiante)
          }
        });
    },
    obtenerLeccion: function(){
      //  rkK9Xv8Ax id de la lección para pruebas inmediatas.
      var self = this;
      this.$http.get('/api/lecciones/rkK9Xv8Ax').
        then(res => {
          if (res.body.estado) {
            self.leccion = res.body.datos;
            console.log(self.leccion)
          }
        }); 
    }
  }
});