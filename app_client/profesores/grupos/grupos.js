var app = new Vue({
	el: '#grupos',
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    },
    obtenerTodosProfesores: function () {
      this.$http.get('/api/grupos').then(response => {
        this.grupos = response.body.datos;
      }, response => {
      });
    }
  },
	data: {
      grupos: [
      ]
	},

	mounted: function(){
		$('.button-collapse').sideNav();
	}

});

app.obtenerTodosProfesores()
