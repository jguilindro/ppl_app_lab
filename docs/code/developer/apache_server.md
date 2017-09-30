# Configuracion apache server

La mala configuracion de apache crea que lo websockets no funcionen correctamente

[referencia][7796bebc]
  [7796bebc]: https://stackoverflow.com/questions/27526281/websockets-and-apache-proxy-how-to-configure-mod-proxy-wstunnel/27534443#27534443 "referencia base"

El servidor apache se debe configurar para que no aparesca el error: Error during WebSocket handshake

### Localizacion de archivo de configuracion

Localizacion archivo: /etc/httpd/conf

Localizacion archivo: /etc/httpd/conf/http.conf

### Snippet de configuracion apache

```apache
<VirtualHost [ip]:80>
  ServerName www.ppl-assessment.espol.edu.ec
  ServerAlias www.ppl-assessment.espol.edu.ec
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
$ sudo a2enmod proxy rewrite proxy_http proxy_wstunnel # solo funciona en UBUNTU
$ sudo service apache2 restart
$ systemctl status apache2.service
```

Para Centos hay que hacer la configuracion manual de a2enmod
