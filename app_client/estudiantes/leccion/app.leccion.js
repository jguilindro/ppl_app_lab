var socket = io('/tomando_leccion', {
  'reconnect': true,
  'forceNew': true
});

let App = new Vue({
  created: function(){
    this.obtenerDatosLeccion();
  },
  mounted: function(){
    this.inicializarMaterialize();
  },
  el: '#app',
  data: {
    tiempo    : '',   //Tiempo restante de la lección
    leccion   : {},   //JSON de la lección
    preguntas : [],   //Array de preguntas de la lección
    estudiante: {},   //JSON con la info del estudiante conectado
    respuesta : {
      respuesta     : '',
      feedback      : '',
      calificacion  : 0,
      fechaRespuesta: '',
      grupo         : '',
      pregunta      : '',
      leccion       : '',
      imagenes      : ''  //JSON de respuesta
    },
    respuestas: [],   //Array de respuestas que el estudiante ya ha enviado a la base
    corregirHabilitado: false,
  },
  methods: {
    //////////////////////////////////////////////////////
    //MODIFICACIONES AL DOM
    //////////////////////////////////////////////////////
    inicializarMaterialize: function(){
      $('ul.tabs').tabs();
      $('.modal').modal();
      $('.tooltipped').tooltip({delay: 50});
    },
    /*
      Asigna los valores obtenidos de la base de datos al objeto Vue que controla el DOM
    */
    asignarValoresObtenidos: function(res){
      App.estudiante          = res.datos.estudiante;
      App.idLeccion           = res.datos.estudiante.leccion;
      App.leccion             = res.datos.leccion;
      App.estudiante.grupo    = res.datos.grupo._id;
      App.grupo               = res.datos.grupo;
      App.estudiante.paralelo = res.datos.paralelo._id;
      App.respuestas          = res.datos.respuestas;
      App.preguntas           = res.datos.preguntas
    },
    /*
      Los tabs al crearse están bloqueados.
      Esta función desbloquea los tabs de acuerdo al tipo de lección
        Si es FC -> Se desbloquean todos los tabs
        Si es F2 o F3
          Si no es tutorial -> Se desbloquean todos los tabs
          Si es tutorial -> Se desbloquea solo la primera tab
    */
    desbloquearTabs: function(){
      const esFisicaConceptual = (App.leccion.codigoMateria == 'FISG2001');
      const noEsTutorial       = (App.leccion.tipo != 'tutorial');
      if( esFisicaConceptual || noEsTutorial ){
        $("#ul-tabs>li").removeClass("disabled");
      }else{
        for (let i = 0; i < App.preguntas.length; i++) {
          let actualP = App.preguntas[i];
          if( actualP.terminada == '' ){
            continue;
          }else{
            actualP.terminada = '';
            break;
          }
        }
      }
    },
    /*
      Desbloquea el tab de la siguiente sección al terminar la sección actual
    */
    habilitarSiguienteSeccion: function(pregunta, arrayP){
      //Obtengo el índice de la sección actual. Si no lo encuentra, retorno falso
      const indexPActual = arrayP.findIndex( function(item, i){
        return item._id == pregunta._id;
      });
      //Esto nunca debería pasar porque siempre va a encontrar a la pregunta en el array.
      if( indexPActual < 0 ){
        return false;
      }
      //Verifica si es la última pregunta
      const indexUltimaP     = arrayP.length - 1;
      const esUltimaPregunta = ( indexPActual == indexUltimaP );
      if( !esUltimaPregunta ){
        //Obtengo la siguiente sección y la marco como terminada para que el tab se desbloquee
        const indexPSig = indexPActual + 1;
        let pSig        = arrayP[indexPSig];
        pSig.terminada  = '';  
      }
      return true;
    },
    //////////////////////////////////////////////////////
    //LLAMADAS A LA API
    //////////////////////////////////////////////////////
    /*
      Obtengo toda la información de la lección
      Al obtenerla, asigno los valores a los campos correspondientes de Vue para mostrar la información al estudiante
    */
    obtenerDatosLeccion: function(){
      $.get({
        url    : '/api/estudiantes/leccion/datos_leccion',
        success: function(res) {
          if ( !res.datos.paralelo.dandoLeccion ) {
            window.location.href = '/estudiantes';  //Si no está tomando lección se lo redirige al perfil
          }
          App.asignarValoresObtenidos(res);
          App.desbloquearTabs();
          socket.emit('usuario', App.estudiante);
        }
      });
    },
    /*
      Se ejecuta solo si es tutorial no de FC
      Envía la respuesta del estudiante a la pregunta respondida de la sección en la que se encuentra
      Esta función se ejecuta si el estudiante responde a la primera pregunta de la sección
      Debe crear el registro de respuesta en la base de datos
    */
    enviarRespuestaSeccion: function(respuesta, sub, pregunta){
      const idBtn = '#btn-responder-sub-' + pregunta.ordenP + '-' + sub.orden;
      $.ajax({
        url    : '/api/respuestas/',
        type   : 'POST',
        data   : respuesta,
        success: function(res){
          loading(false, idBtn);
          Materialize.toast('¡Su respuesta ha sido enviada!', 5000, 'rounded');
          pregunta.respondida    = true;  
          const seccionTerminada = ( App.verificarPreguntasSeccion(pregunta) );
          if( seccionTerminada ){
            App.habilitarSiguienteSeccion(pregunta, App.preguntas);
          }
        },
        error  : function(err){
          loading(false, idBtn);
          Materialize.toast('¡Algo ha pasado!, no hemos podido enviar su respuesta', 1000, 'rounded');
          sub.respondida = false;
        }
      });
    },
    /*
      Se ejecuta solo si es tutorial no de FC
      Envía la respuesta del estudiante a la pregunta respondida de la sección en la que se encuentra
      Esta función se ejecuta si el estudiante ya ha respondido a una pregunta de la sección actual
      Se envía solo el array de subrespuestas
    */
    enviarSubrespuestas: function(respuesta, sub, pregunta){
      const idBtn = '#btn-responder-sub-' + pregunta.ordenP + '-' + sub.orden;
      $.ajax({
        url    : '/api/respuestas/',
        type   : 'PUT',
        data   : respuesta,
        success: function(res){
          loading(false, idBtn);
          Materialize.toast('¡Su respuesta ha sido enviada!', 2000, 'rounded');
          const seccionTerminada = ( App.verificarPreguntasSeccion(pregunta) );
          if( seccionTerminada ){
            App.habilitarSiguienteSeccion(pregunta, App.preguntas);
          }
        },
        error: function(err){
          loading(false, idBtn);
          Materialize.toast('¡Algo ha pasado!, no hemos podido enviar su respuesta', 2000, 'rounded red');
          sub.respondida = false;
        }
      });
    },
    /*
      Se ejecuta solo si no es tutorial o si es de FC
      @Descripción:
        * Sube una respuesta a la base de datos
      @Params:
        * pregunta  ->  json de la pregunta que el estudiante respondió
        * respuesta ->  json de la respuesta a enviar
      @Success:
        * Verifica si el estudiante ha terminado de responder todas las preguntas.
      @Error:
        * Marca la pregunta como no respondida. Habilita los inputs
    */
    enviarRespuesta: function(pregunta, respuesta){
      $.ajax({
        url    : '/api/respuestas/',
        type   : 'POST',
        data   : respuesta,
        success: function(res){
          const todasRespondidas = App.verificarTodasRespondidas(App.preguntas);
          if( todasRespondidas ){
            $('#modalRevisarRespuestas').modal('open');
          }
          Materialize.toast('¡Su respuesta ha sido enviada!', 3000, 'rounded');
        },
        error: function(err){
          console.log(err);
          pregunta.respondida = false;
          Materialize.toast('¡Algo ha pasado!, no hemos podido enviar su respuesta', 3000, 'rounded red');
        }
      });
    },
    /*
      @Descripcón:
        * Sube la imagen al servidor.
      @Params:
        * data     -> imagen en base64 que se va a subir al servidor.
        * pregunta -> json de la pregunta que el estudiante respondió con la imagen.
      @Success:
        * Añade el path de la imagen en pregunta.imagenes.
        * Desbloquea botones y quita el loading.
      @Error:
        * Desbloquea botones, quita loading y vacía el input.
    */
    subirImagen: function(data, pregunta, idLoading, idFI){
      $.ajax({
        type : 'POST',
        url  :'/api/respuestas/imagen',
        data : data,
        timeout     : 300000, //5 minutos
        cache       : false,
        contentType : false,
        processData : false,
        mimeType    : 'multipart/form-data',
        success : function(res) {
          res               = JSON.parse(res)
          pregunta.imagenes = res.datos;
          pregunta.imagen   = res.datos;
          App.imagenHandler(pregunta, true, idLoading, idFI);
          Materialize.toast('Imagen subida exitosamente', 3000, 'rounded');
        },
        error   : function(XMLHttpRequest, textstatus, message) {
          pregunta.imagenes = '';
          pregunta.imagen   = '';
          App.imagenHandler(pregunta, false, idLoading, idFI);
          Materialize.toast('Hubo un error al subir la imagen. Intente nuevamente.', 5000, 'rounded red');
        }
      });
    },
    /*
      @Descripcion: Esta función se ejecutará cuando el estudiante quiera responder una pregunta que ya fue respondida y tenga habilitada la opción para responder preguntas.
      @Autor: @edisonmora95
      @ÚltimaMidificación: 21-05-2017 @edisonmora95
    */
    corregirRespuesta: function(self, pregunta, idLeccion, idEstudiante){
      //Primero busco en la base de datos si la pregunta que quiere corregir ya fue respondida
      var url = "/api/respuestas/buscar/leccion/" + idLeccion + "/pregunta/" + pregunta._id + "/estudiante/" +idEstudiante;
      $.ajax({
        url   : url,
        method: 'GET',
        success: function(response) {
          var idRespuesta = response.datos._id;
          self.enviarCorreccion(idRespuesta, pregunta);
        }
      });
    },
    /*
      Esta función hace la llamada a la api para corregir la respuesta.
    */
    enviarCorreccion: function(idRespuesta, pregunta){
      const urlPut = "/api/respuestas/" + idRespuesta;
      const resp   = {respuesta: pregunta.respuesta}
      $.ajax({
        url    : urlPut,
        method : 'PUT',
        data   : resp,
        success: function(response) {
          Materialize.toast('¡Su respuesta ha sido corregida!', 3000, 'rounded');
        },
        error  : function(response) {
          console.log(response);
          Materialize.toast('Hubo un error al tratar de corregir su respuesta.', 3000, 'rounded red');
        }
      });
    },
    //////////////////////////////////////////
    //Eventos
    //////////////////////////////////////////
    /*
      Primero se bloquea el textarea y el botón para evitar que el estudiante lo presione varias veces
      Primero verifica si la pregunta que responde está dentro de una sección la cual ya ha sido respondida previamente
    */
    responderSub: function(pregunta, sub){
      sub.respondida  = true;   //Bloquea el textarea/btn/fileInput. 
      const idBtn     = '#btn-responder-sub-' + pregunta.ordenP + '-' + sub.orden;
      loading(true, idBtn); //Se añade el loading al btn
      const respuesta = crearRespuesta(pregunta._id,App.estudiante._id,App.leccion._id,App.estudiante.paralelo,App.estudiante.grupo,pregunta);  
      if( pregunta.respondida ){
        const obj = {
          leccion       : App.leccion._id,
          pregunta      : pregunta._id,
          estudiante    : App.estudiante._id,
          subrespuestas : respuesta.arraySubrespuestas
        };
        App.enviarSubrespuestas(obj, sub, pregunta); //ESTO ES AJAX
      }else{
         App.enviarRespuestaSeccion(respuesta, sub, pregunta); //AJAX
      }
    },
    /*
      Esta función se ejecuta cuando el estudiante selecciona una imagen para subir como respuesta
      Comprime la imagen, la sube al servidor y obtiene el path. El cual se ubica en el objeto respuesta a enviar
    */
    getImageSub: function(pregunta, sub, event){
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      sub.respondida  = true;                                     //Se marca la pregunta como respondida. Lo cual bloquea el textarea/btn/fileInput. 
      const idLoading = '#loading-' + pregunta.ordenP + '-' + sub.orden;
      const idFI      = '#fi-' + pregunta.ordenP + '-' + sub.orden;
      $(idLoading).show();  //Se añade el loading al btn
      //Se comprime la imagen
      new ImageCompressor(file, {
        quality: .3,
        success(result) {
          //Enviar imagen al servidor
          let formData = new FormData();
          formData.append('imagenes', result, result.name);
          App.subirImagen(formData, sub, idLoading, idFI);
        },
        error(e) {
          console.log(e.message);
          App.imagenHandler(sub, false, idLoading, idFI);
        },
      });
    },
    /*
      Esta función se ejecuta cuando el estudiante da click a responder (laboratorio|estimación).
      @Descripción:
        * Marca la pregunta como respondida para bloquear los inputs.
        * Envía la respuesta o la corrige.
    */
    responderP: function(pregunta){
      const yaFueRespondida = pregunta.respondida;  //Esto funciona...
      pregunta.respondida   = true;                 //Bloquea los inputs de la pregunta actual
      if( yaFueRespondida ){
        if ( App.corregirHabilitado ) {
          App.corregirRespuesta(pregunta, App.leccion._id, App.estudiante._id);
        }else{
          $('#modalCorregirRespuesta').modal('open');
        }
      }else{
        const respuesta = crearRespuesta(pregunta._id, App.estudiante._id, App.leccion._id, App.estudiante.paralelo, App.estudiante.grupo, pregunta);  //Se crea el objeto Respuesta que se enviará a la base de datos
        App.enviarRespuesta(pregunta, respuesta);
      }
    },
    /*
      Esta función se ejecuta cuando el estudiante selecciona una imagen para subir como respuesta
      Comprime la imagen, la sube al servidor y obtiene el path. El cual se ubica en el objeto respuesta a enviar
    */
    getImageP: function(pregunta, event) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      pregunta.respondida = true;           //Se marca la pregunta como respondida, lo cual bloquea el textarea/btn/fileInput.
      const idLoading     = '#loading-' + pregunta._id;
      const idFI          = '#fi-' + pregunta._id;
      $(idLoading).show(); //Se añade el loading
      //Se comprime la imagen
      new ImageCompressor(file, {
        quality: .3,
        success(result) {
          //Enviar imagen al servidor
          let formData = new FormData();
          formData.append('imagenes', result, result.name);
          App.subirImagen(formData, pregunta, idLoading, idFI)
        },
        error(e) {
          console.log(e.message);
          App.imagenHandler(pregunta, false, idLoading, idFI);
        },
      });
    },
    /*
      Función del modal. Si el estudiante escoge la opción de corregir respuestas
    */
    revisarLeccion: function(){
      App.corregirHabilitado = true;
      for (let i = 0; i < App.preguntas.length; i++) {
        let actualP = App.preguntas[i];
        actualP.respondida = false;
      }
    },
    //////////////////////////////////////////
    //HELPERS
    //////////////////////////////////////////
    /*
      Retorna true si todas las preguntas de la sección fueron respondidas
    */
    verificarPreguntasSeccion: function(seccion){
      let flag = true;
      for (var i = 0; i < seccion.subpreguntas.length; i++) {
        let subActual = seccion.subpreguntas[i];
        if( !subActual.respondida ){
          flag = false;
          return false;
        }
      }
      return flag;
    },
    /*
      Esta función verifica si el estudiante ha respondido todas las preguntas de la lección
    */
    verificarTodasRespondidas: function(arrayPreguntas){
      let todasRespondidas = true;
      $.each(arrayPreguntas, function(index, pregunta){
        if( !pregunta.respondida ){
          todasRespondidas = false;
          return false;
        }
      });
      return todasRespondidas;
    },
    /*
      Esta función se ejecuta cuando hay un error al comprimir o subir una imagen, o cuando se termina de subir al servidor
      Marca la pregunta como respondida, para desbloquear el textarea/btn/file input
      Quita el loading de la pantalla
      Si el estado es false, la imagen no se subió/comprimió. Entonces vacía el file input
    */
    imagenHandler(pregunta, estado, idLoading, idFI){
      pregunta.respondida = false;
      $(idLoading).hide();
      if ( !estado ) {
        $(idFI).val('');
      }
    },
  }
});

