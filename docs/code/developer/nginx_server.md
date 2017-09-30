# Configuracion Nginx

https://www.nginx.com/blog/nginx-nodejs-websockets-socketio/

Cache Static Files
Load balancer
Proxy WebSocket Connections

```
server {
    listen 80;
    server_name static-test-47242.onmodulus.net;


    root /mnt/app;
    index index.html index.htm;

    location /static/ {
        try_files $uri $uri/ =404;
    }

    location /api/ {
        proxy_pass http://node-test-45750.onmodulus.net;
    }
}

location ~ ^/(?:ghost|signout) {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header Host $http_host;
    proxy_pass http://ghost_upstream;
    add_header Cache-Control "no-cache, private, no-store,
    must-revalidate, max-stale=0, post-check=0, pre-check=0";
}
```

# Restart server

sudo service nginx restart
sudo service nginx status
sudo service nginx start

# Install nginx last version
https://www.nginx.com/resources/wiki/start/topics/tutorials/install/

# Nginx proxy server


# Brenchark testing

* La aplicacion es nativa de apache

ab -c 40 -n 1000 http://localhost/