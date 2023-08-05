#!/bin/sh

docker-compose run app yarn build
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d