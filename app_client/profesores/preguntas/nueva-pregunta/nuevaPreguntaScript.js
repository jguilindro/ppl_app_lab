
var app = new Vue({
	mounted: function(){
		$('#summernote').summernote();
		

	},
	el: '#preguntaNueva',
	data: {
		pregunta: {
			nombre: '',
			descripcion: '',
			//imagenes: [],	//Es opcional añadir imágenes a la pregunta
			tipoPregunta: '',	//v_f, justifiacación u opcion
			//opciones: [],		//Se llena solo si tipoPregunta=='Opcion multiplie'
			tipoLeccion: '',	// estimacion, tutorial o laboratorio
			tiempoEstimado: 0,
			//tiempoBandera: 0,	// Tiempo en que la bandera cambiará de color para el Real Time
			creador: '',		//Se deberia llenar con las sesiones, trabajo de Julio Guilindro
			capitulo: '',		//Se llena solo si tipoLeccion=='leccion'
			tutorial: '',		//Se llena solo si tipoLeccion=='tutorial'
			laboratorio: '',	//Se llena solo si tipoLeccion=='Laboratorio'
			puntaje: 2,
			nombreCreador: ''
		},
		profesor: {}
	},
	methods: {
		cancelar: function(){
			window.location.href = '/profesores/preguntas/estimacion'
		},
		crearPregunta: function(){
			var self = this;
			console.log(this.pregunta);
			var url = '/api/preguntas';
			this.$http.post(url, self.pregunta).then(response => {
				//success callback
				console.log(response)
			}, response => {
				//error callback
				console.log(response)
			});
			$('#myModal').modal()

		},
		ok: function(){
			window.location.href = '/profesores/preguntas/estimacion'
		},
		obtenerLogeado: function() {
      var self = this;
      this.$http.get('/api/session/usuario_conectado').
        then(res => {
          if (res.body.estado) {
            self.profesor = res.body.datos;
            console.log(self.profesor)
            self.pregunta.creador = self.profesor._id;
            self.pregunta.nombreCreador = self.profesor.nombres + self.profesor.apellidos;
          }
        });
    }
	},
  mounted() {
    $('#summernote').on('summernote.image.upload', function(we, files, otor) {
      var clientId = "300fdfe500b1718";
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://api.imgur.com/3/upload', true);
      xhr.setRequestHeader('Authorization', 'Client-ID ' + clientId);
       xhr.onreadystatechange = function () {
          if (xhr.status === 200 && xhr.readyState === 4) {
            console.log('subido');
            var url = JSON.parse(xhr.responseText)
            console.log(url.data.link);
            $('#summernote').summernote('editor.insertImage', url.data.link);
          }
       }
       xhr.send(files[0]);
    });
    $('#summernote').summernote({
      height: "500px",
      callbacks: {
        onImageUpload: function(files, editor, $editable) {
        },
        onChange: function(contents, $editable) {
          app.$data.pregunta.descripcion = contents;
        }
      }
    });
    this.obtenerLogeado();
  }
});

/*
$('#tipo-leccion').change(function(){
	//console.log('asdfsdfsd')
	console.log(app.$data.pregunta.tipoLeccion)
	console.log($('#tipo-leccion option:selected').text())
	//app.set('select', $('#jurisdiction').val());
	//console.log( 'Text: ' + $('#tipo-leccion option:selected').text())
	//console.log('Antes: ' + app.$data.pregunta.tipoLeccion)
	//app.$data.pregunta.tipoLeccion = $('#tipo-leccion option:selected').text();
	//console.log('Despues: ' + app.$data.pregunta.tipoLeccion)
});

$('#tipo-pregunta').change(function(){
	//app.set('select', $('#jurisdiction').val());
	//console.log( 'Text: ' + $('#tipo-pregunta option:selected').text())
	//console.log('Antes: ' + app.$data.pregunta.tipoPregunta)
	app.$data.pregunta.tipoPregunta = $('#tipo-pregunta option:selected').text();
	//console.log('Despues: ' + app.$data.pregunta.tipoPregunta)
});*/
/*
$('#aaa').click(function(){
	console.log($('#summernote').summernote('code'))

	//console.log('asdfafsd')
})*/

// $('#summernote').on('summernote.change', function(we, contents, $editable) {
// app.$data.pregunta.descripcion = contents;
// })
//
// $('#summernote').on('summernote.image.upload', function(we, files) {
//   // upload image to server and create imgNode...
//   console.log('imag upload');
//   console.log(files);
//   // $summernote.summernote('insertNode', imgNode);
// });

// $('#summernote').summernote({
//   height: "500px",
//   callbacks: {
//     onImageUpload: function(files) {
//       // upload image to server and create imgNode...
//       $summernote.summernote('insertNode', imgNode);
//     },
//     onChange: function(contents, $editable) {
//       app.$data.pregunta.descripcion = contents;
//     }
//   }
// });
// $('#summernote').summernote({
//     height: "500px",
//     onImageUpload: function(files, editor, welEditable) {
//         sendFile(files[0],editor,welEditable);
//     },
//     onChange: function(contents, $editable) {
//       console.log(app.pregunta);
//       app.$data.pregunta.descripcion = contents;
//     }
// });
