var Mongo  = require('mongodb').MongoClient,
dbName = "ppl";
conn = new Mongo();
db 	 = conn.getDB(dbName);
/*
	Tenemos lo siguiente
	El estudiante tenía ID antiguo hasta el 12

	El 13 cambió a ID nuevo

	Voy a cambiar el ID a nuevo a todos los registros con el ID antiguo
*/

/*
	Se tiene el Id antiguo
	Buscar en la base de datos antigua el estudiante con ese id antiguo
	Buscar al estudiante en la base actual por su correo
	Realizar los cambios
*/

idAntiguo = 'BJbgiMRd3hb';
correo = 'anjopena@espol.edu.ec';
idNuevo = '';

/* Se obtiene el id nuevo del estudiante */
//Para eso se busca al estudiante por su correo

var estudiante = db.estudiantes.findOne({
	"correo" : correo
});

if( estudiante == null ){
	print('No se encontro al estudiante en la base de datos');
	quit();
}else{
	print('El estudiante es: ', estudiante.nombres, estudiante.apellidos, ' con id:', estudiante._id);
	idNuevo = estudiante._id;
}
print('----------------------------')
/* 
	En la colección de Grupos está el id antiguo y el id nuevo. 
	Hay doble registro. 
	Eliminar el antiguo
*/
//Primero obtengo el grupo en el cual se encuentra el id antiguo

var grupo = db.grupos.findOne({
	"estudiantes" : idAntiguo
});

if( grupo != null ){
	var idGrupo = grupo._id
	print('El estudiante con id:', idAntiguo, ' pertenece al grupo:', idGrupo)

	var updateResult = db.grupos.update({
		"_id" : idGrupo
	}, {
		$pull : {
			"estudiantes" : idAntiguo
		}
	});

	if( updateResult.nMatched != 1 || updateResult.nModified != 1 ){
		print('Hubo un error al eliminar al id antiguo del estudiante del grupo')
		print(updateResult)
		quit()
	}else{
		print('Id antiguo eliminado del registro del grupo')
	}

}else{
	print('No se encontro grupo del id antiguo del estudiante')
}

print('----------------------------')

/* El id antiguo no se encuentra en un paralelo */

var paraleloIdAntiguo = db.paralelos.findOne({
	"estudiantes" : idAntiguo
});

print('Paralelo del idAntiguo:', paraleloIdAntiguo)

var paraleloIdNuevo = db.paralelos.findOne({
	"estudiantes" : idNuevo
});

print('Paralelo del idNuevo:', paraleloIdNuevo.nombreMateria, ' paralelo' , paraleloIdNuevo.nombre, ' con id:', paraleloIdNuevo._id);

var idParaleloIdNuevo = paraleloIdNuevo._id;

print('----------------------------')

/* Registro de calificaciones*/
/*
	En esta colección hay registros con el id antiguo y con el id nuevo
	Por suerte solo hay 2
	Al registro con el id antiguo hay que cambiar el id antiguo por el id nuevo
*/

var registroCalIdAnt = db.calificaciones.findOne({
	"participantes" : idAntiguo
});

if( registroCalIdAnt != null ){

	print('El registro de calificacion del id antiguo es el siguiente:');
	print('Leccion:', registroCalIdAnt.leccion);
	print('Grupo:', registroCalIdAnt.nombreGrupo, ' con id:', registroCalIdAnt.grupo);
	print('Paralelo:', registroCalIdAnt.nombreParalelo, 'con id:', registroCalIdAnt.paralelo);

	var idCalAnt = registroCalIdAnt._id;
	/* Primero se elimina el id antiguo del array de participantes */
	var updateCal1 = db.calificaciones.update({
		"_id" : idCalAnt
	}, {
		$pull : {
			"participantes" : idAntiguo
		}
	});
	if( updateCal1.nMatched != 1 || updateCal1.nModified != 1 ){
		print('Hubo un error al eliminar al id antiguo del estudiante del registro de calificaciones');
		print(updateCal1);
		quit();
	}else{
		print('Id antiguo eliminado del registro de calificaciones');
	}
	/* Luego se añade el id nuevo al array de participantes */
	db.calificaciones.update({
		"_id" : idCalAnt
	}, {
		$addToSet : {
			"participantes" : idNuevo
		}
	});
	print('Id nuevo anadido al registro de calificaciones');
}else{
	print('No se encontro registro de calificacion del id antiguo');
}

print('----------------------------')

/* Registros en respuestas */
/* Se debe cambiar el campo 'estudiante' de todas las respuestas con el id antiguo */

var numResultados = db.respuestas.find({
	"estudiante" : idAntiguo
}).count();

print('El id antiguo tiene', numResultados, ' registros en la coleccion de respuestas');

var updateRespuestas = db.respuestas.update({
	"estudiante" : idAntiguo
}, {
	$set : {
		"estudiante" : idNuevo
	}
}, { multi : true});

print('Cantidad de registros actualizados: ', updateRespuestas.nModified);

//db.getCollection('estudiantes').update({}, {$set: {leccion: ""}}, {multi: true})