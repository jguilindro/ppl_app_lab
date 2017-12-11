let app = new Vue({
	el: '#appEstadisticas',
	created(){
		this.idLeccion = window.location.href.split('/')[5];
		this.obtenerEstadisticas(this);
		this.obtenerEstadisticasDePreguntas(this);
	},
	mounted(){
	},
	data: {
		idLeccion 		 : '',
		grupos 	 			 : [],
		calificaciones : [],
		leccion 			 : {},
		estadisticas 	 : {
			min : {},
			max : {},
			prom: 0.00
		},
		preguntas 		 : [],
	},
	methods: {
		obtenerEstadisticas(self){
			$.get({
				url : '/api/lecciones/' + this.idLeccion + '/estadisticas',
				type: 'GET',
				success: function(res){
					self.grupos 					 = res.datos.grupos;
					self.calificaciones 	 = res.datos.calificaciones;
					self.leccion 					 = res.datos.leccion;
					self.estadisticas.min  = res.datos.min;
					self.estadisticas.max  = res.datos.max;
					self.estadisticas.prom = res.datos.prom;
					let arrayColores 			 = self.formarColores(self.calificaciones);
					self.createChart('myChart', self.grupos, self.calificaciones, "Calificación general", arrayColores, 100, 10);
				},
				error : function(err){
					console.log(err)
				} 
			});
		},
		obtenerEstadisticasDePreguntas(self){
			$.get({
				url : '/api/lecciones/' + this.idLeccion + '/estadisticas/preguntas',
				type: 'GET',
				success: function(res){
					let datos = {
						labels   : res.datos.labels,
						datasets : [{
							label : "0",
							data 	: res.datos.cal0,
							backgroundColor : "rgba(198, 40, 40, 0.3)"
						},{
							label : "1",
							data  : res.datos.cal1,
							backgroundColor : "rgba(255, 143, 0, 0.3)"
						},{
							label : "2",
							data  : res.datos.cal2,
							backgroundColor : "rgba(255, 235, 59, 0.3)"
						}]
					};
					self.stackedChart(datos, res.datos.nGrupos, 1, "Puntaje por pregunta")
				},
				error : function(err){
					console.log(err)
				} 
			});
		},
		formarColores(calificaciones){
			let arrayColores = [];
			for (var i = 0; i < calificaciones.length; i++) {
				let actual = calificaciones[i];
				if( actual > 80 ){
					arrayColores.push('rgba(255, 235, 59, 0.3)');
				}else if( actual > 60 ){
					arrayColores.push('rgba(255, 143, 0, 0.3)');
				}else{
					arrayColores.push('rgba(198, 40, 40, 0.3)');
				}
			}
			return arrayColores;
		},
		createChart(id, labels, data, label, colors, max, stepSize){
			let ctx = document.getElementById(id).getContext('2d');
			let chart = new Chart(ctx, {
				type : 'bar',
				data : {
					labels 	 : labels,
					datasets : [{
						label 				 : label,
            backgroundColor: colors,
            data 					 : data,
					}],
				},
				options : {
					responsive : true,
					scales 		 : {
						yAxes : [{
							ticks : {
								beginAtZero : true,
								max 				: max,
								stepSize    : stepSize
							}
						}]
					}
				}
			});
			$('.card').matchHeight();
		},
		stackedChart(data, max, stepSize, title){
			let ctx = document.getElementById('stackedChart').getContext('2d');
			let stackedBar = new Chart(ctx, {
				type 		: 'bar',
				data 		: data,
				options : {
					elements : {
						rectangle : {
							borderWidth 	: 1,
							borderSkipped : "bottom"
						}
					},
					responsive : true,
					title : {
						display : true,
						text		: title
					},
					scales 		 : {
						yAxes : [{
							ticks : {
								beginAtZero : true,
								max 				: max,
								stepSize    : stepSize
							}
						}]
					}
				}
			})
		}
	}
});
