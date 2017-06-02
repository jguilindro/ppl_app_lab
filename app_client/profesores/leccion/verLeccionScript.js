var app = new Vue({
	created: function(){
		self.anioActual = new Date().getFullYear();
		this.obtenerLogeado();
	},
	mounted: function(){
		//Inicializadores de Materialize
		$('.button-collapse').sideNav();
		$(".dropdown-button").dropdown({ hover: false });
		$('.scrollspy').scrollSpy();
		$('#modalEliminarLeccion').modal();
		$('.modal').modal();

		//Funciones de flujo de la aplicación
		this.getLecciones();

	},
	el: '#preguntas',
	data: {
		lecciones: [],
		profesor: {},
		paralelos: [],
		todasLecciones: [],
		leccionesId: [],
	 	gruposParaleloId: [],
		 paralelosDatos: [],
	 	nombreParalelo: [],
		 nombreMateria: [],
		nombreLecciones: [],
		profesorConectado: '',
		anioActual: '',
		//
		paraleloId: '',
		calificaciones: []
	},
	methods: {
		obtenerLogeado: function() {
			/*
				Modificada: 26-05-2017 @edisonmora95
			*/
			var self = this;
      $.get({
      	url: '/api/session/usuario_conectado',
      	success: function(res){
      		self.profesor = res.datos;
      		self.misParalelos();
      	}
      });
    },
    misParalelos: function() {
    	var self = this;
    	$.get({
    		url: '/api/paralelos/profesores/mis_paralelos',
    		success: function(res){
    			self.paralelos = res.datos;
    		}
    	});

    },
    getLecciones: function(){
    	/*
				Modificada: 19-05-2017 @edisonmora95
    	*/
			var self = this;
			self.$http.get('/api/lecciones').then(response => {
				var leccionesObtenidas = response.body.datos;
				if(self.profesor.tipo === 'titular'){
					self.filtrarLecciones(leccionesObtenidas);
				}else if(self.profesor.tipo === 'peer'){
					self.filtrarLeccionesPeer(leccionesObtenidas);
				}

			}, response => {
				//error callback
				console.log(response)
			})

		},
		filtrarLeccionesPeer: function(arrayLecciones){
			/*
				@Autor: 19-05-2017 @edisonmora95
				@Descripción:	Cuando un peer está loggeado, las lecciones que se deben mostrar son todas las de sus paralelos.
			*/
			var self = this;
      var permiso = self.profesor.nivelPeer.some(nivel => {
        return nivel.nivel === 1
      })
      if (permiso) {
        self.profesor.nivelPeer.forEach(nivel => {
          if (nivel.nivel === 1) {
            self.lecciones = arrayLecciones.filter(leccion => {
              if (leccion.paralelo == nivel.paralelo && leccion.estado != 'pendiente') {
                $.get({
                  url: `/api/lecciones/${leccion._id}/calificada`,
                  success: function(res) {
                    if (res.datos) {
                      leccion.estado = 'calificada'
                    }
                  }
                })
                return leccion
              }
            })
          }
        })
        self.lecciones = self.lecciones.sort(self.sortPorUpdate);
        self.lecciones = self.lecciones.sort(self.sortPorEstado);
      }
		},
		nuevaPregunta: function(){
			window.location.href = '/profesores/leccion/crear'

		},
		eliminarLeccion: function(id){
			var self = this;
			var url = '/api/lecciones/' + id;
			this.$http.delete(url).then(response => {
				self.lecciones= [];
				this.getLecciones();
			}, response => {
				//error callback
				console.log(response)
			});
		},

		crearModalEliminarLeccion: function(id, nombre){
			var self = this;
			var leccionId = id;
			//Primero hay que eliminar el modal-content. Sino cada vez que abran el modal se añadirá un p más
			$('#modalEliminarLeccionContent').empty();
			//Ahora si añadir las cosas
			var modalContentH4 = $('<h4/>').addClass('center-align').text('Eliminar');
			var modalContentP = $('<p/>').text('¿Seguro que desea eliminar la leccion: ' + nombre + ' con id: ' + id + '?')
			modalContentP.addClass('center-align')
			$('#modalEliminarLeccionContent').append(modalContentH4, modalContentP);
			//Lo mismo con el footer
			$('#modalEliminarLeccionFooter').empty();
			var btnEliminar = $('<a/>').attr({
				'href': '#!',
				'class': 'modal-action modal-close waves-effect waves-green btn-flat'
			});
			btnEliminar.text('Eliminar');
			btnEliminar.click(function(){
				self.eliminarLeccion(leccionId);

			})
			var btnCancelar = $('<a/>').attr({
				'href': '#!',
				'class': 'modal-action modal-close waves-effect waves-green btn-flat'
			});
			btnCancelar.text('Cancelar');
			$('#modalEliminarLeccionFooter').append(btnEliminar, btnCancelar)
			$('#modalEliminarLeccion').modal('open');
		},


    filtrarLecciones: function(arrayLecciones){
    	var self = this;
    	$.each(arrayLecciones, function(index, leccion){
    		if(leccion.creador==self.profesor._id){
          $.get({
            url: `/api/lecciones/${leccion._id}/calificada`,
            success: function(res) {
              if (res.datos) {
                leccion.estado = 'calificada'
              }
              self.lecciones.push(leccion);
            }
          })
    		}
    	})
    	// self.lecciones = self.lecciones.sort(self.sortPorUpdate);
      self.lecciones = self.lecciones.sort(self.sortPorEstado);
      // self.lecciones = self.lecciones.sort(self.sortPorEstado);
      console.log(self.lecciones);
    },
    sortPorUpdate: function(a, b){
    	return (a.updatedAt < b.updatedAt) ? 1: -1;
    },
    sortPorEstado: function(a ,b){
      if (a.estado > b.estado) {
        return 1;
      }
      if (a.estado < b.estado) {
        return -1;
      }
      return 0;
    },
    tomarLeccion: function(paralelo, id){
    	var self = this;
    	var url1 = '/api/lecciones/tomar/' + id;
    	//Actualizo el estado de la lección a 'tomando'
    	self.$http.post(url1).then(response => {
    		//Success callback
    		//Actualizo el estado del paralelo a dando leccion
    		if(response.body.estado){
    			var url2 = '/api/paralelos/' + paralelo + '/leccion/' + id;
    			self.$http.post(url2).then(response => {
    				//Success callback
    				if(response.body.estado){
    					var url3 = '/profesores/leccion-panel/' + id + '/paralelo/' + paralelo;
    					window.location.href = url3;
    				}
    			}, response => {
    				//Error callback
    				console.log('Error')
    				console.log(response)
    			})
    		}
    	}, response => {
    		//Error callback
    		console.log('Error')
    		console.log(response)
    	})
    },
    calificarLeccion: function(id){
			window.location.href = '/profesores/leccion/calificar/grupos/'+id;
    },
    recalificarLeccion: function(id){
			window.location.href = '/profesores/leccion/recalificar/grupos/'+ id;
    },
    tomandoLeccion(paralelo, id_leccion) {
      window.location.href = `/profesores/leccion-panel/${id_leccion}/paralelo/${paralelo}`
    },
    moment: function (date) {
      return moment(date);
    },
    date: function (date) {
      var es = moment().locale('es');
      // es.localeData().months(date)
      // return moment(date).format('DD/MM hh:mm:ss');
      if (date == undefined || date == '') {
        return '----'
      }
      // var hora = moment(date).format('hh')
      // if ( parseInt(hora) < 5) {
      //   return moment(date).add(8,'h').tz("America/Guayaquil").format('DD MMMM hh:mm');
      // }
      return moment(date).format('DD MMMM HH:mm');
    },
    dateInicio: function (date) {
      var es = moment().locale('es');
      if (date == undefined || date == '') {
        return '----'
      }
      // es.localeData().months(date)
      // return moment(date).tz("America/Guayaquil").format('DD/MM');
      return moment(date).format('DD MMMM');
    },
    dateTerminada: function (leccion, tiempoEstimado) {
      var es = moment().locale('es');
      if (leccion.fechaInicioTomada == undefined || leccion.fechaInicioTomada == '') {
        return '----'
      }
      if (leccion.fechaTerminada) {
        return moment(leccion.fechaTerminada).format('HH:mm');
      }
      return moment(leccion.fechaInicioTomada).add(tiempoEstimado,'m').format('HH:mm');
    },

		//Version inicial de generar Reporte está por backup por si acaso
/*
    generarReporte: function(){
	var reporteData= [];

	var self = this;
	var promises= [];
	var promesas= [];

				promises.push(this.$http.get("/api/lecciones").then(response => {
		        self.todasLecciones= response.body.datos;
		        $.each(self.todasLecciones, function(index, value){
		      	self.leccionesId.push(value._id);
		      	self.nombreLecciones.push(value.nombre);
		      });



 			}));


             promises.push(this.$http.get( "/api/paralelos").then(res => {
		 	 $.each(res.body.datos, function(index, value){
		 	 	self.paralelosDatos.push(value._id);
		 	 	self.gruposParaleloId.push(value.grupos);
		 	 	self.nombreParalelo.push(value.nombre);
		 	 	self.nombreMateria.push(value.nombreMateria);
		 	 });
			}));

		Promise.all(promises).then(function(){
			$.each(self.leccionesId, function(index, leccion){
		$.each(self.paralelosDatos,function(indice, paralelo){
			if(self.gruposParaleloId[indice].length!=0){
				$.each(self.gruposParaleloId[indice], function(i,grupo){
					promesas.push(self.$http.get("/api/calificaciones/"+leccion+'/'+grupo).then(data => {
						if(data.body.datos.length!=0 && data.body.datos[0].calificada == true){
							var calificaciones= {
								leccion: '',
								grupo: '',
								calificacion: '',
								paralelo: '',
								materia: ''
							};
				 	calificaciones.leccion= self.nombreLecciones[index];
				 	calificaciones.grupo= grupo;
				 	calificaciones.calificacion= data.body.datos[0].calificacion;
				 	calificaciones.paralelo= self.nombreParalelo[indice];
				 	calificaciones.materia= self.nombreMateria[indice];
				 	console.log(calificaciones);
				 	reporteData.push(calificaciones);

					}
				}));
				});

			}
		});
	});

		Promise.all(promesas).then(function(){
			$.each(reporteData, function(i, data){
				var nombre;
				var datos= data;
				var indice= i;
				$.ajax({
					async: false,
					url: "/api/grupos/"+datos.grupo,
					success: function( data ) {
					nombre=data.datos.nombre;
				}
				});
				reporteData[indice].grupo= nombre;
			});
			JSONToCSVConvertor(JSON.stringify(reporteData), "Reporte de Calificaciones Fisica PPL", true);
			});

		});

}*/

// Para probar el CSV del lado del servidor.
test : function(){

	var self = this;

	this.$http.post( "/api/calificaciones/csv").then(function(response){
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    console.log(typeof(response.body));
    url = window.URL.createObjectURL(response.body);
    console.log(url);
    a.href = url;
    a.download = app.profesor.correo.split('@')[0] + '.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
    // var link = document.createElement('a');
  	// link.setAttribute('href',response.url);
  	// link.setAttribute('download',app.profesor.correo.split('@')[0] + '.xlsx');
  	// var event = document.createEvent('MouseEvents');
  	// event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
  	// link.dispatchEvent(event);
	});

},

/* Segunda versión CSV backup
>>>>>>> b0fb910b0bcf5ca7accd36e1c9d6df21c5bde80d
generarReporte: function(){
	var reporteData= [];
	var self = this;
	var promises= [];
	var promesas= [];

				promises.push(this.$http.get("/api/session/usuario_conectado").then(response => {
		        self.profesorConectado= response.body.datos._id;
					//console.log("Profesor conectado:");
					//console.log(self.profesorConectado);
				 }));


				promises.push(this.$http.get("/api/lecciones").then(response => {
		        self.todasLecciones= response.body.datos;
					//console.log("todas las lecciones:");
					//console.log(self.todasLecciones);
		        $.each(self.todasLecciones, function(index, value){
		        	if(value.creador == self.profesorConectado){
		      	self.leccionesId.push(value._id);
		      	self.nombreLecciones.push(value.nombre);
		      }
		      });
 			}));


             promises.push(this.$http.get( "/api/paralelos").then(res => {
		 	 $.each(res.body.datos, function(index, value){
		 	 	self.paralelosDatos.push(value._id);
		 	 	self.gruposParaleloId.push(value.grupos);
		 	 	self.nombreParalelo.push(value.nombre);
		 	 	self.nombreMateria.push(value.nombreMateria);
		 	 });
			}));

		Promise.all(promises).then(function(){
			$.each(self.leccionesId, function(index, leccion){
		$.each(self.paralelosDatos,function(indice, paralelo){
			if(self.gruposParaleloId[indice].length!=0){
				$.each(self.gruposParaleloId[indice], function(i,grupo){
					promesas.push(self.$http.get("/api/calificaciones/"+leccion+'/'+grupo).then(data => {
						self.$http.get('/api/grupos/'+grupo).then(function (response) {
								console.log("Hmmm::"+response.body.datos);
							}
						);
						//console.log(data.body.datos[0]);
						//console.log(data.body.datos[0].participantes);
						if(data.body.datos.length!=0 && data.body.datos[0].calificada == true){
							var calificaciones= {
								leccion: '',
								grupo: '',
								calificacion: '',
								paralelo: '',
								materia: ''
							};
				 	calificaciones.leccion= self.nombreLecciones[index];
				 	calificaciones.grupo= grupo;
				 	calificaciones.calificacion= data.body.datos[0].calificacion;
				 	calificaciones.paralelo= self.nombreParalelo[indice];
				 	calificaciones.materia= self.nombreMateria[indice];
				 	//console.log(calificaciones);
				 	reporteData.push(calificaciones);

					}
				}));
				});

			}
		});
	});

		Promise.all(promesas).then(function(){
			$.each(reporteData, function(i, data){
				var nombre;
				var datos= data;
				var indice= i;
				$.ajax({
					async: false,
					url: "/api/grupos/"+datos.grupo,
					success: function( data ) {
					nombre=data.datos.nombre;
				}
				});
				reporteData[indice].grupo= nombre;
			});
			JSONToCSVConvertor(JSON.stringify(reporteData), "Reporte de Calificaciones Fisica PPL", true);
			});

		});

}*/


generarReporte: function(){
	$('#modalGenerarCsv').modal({dismissible: false});
	$('#modalGenerarCsv').modal('open');
	var reporteData= [];
	var self = this;
	var promises= [];
	var promesas= [];

				promises.push(this.$http.get("/api/session/usuario_conectado").then(response => {
		        self.profesorConectado= response.body.datos._id;
				 }));


				promises.push(this.$http.get("/api/lecciones").then(response => {
		        self.todasLecciones= response.body.datos;
		        $.each(self.todasLecciones, function(index, value){
		        	if(value.creador == self.profesorConectado){
		      	self.leccionesId.push(value._id);
		      	self.nombreLecciones.push(value.nombre);
		      }
		      });



 			}));


             promises.push(this.$http.get( "/api/paralelos").then(res => {
		 	 $.each(res.body.datos, function(index, value){
		 	 	self.paralelosDatos.push(value._id);
		 	 	self.gruposParaleloId.push(value.grupos);
		 	 	self.nombreParalelo.push(value.nombre);
		 	 	self.nombreMateria.push(value.nombreMateria);
		 	 });
			}));

		Promise.all(promises).then(function(){
			$.each(self.leccionesId, function(index, leccion){
		$.each(self.paralelosDatos,function(indice, paralelo){
			if(self.gruposParaleloId[indice].length!=0){
				$.each(self.gruposParaleloId[indice], function(i,grupo){
					promesas.push(self.$http.get("/api/grupos/"+grupo).then(data => {
						if(data.body.datos != null){
						$.each(data.body.datos.estudiantes, function(a, estudiante){
							$.each(estudiante.lecciones, function(b, estudianteLeccion){
								if(estudianteLeccion.calificado == true && estudianteLeccion.leccion == leccion){
										var calificaciones= {
											estudiante: '',
											materia: '',
											paralelo: '',
											grupo: '',
											leccion: '',
											calificacion: ''

											};
								 	calificaciones.leccion= self.nombreLecciones[index];
								 	calificaciones.grupo= data.body.datos.nombre;
								 	calificaciones.calificacion= estudianteLeccion.calificacion;
								 	calificaciones.paralelo= self.nombreParalelo[indice];
								 	calificaciones.materia= self.nombreMateria[indice];
								 	calificaciones.estudiante= estudiante.nombres +' '+estudiante.apellidos;
								 	reporteData.push(calificaciones);

								}

							});

						});
				}
				}));
				});

			}
		});
	});

		Promise.all(promesas).then(function(){
			/*each(reporteData, function(i, data){
				var nombre;
				var datos= data;
				var indice= i;
				$.ajax({
					async: false,
					url: "/api/grupos/"+datos.grupo,
					success: function( data ) {
					nombre=data.datos.nombre;
				}
				});
				reporteData[indice].grupo= nombre;
			});*/
			JSONToCSVConvertor(JSON.stringify(reporteData), "Reporte de Calificaciones Fisica PPL", true);
			});

		});

}



	}
});

$('body').on("click", '#btnCapituloNuevo', function(){
	$('#modalNuevoCapitulo').modal('open');
})

document.addEventListener("DOMContentLoaded", function(event) {
  $.get({
    url: "/../navbar/profesores",
    success: function(data) {
      document.getElementById('#navbar').innerHTML = data;
      $(".button-collapse").sideNav();
      $(".dropdown-button").dropdown();
    }
  })
});



//Yo lo hice #khemas :v
function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';
    //Set Report title in first row or line

    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = "";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    $('#modalGenerarCsv').modal('close');
}
