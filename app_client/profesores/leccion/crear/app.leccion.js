var App = new Vue({
  created: function() {
    this.obtenerUsuario();
    this.obtenerCapitulos(this);
    this.obtenerPreguntas(this);
    this.obtenerParalelos();
  },
  mounted: function(){
    this.inicializarMaterialize();
  },
  updated: function(){
    var self = this;
      self.DOMupdated = true;
  },
  el: '#app',
  methods: {
    inicializarMaterialize: function(){
      $('ul.tabs').tabs();
      $('.button-collapse').sideNav();
      $(".dropdown-button").dropdown({ hover: false });
      $('.scrollspy').scrollSpy();
      $('.modal').modal();
      $('select').material_select();
      $('.modal').modal();
      $('.collapsible').collapsible({
        onOpen: function(el) {
          var self = this;
          self.CollapsibleOpen = true
        }
      });
      
      $('#select-materia').change( function(){
        $('#select-paralelo').attr('disabled', false);
        $('#select-paralelo').material_select();
        const nombreMateria  = $('#select-materia option:selected').text();
        App.leccion_nueva.nombreMateria = nombreMateria;
        App.leccion_nueva.codigoMateria = $('#select-materia').val();
      });

      $('#select-paralelo').change( function(){
        $('#select-tipo-leccion').attr('disabled', false);
        $('#select-tipo-leccion').material_select();

        const materiaSel           = $('#select-materia').val();
        const nombreMateria        = $('#select-materia option:selected').text();
        const paraleloSel          = $('#select-paralelo').val();
        App.leccion_nueva.paralelo = App.obtenerIdParalelo(materiaSel, paraleloSel, App.paralelos);
        if( App.leccion_nueva.paralelo == null ){
          const mensaje = 'La materia ' + nombreMateria + ' no tiene paralelo #' + paraleloSel;
          Materialize.toast(mensaje, 5000, 'rounded red');
        }
        App.leccion_nueva.nombreParalelo = $('#select-paralelo option:selected').text();
        App.paraleloEscogido.nombre      = $('#select-paralelo option:selected').text();

        const paralelo = $.grep(App.paralelos, function(par, i){
          return par._id == App.leccion_nueva.paralelo;
        });
      });
      //Cuando el tipo de lección es seleccionado, se tienen que filtrar las preguntas a mostrar de los capitulo a mostrar
      $('#select-tipo-leccion').change( function(){
        App.leccion_nueva.tipo = $('#select-tipo-leccion').val();
        App.anadirPreguntasACapitulos(App.capitulosObtenidos, App.preguntas);
        App.capitulosMostrar = [];
        const materiaSel     = $('#select-materia').val();
        App.capitulosMostrar = $.grep(App.capitulosObtenidos, function(capitulo, i){
          return capitulo.codigoMateria == materiaSel;
        });
        const tipoSel = $('#select-tipo-leccion').val();
        for (var i = 0; i < App.capitulosMostrar.length; i++) {
          let capituloActual = App.capitulosMostrar[i];
          capituloActual.preguntas = App.filtrarPreguntasPorTipoLeccion(capituloActual.preguntas, tipoSel);
        }
      });
    },
    //////////////////////////////////////////////
    //Llamadas api
    //////////////////////////////////////////////
    obtenerUsuario: function() {
      this.$http.get('/api/session/usuario_conectado').then(response => {
        this.profesor = response.body.datos;
      });
    },
    obtenerParalelos: function(){
      $.get({
        url: '/api/paralelos/',
        success: function(res){
          App.paralelos = res.datos;
          console.log('paralelos:', App.paralelos);
        },
        error: function(err){
          Materialize.toast('No se pudieron obtener los paralelos. Recargue la página', 3000, 'rounded red');
          console.log(err);
        }
      });
    },
    obtenerCapitulos: function(self){
      var url = '/api/capitulos/'
      self.$http.get(url).then(response => {
        self.capitulosObtenidos = response.body.datos;
      }, response => {
        console.log('Hubo un error al obtener los capítulos de la base de datos.');
        console.log(response);
      })
    },
    obtenerPreguntas: function(self){
      var url = '/api/preguntas/';
      self.$http.get(url).then(response => {
        self.preguntas = response.body.datos;
      }, response => {
        console.log('Hubo un error al obtener las preguntas de la base de datos');
      });
    },
    crearLeccion() {
      var crearLeccionURL = '/api/lecciones/';
      var self = this;
      this.$http.post(crearLeccionURL, self.leccion_nueva).then(response => {
        //success callback
        $('#myModal').modal('open');
        console.log(response)
        /**
          *Not the best way, but a way. Una vez se haya creado la pregunta, se agregará un evento click al body
          *Al apretar cualquier parte del body, reenviará al menú de lecciones,
        **/
        $("body").click(function(){
          window.location.replace("/profesores/leccion");
        });
        $(document).keyup(function(e) {
          if (e.keyCode == 27) { // escape key maps to keycode `27`
            window.location.replace("/profesores/leccion");
          }
        });
        //-------Fin de cerrar Modal-------------
      }, response => {
        //error callback
        alert("ALGO SALIÓ MAL!" + response);
        console.log(response)
      });
    },
    ///////////////////////////////////////////////
    //HELPERS
    ///////////////////////////////////////////////
    anadirPreguntasACapitulos: function(arrayCapitulos, arrayPreguntas){
      for (var i = 0; i < arrayCapitulos.length; i++) {
        let capituloActual       = arrayCapitulos[i];
        capituloActual.preguntas = App.obtenerPreguntasDeCapitulo(capituloActual, arrayPreguntas);
      }
    },
    obtenerPreguntasDeCapitulo: function(capitulo, arrayPreguntas){
      let preguntas = [];
      for (var i = 0; i < arrayPreguntas.length; i++) {
        let preguntaActual = arrayPreguntas[i];
        if( preguntaActual.capitulo._id == capitulo._id ){
          preguntas.push(preguntaActual);
        }
      }
      return preguntas;
    },
    obtenerIdParalelo: function(codigoMateria, nombreParalelo, arrayParalelos){
      for (var i = 0; i < arrayParalelos.length; i++) {
        let paraleloActual = arrayParalelos[i];
        if( paraleloActual.codigo == codigoMateria && paraleloActual.nombre == nombreParalelo ){
          return paraleloActual._id;
        }
      }
    },
    /*
      Primero obtengo los paralelos del usuario conectado
    */
    toHTML: function (str){
      var entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
      };
      return String(str).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
      });
    },
    /*
      *Sanitizes all the text fields in a container
      *container: Is the container in which the text fields are contained :v
    */
    sanitize: function (container){
      var self = this;
      var inputs, index;
      container = document.getElementById("test1");
      inputs    = container.querySelectorAll("input[type=text]");
      for (index = 0; index < inputs.length; ++index) {
        inputs[index].value = this.toHTML(inputs[index].value); 
      }
    },
    validarCamposVacios: function(){
      var self = this;
      self.avanzarPestania("test2","#t2");
      /*var self = this;
      this.sanitize('test1');
      var  nombre = self.leccion_nueva.nombre;
      console.log(nombre);
      var  tEst = self.leccion_nueva.tiempoEstimado;
      var  tipo = self.leccion_nueva.tipo;
      var  fInicio = self.leccion_nueva.fechaInicio;
      var pEscogido = self.paraleloEscogido.id;
      var materia = self.leccion_nueva.nombreMateria;
      var error = false;
      $("#lblNombre").removeClass("#ffebee red lighten-5");
      $("#tipoLeccion").removeClass("#ffebee red lighten-5");
      $("lblNombre").removeClass("#ffebee red lighten-5");
      $("#datePicker").removeClass("#ffebee red lighten-5");
      $("#materias").removeClass("#ffebee red lighten-5");
      $("#div-select").removeClass("#ffebee red lighten-5");

      if (nombre == ""){
        $("#lblNombre").addClass("#ffebee red lighten-5");
        error = true;

      }
      if (tipo == ""){
        $("#tipoLeccion").addClass("#ffebee red lighten-5");
        error = true;
      }

      if (materia == ""){
        $("#materias").addClass("#ffebee red lighten-5");
        error = true;
      }
      if (pEscogido == ""){
        $("#div-select").addClass("#ffebee red lighten-5");
        error = true;
      }

      if(error){
        //$('#modalVal').modal('open');        DESCOMENTAR ESTA LINEA, XAVIER!

      }else{
        self.avanzarPestania("test2","#t2");

      }*/
    },
    anadirPregunta: function(pregunta){
      const existe = App.objectInArray(pregunta, App.preguntasSel);
      if(existe){
        let aux = $.grep(App.preguntasSel, function(p, i){
          return pregunta._id != p._id;
        });
        App.preguntasSel = aux;
      }else{
        App.preguntasSel.push(pregunta);
      }
      App.ordenarPreguntas(App.preguntasSel);
      App.sumarTiempos(App.preguntasSel);
      App.sumarPuntaje(App.preguntasSel);
    },
    objectInArray: function(object, array){
      for (var i = 0; i < array.length; i++) {
        let actual = array[i];
        if( actual._id == object._id ){
          return true;
        }
      }
      return false;
    },
    ordenarPreguntas: function(arrayPreguntas){
      App.leccion_nueva.preguntas = [];
      let cont = 1;
      for (var i = 0; i < arrayPreguntas.length; i++) {
        let preguntaActual = arrayPreguntas[i]._id;
        let obj            = {
          pregunta      : preguntaActual,
          ordenPregunta : cont
        };
        App.leccion_nueva.preguntas.push(obj);
        cont++;
      }
    },
    sumarTiempos: function(arrayPreguntas){
      App.leccion_nueva.tiempoEstimado = 0;
      for (var i = 0; i < arrayPreguntas.length; i++) {
        let actual = arrayPreguntas[i];
        App.leccion_nueva.tiempoEstimado += parseInt(actual.tiempoEstimado);
      }
    },
    sumarPuntaje: function(arrayPreguntas){
      App.leccion_nueva.puntaje = 0;
      for (var i = 0; i < arrayPreguntas.length; i++) {
        let actual = arrayPreguntas[i];
        App.leccion_nueva.puntaje += parseInt(actual.puntaje);
      }
    },
    /*
      Devuelve un array de preguntas filtradas por el tipo de lección indicado
    */
    filtrarPreguntasPorTipoLeccion: function(arrayPreguntas, tipoLeccion){
      if( tipoLeccion === 'tutorial'){
        return $.grep( arrayPreguntas, function(pregunta, index){
          return pregunta.tipoLeccion == tipoLeccion;
        });
      }else{
        return $.grep( arrayPreguntas, function(pregunta, index){
          return ( pregunta.tipoLeccion == 'laboratorio' || pregunta.tipoLeccion == 'estimacion' );
        });
      }
    },
    ////////////////////////////////////////////////
    //MODIFICACIONES DOM
    ////////////////////////////////////////////////
    /*
      Colocar Modal
    */
    verModal: function(descripcion, tiempo){
      $("#modalDesc .modal-content").empty();
      $("#modalDesc .modal-content").append(descripcion);
      $("#modalDesc .modal-content").append($("<hr>"));
      var tiempoDesc = $("<label>").addClass("modal-tiempo pull right").text("Tiempo estimado: " + tiempo + " minutos");
      $("#modalDesc .modal-content").append(tiempoDesc);
      $('#modalDesc').modal('open');
    },
    /*
      *Cuando se da click al boton que invoca al metodo, se selecciona una pestaña
      *pestaniasgt: Id de la pestaña a la que desea dirigirse
    */
    avanzarPestania: function(pestaniasgt,aTag){
      var pestania = pestaniasgt;  
      var self = this;
      //var inputs, index;
      tabs = document.querySelectorAll(".tab");
      for (index = 0; index < tabs.length; ++index) {
        
          console.log(tabs[index]);
          $(tabs[index]).addClass("disabled");
          

      }
      //console.log($(".active").parentNode.nodeName);
      $(aTag).removeClass("disabled");
      $('ul.tabs').tabs();
      $('ul.tabs').tabs('select_tab', pestania);
    },
    /*
      Muestra un preview de la pregunta    
    */
    showTooltip: function(preguntaID, descripcion, tiempo){
        var tooltipID = "#tooltip-" + preguntaID;
        var max_width = ( 50 * $( window ).width() )/100;
        var max_height = ( 50 * $( window ).width() )/100;
        descripcion.concat("<br><hr>");
        descripcion.concat(tiempo);
        console.log();
        $(tooltipID).tooltipster({
          theme: 'tooltipster-light',
          position: 'bottom',
          maxWidth: max_width,
          height: max_height,
          contentCloning: true,
          arrow: false,
          delay: 100,
          multiple: true,
          contentAsHTML: true})
          .tooltipster('content', descripcion)
          .tooltipster('open');
    },
    /*
      Abrir/Cerrar el acordeón
    */
    collapsibleClicked: function(event){
      var self = this;
      if(self.DOMupdated && !self.CollapsibleOpen){
        $('.collapsible').collapsible({
          onOpen: function(el) {
            self.CollapsibleOpen = true;
          },
          onClose: function(el){
            self.CollapsibleOpen = false;
          }
        });
        self.DOMupdated = false;
      }
    },
  },
  data: {
    capitulosMostrar   : [],   //Capítulos que se mostrarán en el DOM
    capitulosObtenidos : [], //Capítulos obtenidos de la base de datos (no se altera)
    leccion_nueva      : {
      nombre        : '',
      tiempoEstimado: 0,
      tipo          : '',
      fechaInicio   : moment().add(1, 'day').format('YYYY-MM-DD'),
      preguntas     : [],
      puntaje       : 0,
      paralelo      : '',
      nombreParalelo: '',
      nombreMateria : '',
      codigoMateria : ''
    },
    paralelos          : [],        //Paralelos obtenidos de la base de datos
    preguntas          : [],        //Preguntas obtenidas de la base de datos
    preguntas_escogidas: {
      preguntas  : [],
      tiempoTotal: 0
    },
    paraleloEscogido   : {
      nombre: '',
      id    : ''
    },
    DOMupdated         : false,
    CollapsibleOpen    : false,
    profesor           : {},
    preguntasSel       : []
  },
});

$('#datePicker').pickadate({
  monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthsShort: ['En', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  weekdaysFull: ['Domingo','Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
  weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
  today: 'Hoy',
  clear: 'Limpiar',
  close: 'Cerrar',
  closeOnSelect: true,
  format: 'yyyy-mm-dd',
  min: new Date(),
  onClose: function(data) {
    App.leccion_nueva.fechaInicio = moment(this.get('value')).add(1, 'day').format('YYYY-MM-DD')
  }
});
