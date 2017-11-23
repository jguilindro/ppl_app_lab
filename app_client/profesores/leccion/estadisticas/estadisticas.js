let app = new Vue({
	el: '#appEstadisticas',
	created(){
		this.idLeccion = window.location.href.split('/')[5];
		console.log(this.idLeccion);
		this.obtenerEstadisticas(this);
	},
	mounted(){
		console.log('Hola')
		this.createChart();
	},
	data: {
		idLeccion 		 : '',
		grupos 	 			 : [],
		calificaciones : [],
		leccion 			 : {}
	},
	methods: {
		obtenerEstadisticas(self){
			$.get({
				url : '/api/lecciones/' + this.idLeccion + '/estadisticas',
				type: 'GET',
				success: function(res){
					console.log(res)
					self.grupos 				= res.datos.grupos;
					self.calificaciones = res.datos.calificaciones;
					self.leccion 				= res.datos.leccion;
					let arrayColores 		= self.formarColores(self.calificaciones);
					self.createChart(self.grupos, self.calificaciones, self.leccion.nombre, arrayColores);
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
					arrayColores.push('Green');
				}else if( actual > 60 ){
					arrayColores.push('Yellow');
				}else{
					arrayColores.push('Red');
				}
			}
			return arrayColores;
		},
		createChart(labels, data, label, colors){
			let ctx = document.getElementById('myChart').getContext('2d');
			let chart = new Chart(ctx, {
				type : 'bar',
				data : {
					labels 	 : labels,
					datasets : [{
						label 				 : label,
            backgroundColor: colors,
            borderColor 	 : 'rgb(255, 99, 132)',
            data 					 : data,
					}]
				},
				options : {
					responsive : true
				}
			});
		}
	}
});

