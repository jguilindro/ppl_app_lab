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
    obtenerLogeado: function() {
      var self = this;
      this.$http.get('/api/session/usuario_conectado').
        then(res => {
          if (res.body.estado) {
            self.estudiante = res.body.datos;
            self.presentarLecciones();
          }
        });
    }, 
    presentarLecciones: function(){
      var self = this;
      $.each(self.estudiante.lecciones, function(index, leccion){
        //Existía un bug que mostraba lecciones sin referencia a la lección que pertenecía. Esta validación es para no mostrar eso
        if(leccion.leccion!=null){
          self.lecciones.push(leccion);
        }
      })
    },
    tomarLeccion : function(){
        window.location.href = '/estudiantes/tomar-leccion'
    },
    verLeccion: function(event){
      leccion = event.currentTarget.id;
      window.location.href = '/estudiantes/ver-leccion/' + leccion;
    }
  }
});

