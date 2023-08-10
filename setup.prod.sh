#!/bin/bash

cp api/.env.prod.example api/.env

docker-compose build certbot

tmp_file=$$
sed -e 's|entrypoint|#&|' docker-compose.yml > $tmp_file
docker-compose -f $tmp_file run --rm certbot certonly --webroot -w /var/www/certbot -d waylap.com
rm $tmp_file