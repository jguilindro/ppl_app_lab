
var socket = io('/tomando_leccion', {
  'reconnect': true,
  'forceNew': true
});

let App = new Vue({
  created: function(){
    let self = this;
    /*
      Al iniciar la ventana se obtienen los datos de la lección
      Luego se añaden las respuestas que el estudiante ya ha enviado (en caso de que haya recargado la página)
    */
    $.when( $.ajax( self.obtenerDatosLeccion() ) ).then( function(){
      //A veces cuando el internet está muy lento, no se terminan de cargar los datos y ya se comienzan a añadir las respuestas
      while( true ){
        if( self.dataFinishedLoading ){
          self.anadirRespuestas(self.respuestas, self.preguntas);
          self.desbloquearTabs();
          const todasRespondidas     = self.verificarTodasRespondidas(self.preguntas);
          const noEsTutorial         = ( self.leccion.tipo != 'tutorial' );
          const noEsFisicaConceptual = ( self.leccion.codigoMateria != 'FISG2001' ); 
          if( todasRespondidas &&  noEsTutorial && noEsFisicaConceptual ){
            $('#modalRevisarRespuestas').modal('open');
          }
          return;
        }
      }
    });
  },
  mounted: function(){
    this.inicializarMaterialize();
  },
  el: '#app',
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
      App.preguntas           = App.armarArrayPreguntas(res.datos.leccion.preguntas);
      App.respuestas          = res.datos.respuestas;
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
        $('#tab-1').removeClass('disabled');
      }
    },
    /*
      Función que indicará que una foto se está subiendo (si tuviera lo alto y ancho podría simular a la foto en sí.)
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
    mostrarModal: function(imageUrl){
      $("#modal_Img .modal-content").empty();
      $("<img>",{'src': imageUrl, 'class' : 'center-block' }).appendTo("#modal_Img .modal-content")
      $('#modal_Img').modal('open');
    },
    //////////////////////////////////////////////////////
    //LLAMADAS A LA API
    //////////////////////////////////////////////////////
    /*
      Obtengo toda la información de la lección
    */
    obtenerDatosLeccion: function(){
      $.get({
        url    : '/api/estudiantes/leccion/datos_leccion',
        success: function(res) {
          console.log(res)
          //Primero se verifica si el paralelo del estudiante está tomando lección
          if ( !res.datos.paralelo.dandoLeccion ) {
            window.location.href = '/estudiantes';  //Si no está tomando lección se lo redirige al perfil
          }
          App.asignarValoresObtenidos(res);
          socket.emit('usuario', App.estudiante);
          App.dataFinishedLoading = true;
        }
      });
    },
    /*
      Función que se ejecutará para enviar una respuesta por primera vez
      Si se pudo enviar la respuesta, se marca la pregunta como respondida
    */
    enviarRespuesta: function(pregunta, idEstudiante, idLeccion, idParalelo, idGrupo){
      const respuesta = App.crearRespuesta(pregunta._id, idEstudiante, idLeccion, idParalelo, idGrupo, pregunta);  //Se crea el objeto Respuesta que se enviará a la base de datos
      const urlApi    = '/api/respuestas/';
      $.ajax({
        url    : urlApi,
        type   : 'POST',
        data   : respuesta,
        success: function(res){
          if( res.estado ){
            Materialize.toast('¡Su respuesta ha sido enviada!', 5000, 'rounded');
            pregunta.respondida    = true; //Marco que la pregunta ha sido respondida, para que no pueda corregirla hasta que termine la lección.
            const todasRespondidas = App.verificarTodasRespondidas(App.preguntas);
            if( todasRespondidas ){
              $('#modalRevisarRespuestas').modal('open');
            }
          }
        },
        error: function(err){
          Materialize.toast('¡Algo ha pasado!, no hemos podido enviar su respuesta', 1000, 'rounded');
          console.log(err);
          const idTextarea   = '#textarea-'      + pregunta._id;
          const idBtn        = '#btn-responder-' + pregunta._id;
          const idFI         = '#fi-'            + pregunta._id;
          App.desbloquearRespuesta(idTextarea, idBtn, idFI);
        }
      });
    },
    /*
      Esta función hace la llamada a la api para corregir la respuesta.
    */
    enviarCorreccion: function(idRespuesta, pregunta){
      const urlPut            = "/api/respuestas/" + idRespuesta;
      const idTextarea        = '#textarea-' + pregunta._id;
      const respuestaTextarea = $(idTextarea).val();
      const resp              = {respuesta: respuestaTextarea}
      $.ajax({
        url    : urlPut,
        method : 'PUT',
        data   : resp,
        success: function(response) {
          Materialize.toast('¡Su respuesta ha sido corregida!', 6000, 'rounded');
        },
        error  : function(response) {
          console.log(response);
          Materialize.toast('Hubo un error al tratar de corregir su respuesta.', 1000, 'rounded red');
        }
      });
    },
    enviarSubrespuestas: function(respuesta, sub, pregunta){
      const idBtn = '#btn-responder-sub-' + pregunta.orden + '-' + sub.orden;
      $.ajax({
        url    : '/api/respuestas/',
        type   : 'PUT',
        data   : respuesta,
        success: function(res){
          App.loading(false, idBtn);
          Materialize.toast('¡Su respuesta ha sido enviada!', 5000, 'rounded');
          sub.respondida         = true;
          pregunta.respondida    = true;
          const seccionTerminada = ( App.verificarPreguntasSeccion(pregunta) );
          if( seccionTerminada ){
            let cont = pregunta.orden;
            cont++;
            $('#tab-' + cont).removeClass('disabled');  
          }
        },
        error: function(err){
          App.loading(false, idBtn);
          Materialize.toast('¡Algo ha pasado!, no hemos podido enviar su respuesta', 1000, 'rounded');
          sub.respondida      = false;
          pregunta.respondida = false;
          const idTextarea    = '#textarea-sub-'      + pregunta.orden + '-' + sub.orden;
          const idBtn         = '#btn-responder-sub-' + pregunta.orden + '-' + sub.orden;
          const idFileInput   = '#fi-'                + pregunta.orden + '-' + sub.orden;
          App.desbloquearRespuesta(idTextarea, idBtn, idFileInput);
        }
      });
    },
    enviarRespuestaSeccion: function(respuesta, sub, pregunta){
      const idBtn = '#btn-responder-sub-' + pregunta.orden + '-' + sub.orden;
      $.ajax({
        url    : '/api/respuestas/',
        type   : 'POST',
        data   : respuesta,
        success: function(res){
          App.loading(false, idBtn);
          Materialize.toast('¡Su respuesta ha sido enviada!', 5000, 'rounded');
          sub.respondida         = true;
          pregunta.respondida    = true;
          const seccionTerminada = ( App.verificarPreguntasSeccion(pregunta) );
          if( seccionTerminada ){
            let cont = pregunta.orden;
            cont++;
            $('#tab-' + cont).removeClass('disabled');  
          }
          App.loading(false, idBtn);
        },
        error  : function(err){
          App.loading(false, idBtn);
          Materialize.toast('¡Algo ha pasado!, no hemos podido enviar su respuesta', 1000, 'rounded');
          sub.respondida      = false;
          pregunta.respondida = false;
          const idTextarea    = '#textarea-sub-'      + pregunta.orden + '-' + sub.orden;
          const idBtn         = '#btn-responder-sub-' + pregunta.orden + '-' + sub.orden;
          const idFileInput   = '#fi-'                + pregunta.orden + '-' + sub.orden;
          App.desbloquearRespuesta(idTextarea, idBtn, idFileInput);
        }
      });
    },
    /*
      @Descripción: Esta función sube la imagen comprimida a imgur y devuelve la url.
      @Autor: @jguilindro
      @FechaModificación: 19-07-2017 @jguilindro
    */
    subirImagen: function(imagenSrc, pregunta){
      var clientId = "300fdfe500b1718";
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://api.imgur.com/3/image', true);
      xhr.setRequestHeader('Authorization', 'Client-ID ' + clientId);
      xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
          App.loading(false);
          Materialize.toast('Imagen subida exitosamente', 5000, 'rounded');
          var url          = JSON.parse(xhr.responseText)
          var idSrcImage   = '#source_image-' + pregunta;
          var idResImage   = '#result_image-' + pregunta;
          var result_image = document.getElementById('result_image-'+pregunta);
          $(idSrcImage).attr('aux', url.data.link);
          $(idResImage).attr('src', url.data.link);
        }
      }
    },
    //////////////////////////////////////////////////////
    //HELPERS
    //////////////////////////////////////////////////////
    /*
      Devuelve el array de preguntas que se va a mostrar al usuario
      Cada pregunta tendrá la información completa de la pregunta y un boolean indicando si tiene subpreguntas
    */
    armarArrayPreguntas: function(preguntasObtenidas){
      let arrayPreguntas = [];
      for( let i = 0; i < preguntasObtenidas.length; i++ ) {
        let preguntaActual               = preguntasObtenidas[i].pregunta;
        preguntaActual.orden             = preguntasObtenidas[i].ordenPregunta;
        preguntaActual.tieneSubpreguntas = ( preguntaActual.subpreguntas != null && preguntaActual.subpreguntas.length > 0 );
        arrayPreguntas.push(preguntaActual);
      }
      return arrayPreguntas;
    },
    /*
      Se recorre el array de respuestas obtenidas de la base de datos
      Se encuentra la pregunta correspondiente comparando los _id
      Si es Sección se tienen que añadir las subrespuestas
      Si no es Sección, solo se añáde la respuesta al textarea para que el estudiante la vea
      Se revisa si todas las preguntas han sido respondidas
    */
    anadirRespuestas: function(arrayRespuestas, arrayPreguntas) {
      arrayRespuestas.forEach(function(res) {
        let pregunta               = $.grep(arrayPreguntas, function(p){ return p._id == res.pregunta; })[0]; //Encuentro la pregunta a la que pertenece la respuesta
        const esTutorial           = ( App.leccion.tipo == 'tutorial' );
        const tieneSubrespuestas   = ( res.subrespuestas.length > 0 );
        const noEsFisicaConceptual = ( App.leccion.codigoMateria != 'FISG2001' );
        const esSeccion            = ( tieneSubrespuestas && esTutorial && noEsFisicaConceptual );
        if( esSeccion ){
          App.anadirSubrespuestas(res.subrespuestas, pregunta);
          if( App.verificarPreguntasSeccion(pregunta) ){
            let cont = pregunta.orden;
            cont++;
            $('#tab-' + cont).removeClass('disabled');  
          }
        }else{
          let idTextarea = '#textarea-'      + res.pregunta;
          let idBtn      = '#btn-responder-' + res.pregunta;
          let idImgSrc   = '#result_image-'  + res.pregunta;
          let idFI       = '#fi-'            + res.pregunta;
          App.asignarDatosRespuesta(idTextarea, idBtn, idImgSrc, idFI, res.respuesta, res.imagenes);
          pregunta.respuesta  = res.respuesta;
          pregunta.respondida = true;
        }
      });
    },
    /*
      Se añaden las respuestas a las preguntas de la sección que el estudiante ya haya enviado previamente
      Se busca la pregunta correspondiente comparando el orden de la respuesta con el orden de la pregunta
      Como al responder una pregunta en tutorial, se crea el array de todas las subrespuestas, se hacer una verificación
        para solo añadir la respuesta que sea diferente de vacío
    */
    anadirSubrespuestas: function(arraySubrespuestas, pregunta){
      arraySubrespuestas.forEach( function(subRes){
        let subpregunta = $.grep(pregunta.subpreguntas, function(sp){ return sp.orden == subRes.ordenPregunta; })[0];
        let textareaId  = '#textarea-sub-'      + pregunta.orden + '-' + subpregunta.orden;
        let btnId       = '#btn-responder-sub-' + pregunta.orden + '-' + subpregunta.orden;
        let resultImg   = '#result_image-'      + pregunta.orden + '-' + subRes.ordenPregunta;
        let fileInputId = '#fi-'                + pregunta.orden + '-' + subRes.ordenPregunta;
        const respuestaNoVacia = ( subRes.respuesta != '' && subRes.respuesta != null );
        if( respuestaNoVacia ){
          App.asignarDatosRespuesta(textareaId, btnId, resultImg, fileInputId, subRes.respuesta, subRes.imagen);
          subpregunta.respondida = true;
          pregunta.respondida    = true;
        }
      });
    },
    /*
      Asigno la respuesta al textarea correspondiente y la imagen al div
      Bloqueo el textarea, botón de respuesta y file input
    */
    asignarDatosRespuesta: function(idTextarea, idBtn, idImgSrc, idFI, respuesta, imagen){
      const hayImagen = (imagen != undefined || imagen != null);
      if( hayImagen )  {
        $(idImgSrc)[0].src = imagen;
        $(idImgSrc).css({'width' : '150px','height' : '150px'})
                   .addClass('materialboxed')
                   .materialbox()
                   .show();
      }
      $(idTextarea).val(respuesta);
      App.bloquearRespuesta(idTextarea, idBtn, idFI);
    },
    bloquearRespuesta : function(idTextarea, idBtn, idFI){
      $(idTextarea).attr("disabled", true);
      $(idBtn).attr("disabled", true);
      $(idFI).attr('disabled','disabled');
    },
    desbloquearRespuesta : function(idTextarea, idBtn, idFI){
      $(idTextarea).attr("disabled", false);
      $(idbtn).attr("disabled", false);
      $(idFI).attr('disabled', false);
    },
    crearSocket: function(estudiante, grupo, idLeccion, idParalelo, pregunta, respuesta, urlImagen, arraySubrespuestas){
      let respuesta_realtime = {
        estudianteId       : estudiante._id,
        estudianteNombre   : estudiante.nombres,
        estudianteApellido : estudiante.apellidos,
        grupoId            : grupo._id,
        grupoNombre        : grupo.nombre,
        leccion            : idLeccion,
        paralelo           : idParalelo,
        pregunta           : pregunta,
        respuesta          : respuesta,
        feedback           : '',
        calificacion       : 0,
        imagenes           : urlImagen,
        arraySubrespuestas : arraySubrespuestas
      };
      return respuesta_realtime;
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
    //////////////////////////////////////////
    //Eventos
    //////////////////////////////////////////
    /*
      Función ejecutada al dar click en btn responder de cada pregunta.
      Hay 3 posibles casos cuando el estudiante quiere responder:
        * Primera vez que el estudiante responde la pregunta y no puede corregir todavía.
        * La pregunta ya fue respondida y puede corregirla.
        * Aún no tiene habilitado para corregir y quiere corregir la respuesta enviada.
    */
    responder: function(pregunta, event){
      let self           = this;
      const idEstudiante = self.estudiante._id;
      const idLeccion    = self.leccion._id;
      const idParalelo   = self.estudiante.paralelo;
      const idGrupo      = self.estudiante.grupo;
      //Apenas da click en el botón se bloquea el textarea, el botón y el file input
      const idTextarea   = '#textarea-'      + pregunta._id;
      const idBtn        = '#btn-responder-' + pregunta._id;
      const idFI         = '#fi-'            + pregunta._id;
      App.bloquearRespuesta(idTextarea, idBtn, idFI);
      //self.bloquearEditor(pregunta);
      if( !pregunta.respondida ){       //Caso normal, responde por primera vez a la pregunta indicada
        App.enviarRespuesta(pregunta, idEstudiante, idLeccion, idParalelo, idGrupo);
      }else{                            //Si ya ha enviado una respuesta a la pregunta indicada
        if( self.corregirHabilitado ){  //Si ya puede corregir las respuestas
          self.corregirRespuesta(self, pregunta, idLeccion, idEstudiante);
        }else{                         //Si no puede corregir las respuestas
          $('#modalCorregirRespuesta').modal('open');
       }
     }
    },
    /*
      @Descripción: Esta función crea el objeto Respuesta que se enviará a la base de datos.
      @Autor: @edisonmora95
      @FechaModificación: 
        04-10-2017 @edisonmora95 añadido campo de subrespuestas
    */
    crearRespuesta: function(idPregunta, idEstudiante, idLeccion, idParalelo, idGrupo, pregunta){
      //var idEditor = '#editor-' + pregunta._id; //Obtengo el id del editor en el que se encuantra la respuesta que se desea enviar.
      //var respuestaEditor = $(idEditor).code() //Obtengo la respuesta escrita
      const idTextarea        = '#textarea-' + idPregunta;
      const respuestaTextarea = $(idTextarea).val();
      const idSrcImage        = '#source_image-' + idPregunta;
      const urlImagen         = $(idSrcImage).attr('aux');
      // Armo el array de subrespuestas
      let arraySubrespuestas  = App.armarArraySubrespuestas(pregunta); //Si la pregunta no tiene subpreguntas, esto queda vacío
      var arraySubrespuestas2 = JSON.stringify(arraySubrespuestas);
      //arraySubrespuestas      = JSON.stringify(arraySubrespuestas);
      const respuesta         = {
        estudiante         : idEstudiante,
        leccion            : idLeccion,
        pregunta           : idPregunta,
        paralelo           : idParalelo,
        grupo              : idGrupo,
        contestado         : true,
        respuesta          : respuestaTextarea,
        feedback           : '',
        calificacion       : 0,
        imagenes           : urlImagen,
        arraySubrespuestas : arraySubrespuestas2
      };
      let respuesta_realtime = App.crearSocket(App.estudiante, App.grupo, idLeccion, idParalelo, pregunta, respuestaTextarea, urlImagen, arraySubrespuestas);
      socket.emit('respuesta estudiante', respuesta_realtime);
      return respuesta;
    },
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
        respuesta          : respuesta,
        feedback           : '',
        calificacion       : 0,
        imagenes           : urlImagen,
        arraySubrespuestas : arraySubrespuestas
      };
      return respuesta_realtime;
    },
    /*
      Dada la pregunta ingresada como parámetro, obtiene todas las subrespuestas ingresadas por el estudiante y las añade a un array con el orden de la pregunta a la que pertenece
    */
    armarArraySubrespuestas: function(pregunta){
      let arraySubrespuestas = [];
      for (let i = 0; i < pregunta.subpreguntas.length; i++) {
        let subActual    = pregunta.subpreguntas[i];
        let idTextarea   = '#textarea-sub-' + pregunta.orden + '-' + subActual.orden;
        let respuesta    = $(idTextarea).val();
        let idImgSrc     = '#result_image-' + pregunta.orden + '-' + subActual.orden;
        let imagen       = $(idImgSrc)[0].src;
        let subrespuesta = {
          respuesta    : respuesta,
          ordenPregunta: subActual.orden,
          feedback     : '',
          calificacion : 0,
          imagen       : imagen
        };
        arraySubrespuestas.push(subrespuesta);
      }
      return arraySubrespuestas;
    },
    /*
      Función del modal. Si el estudiante escoge la opción de corregir respuestas
    */
    revisarLeccion: function(){
      App.corregirHabilitado = true;
      $.each(App.preguntas, function(index, pregunta){
        let idTextarea = '#textarea-'      + pregunta;
        let idBtn      = '#btn-responder-' + pregunta;
        let idImgSrc   = '#result_image-'  + pregunta;
        let idFI       = '#fi-'            + pregunta;
        App.desbloquearRespuesta(idTextarea, idBtn, idImgSrc, idFI);
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
        url: url,
        method: 'GET',
        success: function(response) {
          //Si se encuentra la respuesta, se hace la llamada a la api para corregirla.
          var idRespuesta = response.datos._id;
          self.enviarCorreccion(idRespuesta, pregunta);
        }
      });
    },
    /*
      Esta función se ejecuta cuando el tiempo se ha terminado, automáticamente se envían todas las respuestas.
    */
    responderTodas: function(){
      $.each(App.preguntas, function(index, pregunta){
        if( !pregunta.respondida ){
          App.responder(pregunta);
        }
      });
      window.location.href = "/estudiantes";
    },
    getImageSub: function(pregunta, sub, event){
      //Primero hay que bloquear el botón de responder subpregunta
      let idBtn = '#btn-responder-sub-' + pregunta.orden + '-' + sub.orden;
      $(idBtn).attr('disabled', true);
      //Hay que mostrar el gif de loading
      const idLoading = '#loading-' + pregunta.orden + '-' + sub.orden;
      $(idLoading).show();
      //Obtengo la imagen ingresada
      let input = event.target;
      let idSrcImage = '#source_image-' + pregunta.orden + '-' + sub.orden;
      if( input.files && input.files[0] ){
        let reader = new FileReader();
        reader.onload = function(e){
          $(idSrcImage).attr('src', e.target.result).hide();
          App.comprimirSub(pregunta, sub);
        };
        reader.readAsDataURL(input.files[0]);
      }
    },
    comprimirSub: function(pregunta, sub){
      var output_format = "jpg";
      var source_image  = document.getElementById('source_image-'+pregunta.orden+'-'+sub.orden);
      var result_image  = document.getElementById('result_image-'+pregunta.orden+'-'+sub.orden);
      var quality       = 15;
      const idResultImg = '#result_image-'+pregunta.orden+'-'+sub.orden;

      $('#source_image-'+pregunta.orden+'-'+sub.orden).ready(function(){//Espera a que cargue la imagen para poder realizar la compresion
        result_image.src = jic.compress(source_image,quality,output_format).src;
        $(idResultImg).css({
                        'width' : '150px',
                        'height' : '150px'
                      })
                      .addClass('materialboxed')
                      .materialbox()
                      .hide();
      });
      
      $('#result_image-'+pregunta.orden+'-'+sub.orden).ready(function(){
        App.subirImagenSub((result_image.src).substring(23), pregunta, sub);//Se convierte el SRC de la imagen comprimida a un formato que el API de imgur pueda leer
      });
    },
    subirImagenSub: function(imagenSrc, pregunta, sub){
      let idBtn    = '#btn-responder-sub-' + pregunta.orden + '-' + sub.orden;
      let clientId = "300fdfe500b1718";
      let xhr      = new XMLHttpRequest();
      xhr.open('POST', 'https://api.imgur.com/3/image', true);
      xhr.setRequestHeader('Authorization', 'Client-ID ' + clientId);
      xhr.onreadystatechange = function(){
        if (xhr.status === 200 && xhr.readyState === 4) {
          $(idBtn).attr('disabled', false);
          let url = JSON.parse(xhr.responseText);
          Materialize.toast('Imagen subida exitosamente', 3000, 'rounded');

          var result_image  = document.getElementById('result_image-'+pregunta.orden+'-'+sub.orden);
          const idResultImg = '#result_image-'+pregunta.orden+'-'+sub.orden;
          result_image.src  = url.data.link;
          $(idResultImg).show();

          const idLoading = '#loading-' + pregunta.orden + '-' + sub.orden;
          $(idLoading).hide();

        }
        if (xhr.status === 400){
          Materialize.toast('<span style="color: red">Hubo un error al subir la imagen. Intentelo de nuevo.</span>', 5000, 'rounded');
        }
      }
      xhr.send(imagenSrc);//Envia la imagen
    },
    /*
      @Descripción: Esta función obtiene la imagen subida por el usuario
      @Autor: @edisonmora95, @jguilindro
      @FechaModificación: 19-07-2017 @jguilindro
    */
    getImage: function(pregunta, event) {
      $('#btn-responder-' + pregunta).attr("disabled", true);//Bloquear boton de envio
      $('#loading-'+ pregunta).hide();
      $('#source_image-'+pregunta).hide();
      $('#result_image-'+pregunta).hide();
      var input = event.target;
      if (input.files && input.files[0]) {
        var reader    = new FileReader();
        reader.onload = function (e) {
          $('#source_image-'+pregunta).attr('src', e.target.result);
          $('#loading-'+ pregunta).show();//Muestra loading
          App.comprimir(pregunta);//Comprime la imagen obtenida
        };
        reader.readAsDataURL(input.files[0]);
      }
    },
    /*
      @Descripción: Esta función comprime una imagen subida por el usuario
      @Autor: @edisonmora95, @jguilindro
      @FechaModificación: 19-07-2017 @jguilindro
      @Params:
        pregunta -> id de la pregunta a la cual se responde con la imagen
    */
    comprimir: function(pregunta){
      var output_format = "jpg";
      var source_image  = document.getElementById('source_image-'+pregunta);
      var result_image  = document.getElementById('result_image-'+pregunta);
      var quality       = 15;
      $('#source_image-'+pregunta).ready(function(){//Espera a que cargue la imagen para poder realizar la compresion
        result_image.src = jic.compress(source_image,quality,output_format).src;
      });

      $('#result_image-'+pregunta).ready(function(){
        App.subirImagen((result_image.src).substring(23), pregunta);//Se convierte el SRC de la imagen comprimida a un formato que el API de imgur pueda leer
      });
    },
    /*
      @Descripción: Esta función sube la imagen comprimida a imgur y devuelve la url.
      @Autor: @jguilindro
      @FechaModificación: 19-07-2017 @jguilindro
    */
    subirImagen: function(imagenSrc, pregunta){
      var clientId = "300fdfe500b1718";
      var xhr      = new XMLHttpRequest();
      xhr.open('POST', 'https://api.imgur.com/3/image', true);
      xhr.setRequestHeader('Authorization', 'Client-ID ' + clientId);
      xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
          App.loading(false);
          var url = JSON.parse(xhr.responseText)
          Materialize.toast('Imagen subida exitosamente', 5000, 'rounded');

          var idSrcImage = '#source_image-' + pregunta;
          $(idSrcImage).attr('aux', url.data.link);

          var result_image = document.getElementById('result_image-'+pregunta);
          $('#result_image-'+pregunta).attr('src', url.data.link);

          var image_width=$(result_image).width(), image_height=$(result_image).height();

          if(image_width > image_height){
            result_image.style.width="320px";
          }else{
            result_image.style.height="300px";
          }
          result_image.style.display = "block";
          $('#loading-'+ pregunta).hide();//Esconde loading
          document.getElementById('result_image-'+ pregunta).setAttribute("hidden", false);
          $('#btn-responder-' + pregunta).attr("disabled", false);
        }
        if (xhr.status === 400){
          Materialize.toast('<span style="color: red">Hubo un error al subir la imagen. Intentelo de nuevo.</span>', 5000, 'rounded');
        }
      }
      xhr.send(imagenSrc);//Envia la imagen
    },
    /*
      Primero se bloquea el textarea y el botón para evitar que el estudiante lo presione varias veces
      Primero verifica si la pregunta que responde está dentro de una sección la cual ya ha sido respondida previamente
    */
    responderSub: function(pregunta, sub){
      const idEstudiante = App.estudiante._id;
      const idLeccion    = App.leccion._id;
      const idParalelo   = App.estudiante.paralelo;
      const idGrupo      = App.estudiante.grupo;
      //Primero bloqueo enseguida el textarea y el botón de la respuesta enviada
      const idTextarea   = '#textarea-sub-'      + pregunta.orden + '-' + sub.orden;
      const idBtn        = '#btn-responder-sub-' + pregunta.orden + '-' + sub.orden;
      const idFileInput  = '#fi-'                + pregunta.orden + '-' + sub.orden;
      $(idTextarea).attr("disabled", true);
      $(idBtn).attr("disabled", true);
      $(idFileInput).attr('disabled','disabled');
      //Se añade el loading
      App.loading(true, idBtn);
      //Se crea el objeto Respuesta que se enviará a la base de datos
      const respuesta    = App.crearRespuesta(pregunta._id, idEstudiante, idLeccion, idParalelo, idGrupo, pregunta);  
      //Verifico si la pregunta(sección) ya ha sido respondida anteriormente
      if( pregunta.respondida ){
        //Se debe actualizar el registro de la colección de Respuestas
        const obj = {
          leccion       : App.leccion._id,
          pregunta      : pregunta._id,
          estudiante    : App.estudiante._id,
          subrespuestas : respuesta.arraySubrespuestas
        };
        App.enviarSubrespuestas(obj, sub, pregunta); //ESTO ES AJAX
      }else{
        //Se debe crear el registro en la colección de Respuestas
         App.enviarRespuestaSeccion(respuesta, sub, pregunta); //AJAX
      }
    }
   },
  data: {
    tiempo    : '',
    leccion   : {},
    preguntas : [],
    estudiante: {},
    respuesta : {
      respuesta     : '',
      feedback      : '',
      calificacion  : 0,
      fechaRespuesta: '',
      grupo         : '',
      pregunta      : '',
      leccion       : '',
      imagenes      : ''
    },
    respuestas: [],
    corregirHabilitado: false,
    flag: false,
    dataFinishedLoading : false
  }
});

socket.on('tiempo restante', function(tiempo) {
  App.tiempo = tiempo
})

socket.on('terminado leccion', function(match) {
  socket.disconnect();
  const noEsTutorial       = ( App.leccion.tipo != 'tutorial' );
  const esFisicaConceptual = ( App.leccion.codigoMateria == 'FISG2001' ); 
  if( esFisicaConceptual ){
    App.responderTodas();  
  }else{
    if( noEsTutorial ){
      App.responderTodas();
    }
  }
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

