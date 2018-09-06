# Peer Proyect Learning ESPOL WEB APP


## Nombres bases de datos

* Development.- ppl_development
* Production.- ppl_production
* Testing.- ppl_testing

## Nombres bases de datos att
* Development.- att_development
* Production.- att_production

__La primera vez clonado__

```sh
git submodule update --init

```


```sh
./production # no usarlo en LOCAL
export $(cat .env | xargs) # instalar las variables de entorno
export NODE_ENV=production # 
pm2 start server.js
# pm2 monit
# pm2 restart
# pm2 list
# pm2 stop 0
# https://www.npmjs.com/package/pm2
```

## Development
### Variables de entorno usadas

```txt
development
production
testing
development:cas .- usada para pruebas locales del cas
APP.- usada para detectar en att cuando se la esta usando integrada con ppl
```

### Servidores

* Proxy API

__puerto 8000__

* PPL

__puerto 8001__

* Att

__puerto 8002__

# Version 2

```sh
> yarn dev2
```