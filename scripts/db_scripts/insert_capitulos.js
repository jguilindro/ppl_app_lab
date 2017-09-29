dbName = "ppl";
conn = new Mongo();
db 	 = conn.getDB(dbName);

db.capitulos.drop();
/* Física 2 */
db.capitulos.insert({
	_id 				 : '1',
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 15. Ondas mecanicas",
	codigoMateria: "FISG1002",
	nombreMateria: "Fisica 2",
	tipo 				 : "estimacion",
	preguntas 	 : []
});
db.capitulos.insert({
	_id 				 : '2',
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 16. Sonido y el oido",
	codigoMateria: "FISG1002",
	nombreMateria: "Fisica 2",
	tipo 				 : "estimacion",
	preguntas 	 : []
});
db.capitulos.insert({
	_id 				 : '3',
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 17 y 18. Temperatura y calor | Propiedades termicas de la materia",
	codigoMateria: "FISG1002",
	nombreMateria: "Fisica 2",
	tipo 				 : "estimacion",
	preguntas 	 : []
});
db.capitulos.insert({
	_id 				 : '4',
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 19. La primera ley de la termodinamica",
	codigoMateria: "FISG1002",
	nombreMateria: "Fisica 2",
	tipo 				 : "estimacion",
	preguntas 	 : []
});
db.capitulos.insert({
	_id 				 : '5',
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 20. La segunda ley de la termodinamica",
	codigoMateria: "FISG1002",
	nombreMateria: "Fisica 2",
	tipo 				 : "estimacion",
	preguntas 	 : []
});
db.capitulos.insert({
	_id 				 : '6',
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 21. Carga electrica y campo electrico",
	codigoMateria: "FISG1002",
	nombreMateria: "Fisica 2",
	tipo 				 : "estimacion",
	preguntas 	 : []
});
db.capitulos.insert({
	_id 				 : '7',
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 22. Ley de Gauss",
	codigoMateria: "FISG1002",
	nombreMateria: "Fisica 2",
	tipo 				 : "estimacion",
	preguntas 	 : []
});
db.capitulos.insert({
	_id 				 : '8',
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 23. Potencial electrico",
	codigoMateria: "FISG1002",
	nombreMateria: "Fisica 2",
	tipo 				 : "estimacion",
	preguntas 	 : []
});
db.capitulos.insert({
	_id 				 : '9',
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 24. Capacitancia y dielectricos",
	codigoMateria: "FISG1002",
	nombreMateria: "Fisica 2",
	tipo 				 : "estimacion",
	preguntas 	 : []
});
db.capitulos.insert({
	_id 				 : '10',
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 25. Corriente, resistencia y fuerza electromotriz",
	codigoMateria: "FISG1002",
	nombreMateria: "Fisica 2",
	tipo 				 : "estimacion",
	preguntas 	 : []
});
db.capitulos.insert({
	_id 				 : '11',
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 26. Circuitos de corriente directa",
	codigoMateria: "FISG1002",
	nombreMateria: "Fisica 2",
	tipo 				 : "estimacion",
	preguntas 	 : []
});
/* Física 3 */
db.capitulos.insert({
	_id 				 : '12',
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 27. Campo magnetico y fuerzas magneticas",
	codigoMateria: "FISG1003",
	nombreMateria: "Fisica 3",
	tipo 				 : "estimacion",
	preguntas 	 : []
});
db.capitulos.insert({
	_id 				 : '13',
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 28. Fuentes de campo magnetico",
	codigoMateria: "FISG1003",
	nombreMateria: "Fisica 3",
	tipo 				 : "estimacion",
	preguntas 	 : []
});
db.capitulos.insert({
	_id 				 : '14',
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 29. Induccion electromagnetica",
	codigoMateria: "FISG1003",
	nombreMateria: "Fisica 3",
	tipo 				 : "estimacion",
	preguntas 	 : []
});
db.capitulos.insert({
	_id 				 : '15',
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 30. Inductancia",
	codigoMateria: "FISG1003",
	nombreMateria: "Fisica 3",
	tipo 				 : "estimacion",
	preguntas 	 : []
});
db.capitulos.insert({
	_id 				 : '16',
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 31. Corriente alterna",
	codigoMateria: "FISG1003",
	nombreMateria: "Fisica 3",
	tipo 				 : "estimacion",
	preguntas 	 : []
});
db.capitulos.insert({
	_id 				 : '17',
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 32. Ondas electromagneticas",
	codigoMateria: "FISG1003",
	nombreMateria: "Fisica 3",
	tipo 				 : "estimacion",
	preguntas 	 : []
});
db.capitulos.insert({
	_id 				 : '18',
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 33. Naturaleza y propagacion de la luz",
	codigoMateria: "FISG1003",
	nombreMateria: "Fisica 3",
	tipo 				 : "estimacion",
	preguntas 	 : []
});
db.capitulos.insert({
	_id 				 : '19',
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 34. Optica geometrica",
	codigoMateria: "FISG1003",
	nombreMateria: "Fisica 3",
	tipo 				 : "estimacion",
	preguntas 	 : []
});
db.capitulos.insert({
	_id 				 : '20',
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 35. Interferencia",
	codigoMateria: "FISG1003",
	nombreMateria: "Fisica 3",
	tipo 				 : "estimacion",
	preguntas 	 : []
});
db.capitulos.insert({
	_id 				 : '21',
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 36. Difraccion",
	codigoMateria: "FISG1003",
	nombreMateria: "Fisica 3",
	tipo 				 : "estimacion",
	preguntas 	 : []
});