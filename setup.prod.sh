#!/bin/bash

cp api/.env.prod.example api/.env

. ./tools/setup-awscli.sh
. ./tools/setup-certbot.sh