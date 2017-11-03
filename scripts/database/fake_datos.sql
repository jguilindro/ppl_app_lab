USE ppl_development

INSERT INTO materias (nombre,codigo) VALUES
('FÍSICA II','FISG1002');

INSERT INTO semestres (anio,termino) VALUES
('2017','2');

INSERT INTO profesores (nombres,apellidos,correo) VALUES
('CARLOS VINICIO','MORENO MEDINA', 'cmoreno@espol.edu.ec');


INSERT INTO paralelos (nombre,materia_id,semetre_id) VALUES
('2',1,1);

INSERT INTO grupos (nombre,paralelo_id) VALUES
('Grupo 1',1);

INSERT INTO estudiantes (nombres,apellidos,correo,matricula,foto_url,paralelo_id,grupo_id) VALUES
('STEVEN SEBASTIAN', 'MACIAS QUEZADA', 'stsemaci@espol.edu.ec','201121507' ,'', 1,1);

INSERT INTO estudiantes (nombres,apellidos,correo,matricula,foto_url,paralelo_id,grupo_id) VALUES
('SEBASTIAN', 'CARLOS', 'dtsadff@espol.edu.ec','201121507s' ,'', 1,1);

INSERT INTO estudiantes (nombres,apellidos,correo,matricula,foto_url,paralelo_id,grupo_id) VALUES
('SEBASTIANSSS', 'CARLOSS', 'iii@espol.edu.ec','201121507s' ,'', 1,1);

INSERT INTO lecciones (nombre,estado,tiempo_estimado,puntaje,tipo,codigo,fecha_estimado,fecha_terminado,fecha_empezado,profesor_id,paralelo_id) VALUES
('Ondas Mecánica-Laboratorio','terminado', 20, 13, 'estimacion|laboratorio', 59598,"2017-08-11","2017-08-11" ,"2017-08-11" , 1,1);


INSERT INTO lecciones (nombre,estado,tiempo_estimado,puntaje,tipo,codigo,fecha_estimado,fecha_terminado,fecha_empezado,profesor_id,paralelo_id) VALUES
('Campo Magnético','terminado', 20, 13, 'estimacion', 59598,"2017-08-10","2017-08-10" ,"2017-08-10" , 1,1);

INSERT INTO estudiante_lecciones (calificacion,estudiante_id,leccion_id) VALUES
(50,1,1); 

INSERT INTO estudiante_lecciones (calificacion,estudiante_id,leccion_id) VALUES
(50,2,1); 

INSERT INTO estudiante_lecciones (calificacion,estudiante_id,leccion_id) VALUES
(75,1,2); 

-- como identifico sobre cuanto es la leccion?, aqui agregar rubrica?
-- tipos lecciones no es necesario, porque?


-- select nombres, apellidos, correo from estudiantes where correo = 'stsemaci@espol.edu.ec'