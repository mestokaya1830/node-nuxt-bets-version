server {
    listen 80;
    listen [::]:80;
    index index.html;
    server_name 127.0.0.1;
    client_max_body_size 1m;

    location / {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
	    proxy_redirect off;
	    proxy_send_timeout 1000s;
        proxy_read_timeout 1000s;
        client_max_body_size 1m;
        add_header X-Frame-Options SAMEORIGIN;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
	    access_log off;
    }
}
