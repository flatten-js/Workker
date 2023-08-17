#!/bin/bash

NETWORK_DEVELOPMENT=development

NETWORK=${1:-$NETWORK_DEVELOPMENT}
MAX_TOKEN=${2:-'99999'}
REVEALED_URI=${3:-'http://localhost:3030/storage/develop.vol.1/metadata/'}
NOT_REVEALED_URI=${4:-'http://localhost:3030/storage/develop.vol.1/package.json'}

PACKAGES=$(ls ./data/packages/*.zip)
STORAGE_PATH="./api/storage"

for PACKAGE in $PACKAGES
do
  PACKAGE_FILE=$(basename $PACKAGE)
  PACKAGE_NAME=$(echo $PACKAGE_FILE | sed 's/\.[^\.]*$//')
  echo --- $PACKAGE_NAME

  PACKAGE_DIR="${STORAGE_PATH}/${PACKAGE_NAME}"

  if [ -e $PACKAGE_DIR ]; then 
    echo "Package already exists"
    continue
  fi

  docker build ./blockchain -t blockchain --no-cache > /dev/null 2>&1
  echo "Successfully Docker build"

  unzip $PACKAGE -d $STORAGE_PATH > /dev/null
  CONFIG_JSON=$(cat "$PACKAGE_DIR/config.json")
  echo $CONFIG_JSON | jq '.package | {"name":.name,"description":.description,"image":.image}' > "$PACKAGE_DIR/package.json"
  echo "Successfully unzipped [$PACKAGE_FILE]"

  mkdir "$PACKAGE_DIR/metadata"
  
  echo "Trying Deployment..."

  PRIVATE_KEY=""
  if [ $NETWORK != $NETWORK_DEVELOPMENT ]; then
    read -sp "PRIVATE_KEY: " PRIVATE_KEY
    echo -ne "\r\033[K"
  fi
  
  docker-compose stop blockchain > /dev/null 2>&1

  result=$(
    docker run --rm \
      -e REVEALED_URI=$REVEALED_URI -e NOT_REVEALED_URI=$NOT_REVEALED_URI \
      -e MAX_TOKEN=$MAX_TOKEN -e PRIVATE_KEY=$PRIVATE_KEY \
      -v blockchain_node_modules:/usr/local/src/node_modules \
      -v ./blockchain/db:/usr/local/src/db \
      blockchain ./deploy.sh --network $NETWORK 2>&1
  )

  docker-compose up -d blockchain > /dev/null 2>&1

  ACCOUNT=$(echo $result | sed -r 's/.*> account:[ ]*([0-9a-zA-Z]+).*/\1/')
  PRIVATE_KEY=$(echo $result | sed -r 's/.*Private Keys ================== \(0\)[ ]*([0-9a-zA-Z]+).*/\1/')
  CONTRACT_ADDRESS=$(echo $result | sed -r 's/.*> contract address:[ ]*([0-9a-zA-Z]+).*/\1/')

  echo "Successfully deployed"
  echo "  account: $ACCOUNT"
  echo "  private_key: $PRIVATE_KEY" 
  echo "  contract address: $CONTRACT_ADDRESS"

  docker-compose up -d api > /dev/null 2>&1
  ESCAPE_CONFIG_JSON=$(echo $CONFIG_JSON | jq '@json')
  docker-compose exec api /bin/bash -c "echo $ESCAPE_CONFIG_JSON | node cli.js deploy $CONTRACT_ADDRESS" > /dev/null 2>&1
  echo "Successfully saved packages deployed to DataBase"

  rm -f "$PACKAGE_DIR/config.json"
  echo "Successfully cleaned files"
done