/*
  Esta función crea el objeto Respuesta que se enviará a la base de datos.
  @FechaModificación: 
    04-10-2017 @edisonmora95 añadido campo de subrespuestas
*/
function crearRespuesta(idPregunta, idEstudiante, idLeccion, idParalelo, idGrupo, pregunta) {
  // Armo el array de subrespuestas
  let arraySubrespuestas  = armarArraySubrespuestas(pregunta); //Si la pregunta no tiene subpreguntas, esto queda vacío
  var arraySubrespuestas2 = JSON.stringify(arraySubrespuestas);
  //Creo el JSON
  const respuesta         = {
    estudiante         : idEstudiante,
    leccion            : idLeccion,
    pregunta           : idPregunta,
    paralelo           : idParalelo,
    grupo              : idGrupo,
    contestado         : true,
    respuesta          : pregunta.respuesta,
    feedback           : '',
    calificacion       : 0,
    imagenes           : pregunta.imagenes,
    arraySubrespuestas : arraySubrespuestas2
  };
  //Creo el socket con la respuesta del estudiante y lo envío al profesor
  let respuesta_realtime = crearSocket(App.estudiante, App.grupo, idLeccion, idParalelo, pregunta, pregunta.respuesta, pregunta.imagenes, arraySubrespuestas);
  socket.emit('respuesta estudiante', respuesta_realtime);
  return respuesta;
}
/*
  Dada la pregunta ingresada como parámetro, obtiene todas las subrespuestas ingresadas por el estudiante y las añade a un array con el orden de la pregunta a la que pertenece
*/
function armarArraySubrespuestas(pregunta) {
  let arraySubrespuestas = [];
  for (let i = 0; i < pregunta.subpreguntas.length; i++) {
    let subActual    = pregunta.subpreguntas[i];
    let subrespuesta = {
      respuesta    : subActual.respuesta,
      ordenPregunta: subActual.orden,
      feedback     : '',
      calificacion : 0,
      imagen       : subActual.imagen
    };
    if( subActual.respondida ){
      arraySubrespuestas.push(subrespuesta);
    }
  }
  return arraySubrespuestas;
}
/*
  Crea el json que se va a enviar como socket al profesor para el realtime
*/
function crearSocket(estudiante, grupo, idLeccion, idParalelo, pregunta, respuesta, urlImagen, arraySubrespuestas){
  let respuesta_realtime = {
    estudianteId       : estudiante._id,
    estudianteNombre   : estudiante.nombres,
    estudianteApellido : estudiante.apellidos,
    grupoId            : grupo._id,
    grupoNombre        : grupo.nombre,
    leccion            : idLeccion,
    paralelo           : idParalelo,
    pregunta           : pregunta._id,
    preguntaNombre     : pregunta.nombre,
    descripcion        : pregunta.descripcion,
    subpreguntas       : pregunta.subpreguntas, 
    orden              : pregunta.ordenP,
    respuesta          : respuesta,
    feedback           : '',
    calificacion       : 0,
    imagenes           : urlImagen,
    visitado           : false,
    arraySubrespuestas : arraySubrespuestas
  };
  return respuesta_realtime;
}
/*
  Función que añade o quita el gif de loading
  Requiere el estado, si está cargando algo o no.
    Si es true, añade el loading en el botón indicado
    Si es false lo remueve
*/
function loading(estado, idBtn) {
  if(estado){
    $(idBtn).empty();
    $(idBtn).append('<div class="preloader-wrapper small active onLoad"></div>');
    $('.onLoad').append('<div class="spinner-layer spinner-blue-only load-2"></div>');
    $('.load-2').append('<div class="circle-clipper left load-3"></div>');
    $('.load-3').append('<div id="load-4" class="circle"></div>');
  }else{
    $(idBtn).empty();
    $(idBtn).html('Responder')
  }
}

