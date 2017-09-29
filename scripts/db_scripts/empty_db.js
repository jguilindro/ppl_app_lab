dbName = "ppl";
conn = new Mongo();
db 	 = conn.getDB(dbName);

db.capitulos.drop();
db.respuestas.drop();
db.calificaciones.drop();
db.lecciones.drop();
db.preguntas.drop();