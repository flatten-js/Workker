#!/bin/sh

option=$1

case $option in
  --no-build)
    # Skip building the app
    ;;
  
  *)
    docker-compose run app bash -c "yarn; yarn build"
    ;;
esac

git fetch
git reset --hard origin/develop
docker-compose -f docker-compose.prod.yml up -d --build