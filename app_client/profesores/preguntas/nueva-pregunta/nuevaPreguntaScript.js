
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


var app = new Vue({
  created(){
    this.obtenerLogeado(this);
    this.obtenerCapitulos(this);
  },
  mounted() {
    this.inicializarMaterialize(this);
    this.generarNavbar();
    this.inicializarEditor(this, '#firstEditor');
  },
	el: '#preguntaNueva',
	data: {
    subTotales        : 0,
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
			puntaje        : 2,
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
      tipo         : 'estimacion',
      nombreMateria: '',
      codigoMateria: ''
    },
    nuevoTutorial     : {
      nombre       : '',
      tipo         : 'tutorial',
      nombreMateria:'',
      codigoMateria:''
    },
    nuevoLaboratorio  : {
      nombre       : '',
      tipo         : 'laboratorio',
      nombreMateria: '',
      codigoMateria: ''
    }
  },
	methods: {
    obtenerLogeado: function(self) {
      this.$http.get('/api/session/usuario_conectado').
      then(res => {
        if (res.body.estado) {
          self.profesor         = res.body.datos;
          self.pregunta.creador = self.profesor._id;
        }
      });
    },
    obtenerCapitulos: function(self){
      var url = '/api/capitulos/';
      self.$http.get(url).then(response => {
        self.capitulosObtenidos = response.body.datos;
        self.dividirCapitulosObtenidos(self);
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
    generarNavbar: function(){
      this.$http.get('/../navbar/profesores').then(response =>{
        document.getElementById('#navbar').innerHTML = response.body;
        $('.button-collapse').sideNav();
        $('.dropdown-button').dropdown();
      });
    },
    agregarSubpregunta: function(){
      this.subTotales++;
      //Div container subpregunta
      var idContainer  = 'container-subpregunta-' + this.subTotales; 
      var divContainer = $('<div>').attr('id', idContainer);
      //Label de subpregunta
      var labelSub      = $('<label>').html('Subpregunta #' + this.subTotales);
      //Section que alojará al editor
      var idSectionEditor = 'section-subpregunta-' + this.subTotales;
      var sectionEditor   = $('<section>').addClass('input-field col s12')
                                          .attr('id', idSectionEditor);
      //Div del editor
      var idEditor      = 'subpregunta-' + this.subTotales;
      var divEditor     = $('<div>').attr('id', idEditor).addClass('myEditor');
      //Div puntaje

      sectionEditor.append(divEditor);
      //Section de botón nueva subpregunta
      var sectionBtn    = $('<section>').addClass('row buttons');
      var crearBtn      = $('<a>').addClass('waves-effect waves-light btn pull right').html('Nueva subpregunta');
      crearBtn.click( function(){
        app.agregarSubpregunta();
      });
      var eliminarBtn   = $('<a>').addClass('waves-effect waves-light btn').html('Eliminar subpregunta');
      eliminarBtn.click( function(){
        app.eliminarDiv('#' + idContainer);
      });
      sectionBtn.append(crearBtn, eliminarBtn);

      divContainer.append(labelSub, sectionEditor, sectionBtn);
      $('#row-sub').append(divContainer);
      
      this.inicializarEditor(this, '#' + idEditor);
    },
    eliminarDiv: function(idDiv){
      app.subTotales--;
      $(idDiv).empty();
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
    dividirCapitulosObtenidos: function(self){
      $.each(self.capitulosObtenidos, function(index, capitulo){
        if(capitulo.tipo.toLowerCase()=='estimacion'){
          self.capitulos.push(capitulo);
        }
        if (capitulo.tipo.toLowerCase()=='tutorial') {
          self.tutoriales.push(capitulo);
        }
        if(capitulo.tipo.toLowerCase()=='laboratorio'){
          self.laboratorios.push(capitulo);
        }
      });
      self.crearSelectCapitulos('select-capitulos', self.capituloEscogido, 'div-select-capitulo', self.capitulos, 'estimacion');
      self.crearSelectCapitulos('select-tutorial', self.capituloEscogido, 'div-select-tutorial', self.tutoriales, 'tutorial');
      self.crearSelectCapitulos('select-laboratorios', self.capituloEscogido, 'div-select-laboratorio', self.laboratorios, 'laboratorio');
    },
    /*
      Parámetros:
        idSelect -> id del elemento select que se va a crear en esta función para contener a los grupos deseados. Ejemplo: select-capitulos
        capituloEscogido ->  Elemento de data con el cual se hará el 2 way data binding. Almacenará el capitulo escogido del select
        idDivSelect -> id del div que contendrá al elemento select que se va a crear
        capitulos -> Los capitulos que se van a mostrar en el select
    */
    crearSelectCapitulos: function(idSelect, capituloEscogido, idDivSelect, capitulos, tipo){
      //Todos los parametros de id vienen sin el #
      var self = this;
      var select = $('<select>').attr({'id': idSelect});
      var optionSelectedAux = '#' + idSelect + ' option:selected';
      select.change(function(){
        if(tipo=='estimacion'){
          self.pregunta.capitulo = $(optionSelectedAux).text();
        }
        if (tipo=='laboratorio') {
          self.pregunta.laboratorio = $(optionSelectedAux).text();
        }
        if(tipo=='tutorial'){
          self.pregunta.tutorial = $(optionSelectedAux).text();
        }
        
      });
      var idDivSelectAux = '#' + idDivSelect;
      var divSelect = $(idDivSelectAux);
      self.crearSelectOptions(select, capitulos, divSelect);
      divSelect.append(select);
      select.material_select();
    },
    /*
      Parámetros:
        select -> elemento select creado en la función crearSelectGrupo que mostrará a los capitulos deseados
        capitulos -> los capitulos que se mostrarán como opciones dentro del select
        divSelect -> elemento div que contendrá al select
    */
    crearSelectOptions: function(select, capitulos, divSelect){
      var self = this;
      var optionDisabled = $('<option>').val('').text('');
      select.append(optionDisabled);
      $.each(capitulos, function(index, capitulo){
        var option = $('<option>').val(capitulo._id).text(capitulo.nombre);
        select.append(option);
      });
      divSelect.append(select);
    },
    vincularSubpreguntas: function(){
      app.pregunta.subpreguntas = [];
      var contador = 1;
      var idEditor = '#subpregunta-';
      var aux = app.subTotales;
      while( aux >= 0 ){
        idEditor      = idEditor + contador;
        var divExiste = ( $(idEditor).length != 0 );
        if( divExiste ){
          var contenido = $(idEditor).code();
          app.pregunta.subpreguntas.push(contenido);
        }
        contador++;
        aux--;
        idEditor = '#subpregunta-';
      }
    },
		crearPregunta: function(){
			var self = this;
      app.vincularSubpreguntas();
			console.log(self.pregunta);
			var url = '/api/preguntas';
			self.$http.post(url, self.pregunta).then(response => {
        //success callback
        console.log('success!')
        console.log(response)

				$('#myModal').modal('open')
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
          self.crearSelectCapitulos('select-capitulos', self.capituloEscogido, 'div-select-capitulo', self.capitulos, 'estimacion');
          self.nuevoCapitulo.nombre = '';
        }, response => {
          console.log('Error al crear el capítulo');
          console.log(response);
        });

    },
    crearTutorial: function(){
      var self = this;
      var url = '/api/capitulos/';
      console.log(self.nuevoTutorial)
      
      self.$http.post(url, self.nuevoTutorial).then(response => {
        self.tutoriales.push(self.nuevoTutorial);
        $('#div-select-tutorial').empty();
        var label = $('<label>').addClass('active').text('Tutoriales');
        $('#div-select-tutorial').append(label);
        self.crearSelectCapitulos('select-tutorial', self.capituloEscogido, 'div-select-tutorial', self.tutoriales, 'tutorial');
        self.nuevoTutorial.nombre = '';
      }, response => {
        console.log('Error al crear el tutorial');
        console.log(response);
      });
    },
    loading: function(estado){
      //función que indicará que una foto se está subiendo (si tuviera lo alto y ancho podría simular a la foto en sí.)
      //Requiere el estado, si está cargando algo o no.
      if (estado){
        $('.note-editable').append('<div id="onLoad" class="preloader-wrapper big active"></div>');
        $('#onLoad').append('<div id="load-2" class="spinner-layer spinner-blue-only"></div>');
        $('#load-2').append('<div id="load-3" class="circle-clipper left"></div>');
        $('#load-3').append('<div id="load-4" class="circle"></div>');
      }else{
        $('#onLoad').remove();
      }
    },
    crearLaboratorio: function(){
      var self = this;
      var url = '/api/capitulos/';
      console.log(self.nuevoLaboratorio)
      
      self.$http.post(url, self.nuevoLaboratorio).then(response => {
        self.laboratorios.push(self.nuevoLaboratorio);
        $('#div-select-laboratorio').empty();
        var label = $('<label>').addClass('active').text('Laboratorios');
        $('#div-select-laboratorio').append(label);
        self.crearSelectCapitulos('select-laboratorios', self.capituloEscogido, 'div-select-laboratorio', self.laboratorios, 'laboratorio');
        self.nuevoLaboratorio.nombre = '';
      }, response => {
        console.log('Error al crear el laboratorio');
        console.log(response);
      });
    },
    cancelar: function(){
      window.location.href = '/profesores/preguntas/estimacion'
    },
		regresar: function(){
      console.log(1234);
			window.location.href = '/profesores/preguntas/estimacion'
		},
    continuar(){
      console.log(1234);
      router.go('https://www.google.com.ec')
      window.location.href = 'https://www.google.com.ec'
      //window.location.href = '/profesores/preguntas/nueva-pregunta'
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


$('#select-materia-estimacion').change(function(){
  app.nuevoCapitulo.nombreMateria = $('#select-materia-estimacion option:selected').text();
  app.nuevoCapitulo.codigoMateria = $('#select-materia-estimacion option:selected').val();
});

$('#select-materia-tutorial').change(function(){
  app.nuevoTutorial.nombreMateria = $('#select-materia-tutorial option:selected').text();
  app.nuevoTutorial.codigoMateria = $('#select-materia-tutorial option:selected').val();
});

$('#select-materia-laboratorio').change(function(){
  app.nuevoLaboratorio.nombreMateria = $('#select-materia-laboratorio option:selected').text();
  app.nuevoLaboratorio.codigoMateria = $('#select-materia-laboratorio option:selected').val();
});