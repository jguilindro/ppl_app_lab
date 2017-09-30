# **Dictionario de Datos**

#materias

| Tabla|Campo|Tipo de Dato|Tamaño|Constrain| Descripción|
| :-------------:|:-------------:|:-------------:|:-------------:|:-------------:|:-------------:|
| materias|id|Number|10|Primary key|Contiene el id de todas las materias|
| materias|nombre|Varchar|20|Not null|Contiene el nombre de todas las materias|
| materias|codigo|Varchar|10|Not null|Contiene el codigo de todas las materias|
| materias|profesor_id|Number|10|Foreign key|Contiene el nombre de todos los profesores|

#paralelos

| Tabla|Campo|Tipo de Dato|Tamaño|Constrain| Descripción|
| :-------------:|:-------------:|:-------------:|:-------------:|:-------------:|:-------------:|
| paralelos|id|Number|10|Primary key|Contiene el id de todos los paralelos|
| paralelos|nombre|Varchar|20|Not null|Contiene el nombre de todos los paralelos|
| paralelos|materia_id|Number|10|Not null|Contiene el id de todas las materias|
| paralelos|semestre_id|Number|10|Not null|Contiene el id de todos los semestres|

#grupos

| Tabla|Campo|Tipo de Dato|Tamaño|Constrain| Descripción|
| :-------------:|:-------------:|:-------------:|:-------------:|:-------------:|:-------------:|
| grupos|id|Number|10|Not null|Contiene el id de todos los grupos|
| grupos|nombre|Varchar|20|Not null|Contiene el nombre de todos los grupos|
| grupos|paralelo_id|Number|10|Foreign key|Contiene el id de todos los paralelos|

#estudiantes

| Tabla|Campo|Tipo de Dato|Tamaño|Constrain| Descripción|
| :-------------:|:-------------:|:-------------:|:-------------:|:-------------:|:-------------:|
| estudiantes|id|Number|10|Primary key|Contiene el id de todos los estudiantes|
| estudiantes|nombres|Varchar|20|Not null|Contiene el nombre de todos los estudiantes|
| estudiantes|apellidos|Varchar|20|Not null|Contiene los apellidos de todos los estudiantes|
| estudiantes|correo|Varchar|20|Not null|Contiene los correos de todos los estudiantes|
| estudiantes|matricula|Number|10|Not null|Contiene la matricula de todos los estudiantes|
| estudiantes|foto_url|Varchar|100|Not null|Contiene la url de las fotos de todos los estudiantes|
| estudiantes|grupo_id|Number|10|Foreign key|Contiene el id de todos los grupos|
| estudiantes|paralelo_id|Number|10|Foreign key|Contiene el id de todos los paralelos|

#respuestas

| Tabla|Campo|Tipo de Dato|Tamaño|Constrain| Descripción|
| :-------------:|:-------------:|:-------------:|:-------------:|:-------------:|:-------------:|
| respuestas|id|Number|10|Primary key|Contiene el id de todas las respuestas|
| respuestas|estudiante_id|Number|10|Foreign key|Contiene el id de todos los estudiantes|
| respuestas|pregunta_leccion_id|Number|10|Foreign key|Contiene el id de todas las pregunta_leccion|
| respuestas|respuesta|Varchar|300|Not null|Contiene todas las respuestas de los estudiantes a una pregunta|
| respuestas|calificacion|Number|3|Not null|Contiene la calificacion de todas las respuestas de los estudiantes a una pregunta|
| respuestas|feedback|Varchar|300|Not null|Contiene todas las retroalimentaciones de los profesores a una respuesta de los estudiantes
| respuestas|imagen_url|Varchar|100|Not null|Contiene todas las url de las imagenes que se envien como parte de una respuesta |
| estudiante_lecciones|estudiante_id|Number|10|Primary key|Contiene el id de todos los estudiantes|
| estudiante_lecciones|leccion_id|Number|10|Primary key|Contiene el id de todas las lecciones|
| estudiante_lecciones|calificacion|Number|3|Not null|Contiene la calificacion de todas las lecciones de los estudiantes |

#semestres

| Tabla|Campo|Tipo de Dato|Tamaño|Constrain| Descripción|
| :-------------:|:-------------:|:-------------:|:-------------:|:-------------:|:-------------:|
| semestres|id|Number|10|Primary key|Contiene el id de todos los semestres|
| semestres|anio|Number|4|Not null|Contiene el año de los todos los semestres |
| semestres|termino|Number|1|Not null|Contiene el termino de todos los semestres|

#profesor_paralelos

| Tabla|Campo|Tipo de Dato|Tamaño|Constrain| Descripción|
| :-------------:|:-------------:|:-------------:|:-------------:|:-------------:|:-------------:|
| profesor_paralelos|paralelo_id|Number|10|Primary key|Contiene el id de todos los paralelos|
| profesor_paralelos|profesor_id|Number|10|Primary key|Contiene el id de todos los profesores|
| profesor_paralelos|grado_responsabilidad|Number|1|Not null|"Contiene el grado de responsabilidad del profesor es decir: si es peer 1,2 o 3 y si es profesor 0"|

