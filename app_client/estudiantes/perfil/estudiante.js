var app = new Vue({
  el: '#app',
  mounted: function(){
    this.obtenerLogeado();
  },
  data: {
    estudiante: {}/*
    estudiante: {
    	
    }*/
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
    verLeccion: function(event){
      leccion = event.currentTarget.id;
      window.location.href = '/estudiantes/ver-leccion/' + leccion;
    }
  }
});

