var appRecalificar = new Vue({
	el: '#appRecalificar',
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
    });
	},
	data: {
		profesor: {},
		registros: [],
		grupos: [],
		grupoSeleccionado: {},
    estudiantes: [],
    estudianteEscogido: {}
	},
	methods:{
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
          self.obtenerTodosGrupos();
        }
      })
    },
    obtenerTodosGrupos: function(){
    	//Obtengo todos los grupos para comparar con los de los registros y obtener sus nombres
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
      });
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
    },
    //Eventos
    seleccionarGrupo: function(registro){
    	this.grupoSeleccionado = registro;
    	this.buscarNombreEstudiantes();
    },
    seleccionarEstudiante: function(estudiante){
    	this.estudianteEscogido = estudiante;
    },
    recalificarRedireccion: function(){
      var self = this;
			if (self.estudianteEscogido){
		  	var leccionId = window.location.href.toString().split('/')[7];
		  	window.location.href = '/profesores/leccion/recalificar/'+leccionId+'/'+ self.estudianteEscogido._id + '/' + self.grupoSeleccionado.grupo;
			}
		}
	}
});