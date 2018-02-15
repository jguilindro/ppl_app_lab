## Arquitectura

La analogia de toda esta parte es un grupo de chat

Cada paralelo es un grupo de chat. En donde el moderador es el profesor que en este caso sera mas general y solo lo llamaremos moderador

Tenemos dos tipos de usuarios: Moderador y estudiante

__Moderador__

Realiza las acciones de la leccion, como son: comenzar-leccion, cancelar-leccion, terminar-leccion, aumentar-tiempo-leccion, pausar-leccion, continuar-leccion. Ademas que recibe las respuestas de los estudiantes

__Estudiante__

Las acciones son: enviar-respuesta

## Metodos

Socketio usa dos metodos, que son los on y los emit. Los __on__ solo escuchan lo que los clientes envien y los __emit__ que envian datos al cliente

## Metodos ON

#### comenzar-leccion

Inicia la leccion y comienza a enviar en tiempo a todos los estudiantes que esten en el paralelo

__recive__

```json
 {
 	"leccionId"
 	"paraleloId"
 	"fechaInicioTomada" // string, en formato isoTime
 	"tiempoEstimado" // number, en segundos
 	"usuarioId"
 }
```

__database__

## Metodos EMIT

Porque en parlelo y no en eleccion emit in(paraleloId)
* Posible: Si un estudiante desconoce su paralelo

#### tiempo-restante-leccion(emit in(paraleloId))

__envio__


#### terminada-leccion(emit in(paraleloId))
	terminado leccion = terminada-leccion
__envio__

#### empezar-leccion(emit in(paraleloId))

__envio__


#### datos-leccion(emit in(paraleloId))
