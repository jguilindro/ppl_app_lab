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
          this.obtenerPregunta(this.leccion.preguntas[x].pregunta, x);
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
    },
    obtenerPregunta: function(pregunta_id, index){
      //Esta función retorna el título y descripción de la pregunta
      /*
        Esta función es una tontera, pero lo que hace es cambiar un poco el objeto de grupos,
        ahora la opción de 'contestado' contará con un objeto con la información total de la
        pregunta. Es colocado en el index 0 porque ese es el que siempre existirá. Otro método
        que sea aplicado ya actualizado será agradecido
      */
      var url = '/api/preguntas/'
      var self = this;
      var pregunta = {
           capitulo       :     '',
           descripcion    :     '',
           nombre         :     '',
           tiempoEstimado :     0,
           _id            :     '' 
      }

      url = url + pregunta_id;
      this.$http.get(url).then(response => {
        //success callback
        pregunta.capitulo       = response.body.datos.capitulo
        pregunta.descripcion    = response.body.datos.descripcion
        pregunta.nombre         = response.body.datos.nombre
        pregunta.tiempoEstimado = response.body.datos.tiempoEstimado
        pregunta._id            = response.body.datos._id

        this.grupos[index][0].contestado = pregunta;
        }, response => {
        //error callback
        console.log(response);
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
        /*
calificacion
contestado
createdAt
estudiante
feedback
grupo
leccion
paralelo
pregunta
respuesta
updatedAt
_id
        */

/*
  nuevo atributo de estudiantes, lecciones. es array de objetos con:
  id_leccion
  calificado
  fechas
  grupo cuando dió la leccion

  for each de lecciones y buscar leccion, 
*/