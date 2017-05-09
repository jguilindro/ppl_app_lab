var app = new Vue({
	mounted: function(){
		$('.button-collapse').sideNav();
		$(".dropdown-button").dropdown({ hover: false });
		$('.scrollspy').scrollSpy();
		$('#modalEliminarLeccion').modal();
		//$('#modalNuevoCapitulo').modal();
		this.obtenerLogeado();
		this.misParalelos();
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
		nombreLecciones: []

	},
	methods: {
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
		getLecciones: function(){
			var self = this;
			this.$http.get('/api/lecciones').then(response => {
				//success callback				
				var leccionesObtenidas = response.body.datos;
				self.filtrarLecciones(leccionesObtenidas)
			}, response => {
				//error callback
				console.log(response)
			})

		},
		obtenerLogeado: function() {
      var self = this;
      this.$http.get('/api/session/usuario_conectado').
        then(res => {
          if (res.body.estado) {
            self.profesor = res.body.datos;
          }
        });
    },
    filtrarLecciones: function(arrayLecciones){
    	var self = this;
    	$.each(arrayLecciones, function(index, leccion){
    		if(leccion.creador==self.profesor._id){
    			self.lecciones.push(leccion);
    		}
    	})
    	self.lecciones = self.lecciones.sort(self.sortPorUpdate);
    },
    sortPorUpdate: function(a, b){
    	return (a.updatedAt < b.updatedAt ) ? 1: -1;
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
    	//Completar esto luego de que Julio termine su parte
		window.location.href = '/profesores/leccion/calificar/grupos/'+id;
    },
    tomandoLeccion(paralelo, id_leccion) {
      window.location.href = `/profesores/leccion-panel/${id_leccion}/paralelo/${paralelo}`
    },
    misParalelos() {
      this.$http.get(`/api/paralelos/profesores/mis_paralelos`).then(response => {
        if (response.body.estado) {
          this.paralelos = response.body.datos
        }
      }, response => {
        console.error('error')
      });
    },moment: function (date) {
      return moment(date);
    },
    date: function (date) {
      return moment(date).format('MMMM Do YYYY');
    },
		

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
}