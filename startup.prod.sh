#!/bin/sh

option=$1

git fetch
git reset --hard origin/develop

case $option in
  --no-build)
    # Skip building the app
    ;;
  
  *)
    docker-compose run app bash -c "yarn; yarn build"
    ;;
esac

docker-compose -f docker-compose.prod.yml up -d --build