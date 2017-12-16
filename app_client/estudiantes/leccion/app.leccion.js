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
      Función que añade o quita el gif de loading
      Requiere el estado, si está cargando algo o no.
        Si es true, añade el loading en el botón indicado
        Si es false lo remueve
    */
    loading: function(estado, idBtn){
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
    /*
      Comprime la imagen que el estudiante seleccionó
      Luego de eso la sube a imgur
    */
    comprimirSub: function(pregunta, sub){
      var output_format = "jpg";
      var source_image  = document.getElementById('source_image-'+pregunta.ordenP+'-'+sub.orden);
      var result_image  = document.getElementById('result_image-'+pregunta.ordenP+'-'+sub.orden);
      var quality       = 15;
      const idResultImg = '#result_image-'+pregunta.ordenP+'-'+sub.orden;
      //Espera a que cargue la imagen para poder realizar la compresion y asignarla a la subpregunta
      $('#source_image-'+pregunta.ordenP+'-'+sub.orden).ready(function(){
        sub.imagen = jic.compress(source_image, quality, output_format).src;
        $(idResultImg)
                      .addClass('materialboxed imagen')
                      .materialbox()
                      .hide();
      });
      //Se convierte el SRC de la imagen comprimida a un formato que el API de imgur pueda leer
      $('#result_image-'+pregunta.ordenP+'-'+sub.orden).ready(function(){
        App.subirImagenSub((sub.imagen).substring(23), pregunta, sub);
      });
    },
    /*
      Comprime la imagen que el estudiante seleccionó
      Luego de eso la sube a imgur
    */
    comprimir: function(pregunta){
      var output_format = "jpg";
      var source_image  = document.getElementById('source_image-'+pregunta._id);
      var result_image  = document.getElementById('result_image-'+pregunta._id);
      var quality       = 15;
      const idResultImg = '#result_image-' + pregunta._id;
      $('#source_image-'+pregunta._id).ready(function(){//Espera a que cargue la imagen para poder realizar la compresion
        pregunta.imagenes = jic.compress(source_image, quality, output_format).src;
        $(idResultImg)
                      .addClass('materialboxed imagen')
                      .materialbox()
                      .hide();
      });

      $('#result_image-'+pregunta._id).ready(function(){
        App.subirImagen((pregunta.imagenes).substring(23), pregunta);//Se convierte el SRC de la imagen comprimida a un formato que el API de imgur pueda leer
      });
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
          App.loading(false, idBtn);
          Materialize.toast('¡Su respuesta ha sido enviada!', 5000, 'rounded');
          pregunta.respondida    = true;  
          const seccionTerminada = ( App.verificarPreguntasSeccion(pregunta) );
          if( seccionTerminada ){
            App.habilitarSiguienteSeccion(pregunta, App.preguntas);
          }
        },
        error  : function(err){
          App.loading(false, idBtn);
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
          App.loading(false, idBtn);
          Materialize.toast('¡Su respuesta ha sido enviada!', 2000, 'rounded');
          const seccionTerminada = ( App.verificarPreguntasSeccion(pregunta) );
          if( seccionTerminada ){
            App.habilitarSiguienteSeccion(pregunta, App.preguntas);
          }
        },
        error: function(err){
          App.loading(false, idBtn);
          Materialize.toast('¡Algo ha pasado!, no hemos podido enviar su respuesta', 2000, 'rounded red');
          sub.respondida = false;
        }
      });
    },
    /*
      Sube la imagen ya comprimida a imgur y obtiene el link
    */
    subirImagenSub: function(imagenSrc, pregunta, sub){
      let idBtn    = '#btn-responder-sub-' + pregunta.ordenP + '-' + sub.orden;
      let clientId = "300fdfe500b1718";
      let xhr      = new XMLHttpRequest();
      xhr.open('POST', 'https://api.imgur.com/3/image', true);
      xhr.setRequestHeader('Authorization', 'Client-ID ' + clientId);
      xhr.onreadystatechange = function(){
        sub.respondida = false;
        if ( xhr.status === 200 && xhr.readyState === 4 ) {
          //Asigno el link de imgur como el src de la imagen y la muestro
          const url         = JSON.parse(xhr.responseText);
          sub.imagen        = url.data.link;
          const idResultImg = '#result_image-'+pregunta.ordenP+'-'+sub.orden;
          $(idResultImg).show();
          //Quito el loading
          const idLoading   = '#loading-' + pregunta.ordenP + '-' + sub.orden;
          $(idLoading).hide();

          Materialize.toast('Imagen subida exitosamente', 3000, 'rounded');
        }
        if (xhr.status === 400){
          Materialize.toast('Hubo un error al subir la imagen. Intentelo de nuevo.', 5000, 'rounded red');
          sub.imagen = '';
        }
      }
      xhr.send(imagenSrc);//Envia la imagen
    },
    /*
      Se ejecuta solo si no es tutorial o si es de FC
      Función que se ejecutará para enviar una respuesta por primera vez
    */
    enviarRespuesta: function(pregunta, idEstudiante, idLeccion, idParalelo, idGrupo){
      const respuesta = App.crearRespuesta(pregunta._id, idEstudiante, idLeccion, idParalelo, idGrupo, pregunta);  //Se crea el objeto Respuesta que se enviará a la base de datos
      const urlApi    = '/api/respuestas/';
      $.ajax({
        url    : urlApi,
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
      Sube la imagen ya comprimida a imgur y obtiene el link
    */
    subirImagen: function(imagenSrc, pregunta){
      let clientId = "300fdfe500b1718";
      let xhr      = new XMLHttpRequest();
      xhr.open('POST', 'https://api.imgur.com/3/image', true);
      xhr.setRequestHeader('Authorization', 'Client-ID ' + clientId);
      xhr.onreadystatechange = function () {
        pregunta.respondida = false;
        if ( xhr.status === 200 && xhr.readyState === 4 ) {
          //Asigno el link de imgur como el src de la imagen y la muestro
          const url         = JSON.parse(xhr.responseText);
          pregunta.imagenes = url.data.link;
          const idResultImg = '#result_image-' + pregunta._id;
          $(idResultImg).show();
          //Quito el loading
          const idLoading   = '#loading-' + pregunta._id;
          $(idLoading).hide();

          Materialize.toast('Imagen subida exitosamente', 3000, 'rounded');
        }
        if (xhr.status === 400){
          pregunta.imagenes = '';
          Materialize.toast('Hubo un error al subir la imagen. Intentelo de nuevo.', 5000, 'rounded red');
        }
      }
      xhr.send(imagenSrc);//Envia la imagen
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
      App.loading(true, idBtn); //Se añade el loading al btn
      const respuesta = App.crearRespuesta(pregunta._id,App.estudiante._id,App.leccion._id,App.estudiante.paralelo,App.estudiante.grupo,pregunta);  
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
      Comprime la imagen, la sube a imgur y obtiene el link. El cual se ubica en el objeto respuesta a enviar
    */
    getImageSub: function(pregunta, sub, event){
      //Se marca la pregunta como respondida. Lo cual bloquea el textarea/btn/fileInput. Se añade el loading al btn
      sub.respondida  = true;
      const idLoading = '#loading-' + pregunta.ordenP + '-' + sub.orden;
      $(idLoading).show();
      //Obtengo la imagen ingresada
      let input      = event.target;
      let idSrcImage = '#source_image-' + pregunta.ordenP + '-' + sub.orden;
      //Si hay una imagen en el input, se la comprime
      if( input.files && input.files[0] ){
        let reader    = new FileReader();
        reader.onload = function(e){
          $(idSrcImage).attr('src', e.target.result).hide();
          App.comprimirSub(pregunta, sub);
        };
        reader.readAsDataURL(input.files[0]);
      }
    },
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
        App.enviarRespuesta(pregunta, App.estudiante._id, App.leccion._id, App.estudiante.paralelo, App.estudiante.grupo);
      }
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
    /*
      Esta función se ejecuta cuando el estudiante selecciona una imagen para subir como respuesta
      Comprime la imagen, la sube a imgur y obtiene el link. El cual se ubica en el objeto respuesta a enviar
    */
    getImageP: function(pregunta, event) {
      //Se marca la pregunta como respondida. Lo cual bloquea el textarea/btn/fileInput. Se añade el loading al btn
      pregunta.respondida = true;
      const idLoading     = '#loading-' + pregunta._id;
      $(idLoading).show();
      //Obtengo la imagen ingresada
      let input      = event.target;
      let idSrcImage = '#source_image-' + pregunta._id;
      //Si hay una imagen en el input, se la comprime
      if (input.files && input.files[0]) {
        var reader    = new FileReader();
        reader.onload = function (e) {
          $(idSrcImage).attr('src', e.target.result);
          App.comprimir(pregunta);//Comprime la imagen obtenida
        };
        reader.readAsDataURL(input.files[0]);
      }
    },
    //////////////////////////////////////////
    //HELPERS
    //////////////////////////////////////////
   /*
      Esta función crea el objeto Respuesta que se enviará a la base de datos.
      @FechaModificación: 
        04-10-2017 @edisonmora95 añadido campo de subrespuestas
    */
    crearRespuesta: function(idPregunta, idEstudiante, idLeccion, idParalelo, idGrupo, pregunta){
      // Armo el array de subrespuestas
      let arraySubrespuestas  = App.armarArraySubrespuestas(pregunta); //Si la pregunta no tiene subpreguntas, esto queda vacío
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
      let respuesta_realtime = App.crearSocket(App.estudiante, App.grupo, idLeccion, idParalelo, pregunta, pregunta.respuesta, pregunta.imagenes, arraySubrespuestas);
      socket.emit('respuesta estudiante', respuesta_realtime);
      return respuesta;
    },
    /*
      Dada la pregunta ingresada como parámetro, obtiene todas las subrespuestas ingresadas por el estudiante y las añade a un array con el orden de la pregunta a la que pertenece
    */
    armarArraySubrespuestas: function(pregunta){
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
    },
    /*
      Crea el json que se va a enviar como socket al profesor para el realtime
    */
    crearSocket: function(estudiante, grupo, idLeccion, idParalelo, pregunta, respuesta, urlImagen, arraySubrespuestas){
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
        respuesta          : respuesta,
        feedback           : '',
        calificacion       : 0,
        imagenes           : urlImagen,
        visitado           : false,
        arraySubrespuestas : arraySubrespuestas
      };
      return respuesta_realtime;
    },
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
  }
});

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

