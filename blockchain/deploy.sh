#!/bin/bash

NETWORK_DEVELOPMENT=development

NETWORK=${1:-$NETWORK_DEVELOPMENT}

yarn

if [ $NETWORK == $NETWORK_DEVELOPMENT ]; then
  yarn start &
fi

yarn migrate --network $NETWORK