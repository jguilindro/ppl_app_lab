var App = new Vue({
  mounted: function(){
    //Materialize initializers
    $('.button-collapse').sideNav();
    $(".dropdown-button").dropdown({ hover: false });
    $('.scrollspy').scrollSpy();
    $('#modalEliminarPregunta').modal();
    $('#modalNuevoCapitulo').modal();
    $('select').material_select();
    $('.modal').modal();
    //Flujo
    //this.getPreguntas();
    this.getParalelos();
    this.obtenerCapitulos();
  },
  el: '#app',
  data: {
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
      fechaInicio: '',
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
    tipoEscogido: ''
  },
  methods: {
    prueba: function(){
    },
    crearLeccion() {
      var crearLeccionURL = '/api/lecciones/'
      var self = this;
      self.leccion_nueva.paralelo = self.paraleloEscogido.id;
      self.leccion_nueva.tipo = self.tipoEscogido;
      this.$http.post(crearLeccionURL, self.leccion_nueva).then(response => {
        //success callback
        $('#myModal').modal('open');
        }, response => {
        //error callback
        console.log(response)
      });
    },
    obtenerCapitulos: function(){
      var self = this;
      var url = '/api/capitulos/'
      self.$http.get(url).then(response => {
        //SUCCESS CALLBACK
        self.capitulosObtenidos = response.body.datos;
        //Separo por estimacion|tutorial|laboratorio
        $.each(self.capitulosObtenidos, function(index, capitulo){
          if(capitulo.tipo.toLowerCase()=='estimacion'){
            self.capitulos.push(capitulo);
          }else if(capitulo.tipo.toLowerCase()=='tutorial'){
            self.tutoriales.push(capitulo);
          }else if(capitulo.tipo.toLowerCase()=='laboratorio'){
            self.laboratorios.push(capitulo);
          }
        });
        self.obtenerPreguntas();
      }, response => {
        //ERROR CALLBACK
        console.log('Hubo un error al obtener los capítulos de la base de datos.');
        console.log(response);
      })
    },
    obtenerPreguntas: function(){
      var self = this;
      var url = '/api/preguntas/';
      self.$http.get(url).then(response => {
        //SUCCESS CALLBACK
        self.preguntas = response.body.datos;
        //Divido las preguntas por tipo
        $.each(self.preguntas, function(index, pregunta){
          if(pregunta.tipoLeccion.toLowerCase()=='estimacion'){
            self.preguntasEstimacion.push(pregunta);
          }else if(pregunta.tipoLeccion.toLowerCase()=='tutorial'){
            self.preguntasTutorial.push(pregunta);
          }else if(pregunta.tipoLeccion.toLowerCase()=='laboratorio'){
            self.preguntasLaboratorio.push(pregunta);
          }
        });
        self.dividirPreguntasEnCapitulos();
        self.dividirPreguntasEnLaboratorios();
        self.dividirPreguntasEnTutoriales();
        $.each(self.capitulos, function(index, capitulo){
          capitulo.preguntas.sort(function(a, b){
             return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          });
        });
        $.each(self.tutoriales, function(index, capitulo){
          capitulo.preguntas.sort(function(a, b){
             return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          });
        });
        $.each(self.laboratorios, function(index, capitulo){
          capitulo.preguntas.sort(function(a, b){
             return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          });
        });

      }, response => {
        //ERROR CALLBACK
        console.log('Hubo un error al obtener las preguntas de la base de datos');
      });
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
    },/*
    getPreguntas: function(){
      var self = this;
      var encontroCapitulo = false;
      this.$http.get('/api/preguntas').then(response => {
        //success callback
        self.preguntas = response.body.datos
        $.each(self.preguntas, function(index, pregunta){
          pregunta['show'] = true;
          if (pregunta.tipoLeccion.toLowerCase()=='estimacion') {
            $.each(self.capitulos, function(index, capitulo){
              if (capitulo.nombre.toLowerCase()==pregunta.capitulo.toLowerCase()) {
                capitulo.preguntas.push(pregunta);
                encontroCapitulo = true;
                return false;
              }else{
                encontroCapitulo=false;
              }
            });
            if (!encontroCapitulo) {
              console.log(pregunta);
              self.crearCapitulo(pregunta)
            }
          }
          /*
           if (pregunta.tipoLeccion.toLowerCase()=='tutorial') {
            $.each(self.capitulos, function(index, capitulo){
              if (capitulo.nombre.toLowerCase()==pregunta.tutorial.toLowerCase()) {
                capitulo.preguntas.push(pregunta);
                encontroCapitulo = true;
                return false;
              }else{
                encontroCapitulo=false;
              }
            });
            if (!encontroCapitulo) {
              console.log(pregunta);
              self.crearCapitulo(pregunta)
            }
          } 
          
        })
      }, response => {
        //error callback
        console.log(response)
      })
    },*/
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
    getParalelos: function(){
      url = '/api/paralelos/profesores/mis_paralelos'
      var self = this;
      self.$http.get(url).then(response =>{
        //successfull callback
        if(response.body.estado) {
          self.paralelos = response.body.datos
          //self.crearSelectParalelos();
        }
        }, response => {
          //error callback
          console.log("EEEEEERRRROOOOOOOOOOOOOR!")
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
    }
  }
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
// document.getElementById('datePicker').valueAsDate = new Date();
// document.getElementById('datePicker').setAttribute('min', "2017-04-09")
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

$('#div-select').change(function(){ 
  App.leccion_nueva.paralelo = $('#select-paralelos option:selected').val();
  App.leccion_nueva.nombreParalelo = $('#select-paralelos option:selected').text();
});

$('#select-tipo-leccion').change(function(){
  filtrarCapitulos();
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

  filtrarCapitulos();
});

function filtrarCapitulos(){
  App.$data.tipoEscogido = $('#select-tipo-leccion option:selected').val();
  App.$data.leccion_nueva.tipo = App.$data.tipoEscogido;
  //Sección de filtrar las preguntas por capítulos.
  var materia = $("#subject").val()
  if($('#select-tipo-leccion option:selected').val()=='estimacion|laboratorio'){
    App.$data.capitulosAMostrar = [];
    App.$data.capitulosAMostrar = App.$data.capitulos.concat(App.$data.laboratorios);
  }else if($('#select-tipo-leccion option:selected').val()=='tutorial'){
    App.$data.capitulosAMostrar = [];
    App.$data.capitulosAMostrar = App.$data.tutoriales;
  }

  if(materia == "FISG1002"){
    App.capitulosAMostrar = App.capitulosAMostrar.filter(filtrarCapitulo2);
  }
  if(materia == "FISG1003"){
    App.capitulosAMostrar = App.capitulosAMostrar.filter(filtrarCapitulo3);
  }

  //uncheck all checked checkbox, la función sirve... pero hay otros errores por arreglar.
  //unCheckPreguntas();
}

function unCheckPreguntas(){
  App.preguntas_escogidas.preguntas = [];
  $('input:checkbox').prop('checked',false);
}
function filtrarParalelo2(paralelos){
  return paralelos.codigo == "FISG1002"
}
function filtrarParalelo3(paralelos){
  return paralelos.codigo == "FISG1003"
}

function filtrarCapitulo2(capitulo){
  return capitulo.codigoMateria == "FISG1002";
}
function filtrarCapitulo3(capitulo){
  return capitulo.codigoMateria == "FISG1003";
}