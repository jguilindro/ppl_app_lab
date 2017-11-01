/*
Física 2 P4
Añadir ids de estudiantes que tomaron la lección r13Oq392W al registro de calificaciones
*/

dbName = "ppl";
conn 	 = new Mongo();
db 		 = conn.getDB(dbName);

var arrayGruposId = [
	"BJ8PRY5hZ", 
  "BkQMkq52W", 
  "r1H5y95hW", 
  "BkArZ5qnZ", 
  "S13sWcqn-", 
  "BkZwz59hW", 
  "H11vB993Z", 
  "ryrZU9c2W", 
  "SJTUUq5hZ", 
  "BJP5Icc2Z", 
  "HkMKwcc2W", 
  "S1gaD993W", 
  "SyREd5cnb", 
  "SJAjO55n-", 
  "SySRu99n-", 
  "H1tGtqc2W", 
  "ByX0Fqc2Z", 
  "rkY8FsQT-"
];
var idLeccion = "r13Oq392W";
var idPregunta = "rybDcw8n-";

var arrayRegistros = [];
//Recorro la colección de respuestas buscando las que son de la lección actual y de la primera pregunta de cada grupo
//Así obtengo a todos los estudiantes de cada grupo que dieron la lección
for (var i = 0; i < arrayGruposId.length; i++) {
	var grupoActual = arrayGruposId[i];
	var registros = db.respuestas.find({
		leccion  : idLeccion,
		pregunta : idPregunta,
		grupo 	 : grupoActual
	}).toArray();
	print('El grupo:', grupoActual, ' tiene', registros.length, ' estudiantes');
	//printjson(registros[0])
	//printjson(registros)
	for (var j = 0; j < registros.length; j++) {
		var registroActual = registros[j];

		var updateResult = db.calificaciones.update({
			leccion : idLeccion,
			grupo : grupoActual
		}, {
			$addToSet : {
				participantes : registroActual.estudiante
			}
		});
		print('estudiante#', j, registroActual.estudiante, ' añadido')
		print('nMatched:', updateResult.nMatched, ' nModified:', updateResult.nModified);
	}

}