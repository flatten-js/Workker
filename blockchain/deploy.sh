#!/bin/sh

yarn

yarn start &

yarn migrate $@