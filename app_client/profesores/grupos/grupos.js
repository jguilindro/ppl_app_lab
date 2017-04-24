/*
Flujo: profesorLogeado => obtenerTodosParalelosProfesor => obtenerTodosGrupos => estudiantesNoEnGrupo

 */
// TODO: que no recage todo el dom al eliminar, cambiar de grupo o anadir a grupo
// TODO: al crear un grupo que lo anada a los grupos

var grupos_animation

var app = new Vue({
  mounted: function(){
    $('.button-collapse').sideNav();
    $(".dropdown-button").dropdown({ hover: false });
    $('select').material_select();
  },

	el: '#grupos',
  methods: {
    profesorLogeado: function() {
      this.$http.get(`/api/session/usuario_conectado`).then(response => {
        this.profesor = response.body.datos
        this.obtenerTodosParalelosProfesor()
      }, response => {
        console.error('error')
      });
		},
    obtenerTodosParalelosProfesor: function() {
      this.$http.get(`/api/paralelos/profesores/mis_paralelos`).then(response => {
        this.paralelos = response.body.datos
        if (this.contador_global == 0) {
          this.paralelo_seleccionado = app.paralelos[0]._id
        }
        this.contador_global = this.contador_global + 1
        this.obtenerTodosGrupos()
      }, response => {
        console.error('error')
      });
		},
    obtenerTodosGrupos: function () {
      // limpiar todo
      this.grupos = []
      this.estudiantes = []
      this.estudiantesSinGrupo = []
      var promesas = []
      this.paralelos.forEach(paralelo => {
        if (this.paralelo_seleccionado === paralelo._id) {
          paralelo.grupos.forEach(grupo => {
            promesas.push(new Promise((resolve, reject) => {
              this.$http.get(`/api/grupos/${grupo._id}`).then(response => {
                if (response.body.estado) return resolve(response.body.datos)
                return reject(response.body.datos)
              });
            }))
          })
        }
      })
      Promise.all(promesas).then(result => {
        result.forEach(grupo => {
          this.grupos.push(grupo)
        })
        this.obtenerTodosEstudiantes()
      }, fail => {
        console.log(fail)
      })
    },
    obtenerTodosEstudiantes: function() {
      if (this.grupos.length == 0) {
        this.nuevoGrupo()
      }
      let cont = 0
      this.paralelos.forEach(paralelo => {
        if (paralelo._id == this.paralelo_seleccionado) {
          this.estudiantes = this.paralelos[cont].estudiantes
        }
        cont = cont + 1
      })
      this.estudiantesNoEnGrupo()
    },
    estudiantesNoEnGrupo: function() {
      let temp = []
      this.grupos.forEach( grupo => {
        grupo.estudiantes.forEach( estudiante => {
          temp.push(estudiante._id);
        })
      })
      this.estudiantes.forEach((es) => {
        if (!temp.includes(es._id)) {
          this.estudiantesSinGrupo.push(es)
        }
      })
    },
    anadirEstudianteAGrupo: function(index_grupo,estudiante) {
      var grupo_drop = this.grupos[index_grupo]
      this.$http.post(`/api/grupos/${this.grupos[index_grupo]._id}/estudiantes/${estudiante._id}`).then(response => {
      }, response => {
      });

      this.grupos.forEach(grupo => {
        grupo.estudiantes.forEach(est => {
          if (est._id === estudiante._id) {
            this.$http.delete(`/api/grupos/${grupo._id}/estudiantes/${est._id}`).then(response => {
              if (response.body.estado) {
              }
            }, response => {
              // codigo error
            });
          }
        })
      })

      // limpiar los estudiantes si existen en sin grupo
      this.estudiantesSinGrupo = this.estudiantesSinGrupo.filter(est => est._id != estudiante._id)

      // eliminar estudiante de grupo
      this.grupos = this.grupos.map( grupo => {
        let estudiantes = grupo.estudiantes.filter(est => est._id != estudiante._id )
        grupo.estudiantes = estudiantes
        return grupo
      })

      // anadir estudiante al grupo que se hizo drop
      this.grupos = this.grupos.map( grupoActual =>{
        if (grupoActual._id == grupo_drop._id) {
          grupoActual.estudiantes.push(estudiante)
          return grupoActual
        }
        return grupoActual
      })

    },
    nuevoGrupo() {
      listeners() // OJO listenrs paralelo
      var ultimo_grupo = []
      // var nombre_grupo = $('#grupo-nombre').val()
      // $('#grupo-nombre').val('');
      if (this.grupos != 0) {
        ultimo_grupo = this.grupos[this.grupos.length - 1].nombre.split(' ')
        nombre_grupo = `Grupo ${parseInt(ultimo_grupo[1]) + 1}`
      } else {
        nombre_grupo = `Grupo 1`
      }
      this.$http.post(`/api/grupos`,{nombre: nombre_grupo}).then( res => {
        if (res.body.estado) {
          let nuevo_paralelo = res.body.datos
          this.$http.post(`/api/paralelos/${this.paralelo_seleccionado}/grupos/${nuevo_paralelo._id}`).then(res => {
            if (res.body.estado) {
              //this.obtenerTodosGrupos
              this.grupos.push(nuevo_paralelo)
            }
          })
        }
      })

    },
    eliminarGrupo(id_grupo) {
      this.$http.delete(`/api/paralelos/${this.paralelo_seleccionado}/grupos/${id_grupo}`).
      then(res => {
        if (res.body.estado) {
          let cont = 0
					this.$http.delete(`/api/grupos/${id_grupo}`).
					then(res => {
						this.grupos.forEach(grupo => {
	            if (grupo._id == id_grupo) {
				        this.borrarGrupo(grupo);
	              this.grupos.splice(cont, 1)
	            }
	            cont = cont + 1
	          })
					})
        }
      })
  },
  borrarAlumno(grupo, estudiante) {
	  this.grupos = this.grupos.map( grupo => {
        let estudiantes = grupo.estudiantes.filter(est => est._id != estudiante._id )
        grupo.estudiantes = estudiantes
        return grupo
      })
	  // anadir estudiante a sin grupo
	  this.estudiantesSinGrupo.push(estudiante)
  },
  borrarGrupo(grupo) {
	  if (grupo.estudiantes.length != 0) {
		  this.estudiantesSinGrupo = [...this.estudiantesSinGrupo, ...grupo.estudiantes]
	  }
  },
  guardarGruposParalelo() {
    let cont = 1
    this.paralelos.forEach(paralelo => {
      if (paralelo._id == this.paralelo_seleccionado) {
        this.paralelos[cont].grupos = this.grupos
      }
      cont = cont + 1
    })
  },
  findBy: function (estudiantes, query) {
    let estudian = estudiantes.filter((estudiante) => {
      let nombres = estudiante.nombres.toLowerCase()
      let apellidos = estudiante.apellidos.toLowerCase()
      let queryLower = query.toLowerCase()
      let n = `${nombres} ${apellidos}`
      return n.includes(queryLower)
    })
    return estudian
  },
  buscarEstudianteFilter: function(grupos, estudiante) {
    var queryLower = estudiante.toLowerCase()
    let grupo = grupos.filter((grupo) => {
      let es = grupo.estudiantes.find(est => {
        let nombres = est.nombres.toLowerCase()
        let apellidos = est.apellidos.toLowerCase()
        let n = `${nombres} ${apellidos}`
        return n.includes(queryLower)
      })
      if (es) {
        return es
      }
    })
    return grupo
  }
  },
	data: {
      grupos: [
      ],
      estudiantesSinGrupo: [
      ],
      estudiantesSinGrupoBackup: [

      ],
      estudiantes: [
      ],
      profesor: {
      },
      paralelos: [
      ],
      paralelo_seleccionado: '',
      contador_global: 0,
      grid_item: 'grid-item',
      grid_item_clear: 'grid-item-clear',
      buscarEstudiante: '',
      mostrarDatosEstudiante: {},
      buscarEstudianteEnGrupo: '',
      buscarGrupo: ''
	},
  watch: {
    grupos: function(val) {
      if (this.grupos[this.grupos.length - 1]) {
        if (this.grupos[this.grupos.length - 1].estudiantes.length != 0 ) {
          this.nuevoGrupo()
        }
      }
    },
    buscarEstudiante: function() { // no borrar, necesario para filtro
    },
    buscarEstudianteEnGrupo: function() { // no borrar, necesario para filtro
    }
  },
  computed: {
    tableFiler: function() {
      return this.findBy(this.estudiantesSinGrupo, this.buscarEstudiante)
    },
    estudianteGrupoFilter: function() {
      return this.buscarEstudianteFilter(this.grupos, this.buscarEstudianteEnGrupo)
    }
  },
  ready() {

  },
  mounted() {
  },
  created() {
  }
});
app.profesorLogeado()

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

