var main = new Vue({
	el: '#main',
	data:{
		selected: {
			nombre: '',
			respuesta: ''
		},
		estudiantes: [
			{
				nombre: 'Xavier Idrovo',
				respuesta: 'Duis ut justo ac nunc interdum ultricies eu ut dui. In volutpat volutpat felis sit amet eleifend. Vivamus vel nunc rutrum, tempor augue maximus, blandit mauris. Ut bibendum metus ut mi luctus blandit. Aenean a lacus purus. Vestibulum at enim at odio semper finibus.'
			},
			{
				nombre: 'Edison Mora',
				respuesta: 'Pellentesque urna metus, viverra non hendrerit ac, placerat at urna. Nullam consectetur, tortor vel dapibus convallis, nunc dui facilisis quam, eget consequat tellus sapien sit amet sem. Proin lobortis tortor eget purus luctus, vitae sodales diam ornare. '
			},
			{
				nombre: 'Joel Rodriguez',
				respuesta: 'Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris malesuada libero odio, ut cursus dolor elementum eu. Nunc id nunc ac erat lacinia cursus id a erat.'
			},
			{
				nombre: 'Julio Guilindro',
				respuesta: 'Duis ut justo ac nunc interdum ultricies eu ut dui. In volutpat volutpat felis sit amet eleifend. Vivamus vel nunc rutrum, tempor augue maximus, blandit mauris. Ut bibendum metus ut mi luctus blandit. Aenean a lacus purus. Vestibulum at enim at odio semper finibus.'
			}
		]
	},
	mounted: function(){

	}
});

$('#estudianteSelect').change(function(){
	main.$data.selected.nombre = $('#estudianteSelect').val();	
	$.each(main.$data.estudiantes, function(i, estudiante){
		if(estudiante.nombre===main.$data.selected.nombre){
			main.$data.selected.respuesta = estudiante.respuesta;
			//console.log('Selected nombre: ' + main.$data.selected.nombre);
			//console.log('Selected respuesta: ' + main.$data.selected.respuesta);
		}
	});	
})