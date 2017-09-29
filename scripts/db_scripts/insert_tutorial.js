dbName = "ppl";
conn = new Mongo();
db 	 = conn.getDB(dbName);

db.capitulos.drop();
/* Física 2 */
db.capitulos.insert({
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 15. Ondas mecanicas",
	codigoMateria: "FISG1002",
	nombreMateria: "Fisica 2",
	tipo 				 : "tutorial",
	preguntas 	 : []
});
db.capitulos.insert({
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 16. Sonido y el oido",
	codigoMateria: "FISG1002",
	nombreMateria: "Fisica 2",
	tipo 				 : "tutorial",
	preguntas 	 : []
});
db.capitulos.insert({
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 17 y 18. Temperatura y calor | Propiedades termicas de la materia",
	codigoMateria: "FISG1002",
	nombreMateria: "Fisica 2",
	tipo 				 : "tutorial",
	preguntas 	 : []
});
db.capitulos.insert({
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 19. La primera ley de la termodinamica",
	codigoMateria: "FISG1002",
	nombreMateria: "Fisica 2",
	tipo 				 : "tutorial",
	preguntas 	 : []
});
db.capitulos.insert({
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 20. La segunda ley de la termodinamica",
	codigoMateria: "FISG1002",
	nombreMateria: "Fisica 2",
	tipo 				 : "tutorial",
	preguntas 	 : []
});
db.capitulos.insert({
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 21. Carga electrica y campo electrico",
	codigoMateria: "FISG1002",
	nombreMateria: "Fisica 2",
	tipo 				 : "tutorial",
	preguntas 	 : []
});
db.capitulos.insert({
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 22. Ley de Gauss",
	codigoMateria: "FISG1002",
	nombreMateria: "Fisica 2",
	tipo 				 : "tutorial",
	preguntas 	 : []
});
db.capitulos.insert({
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 23. Potencial electrico",
	codigoMateria: "FISG1002",
	nombreMateria: "Fisica 2",
	tipo 				 : "tutorial",
	preguntas 	 : []
});
db.capitulos.insert({
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 24. Capacitancia y dielectricos",
	codigoMateria: "FISG1002",
	nombreMateria: "Fisica 2",
	tipo 				 : "tutorial",
	preguntas 	 : []
});
db.capitulos.insert({
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 25. Corriente, resistencia y fuerza electromotriz",
	codigoMateria: "FISG1002",
	nombreMateria: "Fisica 2",
	tipo 				 : "tutorial",
	preguntas 	 : []
});
db.capitulos.insert({
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 26. Circuitos de corriente directa",
	codigoMateria: "FISG1002",
	nombreMateria: "Fisica 2",
	tipo 				 : "tutorial",
	preguntas 	 : []
});
/* Física 3 */
db.capitulos.insert({
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 27. Campo magnetico y fuerzas magneticas",
	codigoMateria: "FISG1003",
	nombreMateria: "Fisica 3",
	tipo 				 : "tutorial",
	preguntas 	 : []
});
db.capitulos.insert({
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 28. Fuentes de campo magnetico",
	codigoMateria: "FISG1003",
	nombreMateria: "Fisica 3",
	tipo 				 : "tutorial",
	preguntas 	 : []
});
db.capitulos.insert({
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 29. Induccion electromagnetica",
	codigoMateria: "FISG1003",
	nombreMateria: "Fisica 3",
	tipo 				 : "tutorial",
	preguntas 	 : []
});
db.capitulos.insert({
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 30. Inductancia",
	codigoMateria: "FISG1003",
	nombreMateria: "Fisica 3",
	tipo 				 : "tutorial",
	preguntas 	 : []
});
db.capitulos.insert({
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 31. Corriente alterna",
	codigoMateria: "FISG1003",
	nombreMateria: "Fisica 3",
	tipo 				 : "tutorial",
	preguntas 	 : []
});
db.capitulos.insert({
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 32. Ondas electromagneticas",
	codigoMateria: "FISG1003",
	nombreMateria: "Fisica 3",
	tipo 				 : "tutorial",
	preguntas 	 : []
});
db.capitulos.insert({
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 33. Naturaleza y propagacion de la luz",
	codigoMateria: "FISG1003",
	nombreMateria: "Fisica 3",
	tipo 				 : "tutorial",
	preguntas 	 : []
});
db.capitulos.insert({
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 34. Optica geometrica",
	codigoMateria: "FISG1003",
	nombreMateria: "Fisica 3",
	tipo 				 : "tutorial",
	preguntas 	 : []
});
db.capitulos.insert({
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 35. Interferencia",
	codigoMateria: "FISG1003",
	nombreMateria: "Fisica 3",
	tipo 				 : "tutorial",
	preguntas 	 : []
});
db.capitulos.insert({
	createdAt    : new Date(),
	updatedAt    : new Date(),
	nombre 			 : "Capitulo 36. Difraccion",
	codigoMateria: "FISG1003",
	nombreMateria: "Fisica 3",
	tipo 				 : "tutorial",
	preguntas 	 : []
});