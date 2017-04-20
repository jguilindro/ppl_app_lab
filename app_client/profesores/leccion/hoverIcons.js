/*
	Este Script permitirá colocar nuevos íconos cuando el mouse pasa por una pregunta.
	en profesores/Preguntas. - Xavier

	También pudo haber sido hecho en el script de Vue, lo cual me hubiera ahorrado muchas confusiones...  - Edison

	Implementé esto usando Vue, ya no se utilizará este script -Edison
*/

$(".question").mouseenter(function(){
	var pregunta = "#".concat(this.id);
	var iconoEditar = "pregunta-".concat(this.id);
	var eliminar = $('<a>').attr({
		'class': iconoEditar.concat(' right-align btn-eliminar'),
		'id': this.id
	});
	eliminar.text('[Eliminar]');
	$(pregunta).append(eliminar);
	//$(pregunta).append(
	//	$("<a>",{"class":iconoEditar.concat(" right-align btn-eliminar")}).text("[Eliminar]"))

	$(pregunta).append(
		$("<a>",{"class":iconoEditar}).text("[Editar]"))
})

$(".question").mouseleave(function(){
	var pregunta = ".pregunta-".concat(this.id);
	$(pregunta).remove();
})



$('body').on("click", '.btn-eliminar', function(){
	console.log('Esto va a funcionar carajo');
	console.log($(this).attr('id'))
	var preguntaId = $(this).attr('id');
	//Primero hay que eliminar el modal-content. Sino cada vez que abran el modal se añadirá un p más
	$('.modal-content').empty();
	//Ahora i añadir las cosas
	var modalContentH4 = $('<h4/>').addClass('center-align').text('Eliminar');
	var modalContentP = $('<p/>').text('Seguro que desea eliminar la pregunta: ' + preguntaId)
	modalContentP.addClass('center-align')
	$('.modal-content').append(modalContentH4, modalContentP);
	$('#modalEliminar').modal('open');
})