// TODO: mejorar no recarga
function drop(ev, target) {
    ev.preventDefault();
    let estudiante_drop;
    var index_grupo = 0;
    var data = ev.dataTransfer.getData("text");
    app.estudiantes.forEach((estudiante) => {
      if (estudiante._id == data) {
        estudiante_drop = estudiante
      }
    })

    app.grupos.forEach(grupo => {
      if (grupo._id == target.id) {
        app.anadirEstudianteAGrupo(index_grupo,estudiante_drop)
      }
      index_grupo = index_grupo + 1
    })
}

// TODO: mejorar no recarga
function borrarAlumno(event) {
  let i = 0
  let j = 1
  app.grupos.forEach(grupo => {
    grupo.estudiantes.forEach(estudiante => {
      if (estudiante._id == event.id) {
        app.$http.delete(`/api/grupos/${grupo._id}/estudiantes/${estudiante._id}`).then(response => {
          if (response.body.estado) {
            //app.obtenerTodosGrupos()
			app.borrarAlumno(grupo, estudiante)
          }
        }, response => {
          // codigo error
        });
      }
      j = j + 1
    })
    j = 0
    i = i + 1
  })
}

function obtenerParaleloEscogido(element) {
  app.paralelo_seleccionado = element[element.selectedIndex].id
  app.obtenerTodosParalelosProfesor()
}

