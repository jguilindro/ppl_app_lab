/*
	Tenemos lo siguiente
	El estudiante tenía ID antiguo hasta el 12

	El 13 cambió a ID nuevo

	Voy a cambiar el ID a 'nuevo' a todos los registros con el ID antiguo
*/
/* BASE ACTUAL */
dbName 	 = "ppl";
conn 		 = new Mongo();
dbActual = conn.getDB(dbName);
print('conn actual: ', conn);
print('base actual: ', db);
/* BASE ANTIGUA */
connBaseAntigua = new Mongo('127.0.0.1:27018'); 		//Tengo corriendo la base antigua en el puerto 27018
dbAntigua 			= connBaseAntigua.getDB(dbName);
print('conn antigua:', connBaseAntigua);
print('base antigua:', dbAntigua);

var array = ["BJbgiMRd3hb", "B10WiG0_nhb", "Hk_Zof0_n3W", "S1_GoMCOnn-","BJCloMA_22b", "B1XgoMC_33W", "rytesM0uh2Z", "BJNsM0d33b", "r1PGjzAun2-", "ry6ljfR_23W", "BkXfifAu33W", "ryGzjMAOhnW", "H1cMjfCun2-", 
"B12ljM0O32b", "HJH-jzAOhnW", "HJVZjf0d33Z", "rypzizAu33b", "B1GmsGROn2Z", "H1UgoGAd33b", "SkvejzA_nhZ", "rJIXszCd2h-", "r1kgjzCOn2W", "r1wmsGAuhnW", "BJ2ozCd32Z", "rJY-ozAd3hb", "S1_mszRun3Z", "BkZMjz0dh3-", 
"BkDZsGAO3n-", "SyNljfR_hh-", "HJBMjzRuhhW", "S1cgsM0d2n-", "BkYjfCu2nW", "rJ7XsMCu2hb", "ryb7if0_2nZ", "SkfWjGC_hnb", "ryPszCOnnZ", "HJ0fjGRu3nZ", "rkk7iz0_n2Z", "HyjMjzRdh2Z", "HkYGof0O32W", "rJVMoGAO23-", 
"HkefjfRuh3b", "ByNmoGCd33b", "Sk8foGAO33W", "rkmZiGCu2nZ", "BysljGRO22Z", "rJgsfRd22W", "Hy6bofCun2W", "rykZoMRO3nb", "B1nfsz0d32Z", "HkBmiz0_32-", "SJusfRun3b"];	//Mi idea es poner aquí todos los id antiguos para no tener que hacerlo manualmente

