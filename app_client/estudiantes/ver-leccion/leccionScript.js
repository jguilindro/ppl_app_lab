var App = new Vue({
  el: '#app',
  mounted: function(){
    this.obtenerLogeado();
    this.obtenerLeccion();
    $('ul.tabs').tabs();
  },
  data: {
    estudiante: {},
    leccion: {},
    grupos: []
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
            var grupo = this.obtenerGrupoDeEstudiante(self.estudiante)
          }
        });
    },
    obtenerLeccion: function(){
      //  rkK9Xv8Ax id de la lección para pruebas inmediatas.
      var self = this;
      path = window.location.pathname;
            
      //Break the path into segments
      segments = path.split("/");
      url = '/api/lecciones/' + segments[3]
      this.$http.get(url).
        then(res => {
          if (res.body.estado) {
            self.leccion = res.body.datos;
          }
        }); 
    },
    obtenerGrupoDeEstudiante: function(estudiante){
      var self = this;
      var url = '/api/grupos/estudiante/'
      url = url + estudiante._id;
      this.$http.get(url).then(response => {
        //Success callback
        for(var x = 0; x < this.leccion.preguntas.length; x++){
          this.obtenerRespuestas(response.body.datos._id, self.leccion._id, this.leccion.preguntas[x].pregunta);
        }        
      }, response => {
        //Error callback
      });    
    },
    obtenerRespuestas: function(grupo_id, leccion_id, pregunta_id){
      var url = '/api/respuestas/buscar'
      var self = this;
      var param = {
        grupo: grupo_id,
        leccion: leccion_id,
        pregunta: pregunta_id
      }
      this.$http.post(url, param).then(response => {
        //success callback
        this.grupos.push(response.body.datos)
        }, response => {
        //error callback
        console.log(response)
      });
    }
  }
})
      //  rkK9Xv8Ax id de la lección para pruebas inmediatas.

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

/*



*/