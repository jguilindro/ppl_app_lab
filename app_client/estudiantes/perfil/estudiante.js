var app = new Vue({
  el: '#app',
  mounted: function(){
    this.obtenerLogeado();
  },
  data: {
    estudiante: {}/*
    estudiante: {
    	nombre: 'Edison',
    	apellido: 'Mora',
    	lecciones: [
    		{
    			nombre: 'Leccion 1',
    			estado: 'Calificado',
    			calificacion: '80',
    			fecha: '21-05-2017'
    		},
    		{
    			nombre: 'Leccion 2',
    			estado: 'Calificado',
    			calificacion: '60',
    			fecha: '29-05-2017'
    		},
    		{
    			nombre: 'Leccion 3',
    			estado: 'Pendiente',
    			calificacion: '',
    			fecha: '7-06-2017'
    		}
    	]
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
    }
  }
});