#!/bin/sh

BRANCH=$1
OPTION=$2

if [ -z "$BRANCH" ]; then
  echo "Branch designation is required" 
  exit 1
fi

git fetch
git reset --hard origin/$BRANCH

case $OPTION in
  --no-build)
    # Skip building the app
    ;;
  
  *)
    docker-compose run --rm app bash -c "yarn; yarn build"
    ;;
esac

docker-compose -f docker-compose.prod.yml up -d --build