var baseAntiguaNE = [];	//Ids no encontrados en la base antigua
var baseNuevaNE 	= []; //Correos no encontrados en la base nueva
for (var i = 0; i < array.length; i++) {
	/*
		Se tiene el Id antiguo
		Buscar en la base de datos antigua el estudiante con ese id antiguo
		Coger su correo
		Buscar al estudiante en la base actual por su correo
	*/
	print('Id #', i);
	print('idAntiguo:', array[i]);
	var idAntiguo = array[i];	//Id del estudiante en la base antigua

	/* Primero debo obtener el correo del estudiante de la base antigua */

	var estudianteBA;	//Registro del estudiante en la base antigua
	estudianteBA = dbAntigua.estudiantes.findOne({
		"_id" : idAntiguo
	});
	if( estudianteBA == null){
		print('No se encontró al estudiante en la base antigua...');
		baseAntiguaNE.push(idAntiguo);
	}else{
		var correo = estudianteBA.correo;
		/* Se obtiene el id nuevo del estudiante buscandolo en la base nueva por su correo */
		var estudiante = dbActual.estudiantes.findOne({
			"correo" : correo
		});
		var idNuevo = ''; //Id del estudiante en la base actual
		if( estudiante == null ){
			print('No se encontro al estudiante en la base de datos actual');
			baseNuevaNE.push(correo);
		}else{
			print('El estudiante es: ', estudiante.nombres, estudiante.apellidos, ' con id actual:', estudiante._id);
			idNuevo = estudiante._id;
			print('----------------------------');
			/* 
				En la colección de Grupos está el id antiguo y el id nuevo. 
				Hay doble registro. 
				Eliminar el antiguo
			*/
			//Primero obtengo el grupo en el cual se encuentra el id antiguo

			var grupo = dbActual.grupos.findOne({
				"estudiantes" : idAntiguo
			});

			if( grupo != null ){
				var idGrupo = grupo._id
				print('El estudiante con id:', idAntiguo, ' pertenece al grupo:', grupo.nombre, ' con id:', idGrupo);
				//Se remueve el id antiguo
				var updateResult = dbActual.grupos.update({
					"_id" : idGrupo
				}, {
					$pull : {
						"estudiantes" : idAntiguo
					}
				});
				//Se verifica que se haya eliminado correctamente
				if( updateResult.nMatched != 1 || updateResult.nModified != 1 ){
					print('Hubo un error al eliminar al id antiguo del estudiante del grupo');
					print(updateResult);
					quit();
				}else{
					print('Id antiguo eliminado del registro del grupo');
				}
				//Aunque puede que esté de más, se añade el id nuevo al grupo. Si ya existe (como debería ser) no hace nada
				var setResult = dbActual.grupos.update({
					"_id" : idGrupo
				}, {
					$addToSet : {
						"estudiantes" : idNuevo
					}
				});
				//Se verifica que se haya eliminado correctamente
				if( setResult.nMatched != 1 ){
					print('Hubo un error al añadir el id nuevo del estudiante al grupo');
					print(setResult);
					quit();
				}else{
					print('Id nuevo añadido al registro del grupo');
				}

			}else{
				print('No se encontro grupo del id antiguo del estudiante')
			}

			print('----------------------------')

			/* El id antiguo no se encuentra en un paralelo */

			var paraleloIdAntiguo = dbActual.paralelos.findOne({
				"estudiantes" : idAntiguo
			});

			print('Paralelo del idAntiguo:', paraleloIdAntiguo)

			var paraleloIdNuevo = dbActual.paralelos.findOne({
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

			var registroCalIdAnt = dbActual.calificaciones.findOne({
				"participantes" : idAntiguo
			});

			if( registroCalIdAnt != null ){

				print('El registro de calificacion del id antiguo es el siguiente:');
				print('Leccion:', registroCalIdAnt.leccion);
				print('Grupo:', registroCalIdAnt.nombreGrupo, ' con id:', registroCalIdAnt.grupo);
				print('Paralelo:', registroCalIdAnt.nombreParalelo, 'con id:', registroCalIdAnt.paralelo);

				var idCalAnt = registroCalIdAnt._id;
				/* Primero se elimina el id antiguo del array de participantes */
				var updateCal1 = dbActual.calificaciones.update({
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
				dbActual.calificaciones.update({
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

			var numResultados = dbActual.respuestas.find({
				"estudiante" : idAntiguo
			}).count();

			print('El id antiguo tiene', numResultados, ' registros en la coleccion de respuestas');

			var updateRespuestas = dbActual.respuestas.update({
				"estudiante" : idAntiguo
			}, {
				$set : {
					"estudiante" : idNuevo
				}
			}, { multi : true});

			print('Cantidad de registros actualizados: ', updateRespuestas.nModified);

			print('FIN DEL ESTUDIANTE ACTUAL')
			print('---------------------------------------------------------------')
			print('---------------------------------------------------------------')
			print('---------------------------------------------------------------')
		}
		
	}
	
}


print('Estudiantes no encontrados en la base antigua:');
for (var j = 0; j < baseAntiguaNE.length; j++) {
	var id = baseAntiguaNE[j];
	print('#', j, ': ', id);
}
print('Estudiantes no encontrados en la base nueva:');
for (var k = 0; k < baseNuevaNE.length; k++) {
	var id = baseNuevaNE[k];
	print('#', k, ': ', id);
}