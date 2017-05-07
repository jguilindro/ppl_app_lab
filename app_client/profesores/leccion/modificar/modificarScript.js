var appModificarLeccion = new Vue({
  el: '#appModificarLeccion',
  mounted: function(){
    $('select').material_select();
    $('.button-collapse').sideNav();
    $(".dropdown-button").dropdown({ hover: false });
    $('.scrollspy').scrollSpy();
    this.obtenerLeccion();
    this.obtenerParalelos();
    this.obtenerCapitulos();
  },
  methods: {
    obtenerLeccion: function(){
      var self = this;
      var pathname = window.location.pathname;
      var idLeccion = pathname.split('/')[4];
      var url = '/api/lecciones/' + idLeccion;
      self.$http.get(url).then(response => {
        if(response.body.datos!=null){
          self.leccion = response.body.datos;
          //self.leccion.codigoMateria = 'FISG1003' //CAMBIAR ESTO
          self.crearSelectMateria();
          self.crearSelectTipoLeccion();
          self.llenarPreguntasSeleccionadas();
        }
      }, response => {
      console.log(response)
      });
    },
    mostrarSeccionDePreguntas: function(){
      var self = this;
      self.capitulosAMostrar = [];
      if(self.leccion.tipo=='estimacion|laboratorio'){
        self.capitulosAMostrar = [];
        self.capitulosAMostrar = self.capitulos.concat(self.laboratorios);
        self.capitulosAMostrar = $.grep(self.capitulosAMostrar, function(capitulo, i){
          return capitulo.codigoMateria === self.leccion.codigoMateria;
        });
      }else if(self.leccion.tipo=='tutorial'){
        self.capitulosAMostrar = [];
        self.capitulosAMostrar = self.tutoriales;
        self.capitulosAMostrar = $.grep(self.capitulosAMostrar, function(capitulo, i){
          return capitulo.codigoMateria === self.leccion.codigoMateria;
        });
      }
    },
    crearSelectMateria: function(){
      var self = this;
      var select = $('#select-materia');
      select.val(self.leccion.codigoMateria);
      select.change(function(){
        self.leccion.nombreMateria = $('#select-materia option:selected').text();
        self.leccion.codigoMateria = $('#select-materia option:selected').val();        
      });
      select.material_select();
    },
    crearSelectTipoLeccion: function(){
      var self = this;
      var select = $('#select-tipo-leccion');
      select.val(self.leccion.tipo);
      select.change(function(){
        self.leccion.tipo = $('#select-tipo-leccion option:selected').val();
      });
      select.material_select();
    },
    obtenerParalelos: function(){
      var self = this;
      var url = '/api/paralelos/profesores/mis_paralelos';
      self.$http.get(url).then(response => {
        if(response.body.estado){
          self.paralelos = response.body.datos;
          self.crearSelectParalelo();
        }
      }, response => {
        console.log(response);
      })
    },
    crearSelectParalelo: function(){
      var self = this;
      var select = $('#select-paralelo');
      var optDisabled = $('<option>').val("").text("");
      select.append(optDisabled);
      $.each(self.paralelos, function(index, paralelo){
        var option = $('<option>').val(paralelo._id).text(paralelo.nombre);
        select.append(option) 
      });
      select.val(self.leccion.paralelo);
      select.change(function(){
        self.leccion.nombreParalelo = $('#select-paralelo option:selected').text();
        self.leccion.paralelo = $('#select-paralelo option:Selected').val();
      });
      select.material_select();
    },
    obtenerCapitulos: function(){
      var self = this;
      var url = '/api/capitulos/';
      self.$http.get(url).then(response => {
        //Los divido por capitulo/tutorial/laboratorio
        $.each(response.body.datos, function(index, capitulo){
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
        console.log(response)
      });
    },
    obtenerPreguntas: function(){
      var self = this;
      var url = '/api/preguntas';
      self.$http.get(url).then(response => {
        self.preguntas = response.body.datos;
        //Las divido por su tipo
        $.each(self.preguntas, function(index, pregunta){
          if(pregunta.tipoLeccion.toLowerCase()=='estimacion'){
            self.preguntasEstimacion.push(pregunta);
          }else if(pregunta.tipoLeccion.toLowerCase()=='laboratorio'){
            self.preguntasLaboratorio.push(pregunta);
          }else if(pregunta.tipoLeccion.toLowerCase()=='tutorial'){
            self.preguntasTutorial.push(pregunta);
          }
        });
        self.dividirPreguntas(self.preguntasEstimacion, self.capitulos, 'estimacion');
        self.dividirPreguntas(self.preguntasTutorial, self.tutoriales, 'tutorial');
        self.dividirPreguntas(self.preguntasLaboratorio, self.laboratorios, 'laboratorio');
        self.buscarPreguntasPorId();
      });
    },
    dividirPreguntas: function(arrayPreguntas, arrayCapitulos, tipo){
      var self = this;
      $.each(arrayPreguntas, function(index, pregunta){
        $.each(arrayCapitulos, function(j, capitulo){
          if(tipo==='estimacion'&&pregunta.capitulo.toLowerCase()==capitulo.nombre.toLowerCase()){
            capitulo.preguntas.push(pregunta);
            return false;
          }else if(tipo==='tutorial'&&pregunta.tutorial.toLowerCase()==capitulo.nombre.toLowerCase()){
            capitulo.preguntas.push(pregunta);
            return false;
          }else if(tipo==='laboratorio'&&pregunta.laboratorio.toLowerCase()==capitulo.nombre.toLowerCase()){
            capitulo.preguntas.push(pregunta);
            return false;
          }
        });
      });
      //Ordenar preguntas por fecha de creacion
      $.each(arrayCapitulos, function(index, capitulo){
        capitulo.preguntas.sort(function(a, b){
           return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });
      });
      self.mostrarSeccionDePreguntas();
    },
    llenarPreguntasSeleccionadas: function(){
      //Esta funcion vincula los checkboxes con las preguntas que tiene la leccion originalmente.
      //Recorre el array de preguntas de la leccion y las añade a preguntasSeleccionadas, el array que está vinculado con los checkboxes
      var self = this;
      $.each(self.leccion.preguntas, function(index, pregunta){
        self.preguntasSeleccionadas.push(pregunta.pregunta);
      });
    },
    buscarPreguntasPorId: function(idPregunta){
      //Esta función se activa cada vez que se selecciona un checkbox.
      /*
        Lo que hace es:
          1. Busca todas las preguntas marcadas en los checkboxes. Esto lo busca en el array preguntasSeleciconadas
          2. Busca la información completa de cada pregunta. Esto lo hace en el array preguntas
          3. Finalmente, añade cada pregunta con su información completa en el array auxPreguntasSeleccionadas. Para mostrar en Repaso.
      */
      var self = this;
      var tiempo = 0;
      puntaje = 0;
      self.auxPreguntasSeleccionadas = [];
      $.each(self.preguntasSeleccionadas, function(index, ps){
        $.each(self.preguntas, function(j, p){
          if(ps===p._id){
            self.auxPreguntasSeleccionadas.push(p);
            tiempo+=parseInt(p.tiempoEstimado);
            puntaje+=parseInt(p.puntaje);
          }
        })
      });
      self.leccion.tiempoEstimado = tiempo;
      self.leccion.puntaje = puntaje;
    },
    prueba: function(){
      console.log(this.leccion)
      //console.log(this.preguntasSeleccionadas)
      //console.log(this.auxPreguntasSeleccionadas)
    },
    editarLeccion: function(){
      var self = this;
      var url = '/api/lecciones/' + self.leccion._id;
      self.leccion.preguntas = []
      var contador = 1;
      $.each(self.preguntasSeleccionadas, function(index, ps){
        var pregunta = {
          pregunta: '',
          ordenPregunta: ''
        }
        pregunta.pregunta = ps;
        pregunta.ordenPregunta = contador;
        self.leccion.preguntas.push(pregunta)
        contador++;
      });
      self.$http.put(url, self.leccion).then(response => {
        console.log('yaaaaa')
        console.log(response)
      }, response => {

      });
      console.log(self.leccion)
      console.log(self.preguntasSeleccionadas)
    }

  },
  data: {
    leccion: {},
    paralelos: [],
    profesor: {},
    capitulos: [],
    laboratorios: [],
    tutoriales: [],
    preguntas: [],
    preguntasEstimacion: [],
    preguntasLaboratorio: [],
    preguntasTutorial: [],
    capitulosAMostrar: [],
    preguntasSeleccionadas: [],
    auxPreguntasSeleccionadas: [],
  }
});
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

$('#select-tipo-leccion').change(function(){
  appModificarLeccion.capitulosAMostrar = [];
  var opcionSeleccionada = $('#select-tipo-leccion option:selected').val();
  console.log('Opcion seleccionada: ' + $('#select-tipo-leccion option:selected').val());
  var materiaSeleccionada = $('#select-materia option:selected').val()
  console.log('Materia seleccionada: ' + materiaSeleccionada);
  if(opcionSeleccionada==='estimacion|laboratorio'&&materiaSeleccionada==='FISG1002'){
    appModificarLeccion.capitulosAMostrar = [];
    appModificarLeccion.capitulosAMostrar = appModificarLeccion.capitulos.concat(appModificarLeccion.laboratorios)
    appModificarLeccion.capitulosAMostrar = $.grep(appModificarLeccion.capitulosAMostrar, function(capitulo, i){
      return capitulo.codigoMateria === 'FISG1002'
    });
    appModificarLeccion.leccion.tipo = opcionSeleccionada;
    appModificarLeccion.leccion.codigoMateria = 'FISG1002';
    appModificarLeccion.leccion.nombreMateria = 'Física 2'
    console.log(appModificarLeccion.capitulosAMostrar)
  }else if(opcionSeleccionada==='estimacion|laboratorio'&&materiaSeleccionada==='FISG1003'){
    appModificarLeccion.capitulosAMostrar = [];
    appModificarLeccion.capitulosAMostrar = appModificarLeccion.capitulos.concat(appModificarLeccion.laboratorios)
    appModificarLeccion.capitulosAMostrar = $.grep(appModificarLeccion.capitulosAMostrar, function(capitulo, i){
      return capitulo.codigoMateria === 'FISG1003'
    });
    appModificarLeccion.leccion.tipo = opcionSeleccionada;
    appModificarLeccion.leccion.codigoMateria = 'FISG1003';
    appModificarLeccion.leccion.nombreMateria = 'Física 3'
    console.log(appModificarLeccion.capitulosAMostrar)
  }else if(opcionSeleccionada==='tutorial' && materiaSeleccionada === 'FISG1002'){
    appModificarLeccion.capitulosAMostrar = [];
    appModificarLeccion.capitulosAMostrar = appModificarLeccion.tutoriales;
    appModificarLeccion.capitulosAMostrar = $.grep(appModificarLeccion.capitulosAMostrar, function(capitulo, i){
      return capitulo.codigoMateria === 'FISG1002'
    });
    appModificarLeccion.leccion.tipo = opcionSeleccionada;
    appModificarLeccion.leccion.codigoMateria = 'FISG1002';
    appModificarLeccion.leccion.nombreMateria = 'Física 2'
    console.log(appModificarLeccion.capitulosAMostrar)
  }else if(opcionSeleccionada==='tutorial' && materiaSeleccionada === 'FISG1003'){
    appModificarLeccion.capitulosAMostrar = [];
    appModificarLeccion.capitulosAMostrar = appModificarLeccion.tutoriales;
    appModificarLeccion.capitulosAMostrar = $.grep(appModificarLeccion.capitulosAMostrar, function(capitulo, i){
      return capitulo.codigoMateria === 'FISG1003'
    });
    appModificarLeccion.leccion.tipo = opcionSeleccionada;
    appModificarLeccion.leccion.codigoMateria = 'FISG1003';
    appModificarLeccion.leccion.nombreMateria = 'Física 3'
    console.log(appModificarLeccion.capitulosAMostrar)
  }
});

$('#select-materia').change(function(){
  appModificarLeccion.capitulosAMostrar = [];
  var opcionSeleccionada = $('#select-tipo-leccion option:selected').val();
  console.log('Opcion seleccionada: ' + $('#select-tipo-leccion option:selected').val());
  var materiaSeleccionada = $('#select-materia option:selected').val()
  console.log('Materia seleccionada: ' + materiaSeleccionada);
  if(opcionSeleccionada==='estimacion|laboratorio'&&materiaSeleccionada==='FISG1002'){
    appModificarLeccion.capitulosAMostrar = [];
    appModificarLeccion.capitulosAMostrar = appModificarLeccion.capitulos.concat(appModificarLeccion.laboratorios)
    appModificarLeccion.capitulosAMostrar = $.grep(appModificarLeccion.capitulosAMostrar, function(capitulo, i){
      return capitulo.codigoMateria === 'FISG1002'
    })
    console.log(appModificarLeccion.capitulosAMostrar)
  }else if(opcionSeleccionada==='estimacion|laboratorio'&&materiaSeleccionada==='FISG1003'){
    appModificarLeccion.capitulosAMostrar = [];
    appModificarLeccion.capitulosAMostrar = appModificarLeccion.capitulos.concat(appModificarLeccion.laboratorios)
    appModificarLeccion.capitulosAMostrar = $.grep(appModificarLeccion.capitulosAMostrar, function(capitulo, i){
      return capitulo.codigoMateria === 'FISG1003'
    })
    console.log(appModificarLeccion.capitulosAMostrar)
  }else if(opcionSeleccionada==='tutorial' && materiaSeleccionada === 'FISG1002'){
    appModificarLeccion.capitulosAMostrar = [];
    appModificarLeccion.capitulosAMostrar = appModificarLeccion.tutoriales;
    appModificarLeccion.capitulosAMostrar = $.grep(appModificarLeccion.capitulosAMostrar, function(capitulo, i){
      return capitulo.codigoMateria === 'FISG1002'
    })
    console.log(appModificarLeccion.capitulosAMostrar)
  }else if(opcionSeleccionada==='tutorial' && materiaSeleccionada === 'FISG1003'){
    appModificarLeccion.capitulosAMostrar = [];
    appModificarLeccion.capitulosAMostrar = appModificarLeccion.tutoriales;
    appModificarLeccion.capitulosAMostrar = $.grep(appModificarLeccion.capitulosAMostrar, function(capitulo, i){
      return capitulo.codigoMateria === 'FISG1003'
    })
    console.log(appModificarLeccion.capitulosAMostrar)
  }
});

