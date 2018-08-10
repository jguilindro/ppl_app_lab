var app = new Vue({
	created: function(){
		this.anioActual = new Date().getFullYear();
		this.obtenerUsuario();
	},
	mounted: function(){
		this.inicializarMaterialize();		
	},
	el: '#lecciones',
	data: {
		leccionesAMostrar : [],	//Array solo de las lecciones a mostrar en la vista
		lecciones: [],			//Array de lecciones de los paralelos del profesor conectado
		profesor : {},			//JSON con la información del profesor conectado
		paralelos: [],			//Array de ids de paralelos de los cuales el usuario es profesor o peer 1
		todasLecciones: [],
		leccionesId: [],
	 	gruposParaleloId: [],
		paralelosDatos: [],
	 	nombreParalelo: [],
		nombreMateria: [],
		nombreLecciones: [],
		profesorConectado: '',
		anioActual: '',
		paraleloId: '',
		calificaciones: [],
		sortActual:'nombre',
  		dirSortActual:'asc'
	},
	methods: {
		sort:function(s) {
		    //if s == current sort, reverse
		    if(s === this.sortActual) {
		      this.dirSortActual = this.dirSortActual==='asc'?'desc':'asc';
		    }
		    this.sortActual = s;
		  },
		inicializarMaterialize: function(){
			$('.button-collapse').sideNav();
			$(".dropdown-button").dropdown({ hover: false });
			$('.scrollspy').scrollSpy();
			$('#modalEliminarLeccion').modal();
			$('.modal').modal();
			$('.tooltipped').tooltip({delay: 50});
			$('select').material_select();

			$('.filtro').change( () => {
				let tipo 		 = $('#filtroTipo').val();
				let materia  = $('#filtroMateria').val();
				let paralelo = $('#filtroParalelo').val();
				app.leccionesAMostrar = filtrarLecciones(app.lecciones, tipo, materia, paralelo);
			});
		},
		/*
			Modificada: 26-05-2017 @edisonmora95
		*/
		obtenerUsuario: function() {
      $.get({
      	url: '/api/session/usuario_conectado',
      	success: function(res){
      		app.profesor = res.datos;
      		app.obtenerTodosParalelos();
      	}
      });
    },
    obtenerTodosParalelos: function(){
    	$.get({
    		url: '/api/paralelos/',
    		success: function(res){
    			app.paralelos = app.filtrarParalelos(res.datos);
    			app.getLecciones();
    		},
    		error: function(err){
    			console.log(res)
    		}
    	});
    },
    /* Devuelve solo los paralelos de los cuales el usuario es profesor titular o peer 1 */
    filtrarParalelos(arrayParalelos){
    	let misParalelos = [];
    	for (let i = 0; i < arrayParalelos.length; i++) {
    		let paraleloActual = arrayParalelos[i];
    		const esProfesor	 = ( paraleloActual.profesor == app.profesor._id );
    		const esPeer1			 = app.esPeer1(app.profesor, paraleloActual._id);
    		if( esProfesor || esPeer1 ){
    			misParalelos.push(paraleloActual._id);
    		}
    	}
    	return misParalelos;
    },
    esPeer1(peer, idParalelo){
    	for (var i = 0; i < peer.nivelPeer.length; i++) {
    		let actual = peer.nivelPeer[i];
    		if( actual.paralelo == idParalelo && actual.nivel == 1 ){
    			return true;
    		}
    	}
    },
    /*
			Modificada: 19-05-2017 @edisonmora95
  	*/
    getLecciones: function(){
			$.get({
				url: '/api/lecciones/',
				success : function(res){
					app.lecciones 				= app.filtrarLecciones(res.datos);
					app.leccionesAMostrar = app.filtrarLecciones(res.datos);
					app.leccionesAMostrar.sort(app.sortPorUpdate);
					app.lecciones.sort(app.sortPorUpdate);
				},
				error: function(err){
					console.log(err)
				}
			});
		},
		/* Devuelve solo las lecciones de los paralelos del usuario */
		filtrarLecciones: function(arrayLecciones){
			let misLecciones = [];
			for (let i = 0; i < arrayLecciones.length; i++) {
				let leccionActual 	 = arrayLecciones[i];
				const esDeMiParalelo = isInArray( leccionActual.paralelo, app.paralelos );
				if( esDeMiParalelo ){
					misLecciones.push(leccionActual);
				}
			}
			return misLecciones;
    },
		eliminarLeccion: function(id){
			let self = this;
			let url = '/api/lecciones/' + id;
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
    moment: function (date) {
      return moment(date);
    },
    date: function (date) {
      let es = moment().locale('es');
      if (date == undefined || date == '') {
        return '----'
      }
      return moment(date).format('DD MMMM HH:mm');
    },
    dateInicio: function (date) {
      var es = moment().locale('es');
      if (date == undefined || date == '') {
        return '----'
      }
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
		// Para probar el CSV del lado del servidor.
		test : function(){
			var self = this;
			this.$http.post( "/api/calificaciones/csv").then(function(response){
		    var a = document.createElement("a");
		    document.body.appendChild(a);
		    a.style = "display: none";
		    if (response.body.estado) {
		      var byteCharacters = atob(response.body.datos);
		      var byteNumbers = new Array(byteCharacters.length);
		      for (var i = 0; i < byteCharacters.length; i++) {
		          byteNumbers[i] = byteCharacters.charCodeAt(i);
		      }
		      var byteArray = new Uint8Array(byteNumbers);
		      var blob = new Blob([byteArray], {type: 'application/octet-stream'});
		      url = window.URL.createObjectURL(blob);
		      a.href = url;
		      a.download = app.profesor.correo.split('@')[0] + '.xlsx';
		      a.click();
		      window.URL.revokeObjectURL(url);
		    }
			});
		},
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

	},
	computed:{
  sortedLecciones:function() {
    return this.leccionesAMostrar.sort((a,b) => {
      let modifier = 1;
      if(this.dirSortActual === 'desc') modifier = -1;
      if(a[this.sortActual] < b[this.sortActual]) return -1 * modifier;
      if(a[this.sortActual] > b[this.sortActual]) return 1 * modifier;
      return 0;
    });
  }
}

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

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

/* No se la razón por la que esto funciona... */
function filtrarLecciones(lecciones, tipo, materia, paralelo){
	let arrayLecciones = [];
	arrayLecciones = filtrarPorTipo(lecciones, tipo);
	arrayLecciones = filtrarPorMateria(arrayLecciones, materia);
	arrayLecciones = filtrarPorParalelo(arrayLecciones, paralelo);
	return arrayLecciones;
}

function filtrarPorTipo(lecciones, tipo){
	if( tipo === "" || tipo === null){
		return lecciones;
	}
	return 	$.grep(lecciones, (value, index) => { return value.tipo === tipo;	});
}

function filtrarPorMateria(lecciones, materia){
	if( materia === "" || materia === null ){
		return lecciones;
	}
	return 	$.grep(lecciones, (value, index) => { return value.codigoMateria === materia;	});
}

function filtrarPorParalelo(lecciones, paralelo){
	if( paralelo === "" || paralelo === null ){
		return lecciones;
	}
	return 	$.grep(lecciones, (value, index) => { return value.nombreParalelo === paralelo;	});	
}