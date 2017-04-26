var app = new Vue({
  el: '#app',
  mounted: function(){
    this.obtenerLogeado();
  },
  data: {
    estudiante: {},
    lecciones: []
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
            console.log('Este es el estudiante conectado')
            console.log(self.estudiante);
            self.presentarLecciones();
          }
        });
    },
    verLeccion: function(event){
      leccion = event.currentTarget.id;
      window.location.href = '/estudiantes/ver-leccion/' + leccion;
    },
    presentarLecciones: function(){
      var self = this;
      $.each(self.estudiante.lecciones, function(index, leccion){
        console.log('Actualmente en la leccion: ');
        console.log(leccion);
        if(leccion.leccion!=null){
          console.log('Anadida la leccion')
          self.lecciones.push(leccion);
        }
        else{
          console.log('Leccion nula, no anadida')
        }
        console.log('-----------------------------')
      })
    }
  }
});

