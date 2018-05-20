
const materias = ['Física 2', 'Física 3', 'Física Conceptual'];
const grupos = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'];
const paralelos = ['1', '2', '3', '4', '5'];
const ejercicios = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'];
const capitulos = ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '34B','35', '36', '37'];

//ARRAY QUE CONTIENE A LOS ARRAYS DE CALIFICACIONES DE CADA EJERCICIO
let arrayCalificaciones = [
  [],       //calificacionE1
  [],       //calificacionE2
  [],       //calificacionE3
  [],       //calificacionE4
  [],       //calificacionE5
  [],       //calificacionE6
  [],       //calificacionE7
  [],       //calificacionE8
  [],       //calificacionE9
  [],       //calificacionE10
  [],       //calificacionE11
  [],       //calificacionE12
  [],       //calificacionE13
  [],       //calificacionE14
  [],       //calificacionE15
  [],       //calificacionE16
  []        //calificacionE17
];

let rubricaApp = new Vue({
  el: '#rubricaApp',
  created: function(){
    this.obtenerLogeado();
  },
  mounted: function(){
    this.inicializarMaterialize();
    this.inicializarDOM(this);
    esconderDivs();
  },
  data: {
    profesor: {},
    grupos  : grupos,
    paralelos : paralelos,
    ejercicios: ejercicios,
    capitulos : capitulos,
    ಠ_ಠ: '',
    Ѿ: moment().format("DD/MM/YYYY"),
    materia  : '',
    paralelo : '',
    grupo    : '',
    capitulo : '',
    ejercicio: '',
    evaluador: '',
    calificacion  : 0,
    calificaciones: [],
    planteamiento: '0',
    desarrollo   : '0',
    fisicos      : '0',
    matematicos  : '0',
    respuesta    : '0',
    equipo       : '0'
  },
  watch: {
    planteamiento: function(value) {
      this.calificacion = sumarCalificaciones([this.planteamiento, this.desarrollo, this.fisicos, this.matematicos, this.respuesta, this.equipo])
      this.calificacion = ponderarCalificacion(this.calificacion)
    },
    desarrollo: function(value) {
      this.calificacion = sumarCalificaciones([this.planteamiento, this.desarrollo, this.fisicos, this.matematicos, this.respuesta, this.equipo])
      this.calificacion = ponderarCalificacion(this.calificacion)
    },
    fisicos: function(value) {
      this.calificacion = sumarCalificaciones([this.planteamiento, this.desarrollo, this.fisicos, this.matematicos, this.respuesta, this.equipo])
      this.calificacion = ponderarCalificacion(this.calificacion)
    },
    matematicos: function(value) {
      this.calificacion = sumarCalificaciones([this.planteamiento, this.desarrollo, this.fisicos, this.matematicos, this.respuesta, this.equipo])
      this.calificacion = ponderarCalificacion(this.calificacion)
    },
    respuesta: function(value) {
      this.calificacion = sumarCalificaciones([this.planteamiento, this.desarrollo, this.fisicos, this.matematicos, this.respuesta, this.equipo])
      this.calificacion = ponderarCalificacion(this.calificacion)
    },
    equipo: function(value) {
      this.calificacion = sumarCalificaciones([this.planteamiento, this.desarrollo, this.fisicos, this.matematicos, this.respuesta, this.equipo])
      this.calificacion = ponderarCalificacion(this.calificacion)
    }
  },
  methods: {
    //////////////////////////////////////
    //Llamadas a la base de datos
    //////////////////////////////////////
    obtenerLogeado () {
      this.$http.get('/api/session/usuario_conectado').then(response => {
        this.profesor = response.body.datos;
      });
    },
    obtenerRegistros (urlApi) {
      $.ajax({
        type: 'GET',
        url : urlApi,
        success (res) {
          console.log(res)
          if (res.estado) {
            if (res.datos.length !== 0) {
              armarArrayCalificaciones(res.datos, arrayCalificaciones);
            }
          }
        },
        error (res) {

        }
      });
    },
    //////////////////////////////////////
    //Inicializadores
    //////////////////////////////////////
    inicializarMaterialize () {
      $('.button-collapse').sideNav();
      $(".dropdown-button").dropdown({ hover: false });
      $('select').material_select();
      $('.modal').modal({
        dismissible: false, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
      });
    },
    inicializarDOM (self) {
      bloquearSelects();
      /* Funciones onChange */
      $('#selectMateria').change(() => {
        self.materia = $('#selectMateria option:selected').text();
        desbloquearSelectMaterialize('#selectCapitulo');
      });
      $('#selectCapitulo').change(function(){
        self.capitulo = $('#selectCapitulo option:selected').text();
        desbloquearSelectMaterialize('#selectParalelo');
      });
      $('#selectParalelo').change(function(){
        self.paralelo = $('#selectParalelo option:selected').text();
        desbloquearSelectMaterialize('#selectGrupo');
      });
      // Al seleccionar el grupo, se debe llamar a la base de datos para obtener los registros de todos los ejercicios
      $('#selectGrupo').change(function(){
        self.grupo = $('#selectGrupo option:selected').text();
        let urlApi = '/api/rubrica/paralelo/' + self.paralelo + '/grupo/' + self.grupo + '/capitulo/' + self.capitulo;
        self.obtenerRegistros(urlApi);
        desbloquearSelectMaterialize('#selectEjercicio');
      });
      $('#selectEjercicio').change(function(){
        let ejercicioSeleccionado = $('#selectEjercicio option:selected').text();
        self.ejercicio = ejercicioSeleccionado;
        self.mostrarCalificacionesEjercicioSeleccionado(self, ejercicioSeleccionado - 1, arrayCalificaciones);
        mostrarDivs();
      });

      $('.calificacion').on('change paste', function(){
        //Cada vez que el profesor ingresa una calificación a una regla de la rúbrica se debe actualizar el valor del total
        let calificacionNoPonderada = self.sumarCalificaciones(idsInput);
        self.calificacion = self.ponderarCalificacion(calificacionNoPonderada).toFixed(2);
      });
    },
    //////////////////////////////////////
    //Helpers
    //////////////////////////////////////
    /*
      @Descripción:
        Inicializa los valores de los inputs del ejercicio indicado con los valores almacenados de las calificaciones del ejercicio
      @Params:
        numEjercicio -> número del ejercicio seleccionado, el cual se va a calificar o recalificar
        arrayCalificaciones -> array que contiene las calificaciones de todos los 15 ejercicios
    */
    mostrarCalificacionesEjercicioSeleccionado: function(self, numEjercicio, arrayCalificaciones){
      //Primero selecciono el ejercicio que se quiere mostrar del array de calificaciones
      let calificacionesEjercicio = arrayCalificaciones[numEjercicio];  //Array que contiene las calificaciones de los input del ejercicio seleccionado
      if(calificacionesEjercicio.length > 0){
        //Luego inicializo todos los inputs con los valores indicados en el array seleccionado
        for(let i = 0; i < calificacionesEjercicio.length; i++) {
          if (calificacionesEjercicio[i].regla === 'Planteamiento') {
            self.planteamiento = calificacionesEjercicio[i].calificacion;
            continue;
          } else if (calificacionesEjercicio[i].regla === 'Desarrollo') {
            self.desarrollo = calificacionesEjercicio[i].calificacion;
            continue;
          } else if (calificacionesEjercicio[i].regla === 'Físicos') {
            self.fisicos = calificacionesEjercicio[i].calificacion;
            continue;
          } else if (calificacionesEjercicio[i].regla === 'Matemáticos') {
            self.matematicos = calificacionesEjercicio[i].calificacion;
            continue;
          } else if (calificacionesEjercicio[i].regla === 'Respuesta') {
            self.respuesta = calificacionesEjercicio[i].calificacion;
          }
        }
      }else{
        console.log('Este ejercicio no tiene registros de calificaciones en la base de datos');
        self.planteamiento = '0';
        self.desarrollo = '0';
        self.fisicos = '0';
        self.matematicos = '0';
        self.respuesta = '0';
      }

    },    
    //////////////////////////////////////
    //Eventos
    //////////////////////////////////////
    calificar () {
      //Bloquear btn
      $('#btn-calificar').attr("disabled", true);
      this.calificaciones = [
        {
          regla: 'Planteamiento',
          calificacion: this.planteamiento
        },
        {
          regla: 'Desarrollo',
          calificacion: this.desarrollo
        },
        {
          regla: 'Físicos',
          calificacion: this.fisicos
        },
        {
          regla: 'Matemáticos',
          calificacion: this.matematicos
        },
        {
          regla: 'Respuesta',
          calificacion: this.respuesta
        }
      ];
      let rubrica = {
        materia      : this.materia,
        paralelo     : this.paralelo,
        grupo        : this.grupo,
        capitulo     : this.capitulo,
        ejercicio    : this.ejercicio,
        calificacion : this.calificacion,
      };
      rubrica            = JSON.stringify(rubrica);
      let calificaciones = JSON.stringify(this.calificaciones);
      const obj = {
        rubrica        : rubrica,
        calificaciones : calificaciones
      };
      console.log(obj)
      this.llamadaApi(obj);
    },
    llamadaApi (data) {
      $.ajax({
        type: 'POST',
        url : '/api/rubrica/',
        data: data,
        success (res) {
          if(res.estado){
            $('#modalCalificacionExitosa').modal('open');
          }
          //Actualizar los valores el array
        },
        error (err) {
          $('#btn-calificar').attr("disabled", false);
          console.log(err)
        }
      });
    },
  }
});

