# Peer Proyect Learning ESPOL WEB APP

## Correr la app en produccion

```sh
> git pull
```

```sh
> npm install
```

```sh
export NODE_ENV=production
```

Ir a la carpta ppl-assessment

```sh
> forever start -o out.log -e err.log app.js
```

# Instalacion y setup Development

## Primero ejecutar
npm install

## Base de datos
mongod.exe --dbpath <path> --port <port>

mongorestore.exe --db <path>

## Correr la aplicación 

### Development mode
npm run dev

### Producction mode
npm run production

# Api Documentacion
https://joelerll95.gitbooks.io/ppl_aplicacion/content/

# Comunicacion
* Apper https://appear.in/ppl_app_lab
* Discord https://discord.gg/Sjkhd6D

<!-- ## Heroku

heroku features:enable http-session-affinity -->

## TODO

* Docker
* Testing api
* Selenium testing
* Front testing
* Socketio Testing

## Documentacion TODO

* Documentacion API
* Diagrama de base de datos
* Diagrama de navegacion pagina
* Documentacion webSockets
* Documentacion Inicializar proyecto
* Fake server api para documentacion (automatico)
*
