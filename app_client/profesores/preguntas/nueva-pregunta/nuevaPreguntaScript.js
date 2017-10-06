
var sub = {
  template: '<div class="row">\
  <ul>\
    <li v-for="(opcion, index) in preguntas">\
      <div class="card-panel teal">\
        <span class="white-text"">{{ opcion.opcion }} </span>\
        <button @click="deleteSub(index)">Eliminar</button>\
      </div></li>\
  </ul></div>',
  props: ['preguntas'],
  methods:{
    deleteSub(index){
      this.$emit('subdeleted', index);
    }
  }
}

var modal = {
  template: '<div class="modal-footer">\
                <a id="crear" class="modal-action modal-close waves-effect waves-green btn-flat" @click="continuar">Si</a>\
                <a id="crear" class="modal-action modal-close waves-effect waves-green btn-flat" @click="regresar">No</a>\
						</div>\
            ',
  methods: {
    regresar(){
      console.log(1234);
			window.location.href = '/profesores/preguntas/banco'
		},
    continuar(){
      console.log(1234);
      window.location.href = '/profesores/preguntas/nueva-pregunta'
    }
  }                  
}

new Vue({
  el: '#app',
  components:{
    'modal': modal
  }
})

var app = new Vue({
  created(){
    this.obtenerUsuario(this);
    this.obtenerCapitulos(this);
  },
  mounted() {
    this.inicializarMaterialize(this);
    this.inicializarEditor(this, '#firstEditor');
  },
	el: '#preguntaNueva',
	data: {
    subTotales        : 0,
    link: 'https://www.google.com.ec',
		pregunta          : {
			nombre         : '',
			descripcion    : '',
			tipoPregunta   : '',	//v_f, justifiacación u opcion
			opciones       : [],		//Se llena solo si tipoPregunta=='Opcion multiple'
      subpreguntas   : [], // Array con las descripciones de las supbreguntas
			tipoLeccion    : '',	// estimacion, tutorial o laboratorio
			tiempoEstimado : 0,
			creador        : '',		//Se deberia llenar con las sesiones, trabajo de Julio Guilindro
			capitulo       : '',		//Se llena solo si tipoLeccion=='leccion'
			tutorial       : '',		//Se llena solo si tipoLeccion=='tutorial'
			laboratorio    : '',	//Se llena solo si tipoLeccion=='Laboratorio'
			puntaje        : 0,
      subpreguntas   : []
		},
		profesor          : {},
    capitulosObtenidos: [],
    capitulos         : [],
    tutoriales        : [],
    laboratorios      : [],
    capituloEscogido  :{
      nombre: '',
      id    : ''
    },
    nuevoCapitulo     : {
      nombre       : '',
      nombreMateria: '',
      codigoMateria: ''
    },
  },
  components:{
    'modal-buttons': modal
  },
	methods: {
    obtenerUsuario: function(self) {
      this.$http.get('/api/session/usuario_conectado').
      then(res => {
        if ( res.body.estado ) {
          self.profesor         = res.body.datos;
          self.pregunta.creador = self.profesor._id;
        }
      });
    },
    obtenerCapitulos: function(self){
      var url = '/api/capitulos/';
      self.$http.get(url).then(response => {
        self.capitulosObtenidos = response.body.datos;
        self.crearSelectCapitulos(self, 'select-capitulos', self.capituloEscogido, 'div-select-capitulo', self.capitulosObtenidos, 'estimacion');
      }, response => {
        console.log(response)
      });
    },
    inicializarMaterialize: function(self){
      $('select').material_select();
      $('.modal').modal();
      $('#tipo-leccion').change( function(){
        var seleccion = $('#tipo-leccion').val();
        if( seleccion === 'tutorial' ){
          self.agregarSubpregunta();
        }
      });
      $('#select-materia').change(function(){
        let materiaSeleccionada = $('#select-materia').val();
        let capitulosMostrar    = $.grep(self.capitulosObtenidos, function(capitulo, index){
          return capitulo.codigoMateria == materiaSeleccionada;
        });
        self.crearSelectCapitulos(self, 'select-capitulos', self.capituloEscogido, 'div-select-capitulo', capitulosMostrar, 'estimacion');
      });
    },
    inicializarEditor: function(self, idEditor){
      $(idEditor).materialnote({
        height: '50vh',
        onImageUpload: function(files, editor, $editable) {
          self.subirImagen(files, editor, $editable, idEditor);
        }
      });
      $('.note-editor').find('button').attr('type', 'button');
    },
    subirImagen: function(files, editor, $editable, idEditor){
      var clientId = '300fdfe500b1718';
      var xhr      = new XMLHttpRequest();
      xhr.open('POST', 'https://api.imgur.com/3/upload', true);
      xhr.setRequestHeader('Authorization', 'Client-ID ' + clientId);
      app.loading(true);
      xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
          console.log('subido');
          app.loading(false);
          var url = JSON.parse(xhr.responseText)
          console.log(url.data.link);
          $(idEditor).materialnote('editor.insertImage', url.data.link);
        }
      }
      xhr.send(files[0]);
    },
    /*
      @Descripción: función que indicará que una foto se está subiendo (si tuviera lo alto y ancho podría simular a la foto en sí.)
      @Params: Requiere el estado, si está cargando algo o no.
    */
    loading: function(estado){
      if ( estado ){
        $('.note-editable').append('<div id="onLoad" class="preloader-wrapper big active"></div>');
        $('#onLoad').append('<div id="load-2" class="spinner-layer spinner-blue-only"></div>');
        $('#load-2').append('<div id="load-3" class="circle-clipper left"></div>');
        $('#load-3').append('<div id="load-4" class="circle"></div>');
      }else{
        $('#onLoad').remove();
      }
    },
    /* Lo siento por el que tenga que modificar esto... */
    agregarSubpregunta: function(){
      let self = this;
      self.subTotales++;
      //Div container subpregunta
      var idContainer     = 'container-subpregunta-' + self.subTotales; 
      var divContainer    = $('<div>').attr('id', idContainer);
      //Label de subpregunta
      var labelSub        = $('<label>').html('Pregunta #' + self.subTotales);
      //Section que alojará al editor
      var idSectionEditor = 'section-subpregunta-' + self.subTotales;
      var sectionEditor   = $('<section>').addClass('input-field col s12')
                                          .attr('id', idSectionEditor);
      //Div del editor
      var idEditor        = 'subpregunta-' + self.subTotales;
      var divEditor       = $('<div>').attr('id', idEditor).addClass('myEditor');
      sectionEditor.append(divEditor);
      //Section puntaje-tiempo-btns
      var sectionPtBtn    = $('<section>').addClass('row section-pt-btn')
                                          .attr('id', 'section-pt-btn-subpregunta-' + self.subTotales);
      //Div puntaje
      var divPt           = $('<div>').addClass('input-field col s4 div-pt')
                               .attr('id', 'div-pt-subpregunta-' + self.subTotales);
      var labelPt         = $('<label>').html('Puntaje');
      var idInputPuntaje  = 'input-pt-subpregunta-' + self.subTotales;
      var inputPuntaje    = $('<input>').attr(
        {
          'type' : 'number', 
          'min'  : 0, 
          'id'   : idInputPuntaje
        });
      inputPuntaje.change( function(){
        self.obtenerPuntajeTotal();
      });
      divPt.append(labelPt, inputPuntaje); 
      //Div tiempo
      let divTiempo       = $('<div>').addClass('input-field col s4 div-pt')
                                      .attr('id', 'div-tiempo-subpregunta-' + self.subTotales);
      let labelTiempo     = $('<label>').html('Tiempo');  
      var idInputTiempo   = 'input-tiempo-subpregunta-' + self.subTotales;
      var inputTiempo     = $('<input>').attr(
        {
          'type' : 'number', 
          'min'  : 0, 
          'id'   : idInputTiempo
        });   
      inputTiempo.change( function(){
        self.obtenerTiempoTotal();
      });            
      divTiempo.append(labelTiempo, inputTiempo);           
      //Div de botón nueva subpregunta
      var divBtn          = $('<div>').addClass('row row-buttons')
                                      .attr('id', 'div-btns-subpregunta-' + self.subTotales);
      var add             = $('<i>').addClass('material-icons').html('add');
      var crearBtn        = $('<a>').addClass('btn-floating waves-effect waves-light btn pull right');
      crearBtn.append(add);
      crearBtn.click( function(){
        self.agregarSubpregunta();
      });
      var del             = $('<i>').addClass('material-icons').html('delete');
      var eliminarBtn     = $('<a>').addClass('btn-floating waves-effect waves-light btn pull right red');
      eliminarBtn.append(del)
      eliminarBtn.click( function(){
        self.eliminarDiv('#' + idContainer);
      });
      divBtn.append(crearBtn, eliminarBtn);

      sectionPtBtn.append(divPt, divTiempo, divBtn);

      divContainer.append(labelSub, sectionEditor, sectionPtBtn);
      $('#row-sub').append(divContainer);
      
      this.inicializarEditor(this, '#' + idEditor);
    },
    eliminarDiv: function(idDiv){
      app.subTotales--;
      $(idDiv).empty();
      app.obtenerPuntajeTotal();
    },
	  agregarOpcion: function () {
	    if (!this.newOpcionText==''){
	      console.log('no esta vacio')
        this.pregunta.opciones.push({
          opcion: this.newOpcionText
        })
        this.newOpcionText= ''
        console.log(this.pregunta.opciones)
      }
      else{
        alert('Opcion vacia!');
      }
    },
    deleteSub(index){
      this.pregunta.opciones.splice(index,1);
    },
    /*
      Parámetros:
        idSelect -> id del elemento select que se va a crear en esta función para contener a los grupos deseados. Ejemplo: select-capitulos
        capituloEscogido ->  Elemento de data con el cual se hará el 2 way data binding. Almacenará el capitulo escogido del select
        idDivSelect -> id del div que contendrá al elemento select que se va a crear
        capitulos -> Los capitulos que se van a mostrar en el select
    */
    crearSelectCapitulos: function(self, idSelect, capituloEscogido, idDivSelect, capitulos, tipo){
      $('#'+idDivSelect).empty();
      let label             = $('<label>').html('Capítulos').addClass('active');
      //Todos los parametros de id vienen sin el #
      var select            = $('<select>').attr({'id': idSelect});
      var optionSelectedAux = '#' + idSelect + ' option:selected';
      select.change(function(){
        self.pregunta.capitulo = $(optionSelectedAux).val();
      });
      var idDivSelectAux = '#' + idDivSelect;
      var divSelect      = $(idDivSelectAux);
      self.crearSelectOptions(self, select, capitulos, divSelect);
      divSelect.append(label, select);
      select.material_select();
    },
    /*
      Parámetros:
        select -> elemento select creado en la función crearSelectGrupo que mostrará a los capitulos deseados
        capitulos -> los capitulos que se mostrarán como opciones dentro del select
        divSelect -> elemento div que contendrá al select
    */
    crearSelectOptions: function(self, select, capitulos, divSelect){
      let optionDisabled = $('<option>').val('').text('');
      select.append(optionDisabled);
      $.each(capitulos, function(index, capitulo){
        let option = $('<option>').val(capitulo._id).text(capitulo.nombre);
        select.append(option);
      });
      divSelect.append(select);
    },
    vincularSubpreguntas: function(){
      app.pregunta.subpreguntas = [];
      var contador      = 1;
      var idEditor      = '#subpregunta-';
      var idInputPt     = '#input-pt-subpregunta-';
      var idInputTiempo = '#input-tiempo-subpregunta-';
      var aux = app.subTotales;
      while( aux >= 0 ){
        idEditor      = idEditor      + contador;
        idInputPt     = idInputPt     + contador;
        idInputTiempo = idInputTiempo + contador;
        var divExiste = ( $(idEditor).length != 0 );
        if( divExiste ){
          var subpregunta  = {};
          var contenido    = $(idEditor).code();
          var puntaje      = $(idInputPt).val();
          var tiempo       = $(idInputTiempo).val();
          if( contenido != '' ){
            subpregunta.contenido = contenido;
            subpregunta.puntaje   = puntaje;
            subpregunta.orden     = contador;
            subpregunta.tiempo    = tiempo;
            app.pregunta.subpreguntas.push(subpregunta);  
          }
        }
        contador++;
        aux--;
        idEditor   = '#subpregunta-';
        idInputPt  = '#input-pt-subpregunta-';
        idInputPt  = '#input-pt-subpregunta-';
      }
    },
		crearPregunta: function(){
			var self = this;
      app.vincularSubpreguntas();
			console.log(self.pregunta);
			var url = '/api/preguntas';
			self.$http.post(url, self.pregunta).then(response => {
        //success callback
        console.log('success!');
        console.log(response);
				$('#myModal').modal('open');
			}, response => {
        //error callback
        console.log('fallo')
				console.log(response)
			});
		},
    crearCapitulo: function(){
      var self = this;
      var url = '/api/capitulos/';
      console.log(self.nuevoCapitulo)
      self.$http.post(url, self.nuevoCapitulo)
        .then(response => {
          //Tengo que añadir el capítulo al array porque la página no se va a recargar
          self.capitulos.push(self.nuevoCapitulo);
          //Como las options del select no están vinculadas con el array de capítulos tengo que hacerlo manualmente.
          //Vacío el div y vuelvo a colocar los elementos.
          $('#div-select-capitulo').empty();
          var label = $('<label>').addClass('active').text('Capítulos');
          $('#div-select-capitulo').append(label)
          self.crearSelectCapitulos(self, 'select-capitulos', self.capituloEscogido, 'div-select-capitulo', self.capitulos, 'estimacion');
          self.nuevoCapitulo.nombre = '';
        }, response => {
          console.log('Error al crear el capítulo');
          console.log(response);
        });

    },
    cancelar: function(){
      window.location.href = '/profesores/preguntas/banco'
    },
		regresar: function(){
      console.log(1234);
			window.location.href = '/profesores/preguntas/banco'
		},
    continuar: function(){
      console.log(1234);
      //router.go('https://www.google.com.ec')
      //window.location.href = 'https://www.google.com.ec'
      window.location.href = '/profesores/preguntas/nueva-pregunta'
    },
    obtenerPuntajeTotal: function(){
      app.pregunta.puntaje = 0;
      var contador         = 1;
      var idEditor         = '#subpregunta-';
      var idInput          = '#input-pt-subpregunta';
      var aux              = app.subTotales;
      while( aux >= 0 ){
        idEditor      = idEditor + contador;
        idInput       = idInput + contador;
        var divExiste = ( $(idEditor).length != 0 );
        if( divExiste ){
          var contenido         = $(idEditor).code();
          var puntaje           = $(idInput).val();
          if( contenido != '' ){
            app.pregunta.puntaje += parseInt(puntaje);
          }
        }
        contador++;
        aux--;
        idEditor = '#subpregunta-';
        idInput  = '#input-pt-subpregunta';
      }
    },
    obtenerTiempoTotal: function(){
      app.pregunta.tiempoEstimado = 0;
      var contador         = 1;
      var idEditor         = '#subpregunta-';
      var idInput          = '#input-tiempo-subpregunta';
      var aux              = app.subTotales;
      while( aux >= 0 ){
        idEditor      = idEditor + contador;
        idInput       = idInput  + contador;
        var divExiste = ( $(idEditor).length != 0 );
        if( divExiste ){
          var contenido        = $(idEditor).code();
          var tiempoEstimado   = $(idInput).val();
          if( contenido != '' ){
            app.pregunta.tiempoEstimado += parseInt(tiempoEstimado);
          }
        }
        contador++;
        aux--;
        idEditor = '#subpregunta-';
        idInput  = '#input-tiempo-subpregunta';
      }
    }
	},
});

//2 way data binding de los selects y del wysiwyg
$('#tipo-leccion').change(function(){
	app.$data.pregunta.tipoLeccion = $('#tipo-leccion option:selected').val();
});

$('#tipo-pregunta').change(function(){
	app.$data.pregunta.tipoPregunta = $('#tipo-pregunta option:selected').val();
});

$('#firstEditor').on('materialnote.change', function(we, contents, $editable) {
 	app.$data.pregunta.descripcion = contents;
});