function bloquearSelects () {
  $("#selectCapitulo").prop('disabled',true);
  $("#selectParalelo").prop('disabled',true);
  $("#selectGrupo").prop('disabled',true);
  $("#selectEjercicio").prop('disabled',true);
  $('select').material_select();
}
function sumarCalificaciones (calificaciones) {
  let suma = 0;
  for (let i = calificaciones.length - 1; i >= 0; i--) {
    suma += parseInt(calificaciones[i])
  }
  return suma;
}
function ponderarCalificacion (calificacionNoPonderada){
    const calificacionMaxima = 18;
    let calificacionPonderada = ( ( calificacionNoPonderada * 15 ) / calificacionMaxima );
    return calificacionPonderada;
}
function desbloquearSelectMaterialize (idSelect) {
  $(idSelect).prop('disabled', false);
  $(idSelect).material_select();
}
function esconderDivs () {
  $('#seccionReglas').css('display', 'none');
  $('#seccionBotones').css('display', 'none');
}
function mostrarDivs () {
  $('#seccionReglas').css('display', 'block');
  $('#seccionBotones').css('display', 'block');
}
/*
  @Descripción: Arma el array de calificaciones global con los datos de la base de datos
    Recorre el array de registros obtenidos de la base de datos
    Añade cada registro al array en la posición correspondiente según su # de ejercicio
  @Params:
    arrayRegistrosBDD -> array de registros de ejercicios obtenidos de la base de datos
    arrayCalificaciones -> array de calificaciones global
*/
function armarArrayCalificaciones (arrayRegistrosBDD, arrayCalificaciones) {
  for (let i = 0; i < arrayRegistrosBDD.length; i++) {
    let indice = arrayRegistrosBDD[i].ejercicio - 1;
    arrayCalificaciones[indice] = arrayRegistrosBDD[i].calificaciones;
  }
  console.log({arrayCalificaciones})
}