#preguntas

| Tabla|Campo|Tipo de Dato|Tamaño|Constrain| Descripción|
| :-------------:|:-------------:|:-------------:|:-------------:|:-------------:|:-------------:|
| preguntas|id|Number|10|Primary key|Contiene el id de todas las preguntas|
| preguntas|nombre|Varchar|20|Not null|Contiene el nombre de todas las preguntas|
| preguntas|profesor_id|Number|10|Foreign key|Contiene el id de todos los profesores|
| preguntas|tipo_leccion|Varchar|20|Not null|" Contiene el tipo de leccion al que la pregunta puede pertenecer es decir: estimacion, laboratorio y tutorial"|
| preguntas|tipo_pregunta|Varchar|20|Not null|"Contiene el tipo de pregunta, estos pueden ser: justificacion, verdadero y falso u opcion multiple"|
| preguntas|capitulo_id|Number|10|Foreign key|Contiene el id de todos los capitulos|
| preguntas|tiempo_estimado|Number|3|Not null|Contiene el tiempo estimado de todas las preguntas|
| preguntas|descripcion|Varchar|300|Not null|Es un string que representa un json con la informacion de la pregunta|
| preguntas|puntaje|Number|3|Not null|Contiene el puntaje de todas las preguntas|
| preguntas|pregunta_raiz|Number|10|Foreign key|Contieneel id de la pregunta principal que contiene a esta pregunta. Si esta pregunta es una pregunta principal entonces el campo es null|

#capitulos

| Tabla|Campo|Tipo de Dato|Tamaño|Constrain| Descripción|
| :-------------:|:-------------:|:-------------:|:-------------:|:-------------:|:-------------:|
| capitulos|id|Number|10|Primary key|Contiene el id de todos los capitulos|
| capitulos|nombre|Varchar|20|Not null|Contiene el nombre de todos los capitulos|
| capitulos|materia_id|Number|10|Foreign key|Contiene el id de todas las materias|

#profesores

| Tabla|Campo|Tipo de Dato|Tamaño|Constrain| Descripción|
| :-------------:|:-------------:|:-------------:|:-------------:|:-------------:|:-------------:|
| profesores|id|Number|10|Primary key|Contiene el id de todos los profesores|
| profesores|correo|Varchar|20|Not null|Contiene los correos de todos los profesores|
| profesores|nombres|Varchar|20|Not null|Contiene el nombre de todos los profesores|
| profesores|apellidos|Varchar|20|Not null|Contiene los apellidos de todos los profesores|
| profesores|tipo|Number|1|Not null|"Contiene el grado de responsabilidad del profesor es decir: si es peer 1,2 o 3 y si es profesor 0"|

#lecciones

| Tabla|Campo|Tipo de Dato|Tamaño|Constrain| Descripción|
| :-------------:|:-------------:|:-------------:|:-------------:|:-------------:|:-------------:|
| lecciones|id|Number|10|Primary key|Contiene el id de todas lecciones|
| lecciones|nombre|Varchar|20|Not null|Contiene el nombre de todas las lecciones|
| lecciones|estado|Varchar|10|Not null|"Contiene el estdo de la leccion, estos pueden ser: terminado, pendiente, en proceso"|
| lecciones|tiempo_estimado|Number|3|Not null|Contiene el tiempo estimado de todas las lecciones|
| lecciones|puntaje|Number|3|Not null|Contiene el puntaje de todas las lecciones|
| lecciones|tipo|Varchar|10|Not null|"Contiene el tipo de la leccion, estos pueden ser: tutorial o laboratorio, estimacion"|
| lecciones|codigo|Number|10|Not null|Contiene el codigo de todas las lecciones|
| lecciones|profesor_id|Number|10|Foreign key|Contiene el id de todos los profesores|
| lecciones|paralelo_id|Number|10|Foreign key|Contiene el id de todos los paralelos|
| lecciones|fecha_evaluacion|Date||Not null|Contiene la fecha en la que se evaluan todas las lecciones|

#preguntas_lecciones

| Tabla|Campo|Tipo de Dato|Tamaño|Constrain| Descripción|
| :-------------:|:-------------:|:-------------:|:-------------:|:-------------:|:-------------:|
| preguntas_lecciones|pregunta_id|Number|10|Primary key|Contiene el id de todas las preguntas|
| preguntas_lecciones|leccion_id|Number|10|Primary key|Contiene el id de todas las lecciones|

#rubricas

| Tabla|Campo|Tipo de Dato|Tamaño|Constrain| Descripción|
| :-------------:|:-------------:|:-------------:|:-------------:|:-------------:|:-------------:|
| rubricas|id|Number|10|Primary key|Contiene el id de todas las rubricas|
| rubricas|creador_id|Number|10|Foreign key|Contiene el id de todos los profesores|
| rubricas|leccion_id|Number|10|Foreign key|Contiene el id de todas als lecciones|