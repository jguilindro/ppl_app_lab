var app = new Vue({
  created: function(){
    this.profesorLogeado();
    this.obtenerRegistrosCalificaciones();
  },
  mounted: function(){
    //Inicializadores de Materialize
    $('.button-collapse').sideNav();
    $(".dropdown-button").dropdown({ hover: false });
    $('select').material_select();
    //Navbar
    $.get({
      url: "/navbar/profesores",
      success: function(data) {
        document.getElementById('#navbar').innerHTML = data;
        $(".button-collapse").sideNav();
        $(".dropdown-button").dropdown();
      }
    })
  },
  el: '#app',
  data: {
      profesor: {},
      registros: [],    //Registros de calificaciones -> leccion, grupo, nombrGrupo, paralelo, nombreParalelo, participantes, calificada, calificacion
      grupos: [],
      registrosAMostrar: [],
      grupoSeleccionado: {},
      estudiantes: [],
      estudianteEscogidoId: ''
	},
  methods: {
    profesorLogeado: function() {
      var self = this;
      $.get({
        url: '/api/session/usuario_conectado',
        success: function(res){
          if (res.estado) {
            self.profesor = res.datos;
          }
        }
      });
		},
    obtenerRegistrosCalificaciones: function(){
      //Obtiene los registros de las calificaciones de la lección que se quiere calificar
      var self = this;
      var pathname = window.location.pathname;
      var idLeccion = pathname.split('/')[5];
      var urlApi = '/api/calificaciones/' + idLeccion;
      $.get({
        url: urlApi,
        success: function(res){
          self.registros = res.datos;
          console.log('Registros obtenidos')
          console.log(self.registros)
          self.obtenerTodosGrupos();
        }
      })
    },
    obtenerTodosGrupos: function(){
      var self = this;
      $.get({
        url: '/api/grupos',
        success: function(res){
          self.grupos = res.datos;
          self.buscarNombreGrupos();
        }
      })
    },
    buscarNombreGrupos: function(){
      //Esta función añade el nombre de cada grupo del array de registros obtenidos.
      //Busca el nombre del grupo dentro del array grupos.
      var self = this;
      $.each(self.registros, function(index, registro){
        $.each(self.grupos, function(j, grupo){
          if(registro.grupo==grupo._id){
            registro.nombreGrupo = grupo.nombre;
            return false
          }
        });
      });
      //Los ordeno por nombre
      self.registros.sort(function(r1, r2){
        return ((r1.nombreGrupo < r2.nombreGrupo) ? -1 : ((r1.nombreGrupo > r2.nombreGrupo) ? 1 : 0));
      })
      //Los muestro en este nuevo array
      self.registrosAMostrar = self.registros;
      console.log(self.registrosAMostrar)

      //Muestro solo los grupos que no han sido calificados
      /*self.registrosAMostrar = $.grep(self.registrosAMostrar, function(registro){
        return registro.calificada==false&&registro.participantes.length!=0;
      })*/
    },
    buscarNombreEstudiantes: function(){
      //Busco el nombre de los estudiantes del grupo seleccionado para calificar para mostrarlos en la pestaña 'Seleccionar estudiantes'
      var self = this;
      self.estudiantes = [];  //Tengo que vaciarlo para que si el usuario selecciona un grupo y luego otro entonces no se acumulen los estudiantes en este array
      $.each(self.grupoSeleccionado.participantes, function(index, estudiante){
        //Por cada estudiante del grupo seleccionado, hago una llamada a la api para conseguir su nombre.
        var urlApi = '/api/estudiantes/' + estudiante;
        $.get({
          url: urlApi,
          success: function(res){
            self.estudiantes.push(res.datos);
          }
        });
      });
    }
	}
      
});

function grupoSeleccionado(_element){
  var self = app.$data
  $.each(self.registrosAMostrar, function(index, registro){
    if(_element.id==registro.grupo){
      self.grupoSeleccionado = registro;
      app.buscarNombreEstudiantes();
      return false
    }
  })
}

function estudianteSeleccionado(_element){
  var self = app.$data
  self.estudianteEscogidoId = _element.id;
}

function calificarRedireccion(){
	if (app.estudianteEscogidoId){
  	var leccionId = window.location.href.toString().split('/')[7];
  	window.location.href = '/profesores/leccion/calificar/'+leccionId+'/'+app.estudianteEscogidoId+'/'+app.grupoSeleccionado.grupo;
	}
}

function regresar(){
	window.location.href = '/profesores/grupos/'
}

function enviarFeedback(){
	window.location.href = '/profesores/grupos/'
}