window.onbeforeunload = function () {
    var grupo  = app.grupos[app.grupos.length - 1]
    $.ajax({
      method: 'DELETE',
      url: `/api/paralelos/${app.paralelo_seleccionado}/grupos/${grupo._id}`
    })
    $.ajax({
      method: 'DELETE',
      url: `/api/grupos/${grupo._id}`
    })
};


function escogerEstudiante(element) {
  // let ele = document.getElementById(element.id)
  let ele = document.getElementById(element.id).firstChild;
  let button = document.createElement('button')
  button.setAttribute('id', `${element.id}1`)
  button.setAttribute('onmousemove', 'borrarBotonEliminar(this)')
  button.innerHTML = 'x'
  //button.onclick = borrarAlumno(element)
  ele.appendChild(button)
  console.log(element.id);
}

function borrarBotonEliminar(element) {

  if (element) {
    console.log(element);
  }
  var ele = document.getElementById(`${element.id}1`);
  // if (ele) {
  //
  //   ele.outerHTML = "";
  //   delete ele;
  // }
}

/* drag and drop scrolling*/
var stop = true;
$(".nombres-estudiantes-grupo").on("drag", function (e) {
  console.log('asdas');
  stop = true;
  if (e.originalEvent.clientY < 300) {
    stop = false;
    scroll(-1)
  }
  if (e.originalEvent.clientY > ($(window).height() - 300)) {
    stop = false;
    scroll(1)
  }
});

$(".nombres-estudiantes-grupo").on("dragend", function (e) {
    stop = true;
  });
var scroll = function (step) {
  var scrollY = $(window).scrollTop();
  $(window).scrollTop(scrollY + step);
  if (!stop) {
    setTimeout(function () { scroll(step) }, 10);
  }
}


/*mostar estudiante*/

function mostrarDatosEstudiante(element) {
  var estudiante_id = element.id
  var estudiante = {}
  $('#modal1').modal('open');
  // var grupo_id
  let grupo = app.grupos.find(grupo => {
    let est = grupo.estudiantes.find(est => {
      return est._id == estudiante_id
    })
    if (est) {
      estudiante = est
      return est
    }
  })
  app.mostrarDatosEstudiante = estudiante
}

$(document).ready(function(){
   $('.modal').modal();
 });


/* drag and drop efects*/
var grupos_animation
setTimeout(function() {
  grupos_animation = document.querySelectorAll('.grupos-drop');
  // console.log(grupos_animation);
  [].forEach.call(grupos_animation, function(col) {
    col.addEventListener('dragstart', handleDragStart, false);
    col.addEventListener('dragover', handleDragOver, false);
    col.addEventListener('drop', handleDrop, false);
    col.addEventListener('dragend', handleDragEnd, false);
    col.addEventListener('dragenter', handleDragEnter, false)
    col.addEventListener('dragleave', handleDragLeave, false);
    col.addEventListener('dragexit', handleDragExit, false);
  });
}, 1000)

function listeners() {
  grupos_animation = document.querySelectorAll('.grupos-drop');
  // console.log(grupos_animation);
  [].forEach.call(grupos_animation, function(col) {
    col.addEventListener('dragstart', handleDragStart, false);
    col.addEventListener('dragover', handleDragOver, false);
    col.addEventListener('drop', handleDrop, false);
    col.addEventListener('dragend', handleDragEnd, false);
    col.addEventListener('dragenter', handleDragEnter, false)
    col.addEventListener('dragleave', handleDragLeave, false);
    col.addEventListener('dragexit', handleDragExit, false);
  });
}

function handleDragExit(e) {
  grupos_animation = document.querySelectorAll('.grupos-drop');
  [].forEach.call(grupos_animation, function (col) {
    col.removeAttribute("style")
  });
}

function handleDragStart(e) {
  this.style.opacity = '0.4';
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDragEnter(e) {
  this.classList.add('over');
}

function handleDragLeave(e) {
 var rect = this.getBoundingClientRect();
 if(e.x > rect.left + rect.width || e.x < rect.left || e.y > rect.top + rect.height || e.y < rect.top) {
     $(this).removeClass('over');
 }
}

function handleDrop(e) {
  [].forEach.call(grupos_animation, function (col) {
    col.removeAttribute("style")
    col.classList.remove('over')
  });
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  return false;
}

function handleDragEnd(e) {
  grupos_animation = document.querySelectorAll('.grupos-drop');
  [].forEach.call(grupos_animation, function (col) {
    col.removeAttribute("style")
    col.classList.remove('over')
  });
}


/*sleector*/

setTimeout(function(){
  $('select').material_select();
  var opt = $('option')
  opt[0].selected = true
}, 500)

document.addEventListener("DOMContentLoaded", function(event) {
  $.get({
    url: "../partials/navbar.html",
    success: function(data) {
      document.getElementById('#navbar').innerHTML = data;
    }
  })
});
