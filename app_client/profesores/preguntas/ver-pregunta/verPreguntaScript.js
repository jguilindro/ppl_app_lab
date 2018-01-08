var pregunta = new Vue({
	el: '#pregunta',
	created(){
		this.obtenerUsuario(this);
	},
	mounted: function(){
		this.inicializarMaterialize();
	},
	data: {
		aux: true,
		preguntaObtenida: {},
		preguntaEditar: {},
		pregunta: {},
		profesor: {},
		editable: false,
		eliminable: false,
		tieneSubpreguntas: false,
		dataFinishedLoading: false,
		subTotales: 0
	},
	methods: {
		inicializarMaterialize(){
			$('.button-collapse').sideNav();
			$('.myEditor').materialnote();
			$('.note-editor').find('button').attr('type', 'button');		//No borrar. Corrige el error estupido de materialNote
			$('select').material_select();
			// $('.modal').modal();
		},
		obtenerUsuario: function(self) {
      this.$http.get('/api/session/usuario_conectado').
      then(res => {
        if ( res.body.estado ) {
        	self.profesor = res.body.datos;
        	self.obtenerPregunta(self);
        }
      });
    },
		obtenerPregunta: function(self){
			var preguntaId = window.location.href.toString().split('/')[5];
			var urlApi 		 = '/api/preguntas/' + preguntaId;
			$.ajax({
				type: 'GET',
				url: urlApi,
				success: function(response){
					self.preguntaObtenida = response.datos
					self.checkCreador(self);
					self.tieneSubpreguntas = self.checkSubpreguntas(self, self.preguntaObtenida);
					self.dataFinishedLoading = true;
				},
				error: function(error){
					console.log(error)
				}
			});
		},
		checkCreador: function(self){
			if( self.preguntaObtenida.creador._id == self.profesor._id ){
				self.editable   = true;
				self.eliminable = true;
			}
		},
		/*
			Devuelve true si la pregunta tiene subpreguntas y false si no tiene
		*/
		checkSubpreguntas: function(self, pregunta){
			var tienePropiedad = pregunta.hasOwnProperty('subpreguntas');
			if( tienePropiedad ){
				if( pregunta.subpreguntas.length > 0 ){
					return true;
				}else{
					return false;
				}
			}else{
				return false;
			}
		},
		mostrarEditar: function(){
			//Hago visible la parte de editar pregunta e invisible la parte de ver pregunta
			var self = this;
			if( self.editable ){
				self.aux = !self.aux;
				//Copio los valores de la pregutaObtenida en preguntaEditar que será un temporal
				self.preguntaEditar = self.preguntaObtenida;
				$('.myEditor').materialnote();
				$('#firstEditor').code(self.preguntaEditar.descripcion);
				
				$('#select-editar-tipo-pregunta').val(self.preguntaObtenida.tipoPregunta)
				$('#select-editar-tipo-pregunta').material_select();
				$('#select-editar-tipo-leccion').val(self.preguntaObtenida.tipoLeccion)
				$('#select-editar-tipo-leccion').material_select();
				$('.lblEditar').addClass('active')
				//Inicializar los wysiwyg
				$.each(self.preguntaEditar.subpreguntas, function(index, subpregunta){
					self.agregarSubpregunta(self, subpregunta.puntaje, subpregunta.contenido);
				});
			}
			else{
				alert('Usted no puede editar ni eliminar esta pregunta.');
			}			
		},
		agregarSubpregunta: function(self, puntaje, contenido){
			self.subTotales++;
      //Div container subpregunta
      var idContainer  		 = 'container-subpregunta-' + self.subTotales; 
      var articleContainer = $('<article>').attr('id', idContainer);
      //Label de subpregunta
      var labelSub = $('<label>').html('Subpregunta #' + self.subTotales).addClass('active');
      //Section que alojará al editor
      var idSectionEditor = 'section-subpregunta-' + self.subTotales;
      var sectionEditor   = $('<section>').addClass('input-field col s12')
                                          .attr('id', idSectionEditor);
      //Div del editor
      var idEditor      = 'subpregunta-' + self.subTotales;
      var divEditor     = $('<div>').attr('id', idEditor).addClass('myEditor');

      sectionEditor.append(divEditor);
      //Section puntaje-btns
      var sectionPtBtn = $('<section>').addClass('row section-pt-btn')
                                       .attr('id', 'section-pt-btn-subpregunta-' + self.subTotales);
      //Div puntaje
      var divPt    = $('<div>').addClass('input-field col s6')
                                    .attr('id', 'div-pt-subpregunta-' + self.subTotales);
      var labelPt  = $('<label>').html('Puntaje').addClass('active');
      var idInputPuntaje = 'input-pt-subpregunta' + self.subTotales;
      var inputPuntaje  = $('<input>').attr(
        {
          'type' : 'number', 
          'min'  : 0, 
          'id'   : idInputPuntaje
        });
      inputPuntaje.val(puntaje);
      divPt.append(labelPt, inputPuntaje);                                    
      //Div de botón nueva subpregunta
      var divBtn    = $('<div>').addClass('row row-buttons')
                                    .attr('id', 'div-btns-subpregunta-' + self.subTotales);
      var add = $('<i>').addClass('material-icons').html('add');
      var crearBtn      = $('<a>').addClass('btn-floating waves-effect waves-light btn pull right');
      crearBtn.append(add);
      crearBtn.click( function(){
        self.agregarSubpregunta(self, 0, '');
      });
      var del = $('<i>').addClass('material-icons').html('delete');
      var eliminarBtn   = $('<a>').addClass('btn-floating waves-effect waves-light btn pull right red');
      eliminarBtn.append(del)
      eliminarBtn.click( function(){
        self.eliminarDiv('#' + idContainer);
      });
      divBtn.append(crearBtn, eliminarBtn);

      sectionPtBtn.append(divPt, divBtn);

      articleContainer.append(labelSub, sectionEditor, sectionPtBtn);
      $('#row-editar-subpreguntas').append(articleContainer);
      
      this.inicializarEditor(this, '#' + idEditor, contenido);
    },
		inicializarEditor(self, idEditor, contenido){
			$(idEditor).materialnote({
        height: '100',
        onImageUpload: function(files, editor, $editable) {
          self.subirImagen(self, files, editor, $editable, idEditor);
        }
      });
      $('.note-editor').find('button').attr('type', 'button');
      $(idEditor).code(contenido);
		},
		subirImagen: function(self, files, editor, $editable, idEditor){
      var clientId = '300fdfe500b1718';
      var xhr      = new XMLHttpRequest();
      xhr.open('POST', 'https://api.imgur.com/3/upload', true);
      xhr.setRequestHeader('Authorization', 'Client-ID ' + clientId);
      self.loading(true);
      xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
          console.log('subido');
          self.loading(false);
          var url = JSON.parse(xhr.responseText)
          console.log(url.data.link);
          $(idEditor).materialnote('editor.insertImage', url.data.link);
        }
      }
      xhr.send(files[0]);
    },
    mostrarModalEliminar: function(){
    	$('.modal').modal();
		$('#modalEliminar').modal('open');
	},
    eliminarDiv: function(idDiv){
      this.subTotales--;
      $(idDiv).empty();
    },
		mostrarModal: function(imageUrl){
			$('#myModal .modal-content').empty();
			$('<img>',{'src': imageUrl }).appendTo('#myModal .modal-content')
			$('#myModal').modal('open');
		},
		vincularSubpreguntas: function(){
      this.preguntaEditar.subpreguntas = [];
      let contador = 1;
      let idEditor = '#subpregunta-';
      let idInput  = '#input-pt-subpregunta';
      let aux 		 = this.subTotales;
      while( aux >= 0 ){
        idEditor      = idEditor + contador;
        idInput       = idInput + contador;
        let divExiste = ( $(idEditor).length != 0 );
        if( divExiste ){
          let subpregunta       = {};
          let contenido         = $(idEditor).code();
          let puntaje           = $(idInput).val();
          if( contenido != '' ){
            subpregunta.contenido = contenido;
            subpregunta.puntaje   = puntaje;
            subpregunta.orden     = contador;
            this.preguntaEditar.subpreguntas.push(subpregunta);  
          }
        }
        contador++;
        aux--;
        idEditor = '#subpregunta-';
        idInput  = '#input-pt-subpregunta';
      }
    },
		actualizarPregunta: function(){
			var self = this;
			if( self.editable ){
				self.vincularSubpreguntas();
				console.log('Pregunta actualizada: ');
				console.log(self.preguntaEditar);
				var preguntaId = window.location.href.toString().split('/')[5]
				var url = '/api/preguntas/' + preguntaId;
				this.$http.put(url, self.preguntaEditar).then(response => {
					location.reload();
				}, response => {
					console.log(response)
				});
			}else{
				alert('Usted no puede editar ni eliminar esta pregunta.');
			}
			
		},
		eliminarPregunta: function(){
			var self = this;
			if(self.eliminable){
				var url = '/api/preguntas/'				
				var preguntaId = window.location.href.toString().split('/')[5];
				url = url + preguntaId;
				this.$http.delete(url).then(response => {
					//Success callback
					window.location.href = '../';
				}, response => {
					console.log(response)
				});
			}else{
				alert('Usted no puede editar ni eliminar esta pregunta.');
			}
		}
	}
});


$('#select-editar-tipo-pregunta').change(function(){ 
	pregunta.$data.preguntaEditar.tipoPregunta = $('#select-editar-tipo-pregunta option:selected').val();
	//console.log(pregunta.$data.preguntaEditar.tipoPregunta)
	//console.log($('#select-editar-tipo-pregunta option:selected').text())
	//console.log(pregunta.$data.preguntaEditar)
});

$('#select-editar-tipo-leccion').change(function(){
	pregunta.$data.preguntaEditar.tipoLeccion = $('#select-editar-tipo-leccion option:selected').val();
});

$('#firstEditor').on('materialnote.change', function(we, contents, $editable) {
 	pregunta.$data.preguntaEditar.descripcion = contents;
  
});

$('body').on('click','img', function(){
	pregunta.mostrarModal($(this).attr('src'));
});
