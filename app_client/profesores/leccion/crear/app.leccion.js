var App = new Vue({
  mounted: function(){
    $('.button-collapse').sideNav();
    $(".dropdown-button").dropdown({ hover: false });
    $('.scrollspy').scrollSpy();
    $('#modalEliminarPregunta').modal();
    $('#modalNuevoCapitulo').modal();
    this.getPreguntas();
    this.getParalelos();
    $('select').material_select();
  },
  el: '#app',
  data: {
    leccion_nueva: {
      nombre: '',
      tiempoEstimado: '',
      tipo: '',
      fechaInicio: '',
      preguntas: [
      ],
      puntaje: 0,
      paralelo: ''
    },
    paralelos: [],
    preguntas: [],
    capitulos: [],
    tutoriales: [],
    pregunta_tutorial: [],
    preguntas_escogidas: {
      preguntas: [],
      tiempoTotal: 0
    },
    paraleloEscogido: {
      nombre: '',
      id: ''
    }
  },
  methods: {
    prueba: function(){
      console.log($('#select-paralelos option:selected').val())
    },
    crearLeccion() {
      var crearLeccionURL = '/api/lecciones/'
      var self = this;
      self.leccion_nueva.paralelo = self.paraleloEscogido.id
      this.$http.post(crearLeccionURL, self.leccion_nueva).then(response => {
        //success callback
        alert("Su lección ha sido creada con éxito!");
        window.location.href = '/profesores/leccion/';
        console.log(response)
        }, response => {
        //error callback
        console.log(response)
      });
    },
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
          */
        })
      }, response => {
        //error callback
        console.log(response)
      })
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
    getParalelos: function(){
      url = '/api/paralelos/profesores/mis_paralelos'
      var self = this;
      self.$http.get(url).then(response =>{
        //successfull callback
        if(response.body.estado) {
          self.paralelos = response.body.datos
          console.log(self.paralelos);
          self.crearSelectParalelos();
        }
        /*
          for (var x = 0; x < response.body.datos.length; x++){
            self.paralelos.push(response.body.datos[x].nombre);
          }
        */
        }, response => {
          //error callback
          console.log("EEEEEERRRROOOOOOOOOOOOOR!")
        });
    },
    crearSelectParalelos: function(){
      var self = this;
      var select = $('<select>').attr({"id":"select-paralelos"});
      select.change(function(){
        console.log('holaaa');
        self.paraleloEscogido.id = $('#select-paralelos option:selected').val();
        self.paraleloEscogido.nombre = $('#select-paralelos option:selected').text();
        console.log(self.paraleloEscogido)
      })
      var optDisabled = $('<option>').val("").text("");
      select.append(optDisabled);
      $.each(self.paralelos, function(index, paralelo){
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
      console.log(acumulador)
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

$('#select-paralelos').change(function(){ 
  console.log('holaaa')
  console.log($('#select-paralelos option:selected').val())
  console.log($('#select-paralelos option:selected').text())
  //pregunta.$data.preguntaEditar.tipoPregunta = $('#select-editar-tipo-pregunta option:selected').val();
  //console.log(pregunta.$data.preguntaEditar.tipoPregunta)
  //console.log($('#select-editar-tipo-pregunta option:selected').text())
  //console.log(pregunta.$data.preguntaEditar)
});