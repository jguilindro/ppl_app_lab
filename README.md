[![Build Status](https://travis-ci.org/joelerll/ppl_app_lab.svg?branch=develop_v2)](https://travis-ci.org/joelerll/ppl_app_lab)
[![Coverage Status](https://coveralls.io/repos/github/joelerll/ppl_app_lab/badge.svg?branch=develop_v2)](https://coveralls.io/github/joelerll/ppl_app_lab?branch=develop_v2)
[![Coverage Status](https://codecov.io/gh/joelerll/ppl_app_lab/branch/develop_v2/graph/badge.svg)](https://codecov.io/gh/joelerll/ppl_app_lab/branch/develop_v2)

# PPL ESPOL LAB

Aplicacion para el manejo de las clases de ppl

## Documentacion

[PPL DOCS](https://joelerll95.gitbooks.io/ppl-lab/content/)

## Prerrequisitos

* Mysql
* Mongodb (opcional)
* Redis (opcional y sera usado para realtime)
* Nodejs >= 6.9.5

## Setup

1. Anadir los submodulos del proyecto (docs y app-estudiante)

Si ya lo clonaste usar:

```sh
> git submodule update --init --recursive
```

Si no lo has clonado:
```sh
> git clone --recursive https://github.com/razerjon24/ppl_app_lab.git
```

```sh
> git checkout origin/develop_2
> git checkout -b develop_2
```

2. Renombrar el archivo __.env_template__ por __.env__ y cambiar los campos DATABASE_USER y DATABASE_PASSWORD por los de su base de datos

3. Instalar las dependencias de nodejs(Puede tomar mucho tiempo)

```sh
> npm install
```

Si por motivos de probar la aplicacion rapidamente se puede usar

```sh
> npm run development
```

__Tomar en cuenta que este comando borrara si existe la base de datos ppl_development__


# Development

1. Correr al app server

```sh
> npm run dev
```

2. En otra terminal correr el app cliente estudiantes

Moverse a la carpeta app_client/estudiantes

```
> npm install
> npm run dev
```

3. En otra terminal correr el app cliente profesores

Moverse a la carpeta app_client/profesores

```
> npm install
> npm run dev
```

## Testing

#### Testing server

```sh
> npm run test
```

## Production

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

(POR DESARROLLAR)
```sh
> 
```

5. Correr la aplicacion

```sh
> forever start -o out.log -e err.log server.js
```


## Documentacion

```sh
> npm run docs
```

## Ayuda

Mostar comandos posibles de npm

```sh
> npm start
```

## Comunicación

[Trello](https://trello.com/b/khhR0x5e/ppldev)

[Discord](https://discord.gg/Sjkhd6D)

[Appeir](https://appear.in/ppl_app_lab)
