#!/bin/sh

git fetch
git reset --hard origin/develop
docker-compose run app bash -c "yarn; yarn build"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build