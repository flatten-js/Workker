#!/bin/bash

NETWORK_DEVELOPMENT=development

# NFT_STORAGE_PAHT
. <(cat ./api/.env | grep NFT_STORAGE_PATH)

NETWORK=${1:-$NETWORK_DEVELOPMENT}
MAX_TOKEN=${2:-'99999'}
revealed_uri=${3:-"$NFT_STORAGE_PATH/metadata/"}
not_revealed_uri=${4:-"$NFT_STORAGE_PATH/package.json"}

TMP_ROOT=./data/tmp
PACKAGE_ROOT=./data/packages
PACKAGES=$(ls $PACKAGE_ROOT/*.zip)

CHECK_ICON="\u2713"

function success_console() {
  echo -e "\e[32m$2 $1"
}

function error_console() {
  echo -e "\e[31m$1"
}

function exec_console() {
  while read -r line; do
    echo -e "\e[90m$line"
  done  
}

function nft_storage_path() {
  echo $1 | sed "s/{bucket}/$2/"
}

function clean_tmp() {
  ls -d $TMP_ROOT/* 2> /dev/null | grep -v ".gitignore" | xargs rm -rfv
}

function error_if_exit() {
  if [[ $1 =~ $2 ]]; then
    error_console "Error: An error has occurred and processing has been interrupted"
    clean_tmp | exec_console
    exit
  fi
}

for PACKAGE in $PACKAGES
do
  PACKAGE_FILE=$(basename $PACKAGE)
  PACKAGE_NAME=$(echo $PACKAGE_FILE | sed 's/\.[^\.]*$//')
  success_console "--- $PACKAGE_NAME"

  docker build ./blockchain -t blockchain --no-cache 2>&1 | exec_console
  success_console "Successfully Docker build" $CHECK_ICON

  BUCKET=$(uuidgen)
  TMP_PACKAGE="$TMP_ROOT/$BUCKET"
  unzip $PACKAGE -d $TMP_ROOT | exec_console
  mv "$TMP_ROOT/$PACKAGE_NAME" $TMP_PACKAGE | exec_console
  CONFIG_JSON=$(cat "$TMP_PACKAGE/config.json" | jq ".package |= .+ {\"image\": \"$(nft_storage_path $NFT_STORAGE_PATH $BUCKET)/package.png\"}")
  echo $CONFIG_JSON | jq '.package | {"name":.name,"description":.description,"image":.image}' > "$TMP_PACKAGE/package.json"
  success_console "Successfully unzipped [$PACKAGE_FILE]" $CHECK_ICON

  echo "Trying Deployment..." | exec_console

  PRIVATE_KEY=""
  if [ $NETWORK != $NETWORK_DEVELOPMENT ]; then
    read -sp "PRIVATE_KEY: " PRIVATE_KEY
    echo -ne "\r\033[K"
  fi

  if [ $NETWORK == $NETWORK_DEVELOPMENT ]; then
    docker-compose stop blockchain 2>&1 | exec_console
  fi

  revealed_uri=$(nft_storage_path $revealed_uri $BUCKET)
  not_revealed_uri=$(nft_storage_path $not_revealed_uri $BUCKET)

  result=$(
    docker run --rm \
      -e REVEALED_URI=$revealed_uri -e NOT_REVEALED_URI=$not_revealed_uri \
      -e MAX_TOKEN=$MAX_TOKEN -e PRIVATE_KEY=$PRIVATE_KEY \
      -v ./blockchain:/usr/local/src \
      -v blockchain_node_modules:/usr/local/src/node_modules \
      blockchain ./deploy.sh $NETWORK 2>&1
  )

  echo $result | exec_console
  error_if_exit $(echo $result | tr -d '\n ') "Error"

  if [ $NETWORK == $NETWORK_DEVELOPMENT ]; then
    docker-compose up -d blockchain 2>&1 | exec_console
  fi

  ACCOUNT=$(echo $result | sed -r 's/.*> account:[ ]*([0-9a-zA-Z]+).*/\1/')
  PRIVATE_KEY=$(echo $result | sed -r 's/.*Private Keys ================== \(0\)[ ]*([0-9a-zA-Z]+).*/\1/')
  CONTRACT_ADDRESS=$(echo $result | sed -r 's/.*> contract address:[ ]*([0-9a-zA-Z]+).*/\1/')

  success_console "Successfully deployed" $CHECK_ICON
  success_console "  account: $ACCOUNT"
  if [ $NETWORK == $NETWORK_DEVELOPMENT ]; then
    success_console "  private_key: $PRIVATE_KEY" 
  fi
  success_console "  contract address: $CONTRACT_ADDRESS"

  docker-compose up -d api 2>&1 | exec_console
  ESCAPE_CONFIG_JSON=$(echo $CONFIG_JSON | jq '@json')
  docker-compose exec api /bin/bash -c "echo $ESCAPE_CONFIG_JSON | node cli.js deploy $BUCKET $CONTRACT_ADDRESS" 2>&1 | exec_console
  success_console "Successfully saved packages deployed to DataBase" $CHECK_ICON

  rm -f "$TMP_PACKAGE/config.json"
  success_console "Successfully prepared for upload to S3" $CHECK_ICON

  aws s3 mb s3://$BUCKET | exec_console
  aws s3api put-object --bucket $BUCKET --key metadata/ | exec_console
  aws s3 cp $TMP_PACKAGE s3://$BUCKET --recursive | exec_console
  success_console "Successfully uploaded to S3" $CHECK_ICON

  clean_tmp | exec_console
  success_console "Successfully cleaned files" $CHECK_ICON
done