socket.on('tiempo restante', function(tiempo) {
  App.tiempo = tiempo
})

socket.on('terminado leccion', function(match) {
  socket.disconnect();
  window.location.href = '/estudiantes/';
});

socket.on('leccion id', function(id_leccion) {
});

socket.on('desconectarlo', function(dato) {
  Materialize.toast('hubo un error llamar', 15000)
});

Offline.options = {
  checkOnLoad: true,
  requests   : true,
};

Offline.on('down', function(data) {
});

Offline.on('up', function(data) {
});

var interval;
socket.on('connect', function() {
  document.getElementById('conectado').classList.remove("red");
  document.getElementById('conectado').classList.add("green");
  $.get({
    url: '/api/session/usuario_conectado',
    success: function(data) {
      socket.emit('reconectar estudiante', data.datos)
    }
  });
});

socket.on('connect_failed', function() {
  $.get({
    url: '/api/session/usuario_conectado',
    success: function(data) {
      socket.emit('reconectar estudiante', data.datos)
    }
  });
});

socket.on('disconnect', function() {
  clearInterval(interval)
  document.getElementById('conectado').classList.remove("green");
  document.getElementById('conectado').classList.add("red");
  console.log('desconectado');
});

supportsWebSockets = 'WebSocket' in window || 'MozWebSocket' in window;
if (!supportsWebSockets) {
  Materialize.toast('No Soportado', 6000)
}
