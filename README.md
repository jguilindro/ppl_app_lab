[![Build Status](https://travis-ci.org/joelerll/ppl_app_lab.svg?branch=develop_v2)](https://travis-ci.org/joelerll/ppl_app_lab)
[![Coverage Status](https://coveralls.io/repos/github/joelerll/ppl_app_lab/badge.svg?branch=develop_v2)](https://coveralls.io/github/joelerll/ppl_app_lab?branch=develop_v2)
[![Coverage Status](https://codecov.io/gh/joelerll/ppl_app_lab/branch/develop_v2/graph/badge.svg)](https://codecov.io/gh/joelerll/ppl_app_lab/branch/develop_v2)

# PPL ESPOL LAB

Aplicacion para el manejo de las clases de ppl

# Documentacion

[PPL DOCS](https://joelerll95.gitbooks.io/ppl_aplicacion/content/)

# Prerrequisitos

* Mysql
* Mongodb (opcional)
* Redis (opcional y sera usado para realtime)
* Nodejs >= 6.9.5

# Instalacion

Guardar el siguiente texto en un archivo llamado __.env__ y customizarlo segun lo mostrado

```txt
PORT=8000
SECRET=mi_secret
MONGO_URL=mongodb://localhost/ppl
DATABASE_HOST=127.0.0.1
DATABASE_USER=mi_user_base_de_datos
DATABASE_PASSWORD=mi_clave_de_base_de_datos
```

Instalar las dependencias de nodejs(Puede tomar mucho tiempo)

```sh
> npm install
```

# Development

```sh
> npm run dev
```

# Testing

```sh
> npm run test
```

# Production

1. Cargar el archivo __.env__ a las variables de entorno

```sh
> export $(cat .env | xargs)
```

2. Actualizar los archivos locales

```sh
> git pull
```

3. 
```sh
> npm install
```

4. Correr los scripts para produccion

```sh
> npm run production
```

5. Correr la aplicacion

```sh
> forever start -o out.log -e err.log app.js
```

# Ayuda

Mostar comandos posibles de npm

```sh
> npm start
```

# Comunicación

[Trello](https://trello.com/b/khhR0x5e/ppldev)
[Discord](https://discord.gg/Sjkhd6D)
[Appeir](https://appear.in/ppl_app_lab)
