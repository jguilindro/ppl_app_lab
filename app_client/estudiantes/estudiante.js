var app = new Vue({
  el: '#app',
  data: {
    estudiante: {
    	nombre: 'Edison',
    	apellido: 'Mora',
    	lecciones: [
    		{
    			nombre: 'Leccion 1',
    			estado: 'Calificado',
    			calificacion: '80',
    			fecha: '21-05-2017'
    		},
    		{
    			nombre: 'Leccion 2',
    			estado: 'Calificado',
    			calificacion: '60',
    			fecha: '29-05-2017'
    		},
    		{
    			nombre: 'Leccion 3',
    			estado: 'Pendiente',
    			calificacion: '',
    			fecha: '7-06-2017'
    		}
    	]
    }
  }
})