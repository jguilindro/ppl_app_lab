var App = new Vue({
  mounted: function(){
    $('.button-collapse').sideNav();
    $(".dropdown-button").dropdown({ hover: false });
    $('.scrollspy').scrollSpy();
    $('#modalEliminarPregunta').modal();
    $('#modalNuevoCapitulo').modal();
	this.getLeccion();
    this.getPreguntas();

  },
  el: '#app',
  data: {
    leccion: {
      nombre: '',
      tiempoEstimado: '',
      tipo: '',
      fechaInicio: '',
      preguntas: [],
      puntaje: 0
    },
    preguntas: [],
    capitulos: [],
    preguntas_escogidas: {
      preguntas: [],
      tiempoTotal: 0
    }
  },
  methods: {
    modificarLeccion() {
      var modificarLeccionURL = '/api/lecciones/'+id
      this.$http.put(modificarLeccionURL, this.leccion)
        .then(res => {
          console.log(res.body)
        })
    },
	getLeccion: function(){
	var preguntaId = window.location.href.toString().split('/')[6];
	var modificarLeccionURL = '/api/lecciones/'+ preguntaId;
      this.$http.get(modificarLeccionURL, this.leccion)
        .then(res => {
          console.log(res.body);
		   var leccion2= res.body.datos;
		   App.leccion.nombre= leccion2.nombre;
		   App.leccion.puntaje= leccion2.puntaje;
		   App.leccion.fechaInicio= leccion2.fechaInicioTomada.substr(0,10);
		  //console.log(leccion.fechaInicio);
        })
	}
	,
    getPreguntas: function(){
      /*
        Esta función hará lo siguiente:
          Hará una llamada a la api de preguntas
          Obtendrá todas las preguntas de la base de datos
          Escogerá solamente las que son de Estimación
          Las dividirá por capítulos para poder mostrarlas al usuario
      */
      var c = 0;
      var self = this;
      var flag = false;
      console.log('Inicialmente self.capitulos: ')
      console.log(self.capitulos)
      //Llamada a la api       
      this.$http.get('/api/preguntas').then(response => {
        //success callback        
        self.preguntas = response.body.datos;   //Se almacenarán temporalmente todas las preguntas de la base de datos
        $.each(self.preguntas, function(index, pregunta){
          pregunta['show'] = true;
          if (pregunta.tipoLeccion.toLowerCase()=='estimacion') {
            //Si la pregunta es de estimacion entonces se tiene que almacenar para mostrarla al usuario
            c++
            console.log('Pregunta #' + c);
            console.log(pregunta.nombre);
            console.log(pregunta.capitulo);
            $.each(self.capitulos, function(index, capitulo){
              //Recorre el array de capitulos del script. Si encuentra el capitulo al que pertenece la pregunta, lo añade.
              console.log('Se recorre self.capitulos para ver si pertenece a alguno')
              console.log('Revisando el capitulo: ' + capitulo.nombre)
              if (capitulo.nombre.toLowerCase()==pregunta.capitulo.toLowerCase()) {
                console.log('Encontró el capítulo dentro de self.capitulos. Se añadirá la pregunta...')
                capitulo.preguntas.push(pregunta);
                flag = true;  //Cambia la bandera indicando que encontro el capitulo
                
                return;
              }else{
                flag=false;
              }
            });
            //Si no encontro el capitulo, la bandera sigue en falso indicando que el capitulo no existe. Entonces se crea el capitulo y se agrega la pregunta
            if (!flag) {
              console.log('No se encontro el capitulo en self.capitulos... Se procede a crearlo')
              self.crearCapitulo(pregunta)
            }
          }

        })
        console.log("Finalmente self.capitulos: ")
        console.log(self.capitulos)
      }, response => {
        //error callback
        console.log(response)
      })
    },
    crearCapitulo: function(pregunta){
      var self = this;
      //console.log(pregunta)
      /*
        Esta funcion se va a utilizar cuando al momento de hacer el requerimiento a /api/preguntas obtengamos todas las preguntas
        Se revisará a cada pregunta el capítulo al que pertenece
        Si pertenece a un capítulo que ya se encuentra en self.capitulos entonces no entrará a esta función
        Si no pertenece a un capítulo que ya se encuentra en self.capitulos entones hay que crear ese capítulo y añadirlo al array self.capitulos
        Luego se añadirá la pregunta al capítulo ya creado
        Formato de capitulo:
        capitulo = {
          nombre: 'Capítulo 1: Electrodinámica',
          id: 'capitulo1'.
          href: '#capitulo1',
          preguntas: []
        }
      */
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
  }
})
function preguntaSeleccionada(_element) {
  var existe = App.leccion.preguntas.some(pregunta => _element.id == pregunta)
  if (!existe) {
    App.leccion.preguntas.push(_element.id)
  } else {
    App.leccion.preguntas = App.leccion.preguntas.filter(pregunta => _element.id != pregunta)
  }
  //Esta variable me dará toda la información de las preguntas escogidas, esta información se guardará en preguntas_escogidas del data.
  var selected = App.preguntas.filter(filtrarPreguntas);
  App.preguntas_escogidas.preguntas = selected;
  App.preguntas_escogidas.tiempoTotal = sumarTiempos(selected);
  /*
  url = '/api/preguntas/' + _element.id;
        $.get(url, function(data){
          console.log(data);
      });
  */
}
function filtrarPreguntas(elemento){
  for(var x = 0; x < App.leccion.preguntas.length; x++){
      if(elemento._id == App.leccion.preguntas[x])
        return true;
      }
  return false;
}
function sumarTiempos(objeto_preguntas){
  var acumulador = 0;
  for (var x = 0; x < objeto_preguntas.length; x++){
      acumulador = acumulador + parseInt(objeto_preguntas[x].tiempoEstimado);
  }
  return acumulador;
}
// document.getElementById('datePicker').valueAsDate = new Date();
// document.getElementById('datePicker').setAttribute('min', "2017-04-09")
