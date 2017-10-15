var app = new Vue({
  created: function(){
    var pathname = window.location.pathname;
    this.idLeccion = pathname.split('/')[5];
    this.profesorLogeado();
    this.obtenerRegistrosCalificaciones(this);
  },
  mounted: function(){
    this.inicializarMaterialize();
  },
  el: '#app',
  data: {
      idLeccion: '',
      profesor: {},
      registros: [],    //Registros de calificaciones -> leccion, grupo, nombrGrupo, paralelo, nombreParalelo, participantes, calificada, calificacion
      grupoSeleccionado: {},
      estudianteSeleccionado: {}
	},
  methods: {
    inicializarMaterialize: function(){
      $('.button-collapse').sideNav();
      $(".dropdown-button").dropdown({ hover: false });
      $('select').material_select();
    },
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
    //Obtiene los registros de las calificaciones de la lección que se quiere calificar
    obtenerRegistrosCalificaciones: function(self){
      var urlApi = '/api/calificaciones/' + self.idLeccion;
      $.get({
        url: urlApi,
        success: function(res){
          app.registros = res.datos;
          console.log('Registros obtenidos', self.registros)
          //Los ordeno por nombre
          self.registros.sort(function(r1, r2){
            var nombreR1 = r1.nombreGrupo;
            var numeroR1 = parseInt(nombreR1.split(" ")[1]);
            var nombreR2 = r2.nombreGrupo;
            var numeroR2 = parseInt(nombreR2.split(" ")[1]);
            return ((numeroR1 < numeroR2) ? -1 : ((numeroR1 > numeroR2) ? 1 : 0));
          });
          //Muestro solo los grupos que no han sido calificados
          self.registros = $.grep(self.registros, function(registro){
            return ( registro.calificada == false && registro.participantes.length != 0 );
          });
        }
      })
    },
    seleccionGrupo: function(registro){
      app.grupoSeleccionado = registro;
      console.log(app.grupoSeleccionado);
    },
    seleccionEstudiante: function(estudiante){
      app.estudianteSeleccionado = estudiante;
      console.log(app.estudianteSeleccionado);
    },
    calificarRedireccion: function(){
      if ( app.estudianteSeleccionado ){
        window.location.href = '/profesores/leccion/calificar/'+app.idLeccion+'/'+app.estudianteSeleccionado._id+'/'+app.grupoSeleccionado._id;
      }else{
        Materialize.toast('Seleccione un estudiante primero!', 3000, 'rounded red');
      }
    }
	}
});

function regresar(){
	window.location.href = '/profesores/grupos/'
}

function enviarFeedback(){
	window.location.href = '/profesores/grupos/'
}
