var App = new Vue({
  el: '#app',
  mounted: function(){
    this.obtenerLogeado();
    this.obtenerLeccion();
    this.obtenerGrupo();
  },
  data: {
    estudiante: {},
    leccion: {},
    grupos: {}
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
          }
        }); 
    },
    obtenerGrupo: function(){
      //  rkK9Xv8Ax id de la lección para pruebas inmediatas.
      var self = this;
      this.$http.get('/api/grupos').
        then(res => {
          if (res.body.estado) {
            self.grupos = res.body.datos;
            var grupo = datoFiltrado();
          }
        }); 
    }
  }
})
function datoFiltrado(){
  var grupo = App.grupos.filter(filterGrupo);
}
function filterGrupo(){
  for(var y = 0; y < App.grupos.length; y++){
    for(var x = 0; x < App.grupos[y].estudiantes.length; x++){
      if (App.estudiante._id == App.grupos[y].estudiantes[x]._id)
        return true;
    }
  }
  return false;
}
//App.leccion_nueva.preguntas

/*
function filtrarPreguntas(elemento){
  for(var x = 0; x < App.leccion_nueva.preguntas.length; x++){
      if(elemento._id == App.leccion_nueva.preguntas[x].pregunta)
        return true;
      }
  return false;
}
*/

//   var selected = App.preguntas.filter(filtrarPreguntas);
