var app = new Vue({
	el: '#grupos',
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    },
    obtenerTodosGrupos: function () {
      this.$http.get('/api/grupos').then(response => {
        this.grupos = response.body.datos;
        this.obtenerTodosEstudiantes();
      }, response => {
        // codigo error
      });
    },
    obtenerTodosEstudiantes: function() {
      this.$http.get('/api/estudiantes').then(response => {
        this.estudiantes = response.body.datos;
        this.estudiantesNoEnGrupo()
      }, response => {
        // codigo error
      });
    },
    estudiantesNoEnGrupo: function() {
      let temp = []
      this.estudiantesSinGrupo = []
      this.grupos.forEach((grupo) => {
        grupo.estudiantes.forEach((estudiante) => {
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
      // this.grupos[index_grupo].estudiantes.push(estudiante)
      // estudianteEstaEnGrupo(this.grupos[index_grupo], estudiante)
      // this.grupos[index_grupo].estudiantes.push(estudiante)
      let cont = 0
      this.estudiantesSinGrupo.forEach(es => {
        if (es._id == estudiante._id) {
          this.estudiantesSinGrupo.splice(cont, 1)
        }
        cont = cont + 1
      })

      this.grupos.forEach(grupo => {
        grupo.estudiantes.forEach(est => {
          if (est._id === estudiante._id) {
            this.$http.delete(`/api/grupos/${grupo._id}/estudiantes/${est._id}`).then(response => {
              if (response.body.estado) {
              }
            }, response => {
              // codigo error
            });
          } else {
            // anadir estudiante a grupo
            this.$http.post(`/api/grupos/${this.grupos[index_grupo]._id}/estudiantes/${estudiante._id}`).then(response => {
              if (response.body.estado) {

              }
            }, response => {
              // codigo error
            });
          }
        })
      })
      this.obtenerTodosGrupos()


      // eliminar estudiante de grupo

    },
    move: function(a) {
      console.log(a)
    }
  },
	data: {
      grupos: [
      ],
      estudiantesSinGrupo: [
      ],
      list2: [],
      estudiantes: [

      ],
      nuevos: [
      ]
	},
  watch: {
    nuevos: function(nuevo) {
      console.log(nuevo)
    }
  },
	mounted: function(){
		$('.button-collapse').sideNav();
	}

});

app.obtenerTodosGrupos()

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev, target) {
    ev.preventDefault();
    let estudianteA
    var data = ev.dataTransfer.getData("text");
    app.estudiantes.forEach((estudiante) => {
      if (estudiante._id == data) {
        estudianteA = estudiante
      }
    })
    var cont = 0
    app.grupos.forEach(grupo => {
      if (grupo._id == target.id) {
        app.anadirEstudianteAGrupo(cont,estudianteA)
      }
      cont = cont + 1
    })
    //ev.target.appendChild(document.getElementById(data));
}


function estudianteEstaEnGrupo(grupos, estudiante) {
  grupos.forEach(grupo => {
    grupo.estudiantes.forEach(est => {
      if (est._id === estudiante._id) {
        return true
      }
    })
  })
  return false
}

function borrarAlumno(event) {
  let i = 0
  let j = 1
  app.grupos.forEach(grupo => {
    grupo.estudiantes.forEach(estudiante => {
      if (estudiante._id == event.id) {
        console.log(estudiante._id)
        console.log(grupo._id)
        app.$http.delete(`/api/grupos/${grupo._id}/estudiantes/${estudiante._id}`).then(response => {
          if (response.body.estado) {
            app.obtenerTodosGrupos()
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
