#!/bin/sh

docker-compose run --rm certbot certonly --webroot -w /var/www/certbot -d waylap.com