# Peer Proyect Learning ESPOL WEB APP

Proyecto Peer Proyect Learning

### Tools
- Mongodb
- Nodejs
- Expressjs
- Vuejs
- Apache
- WebSockets

# Instalacion y setup Development

## Primero ejecutar
npm install

### Development mode
npm run dev

### Producction mode
npm run production

### Docker

# Api Documentacion
https://joelerll95.gitbooks.io/ppl_aplicacion/content/

# Comunicacion
* Apper https://appear.in/ppl_app_lab
* Discord https://discord.gg/Sjkhd6D

<!-- ## Heroku

heroku features:enable http-session-affinity -->

## HANDSHAKE ERROR SOCKETS

[referencia][7796bebc]
  [7796bebc]: https://stackoverflow.com/questions/27526281/websockets-and-apache-proxy-how-to-configure-mod-proxy-wstunnel/27534443#27534443 "referencia base"

El servidor apache se debe configurar para que no aparesca el error: Error during WebSocket handshake

Localizacion archivo: /etc/httpd/conf

```apache
<VirtualHost [ip]:80>
  ServerName www.ppl-assessment.espol.edu.ec
  ProxyPreserveHost On
  ProxyRequests Off
  RewriteEngine On
  RewriteCond %{QUERY_STRING} transport=polling       [NC]
  RewriteRule /(.*)           http://localhost:8000/$1 [P]
  RewriteCond %{HTTP:Upgrade} websocket               [NC]
  RewriteRule /(.*)           ws://localhost:8000/$1  [P]
  <Location />
    ProxyPass http://localhost:8000/
    ProxyPassReverse http://localhost:8000/
  </Location>
</VirtualHost>
```

```sh
$ sudo a2enmod proxy rewrite proxy_http proxy_wstunnel
$ sudo service apache2 restart
$ systemctl status apache2.service
```

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
