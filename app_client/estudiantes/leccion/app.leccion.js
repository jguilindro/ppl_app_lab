
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
    $.when( self.obtenerUsuario() ).then( function(){
      self.anadirRespuestas(self, self.respuestas, self.preguntas);
      self.desbloquearTabs();
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
    desbloquearTabs: function(){
      //Si la lección no es un tutorial entonces las preguntas no tienen que estar bloqueadas
      if( App.leccion.tipo != 'tutorial' ){
        $("#ul-tabs>li").removeClass("disabled");
      }else{
        $('#tab-1').removeClass('disabled');    //Se desbloquea la primera sección para que el estudiante la responda  
      }
    },
    /*
      Función que indicará que una foto se está subiendo (si tuviera lo alto y ancho podría simular a la foto en sí.)
      Requiere el estado, si está cargando algo o no.
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
    bloquearBtnRespuesta: function(pregunta){
      const btnId = '#btn-responder-' + pregunta._id;
      $(btnId).attr("disabled", true);
    },
    bloquearTextAreaRespondida: function(pregunta){
      const textAreaId = "#textarea-" + pregunta._id;
      $(textAreaId).attr("disabled", true);
    },
    bloquearEditor: function(pregunta){
      //TODO
    },
    mostrarModal: function(imageUrl){
      $("#modal_Img .modal-content").empty();
      $("<img>",{'src': imageUrl, 'class' : 'center-block' }).appendTo("#modal_Img .modal-content")
      $('#modal_Img').modal('open');
    },
    //////////////////////////////////////////////////////
    //LLAMADAS A LA API
    //////////////////////////////////////////////////////
    obtenerUsuario: function(){
      $.get({
        url    : '/api/estudiantes/leccion/datos_leccion',
        success: function(res) {
          if( res.estado ) {
            //Primero se verifica si el paralelo del estudiante está tomando lección
            if ( !res.datos.paralelo.dandoLeccion ) {
              window.location.href = '/estudiantes';  //Si no está tomando lección se lo redirige al perfil
            }
            App.asignarValoresObtenidos(res);
            socket.emit('usuario', App.estudiante);
          }
        }
      });
    },
    /*
      Función que se ejecutará para enviar una respuesta por primera vez
      Si se pudo enviar la respuesta, se marca la pregunta como respondida
    */
    enviarRespuesta: function(self, pregunta, idEstudiante, idLeccion, idParalelo, idGrupo){
      const respuesta = self.crearRespuesta(pregunta._id, idEstudiante, idLeccion, idParalelo, idGrupo, pregunta);  //Se crea el objeto Respuesta que se enviará a la base de datos
      const urlApi    = '/api/respuestas/';
      $.ajax({
        url    : urlApi,
        type   : 'POST',
        data   : respuesta,
        success: function(res){
          if( res.estado ){
            Materialize.toast('¡Su respuesta ha sido enviada!', 5000, 'rounded');
            pregunta.respondida    = true; //Marco que la pregunta ha sido respondida, para que no pueda corregirla hasta que termine la lección.
            const todasRespondidas = self.verificarTodasRespondidas(self, self.preguntas);
            if( todasRespondidas ){
              $('#modalRevisarRespuestas').modal('open');
            }
          }
        },
        error: function(err){
          Materialize.toast('¡Algo ha pasado!, no hemos podido enviar su respuesta', 1000, 'rounded');
          console.log(err);
          self.desbloquearBtnRespuesta(pregunta);
          self.desbloquearTextAreaRespondida(pregunta);
        }
      });
    },
    /*
      Esta función hace la llamada a la api para corregir la respuesta.
    */
    enviarCorreccion: function(idRespuesta, pregunta){
      //var idEditor = '#editor-' + pregunta._id; //Obtengo el id del editor en el que se encuantra la respuesta que se desea enviar.
      //var respuestaEditor = $(idEditor).code() //Obtengo la respuesta escrita
      const urlPut            = "/api/respuestas/" + idRespuesta;
      const idTextarea        = '#textarea-' + pregunta._id;
      const respuestaTextarea = $(idTextarea).val();
      const resp              = {respuesta: respuestaTextarea}
      //var resp = {respuesta: respuestaEditor}
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
        url: '/api/respuestas/',
        type: 'PUT',
        data: respuesta,
        success: function(res){
          sub.respondida = true;
          Materialize.toast('¡Su respuesta ha sido enviada!', 5000, 'rounded');
          //Se debe verificar si se han respondido a todas las preguntas de la sección
          if( App.verificarPreguntasSeccion(pregunta) ){
            console.log('Se han respondido a todas las subpreguntas de la sección actual')
            //Se desbloquea la siguiente sección
            let cont = pregunta.orden;
            cont++;
            $('#tab-' + cont).removeClass('disabled');  
          }else{
            console.log('Aún no responde a todas las preguntas de la sección actual.')
          }
          App.loading(false, idBtn);
        },
        error: function(err){
          App.loading(false, idBtn);
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
          //Una vez creado el registro correctamente, se debe marcar la subpregunta como respondida
          sub.respondida      = true;
          pregunta.respondida = true;
          Materialize.toast('¡Su respuesta ha sido enviada!', 5000, 'rounded');
          //Se debe verificar si se han respondido a todas las preguntas de la sección
          if( App.verificarPreguntasSeccion(pregunta) ){
            console.log('Se han respondido a todas las subpreguntas de la sección actual')
            //Se desbloquea la siguiente sección
            let cont = pregunta.orden;
            cont++;
            $('#tab-' + cont).removeClass('disabled');  
          }else{
            console.log('Aún no responde a todas las preguntas de la sección actual.')
          }
          App.loading(false, idBtn);
        },
        error  : function(err){
          //Si no se pudo enviar la respuesta, se avisa al estudiante y se desbloquea el textarea y el botón
          Materialize.toast('¡Algo ha pasado!, no hemos podido enviar su respuesta', 1000, 'rounded');
          console.log(err);
          $('#textarea-sub-'      + pregunta.orden + '-' + sub.orden).attr("disabled", false);
          $('#btn-responder-sub-' + pregunta.orden + '-' + sub.orden).attr("disabled", false);
          sub.respondida      = false;
          pregunta.respondida = false;
          App.loading(false, idBtn);
        }
      });
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
      Se ingresan las respuestas que el estudiante ha escrito a los textareas correspondientes
      Se marca la pregunta correspondiente como respondida
      Se bloquean los textareas y botones de las preguntas respondidas
      Se revisa si todas las preguntas han sido respondidas
    */
    anadirRespuestas: function(self, arrayRespuestas, arrayPreguntas) {
      arrayRespuestas.forEach(function(res) {
        //Se añade la respuesta al textarea correspondiente
        let idTextarea = '#textarea-' + res.pregunta;
        $(idTextarea).val(res.respuesta);
        arrayPreguntas.forEach(function(pregunta){
          //Se marca la pregunta correspondiente como respondida
          if( res.pregunta === pregunta._id ){
            if( res.subrespuestas.length > 0 && App.leccion.tipo === 'tutorial' ){
              //Se arman las subrespuestas
              self.anadirSubrespuestas(self, res.subrespuestas, pregunta);
            }else{
              pregunta.respuesta  = res.respuesta;
              pregunta.respondida = true;
              self.bloquearTextAreaRespondida(pregunta);
              self.bloquearBtnRespuesta(pregunta);
            }
          }
        });
      });
      // Se revisa si todas las preguntas han sido respondidas
      const todasRespondidas = self.verificarTodasRespondidas(self, self.preguntas);
      if( todasRespondidas && App.leccion.tipo != 'tutorial' ){
        $('#modalRevisarRespuestas').modal('open');
      }
    },
    /*
      Se añaden las respuestas a las preguntas de la sección que el estudiante ya haya enviado previamente
      Se busca la pregunta correspondiente comparando el orden de la respuesta con el orden de la pregunta
      Como al responder una pregunta en tutorial, se crea el array de todas las subrespuestas, se hacer una verificación
       para solo añadir la respuesta que sea diferente de vacío
    */
    anadirSubrespuestas: function(self, arraySubrespuestas, pregunta){
      arraySubrespuestas.forEach( function(subRes){
        pregunta.subpreguntas.forEach( function(subPreg){
          if( subRes.ordenPregunta == subPreg.orden ){
            let textareaId = '#textarea-sub-'      + pregunta.orden + '-' + subRes.ordenPregunta;
            let btnId      = '#btn-responder-sub-' + pregunta.orden + '-' + subRes.ordenPregunta;
            //Solo añado la respuesta si no está vacía
            if( subRes.respuesta != '' && subRes.respuesta != null ){
              $(textareaId).val(subRes.respuesta);
              $(textareaId).attr("disabled", true);
              $(btnId).attr("disabled", true);
              subPreg.respondida = true;
              pregunta.respondida = true;
            }
          }
        });
      });
      if( App.verificarPreguntasSeccion(pregunta) ){
        console.log('Se han respondido a todas las subpreguntas de la sección actual')
        let cont            = pregunta.orden;
        cont++;
        $('#tab-' + cont).removeClass('disabled')  
      }else{
        console.log('Aún no responde a todas las preguntas de la sección actual.')
      }
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
      Dada la pregunta ingresada como parámetro, obtiene todas las subrespuestas ingresadas por el estudiante y las añade a un array con el orden de la pregunta a la que pertenece
    */
    armarArraySubrespuestas: function(pregunta){
      let arraySubrespuestas = [];
      for (let i = 0; i < pregunta.subpreguntas.length; i++) {
        let subActual    = pregunta.subpreguntas[i];
        let idTextarea   = '#textarea-sub-' + pregunta.orden + '-' + subActual.orden;
        let respuesta    = $(idTextarea).val();
        let subrespuesta = {
          respuesta    : respuesta,
          ordenPregunta: subActual.orden,
          feedback     : '',
          calificacion : 0,
          imagen       : ''
        };
        arraySubrespuestas.push(subrespuesta);
      }
      return arraySubrespuestas;
    },
    /*
      Esta función verifica si el estudiante ha respondido todas las preguntas de la lección
    */
    verificarTodasRespondidas: function(self, arrayPreguntas){
      let todasRespondidas = true;
      $.each(arrayPreguntas, function(index, pregunta){
        if( !pregunta.respondida ){
          console.log('La pregunta:', pregunta.nombre, ' no ha sido respondida')
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
      //Apenas da click en el botón se bloquea el textarea y el botón
      self.bloquearBtnRespuesta(pregunta);
      self.bloquearTextAreaRespondida(pregunta);
      //self.bloquearEditor(pregunta);
      if( !pregunta.respondida ){       //Caso normal, responde por primera vez a la pregunta indicada
        self.enviarRespuesta(self, pregunta, idEstudiante, idLeccion, idParalelo, idGrupo);
      }else{                            //Si ya ha enviado una respuesta a la pregunta indicada
        if( self.corregirHabilitado ){  //Si ya puede corregir las respuestas
          self.corregirRespuesta(self, pregunta, idLeccion, idEstudiante);
        }else{                         //Si no puede corregir las respuestas
          $('#modalCorregirRespuesta').modal('open');
       }
     }
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
          var url = JSON.parse(xhr.responseText)
          Materialize.toast('Imagen subida exitosamente', 5000, 'rounded');
           var idSrcImage = '#source_image-' + pregunta;
           $(idSrcImage).attr('aux', url.data.link);
           var result_image = document.getElementById('result_image-'+pregunta);
           $('#result_image-'+pregunta).attr('src', url.data.link);
           var image_width=$(result_image).width(), image_height=$(result_image).height();
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
      arraySubrespuestas      = JSON.stringify(arraySubrespuestas);
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
        arraySubrespuestas : arraySubrespuestas
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
        let subrespuesta = {
          respuesta    : respuesta,
          ordenPregunta: subActual.orden,
          feedback     : '',
          calificacion : 0,
          imagen       : ''
        };
        arraySubrespuestas.push(subrespuesta);
      }
      return arraySubrespuestas;
    },
    bloquearBtnRespuesta: function(pregunta){
      const btnId = '#btn-responder-' + pregunta._id;
      $(btnId).attr("disabled", true);
    },
    bloquearTextAreaRespondida: function(pregunta){
      const textAreaId = "#textarea-" + pregunta._id;
      $(textAreaId).attr("disabled", true);
    },
    bloquearEditor: function(pregunta){
      //TODO
    },
    /*
      Esta función verifica si el estudiante ha respondido todas las preguntas de la lección
    */
    verificarTodasRespondidas: function(self, arrayPreguntas){
      let todasRespondidas = true;
      $.each(arrayPreguntas, function(index, pregunta){
        if( !pregunta.respondida ){
          console.log('La pregunta:', pregunta.nombre, ' no ha sido respondida')
          todasRespondidas = false;
          return false;
        }
      });
      return todasRespondidas;
    },
    /*
      Función del modal. Si el estudiante escoge la opción de corregir respuestas
    */
    revisarLeccion: function(){
      App.corregirHabilitado = true; //Se habilita la opción de corregir las respuestas enviadas.
      $.each(App.preguntas, function(index, pregunta){
        //Se vuelven a habilidar los botones y las textareas de todas las preguntas para poder corregir
        App.desbloquearBtnRespuesta(pregunta);
        App.desbloquearTextAreaRespondida(pregunta);
      });
    },
    desbloquearTextAreaRespondida: function(pregunta){
      var textAreaId = "#textarea-" + pregunta._id;
      $(textAreaId).attr("disabled", false);
    },
    desbloquearEditor: function(pregunta){
      //TODO
    },
    desbloquearBtnRespuesta: function(pregunta){
      var btnId = "#btn-responder-" + pregunta._id;
      $(btnId).attr("disabled", false);
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
      const idTextarea = '#textarea-sub-'      + pregunta.orden + '-' + sub.orden;
      const idBtn      = '#btn-responder-sub-' + pregunta.orden + '-' + sub.orden;
      $(idTextarea).attr("disabled", true);
      $(idBtn).attr("disabled", true);
      //Se añade el loading
      App.loading(true, idBtn);
      //Se crea el objeto Respuesta que se enviará a la base de datos
      const respuesta    = App.crearRespuesta(pregunta._id, idEstudiante, idLeccion, idParalelo, idGrupo, pregunta);  
      //Verifico si la pregunta(sección) ya ha sido respondida anteriormente
      if( pregunta.respondida ){
        //Tal vez debería verificar si no ha respondido previamente a esta subpregunta
        console.log('Ya ha respondido a una pregunta dentro de esta sección');
        //Se debe actualizar el registro de la colección de Respuestas
        const obj = {
          leccion       : App.leccion._id,
          pregunta      : pregunta._id,
          estudiante    : App.estudiante._id,
          subrespuestas : respuesta.arraySubrespuestas
        };
        App.enviarSubrespuestas(obj, sub, pregunta); //ESTO ES AJAX
      }else{
        console.log('Esta es la primera pregunta que responde de la sección');
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
    flag: false
  }
});

socket.on('tiempo restante', function(tiempo) {
  App.tiempo = tiempo
})

socket.on('terminado leccion', function(match) {
  socket.disconnect() 
  App.responderTodas();
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

