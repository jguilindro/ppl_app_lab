var App = new Vue({
  created: function() {
    this.obtenerUsuario();
    this.obtenerCapitulos(this);
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
    },
    obtenerUsuario: function() {
      this.$http.get('/api/session/usuario_conectado').then(response => {
        this.profesor = response.body.datos;
      });
    },
    obtenerCapitulos: function(self){
      var url = '/api/capitulos/'
      self.$http.get(url).then(response => {
        self.capitulosObtenidos = response.body.datos;
        self.obtenerPreguntas(self);
      }, response => {
        console.log('Hubo un error al obtener los capítulos de la base de datos.');
        console.log(response);
      })
    },
    obtenerPreguntas: function(self){
      var url = '/api/preguntas/';
      self.$http.get(url).then(response => {
        self.preguntas = response.body.datos;
        self.getParalelos();
      }, response => {
        console.log('Hubo un error al obtener las preguntas de la base de datos');
      });
    },
    getParalelos: function(){
      url = '/api/paralelos/profesores/mis_paralelos'
      var self = this;
      self.$http.get(url).then(response =>{
        if( response.body.estado ) {
          self.paralelos = response.body.datos;
          if ( this.profesor.tipo == 'titular' ) {
            var materia = self.paralelos[0].codigo;
            App.leccion_nueva.codigoMateria = materia
            //Filtrando para física 2
            if( materia == "FISG1002" ){
              App.paralelo_filtrado            = App.paralelos.filter(filtrarParalelo2);
              App.leccion_nueva.nombreMateria  = "Física 2";
              self.paraleloEscogido.id         = self.paralelos[0]._id;
              self.paraleloEscogido.nombre     = self.paralelos[0].nombre;
              App.leccion_nueva.nombreParalelo = self.paralelos[0].nombre;
            }
            //Filtrando para física 3
            if( materia == "FISG1003" ){
              App.paralelo_filtrado            = App.paralelos.filter(filtrarParalelo3);
              App.leccion_nueva.nombreMateria  = "Física 3";
              self.paraleloEscogido.id         = self.paralelos[0]._id;
              self.paraleloEscogido.nombre     = self.paralelos[0].nombre;
              App.leccion_nueva.nombreParalelo = self.paralelos[0].nombre;
            }
            //Filtrando para física conceptual
            if( materia == "FISG2001" ){
              App.paralelo_filtrado            = App.paralelos.filter(filtrarParaleloConceptual);
              App.leccion_nueva.nombreMateria  = "Física Conceptual";
              self.paraleloEscogido.id         = self.paralelos[0]._id;
              self.paraleloEscogido.nombre     = self.paralelos[0].nombre;
              App.leccion_nueva.nombreParalelo = self.paralelos[0].nombre;
            }

            //AQUI DEBO FILTRAR
            console.log('Materia', self.paralelos[0].codigo);
            console.log('Tipo', self.tipoEscogido);
            console.log('Preguntas obtenidas:', self.preguntas)
            self.preguntasMostrar = self.filtrarPreguntasPorMateria(self.preguntas, self.paralelos[0].codigo);
            self.preguntasMostrar = self.filtrarPreguntasPorTipoLeccion(self.preguntasMostrar, self.tipoEscogido);
            console.log('Preguntas mostrar:', self.preguntasMostrar)
            self.capitulosMostrar = self.filtrarCapitulosPorMateria(self.capitulosObtenidos, self.paralelos[0].codigo);
            self.dividirPreguntasEnCapitulos(self, self.preguntasMostrar, self.capitulosMostrar);
            //Eliminando y agregando label donde serán colocados los paralelos.
            //console.log(self.capitulosMostrar)
            //App.filtrarCapitulos(App.tipoEscogido);
          }
          //self.crearSelectParalelos();
        }
        }, response => {
          //error callback
          console.log("EEEEEERRRROOOOOOOOOOOOOR!")
        });
    },
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
      inputs = container.querySelectorAll("input[type=text]");
      for (index = 0; index < inputs.length; ++index) {
          
          inputs[index].value = this.toHTML(inputs[index].value); 

      }
    },
    crearRegistroCalificacion: function(leccionId){
      var self = this;
      var grupos = [];
      //Busco los grupos del paralelo seleccionado para la leccion
      $.each(self.paralelo_filtrado, function(index, paralelo){
        if(paralelo._id == self.paraleloEscogido.id){
          grupos = paralelo.grupos;
          return false;
        }
      });
      var url = '/api/calificaciones/'
      $.each(grupos, function(index, grupo){
        var registro = {
          leccion: leccionId,
          calificacion: 0,
          calificada: false,
          leccionTomada: false,
          grupo: grupo._id,
          paralelo: self.paraleloEscogido.id,
          nombreParalelo: self.paraleloEscogido.nombre
        }
        //registro.grupo = grupo._id;
        self.$http.post(url, registro).then(response => {
        }, response => {

        });
      });
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
    crearLeccion() {
      var crearLeccionURL = '/api/lecciones/'
      var self = this;
      self.leccion_nueva.paralelo = self.paraleloEscogido.id;
      self.leccion_nueva.tipo = self.tipoEscogido;
      this.$http.post(crearLeccionURL, self.leccion_nueva).then(response => {
      //success callback
      $('#myModal').modal('open');
      console.log(response)
      self.crearRegistroCalificacion(response.body.datos._id)
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
    dividirPreguntasEnCapitulos: function(){
      var self = this;
      $.each(self.preguntasEstimacion, function(index, pregunta){
        $.each(self.capitulos, function(j, capitulo){
          if(pregunta.capitulo.toLowerCase()==capitulo.nombre.toLowerCase()){
            capitulo.preguntas.push(pregunta);
            return false;
          }
        });
      });
    },
    dividirPreguntasEnLaboratorios: function(){
      var self = this;
      $.each(self.preguntasLaboratorio, function(index, pregunta){
        $.each(self.laboratorios, function(j, laboratorio){
          if(pregunta.laboratorio.toLowerCase()==laboratorio.nombre.toLowerCase()){
            laboratorio.preguntas.push(pregunta);
            return false;
          }
        });
      });
    },
    dividirPreguntasEnTutoriales: function(){
      var self = this;
      $.each(self.preguntasTutorial, function(index, pregunta){
        $.each(self.tutoriales, function(j, tutorial){
          if(pregunta.tutorial.toLowerCase()==tutorial.nombre.toLowerCase()){
            tutorial.preguntas.push(pregunta);
            return false;
          }
        });
      });
    },
    crearCapitulo: function(pregunta){
      var self = this;
      var nombreCapitulo = pregunta.capitulo;
      var idCapitulo = nombreCapitulo.toLowerCase();
      idCapitulo = idCapitulo.split(":")[0];
      idCapitulo - idCapitulo.replace(/\s+/g, '');
      var hrefCapitulo = '#' + idCapitulo;
      var capitulo = {
        nombre: nombreCapitulo,
        id:  idCapitulo,
        href: hrefCapitulo,
        preguntas: []
      }
      capitulo.preguntas.push(pregunta);
      self.capitulos.push(capitulo);
    },
    crearTutorial: function(tutorial){
      var self = this;
      var nombreCapitulo = tutorial.capitulo;
      var idCapitulo = nombreCapitulo.toLowerCase();
      idCapitulo = idCapitulo.split(":")[0];
      idCapitulo - idCapitulo.replace(/\s+/g, '');
      var hrefCapitulo = '#' + idCapitulo;
      var capitulo = {
        nombre: nombreCapitulo,
        id:  idCapitulo,
        href: hrefCapitulo,
        preguntas: []
      }
      capitulo.preguntas.push(tutorial);
      self.capitulos.push(capitulo);
    },
    filtrarPreguntasPorMateria: function(arrayPreguntas, codigoMateria){
      return $.grep( arrayPreguntas, function(pregunta, index){
        return pregunta.capitulo.codigoMateria === codigoMateria;
      });
    },
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
    filtrarCapitulosPorMateria: function(arrayCapitulos, codigoMateria){
      return $.grep( arrayCapitulos, function(capitulo, index){
        return capitulo.codigoMateria === codigoMateria;
      });
    },
    dividirPreguntasEnCapitulos: function(self, arrayPreguntas, arrayCapitulos){
      $.each(self.capitulosMostrar, function(index, cap){
          cap.preguntas = [];
        });
      $.each( arrayPreguntas, function(index, pregunta){
        $.each( arrayCapitulos, function(j, capitulo){
          if( pregunta.capitulo.nombre.toLowerCase() === capitulo.nombre.toLowerCase() ){
            capitulo.preguntas.push(pregunta);
            return false;
          }
        });
      });
    },
    verModal: function(descripcion, tiempo){
      /*
        Colocar Modal
      */
      $("#modalDesc .modal-content").empty();
      $("#modalDesc .modal-content").append(descripcion);
      $("#modalDesc .modal-content").append($("<hr>"));
      var tiempoDesc = $("<label>").addClass("modal-tiempo pull right").text("Tiempo estimado: " + tiempo + " minutos");
      $("#modalDesc .modal-content").append(tiempoDesc);
      $('#modalDesc').modal('open');
    },
    crearSelectParalelos: function(){
      var self = this;
      var select = $('<select>').attr({"id":"select-paralelos"});
      select.change(function(){
        self.paraleloEscogido.id = $('#select-paralelos option:selected').val();
        self.paraleloEscogido.nombre = $('#select-paralelos option:selected').text();
      })
      var optDisabled = $('<option>').val("").text("");
      select.append(optDisabled);
      $.each(self.paralelo_filtrado, function(index, paralelo){
        var option = $('<option>').val(paralelo._id).text(paralelo.nombre);
        select.append(option);
      });
      $('#div-select').append(select);
      $('#select-paralelos').material_select();
    },
    filtrarCapitulos: function (opcion){
      let self = this;
      self.preguntasMostrar = self.filtrarPreguntasPorMateria(self.preguntas, self.paralelos[0].codigo);
      self.preguntasMostrar = self.filtrarPreguntasPorTipoLeccion(self.preguntasMostrar, self.tipoEscogido);
      self.capitulosMostrar = self.filtrarCapitulosPorMateria(self.capitulosObtenidos, self.paralelos[0].codigo);
      self.dividirPreguntasEnCapitulos(self, self.preguntasMostrar, self.capitulosMostrar);
      //Eliminando y agregando label donde serán colocados los paralelos.
      console.log(self.capitulosMostrar)
      //uncheck all checked checkbox, la función sirve... pero hay otros errores por arreglar.
      //unCheckPreguntas();
    }
  },
  data: {
    capitulosMostrar: [],
    capitulosObtenidos: [],
    capitulos: [],
    tutoriales: [],
    laboratorios: [],
    preguntasEstimacion: [],
    preguntasTutorial: [],
    preguntasLaboratorio: [],
    capitulosAMostrar: [],
    leccion_nueva: {
      nombre: '',
      tiempoEstimado: '',
      tipo: '',
      fechaInicio: moment().add(1, 'day').format('YYYY-MM-DD'),
      preguntas: [
      ],
      puntaje: 0,
      paralelo: '',
      nombreParalelo: '',
      nombreMateria: '',
      codigoMateria: ''
    },
    paralelos: [],
    paralelo_filtrado: [],
    preguntas: [],
    pregunta_tutorial: [],
    preguntas_escogidas: {
      preguntas: [],
      tiempoTotal: 0
    },
    paraleloEscogido: {
      nombre: '',
      id: ''
    },
    tipoEscogido: 'estimacion|laboratorio',
    DOMupdated: false,
    CollapsibleOpen: false,
    profesor: ''
  },
})



function preguntaSeleccionada(_element) {
  var existe = App.leccion_nueva.preguntas.some(pregunta => _element.id == pregunta.pregunta)
  if (!existe) {
    let tamano = App.leccion_nueva.preguntas.length + 1
    App.leccion_nueva.preguntas.push({pregunta: _element.id, ordenPregunta: tamano})
  } else {
    App.leccion_nueva.preguntas = App.leccion_nueva.preguntas.filter(pregunta => _element.id != pregunta.pregunta)
  }

  //Esta variable me dará toda la información de las preguntas escogidas, esta información se guardará en preguntas_escogidas del data.
  var selected = App.preguntas.filter(filtrarPreguntas);
  //Por ahora, preguntas_escogidas tendrá TODA la información en cuanto a las preguntas escogidas, también habrá un total de tiempos para feedback del usuario.
  App.preguntas_escogidas.preguntas = selected;

  App.preguntas_escogidas.tiempoTotal = sumatoria(selected, "tiempo");
  App.leccion_nueva.tiempoEstimado = App.preguntas_escogidas.tiempoTotal;

  App.leccion_nueva.puntaje = sumatoria(selected, "calificacion");
  ordenPreguntas(App.leccion_nueva.preguntas);
}

//Funcion 'Compare' para el uso de filter
function filtrarPreguntas(elemento){
  for(var x = 0; x < App.leccion_nueva.preguntas.length; x++){
      if(elemento._id == App.leccion_nueva.preguntas[x].pregunta)
        return true;
      }
  return false;
}
//Función que suma los tiempos... ;D
//Recibe un objeto de tipo object[M].Int, retorna un entero.
function sumatoria(objeto_preguntas, str_elemento){
  var acumulador = 0;
  if(str_elemento == "tiempo"){
    for (var x = 0; x < objeto_preguntas.length; x++){
      acumulador = acumulador + parseInt(objeto_preguntas[x].tiempoEstimado);
    }
  }
  if(str_elemento == "calificacion"){
    for (var x = 0; x < objeto_preguntas.length; x++){
      acumulador = acumulador + parseInt(objeto_preguntas[x].puntaje);
    }
  }
  return acumulador;
}
//Esta función devuelve null, pero llena el campo de orden de preguntas
//de acuerdo a como han sido grabadas sus ID
function ordenPreguntas(preguntas){
  App.leccion_nueva.preguntas.ordenPregunta = [];
  for(var x = 0; x < preguntas.length; x++){
    App.leccion_nueva.preguntas.ordenPregunta.push(x);
  }
}

$('#div-select').change(function(){
  App.leccion_nueva.paralelo = $('#select-paralelos option:selected').val();
  App.leccion_nueva.nombreParalelo = $('#select-paralelos option:selected').text();
});

$('#select-tipo-leccion').change(function(){
  filtrarCapitulos();
});

$('#seleccionado1').change(function(){
  App.filtrarCapitulos('estimacion|laboratorio');
});

$('#seleccionado2').change(function(){
  App.filtrarCapitulos('tutorial');
});

$("#subject").change(function(){
  var materia = $(this).val();
  App.leccion_nueva.codigoMateria = materia
  //Filtrando para física 2
  if(materia == "FISG1002"){
   App.paralelo_filtrado = App.paralelos.filter(filtrarParalelo2);
   App.leccion_nueva.nombreMateria = "Física 2"
  }
  //Filtrando para física 3
  if(materia == "FISG1003"){
   App.paralelo_filtrado = App.paralelos.filter(filtrarParalelo3);
   App.leccion_nueva.nombreMateria = "Física 3"
  }
  //Eliminando y agregando label donde serán colocados los paralelos.
  $("#div-select").empty();
  var label = $("<label>").addClass("active").text("Paralelo:");
  $("#div-select").append(label);
  App.crearSelectParalelos();
  App.filtrarCapitulos(App.tipoEscogido);

});

function unCheckPreguntas(){
  App.preguntas_escogidas.preguntas = [];
  $('input:checkbox').prop('checked',false);
}
function filtrarParalelo2(paralelos){
  return paralelos.codigo == "FISG1002";
}
function filtrarParalelo3(paralelos){
  return paralelos.codigo == "FISG1003";
}
function filtrarParaleloConceptual(paralelos){
  return paralelos.codigo == "FISG2001";
}

function filtrarCapitulo2(capitulo){
  return capitulo.codigoMateria == "FISG1002";
}
function filtrarCapitulo3(capitulo){
  return capitulo.codigoMateria == "FISG1003";
}
// App.obtenerUsuario()


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
})
