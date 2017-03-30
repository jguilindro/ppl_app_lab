/*
	Este Script permitirá colocar nuevos íconos cuando el mouse pasa por una pregunta.
	en profesores/Preguntas.
*/

$(".question").mouseenter(function(){
	var pregunta = "#".concat(this.id);
	var iconoEditar = "pregunta-".concat(this.id);
	$(pregunta).append(
		$("<a>",{"class":iconoEditar.concat(" right-align")}).text("[Eliminar]"))

	$(pregunta).append(
		$("<a>",{"class":iconoEditar}).text("[Editar]"))
})

$(".question").mouseleave(function(){
	var pregunta = ".pregunta-".concat(this.id);
	$(pregunta).remove();
})