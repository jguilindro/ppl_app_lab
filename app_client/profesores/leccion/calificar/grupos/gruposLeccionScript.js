var app = new Vue({
  mounted: function(){
    $('.button-collapse').sideNav();
    $(".dropdown-button").dropdown({ hover: false });
    $('select').material_select();
    this.profesorLogeado();
    this.mostrarData();
  },
  el: '#app',
  data: {
      grupos: [
      ],
      estudiantes: [
      ],
      estudiantesSinGrupo: [
      ],
      profesor: {
      },
      paralelos: [
      ],
      gruposLeccion: [],
      paralelo_seleccionado: '',
      contador_global: 0,
      buscarEstudiante: '',
      mostrarDatosEstudiante: {},
      buscarEstudianteEnGrupo: '',
      buscarGrupo: '',
      grupoEscogido: {},
      estudianteEscogidoId: ''
	},
  methods: {
	
//Obtiene la respuesta del estudiante a dada pregunta
	profesorLogeado: function() {
      this.$http.get(`/api/session/usuario_conectado`).then(response => {
        this.profesor = response.body.datos
        this.obtenerTodosParalelosProfesor()
      }, response => {
        console.error('error')
      });
		},

    obtenerTodosParalelosProfesor: function() {
      this.$http.get(`/api/paralelos/profesores/mis_paralelos`).then(response => {
        this.paralelos = response.body.datos
        if (this.contador_global == 0) {
          this.paralelo_seleccionado = app.paralelos[0]._id
        }
        this.contador_global = this.contador_global + 1
        this.obtenerTodosGrupos()
      }, response => {
        console.error('error')
      });
		},

		obtenerTodosGrupos: function () {
      // limpiar todo
      var self = this;
      this.grupos = []
      this.estudiantes = []
      this.estudiantesSinGrupo = []
      var promesas = []
      var leccionId = window.location.href.toString().split('/')[7];
      this.paralelos.forEach(paralelo => {
        if (this.paralelo_seleccionado === paralelo._id) {
          paralelo.grupos.forEach(grupo => {
            promesas.push(new Promise((resolve, reject) => {
              this.$http.get(`/api/grupos/${grupo._id}`).then(response => {
                if (response.body.estado) return resolve(response.body.datos)
                return reject(response.body.datos)
              });
            }))
          })
        }
      })

      Promise.all(promesas).then(result => {
        result.forEach(grupo => {
          self.$http.get('/api/lecciones/grupoLeccion/'+leccionId).then(res =>{

            console.log("grupoLecciones");
            console.log(res.body.datos);
            /*$.each(res.body.datos, function(index, grupoLeccion){
              self.gruposLeccion.push(grupoLeccion);
              
            });*/
        
          });
          this.grupos.push(grupo)
        })
        this.obtenerTodosEstudiantes()
      }, fail => {
        console.log(fail)
      })
    },

    obtenerTodosEstudiantes: function() {
      if (this.grupos.length == 0) {
        this.nuevoGrupo()
      }
      let cont = 0
      this.paralelos.forEach(paralelo => {
        if (paralelo._id == this.paralelo_seleccionado) {
          this.estudiantes = this.paralelos[cont].estudiantes
        }
        cont = cont + 1
      })
      this.estudiantesNoEnGrupo()
    },

    estudiantesNoEnGrupo: function() {
      let temp = []
      this.grupos.forEach( grupo => {
        grupo.estudiantes.forEach( estudiante => {
          temp.push(estudiante._id);
        })
      })
      this.estudiantes.forEach((es) => {
        if (!temp.includes(es._id)) {
          this.estudiantesSinGrupo.push(es)
        }
      })
    },

    mostrarData: function(){
    	console.log("Paralelos: ");
    	console.log(this.paralelos);
    	console.log("Grupos: ");
    	console.log(this.grupos);
    	console.log("Estudiantes: ");
    	console.log(this.estudiantes);
    	console.log("Profesor: ");
    	console.log(this.profesor);
    },

    



	
	}
      
});

function grupoSeleccionado(_element){
		  app.grupos.forEach( grupo=> {
		  	if (grupo._id==_element.id){
		  		app.grupoEscogido= grupo;
		  	}
		  });
    }

function estudianteSeleccionado(_element){
		  app.grupoEscogido.estudiantes.forEach( estudiante=> {
		  	if (estudiante._id==_element.id){
		  		app.estudianteEscogidoId= _element.id;
		  	}
		  });
    }

function calificarRedireccion(){
	if (app.estudianteEscogidoId){
	var leccionId = window.location.href.toString().split('/')[7];
	window.location.href = '/profesores/leccion/calificar/'+leccionId+'/'+app.estudianteEscogidoId+'/'+app.grupoEscogido._id;
	}
}

function regresar(){
	window.location.href = '/profesores/grupos/'
}

function enviarFeedback(){
	window.location.href = '/profesores/grupos/'
}
// document.getElementById('datePicker').valueAsDate = new Date();
// document.getElementById('datePicker').setAttribute('min', "2017-04-09")
