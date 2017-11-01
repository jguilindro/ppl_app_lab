dbName 	 = "ppl";
conn 		 = new Mongo();
dbActual = conn.getDB(dbName);
print('conn actual: ', conn);
print('base actual: ', db);

var array = [
	{
		"idAntiguo" : "BJbgiMRd3hb",
		"idNuevo" : "SJxvxlYOweh-",
		"correo" : "anjopena@espol.edu.ec"
	},
	{
		"idAntiguo" : "B10WiG0_nhb",
		"idNuevo" : "HkabYOvehb",
		"correo" : "dharo@espol.edu.ec"
	},
	{
		"idAntiguo" : "Hk_Zof0_n3W",
		"idNuevo" : "HJde-tdwxhW",
		"correo" : "darealba@espol.edu.ec"
	},
	{
		"idAntiguo" : "S1_GoMCOnn-",
		"idNuevo" : "HktIggKOPgh-",
		"correo" : "gabancar@espol.edu.ec"
	},
	{
		"idAntiguo" : "BJCloMA_22b",
		"idNuevo" : "r1lUgxY_vgn-",
		"correo" : "chrasuar@espol.edu.ec"
	},
	{
		"idAntiguo" : "B1XgoMC_33W",
		"idNuevo" : "B12bZFuPenb",
		"correo" : "aadachi@espol.edu.ec"
	},
	{
		"idAntiguo" : "rytesM0uh2Z",
		"idNuevo" : "ryvbbK_Dln-",
		"correo" : "bsponce@espol.edu.ec"
	},
	{
		"idAntiguo" : "BJNsM0d33b",
		"idNuevo" : "B1HSelKOPlnZ",
		"correo" : "acmurill@espol.edu.ec"
	},
	{
		"idAntiguo" : "r1PGjzAun2-",
		"idNuevo" : "HJgfbtdPlhb",
		"correo" : "fraanbol@espol.edu.ec"
	},
	{
		"idAntiguo" : "ry6ljfR_23W",
		"idNuevo" : "ByagWFdwxnb",
		"correo" : "clarrea@espol.edu.ec"
	},
	{
		"idAntiguo" : "BkXfifAu33W",
		"idNuevo" : "rJFWbtdPl2W",
		"correo" : "elema@espol.edu.ec"
	},
	{
		"idAntiguo" : "ryGzjMAOhnW",
		"idNuevo" : "By1PlltOvl2-",
		"correo" : "erduenas@espol.edu.ec"
	},
	{
		"idAntiguo" : "H1cMjfCun2-",
		"idNuevo" : "SyCwegYuwlhb",
		"correo" : "gdfuente@espol.edu.ec"
	},
	{
		"idAntiguo" : "B12ljM0O32b",
		"idNuevo" : "HJ3Wt_wlhW",
		"correo" : "caarmas@espol.edu.ec"
	},
	{
		"idAntiguo" : "HJH-jzAOhnW",
		"idNuevo" : "HJoxbFODx3W",
		"correo" : "dbmedina@espol.edu.ec"
	},
	{
		"idAntiguo" : "HJVZjf0d33Z",
		"idNuevo" : "S1Hx-tODl2-",
		"correo" : "danadgue@espol.edu.ec"
	},
	{
		"idAntiguo" : "rypzizAu33b",
		"idNuevo" : "ry-gWFuDx2W",
		"correo" : "gbeltran@espol.edu.ec"
	},
	{
		"idAntiguo" : "B1GmsGROn2Z",
		"idNuevo" : "ByJz-tODlnZ",
		"correo" : "jacoppia@espol.edu.ec"
	},
	{
		"idAntiguo" : "H1UgoGAd33b",
		"idNuevo" : "B1rvxeY_wen-",
		"correo" : "bjiron@espol.edu.ec"
	},
	{
		"idAntiguo" : "SkvejzA_nhZ",
		"idNuevo" : "rJOWWtdDg2b",
		"correo" : "bsespino@espol.edu.ec"
	},
	{
		"idAntiguo" : "rJIXszCd2h-",
		"idNuevo" : "rJAZ-F_vl3-",
		"correo" : "jdmoreno@espol.edu.ec"
	},
	{
		"idAntiguo" : "r1kgjzCOn2W",
		"idNuevo" : "BkZwxxKdPe2W",
		"correo" : "andaljim@espol.edu.ec"
	},
	{
		"idAntiguo" : "r1wmsGAuhnW",
		"idNuevo" : "ryQWWYuDgnb",
		"correo" : "jcuzco@espol.edu.ec"
	},
	{
		"idAntiguo" : "BJ2ozCd32Z",
		"idNuevo" : "HJ_rxxt_venb",
		"correo" : "anabmart@espol.edu.ec"
	},
	{
		"idAntiguo" : "S1_mszRun3Z",
		"idNuevo" : "SJiZZKuvxnW",
		"correo" : "juagvera@espol.edu.ec"
	},
	{
		"idAntiguo" : "BkZMjz0dh3-",
		"idNuevo" : "rke-F_Px2Z",
		"correo" : "edalban@espol.edu.ec"
	},
	{
		"idAntiguo" : "BkDZsGAO3n-",
		"idNuevo" : "HytxZFdwl3W",
		"correo" : "derealpe@espol.edu.ec"
	},
	{
		"idAntiguo" : "SyNljfR_hh-",
		"idNuevo" : "SkcxZtuDgn-",
		"correo" : "aavelez@espol.edu.ec"
	},
	{
		"idAntiguo" : "HJBMjzRuhhW",
		"idNuevo" : "BJdLllYuveh-",
		"correo" : "fcapelo@espol.edu.ec"
	},
	{
		"idAntiguo" : "S1cgsM0d2n-",
		"idNuevo" : "HJ0ebY_Px3W",
		"correo" : "cimacas@espol.edu.ec"
	},
	{
		"idAntiguo" : "BkYjfCu2nW",
		"idNuevo" : "B1LbF_DghZ",
		"correo" : "ajplaza@espol.edu.ec"
	},
	{
		"idAntiguo" : "rJ7XsMCu2hb",
		"idNuevo" : "H1UWWFdwgn-",
		"correo" : "jemimuri@espol.edu.ec"
	},
	{
		"idAntiguo" : "ryb7if0_2nZ",
		"idNuevo" : "r1Wf-tdve2W",
		"correo" : "jampflor@espol.edu.ec"
	},
	{
		"idAntiguo" : "SkfWjGC_hnb",
		"idNuevo" : "BJJlWtuDlh-",
		"correo" : "drcedill@espol.edu.ec"
	},
	{
		"idAntiguo" : "ryPszCOnnZ",
		"idNuevo" : "ByTPxlF_Deh-",
		"correo" : "artuarez@espol.edu.ec"
	},
	{
		"idAntiguo" : "HJ0fjGRu3nZ",
		"idNuevo" : "B1-Fuwenb",
		"correo" : "hchalen@espol.edu.ec"
	},
	{
		"idAntiguo" : "rkk7iz0_n2Z",
		"idNuevo" : "HkNWt_Pg2-",
		"correo" : "heyyfuen@espol.edu.ec"
	},
	{
		"idAntiguo" : "HyjMjzRdh2Z",
		"idNuevo" : "HJ8eZFOvghW",
		"correo" : "gdmaruri@espol.edu.ec"
	},
	{
		"idAntiguo" : "HkYGof0O32W",
		"idNuevo" : "rJxxZtODg2-",
		"correo" : "gsegarra@espol.edu.ec"
	},
	{
		"idAntiguo" : "rJVMoGAO23-",
		"idNuevo" : "BJLDleKuwghb",
		"correo" : "eveyusol@espol.edu.ec"
	},
	{
		"idAntiguo" : "HkefjfRuh3b",
		"idNuevo" : "By0ZKdPxhb",
		"correo" : "dsatian@espol.edu.ec"
	},
	{
		"idAntiguo" : "ByNmoGCd33b",
		"idNuevo" : "S1-OggKOwxh-",
		"correo" : "jhdaguer@espol.edu.ec"
	},
	{
		"idAntiguo" : "Sk8foGAO33W",
		"idNuevo" : "HkpUeeYuDx2W",
		"correo" : "franvera@espol.edu.ec"
	},
	{
		"idAntiguo" : "rkmZiGCu2nZ",
		"idNuevo" : "rJzdleYdwx3Z",
		"correo" : "dcampana@espol.edu.ec"
	},
	{
		"idAntiguo" : "BysljGRO22Z",
		"idNuevo" : "rkS-FOwghW",
		"correo" : "carxceva@espol.edu.ec"
	},
	{
		"idAntiguo" : "rJgsfRd22W",
		"idNuevo" : "SkvDgxK_Dl2b",
		"correo" : "acarmile@espol.edu.ec"
	},
	{
		"idAntiguo" : "Hy6bofCun2W",
		"idNuevo" : "Sk1LxltdDl2Z",
		"correo" : "degranda@espol.edu.ec"
	},
	{
		"idAntiguo" : "rykZoMRO3nb",
		"idNuevo" : "Bk-IxltuDe3W",
		"correo" : "cjmunoz@espol.edu.ec"
	},
	{
		"idAntiguo" : "B1nfsz0d32Z",
		"idNuevo" : "r15vxxYODl3W",
		"correo" : "gusadcas@espol.edu.ec"
	},
	{
		"idAntiguo" : "HkBmiz0_32-",
		"idNuevo" : "rJhx-FdvlnW",
		"correo" : "josagarc@espol.edu.ec"
	},
	{
		"idAntiguo" : "SJusfRun3b",
		"idNuevo" : "SJrIegFdPeh-",
		"correo" : "aldamosq@espol.edu.ec"
	}
];


for (var i = 0; i < array.length; i++) {
	var actual 		= array[i];
	var idAntiguo = actual.idAntiguo;
	var correo 		= actual.correo;

	var estudiante = dbActual.estudiantes.findOne({
		"correo" : correo
	});
	var idNuevo = ''; //Id del estudiante en la base actual
	if( estudiante == null ){
		print('No se encontro al estudiante en la base de datos actual');
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