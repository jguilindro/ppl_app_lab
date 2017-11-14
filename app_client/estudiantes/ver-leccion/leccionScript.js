var App = new Vue({
  el: '#app',
  mounted: function(){
    this.estudianteId;
    this.leccionId= window.location.href.toString().split('/')[5];
    this.obtenerDatosLeccion(this);
    $('ul.tabs').tabs();
  },
  data: {
    leccionId : '',
    grupoId   : '',
    leccion   : {},
    preguntas : [],
    respuestasConectado: [],
    respuestas: [],
    respuestasEstudiantes: [],
    preguntasEstudiantes: [],
    estudiante: {
      nombres  : '',
      apellidos: '',
      correo   : '',
      grupo    :  ''
    },
    nombresEstudiantes: {},
    estudiantesGrupo: [],
    feedback  : [],
    calificacionTotal    : 0.00,    //Va a ser la suma de las calificaciones (sobre 2) de las preguntas, sobre el puntaje de la lección
    calificacionPonderada: 0.00 //Va a ser la calificación ponderada, sobre 100
  },
  methods: {
    tomarLeccion : function(){
        window.location.href = '/estudiantes/tomar-leccion'
    },
    obtenerDatosLeccion : function(self){
      this.$http.get('/api/session/usuario_conectado').
        then(res => {
          if (res.body.estado) {
            self.estudianteId = res.body.datos._id;
          this.obtenerGrupoDeEstudiante(res.body.datos._id);
          
          }
        });
    },

    //Obtiene los ids de todos los estudiantes del grupo
    obtenerGrupoDeEstudiante: function(estudiante){
          var self = this;
          var url = '/api/grupos/estudiante/'
          url = url + estudiante;
          this.$http.get(url).then(response => {
            //Success callback
           self.estudiantesGrupo=response.body.datos.estudiantes;
           this.obtenerPreguntasRespuestas();
          }, response => {
            //Error callback
          });    
        },

    //Obtiene las preguntas y respuestas de cada estudiante del grupo.    
    obtenerPreguntasRespuestas: function(){
      var self = this;
      $.each(self.estudiantesGrupo, function(index, estudiante){
        self.obtenerNombreEstudiante(estudiante);//Obtiene los nombres de los estudiantes
      $.get({
          url : '/api/lecciones/datos/' + estudiante + '/' + self.leccionId,
          
          success : function(res){
            self.leccion    = res.datos.leccion;
            self.estudiante = res.datos.estudiante;
            self.respuestas = res.datos.respuestas;
            
            self.respuestasEstudiantes.push(self.respuestas);
            //self.preguntasEstudiantes.push(self.preguntas);
            if(estudiante==self.estudianteId){
              self.respuestasConectado=res.datos.respuestas;
              self.preguntas  = self.armarArrayPreguntas(res.datos.leccion.preguntas, self.respuestas, estudiante);
            }
            console.log(self.preguntasEstudiantes);
          },
          error: function(err){
            console.log(err)
          }
      });  
       
      });


        },
        //Crea un objeto que simula un hash table donde la llave es el id del estudiante y el valor el nombre completo
        obtenerNombreEstudiante: function(idEstudiante){
          var self = this;
          $.get({
          url : '/api/estudiantes/' + idEstudiante,
          success : function(res){
            self.nombresEstudiantes[idEstudiante]= res.datos.nombres+ ' '+ res.datos.apellidos;
            //console.log(self.nombresEstudiantes);
          },
          error: function(err){
            console.log(err);
          }
          });  
        },

    //////////////////////////////////////////////////////
    //HELPERS
    //////////////////////////////////////////////////////
    /*
      Devuelve el array de preguntas que se va a mostrar al usuario
      Cada pregunta tendrá la información completa de la pregunta y un boolean indicando si tiene subpreguntas
    */
    armarArrayPreguntas: function(preguntasObtenidas, respuestasObtenidas, estudianteId){
      let arrayPreguntas = [];
      for( let i = 0; i < preguntasObtenidas.length; i++ ) {
        let preguntaActual               = preguntasObtenidas[i].pregunta;
        let respuestaActual              = $.grep(respuestasObtenidas, function(respuesta, i){
          return preguntaActual._id == respuesta.pregunta;
        })[0];
        preguntaActual.orden             = preguntasObtenidas[i].ordenPregunta;
        preguntaActual.subpreguntas      = App.armarArraySubpreguntas(preguntaActual, respuestaActual, estudianteId);
        preguntaActual.tieneSubpreguntas = ( preguntaActual.subpreguntas != null && preguntaActual.subpreguntas.length > 0 );
        arrayPreguntas.push(preguntaActual);
      }
      return arrayPreguntas;
    },
    armarArraySubpreguntas: function(pregunta, respuesta, estudianteId){
      let array = [];
      for (var i = 0; i < pregunta.subpreguntas.length; i++) {
        let subActual    = pregunta.subpreguntas[i];
        let subResActual = $.grep(respuesta.subrespuestas, function(res, i){
          return subActual.orden == res.ordenPregunta;
        })[0];

        subActual.respuesta    = subResActual.respuesta;
        subActual.estudiante   = estudianteId;
        subActual.calificacion = subResActual.calificacion;
        subActual.feedback     = subResActual.feedback;
        subActual.calificada   = subResActual.calificada;
        if(subResActual.imagen.indexOf('imgur') > 0){
          subActual.imagen     = subResActual.imagen; 
        }else{
          subActual.imagen     = '';
        }
 
        let calPonderada          = App.ponderarCalificacion(2, subActual.calificacion, subActual.puntaje);
        App.calificacionTotal     = App.calificacionTotal + calPonderada;
        App.calificacionPonderada = App.ponderarCalificacion(App.leccion.puntaje, App.calificacionTotal, 100).toFixed(2);

        array.push(subActual);
      }
      return array;
    },
    /*
      puntajeMax      -> ponderacion
      puntajeObtenido -> x

      x = puntajeObtenido * ponderacion / puntajeMax
    */
    ponderarCalificacion: function(puntajeMax, puntajeObtenido, ponderacion){
      return ( (puntajeObtenido * ponderacion) / puntajeMax );
    },
    regresar: function(){
      window.location.href = '/estudiantes';
    }
    
  }
})
     