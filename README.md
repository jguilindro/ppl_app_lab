# Importante
* Existe un nuevo .env con diferente formato. Pedirlo si se quiere usar
* Todavia no esta el script de crear las bases de datos automaticamente
* Definir el uso de los rollbacks knexjs
* Se usara el logger winston para todo, incluso los console.log
* Usar promises para todo y seguir el formato especificado para que sea testeable el api
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
https://github.com/tj/co
* Usar el archivo responses.js para retornar los json de respuetas y de errores, si falta uno. Crearlos de acuerdo al archivo
* Documentar el api, se usara apidocs para esto


# Setup Server
export $(cat .env | xargs)
[Travis]: https://travis-ci.org/joelerll/ppl_app_lab.svg?branch=develop_v2 "Travis"
